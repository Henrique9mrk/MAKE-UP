const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const prisma = require("../lib/prisma");

const router = express.Router();

// Configuração compartilhada dos limitadores.
const configuracaoLimite = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
};

// LIMITADOR DE TENTATIVAS DE CADASTRO
const limiteCadastro = rateLimit({
  ...configuracaoLimite,
  message: {
    mensagem:
      "Muitas tentativas de cadastro. Tente novamente em 15 minutos.",
  },
});

// LIMITADOR DE TENTATIVAS DE LOGIN
const limiteLogin = rateLimit({
  ...configuracaoLimite,
  message: {
    mensagem:
      "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
});

// CADASTRO DE USUÁRIO
router.post("/", limiteCadastro, async (req, res) => {
  try {
    const { nome, email, senha } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: "Email ou senha inválidos.",
      });
    }

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || nomeLimpo.length > 100) {
      return res.status(400).json({
        mensagem: "Informe um nome válido, com até 100 caracteres.",
      });
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !formatoEmail.test(emailLimpo) ||
      emailLimpo.length > 254
    ) {
      return res.status(400).json({
        mensagem: "Informe um email válido.",
      });
    }

    // Validar a senha respeitando o limite do bcrypt.
    if (
      senha.length < 8 ||
      Buffer.byteLength(senha, "utf8") > 72
    ) {
      return res.status(400).json({
        mensagem:
          "A senha deve ter pelo menos 8 caracteres e respeitar o limite de segurança.",
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email: emailLimpo,
      },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: "Este email já está cadastrado.",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome: nomeLimpo,
        email: emailLimpo,
        senha: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        mensagem: "Este email já está cadastrado.",
      });
    }

    console.error("Erro ao cadastrar usuário:", error.message);

    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
    });
  }
});

// LISTAGEM PÚBLICA DESATIVADA
router.get("/", (req, res) => {
  return res.status(403).json({
    mensagem: "A listagem de usuários não está disponível.",
  });
});

// LOGIN COM LIMITAÇÃO DE TENTATIVAS
router.post("/login", limiteLogin, async (req, res) => {
  try {
    const { email, senha } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: "Email e senha são obrigatórios.",
      });
    }

    if (
      email.trim().length > 254 ||
      Buffer.byteLength(senha, "utf8") > 72
    ) {
      return res.status(400).json({
        mensagem: "Email ou senha inválidos.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET não está configurada.");

      return res.status(500).json({
        mensagem: "Erro na configuração de autenticação.",
      });
    }

    const emailLimpo = email.trim().toLowerCase();

    const usuario = await prisma.usuario.findUnique({
      where: {
        email: emailLimpo,
      },
    });

    // Mensagem genérica para não revelar se a conta existe.
    if (!usuario) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos.",
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
        algorithm: "HS256",
      }
    );

    return res.json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error.message);

    return res.status(500).json({
      mensagem: "Erro ao realizar login.",
    });
  }
});

module.exports = router;
