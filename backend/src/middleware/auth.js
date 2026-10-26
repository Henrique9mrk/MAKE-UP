
const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // Exigir o formato: Bearer <token>
  if (typeof authHeader !== "string") {
    return res.status(401).json({
      mensagem: "Token de autenticação não informado.",
    });
  }

  const partes = authHeader.trim().split(/\s+/);

  if (
    partes.length !== 2 ||
    partes[0].toLowerCase() !== "bearer" ||
    !partes[1]
  ) {
    return res.status(401).json({
      mensagem: "Formato de autenticação inválido. Use Bearer <token>.",
    });
  }

  const token = partes[1];

  // Verificar a configuração do segredo.
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET não está configurada.");

    return res.status(500).json({
      mensagem: "Erro na configuração de autenticação.",
    });
  }

  try {
    const dadosUsuario = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    // Exigir um payload com ID de usuário válido.
    if (
      !dadosUsuario ||
      typeof dadosUsuario !== "object" ||
      !Number.isSafeInteger(dadosUsuario.id) ||
      dadosUsuario.id <= 0
    ) {
      return res.status(401).json({
        mensagem: "Token inválido. Faça login novamente.",
      });
    }

    req.usuario = dadosUsuario;

    return next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado. Faça login novamente.",
    });
  }
}

module.exports = autenticarToken;
