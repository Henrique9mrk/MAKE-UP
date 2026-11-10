
const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

// Campos que podem ser exibidos publicamente no catálogo.
const camposPublicosProduto = {
  id: true,
  nome: true,
  categoria: true,
  preco: true,
  descricao: true,
  imagem: true,
};

// Listar produtos disponíveis no catálogo.
router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      select: camposPublicosProduto,
      orderBy: {
        id: "asc",
      },
    });

    return res.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.message);

    return res.status(500).json({
      mensagem: "Erro ao buscar produtos.",
    });
  }
});

// Consultar um produto pelo ID.
router.get("/:id", async (req, res) => {
  try {
    const idTexto = req.params.id;

    // Aceitar somente números inteiros positivos.
    if (!/^[1-9]\d*$/.test(idTexto)) {
      return res.status(400).json({
        mensagem: "ID do produto inválido.",
      });
    }

    const id = Number(idTexto);

    // Verificar se o número é um inteiro seguro.
    if (!Number.isSafeInteger(id)) {
      return res.status(400).json({
        mensagem: "ID do produto inválido.",
      });
    }

    const produto = await prisma.produto.findUnique({
      where: {
        id,
      },
      select: camposPublicosProduto,
    });

    if (!produto) {
      return res.status(404).json({
        mensagem: "Produto não encontrado.",
      });
    }

    return res.json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error.message);

    return res.status(500).json({
      mensagem: "Erro ao buscar produto.",
    });
  }
});

module.exports = router;
