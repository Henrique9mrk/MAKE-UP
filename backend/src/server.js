
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const prisma = require("./lib/prisma");
const usuariosRoutes = require("./routes/usuarios");
const pedidosRoutes = require("./routes/pedidos");
const produtosRoutes = require("./routes/produtos");

// ==================================================
// CONFIGURAÇÃO
// ==================================================

const app = express();

const PORT = Number(process.env.PORT || 3000);

const frontendOrigin =
  process.env.FRONTEND_URL || "http://localhost:5173";

// ==================================================
// VALIDAÇÃO DAS VARIÁVEIS DE AMBIENTE
// ==================================================

function validarConfiguracao() {
  const variaveisObrigatorias = ["DATABASE_URL", "JWT_SECRET"];

  const ausentes = variaveisObrigatorias.filter(
    (variavel) => !process.env[variavel]?.trim()
  );

  if (ausentes.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias ausentes: ${ausentes.join(", ")}`
    );
  }

  if (!Number.isSafeInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("A variável PORT deve ser uma porta válida.");
  }

  try {
    const url = new URL(frontendOrigin);

    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error();
    }
  } catch {
    throw new Error("A variável FRONTEND_URL não contém uma origem válida.");
  }
}

// ==================================================
// MIDDLEWARES
// ==================================================

app.disable("x-powered-by");

app.use(
  cors({
    origin: frontendOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10kb" }));

// ==================================================
// ROTA PRINCIPAL
// ==================================================

app.get("/", (req, res) => {
  return res.status(200).json({
    mensagem: "API do sistema de maquiagem funcionando!",
  });
});

// ==================================================
// TESTE DE CONEXÃO COM O BANCO
// ==================================================

// Em produção, restrinja ou remova esta rota de diagnóstico.
app.get("/api/teste", async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      mensagem: "Backend conectado ao banco com sucesso!",
    });
  } catch (error) {
    return next(error);
  }
});

// ==================================================
// ROTAS DA API
// ==================================================

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/produtos", produtosRoutes);

// ==================================================
// ROTA NÃO ENCONTRADA
// ==================================================

app.use((req, res) => {
  return res.status(404).json({
    mensagem: "Rota não encontrada.",
  });
});

// ==================================================
// TRATAMENTO CENTRALIZADO DE ERROS
// ==================================================

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // JSON inválido enviado pelo cliente.
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    return res.status(400).json({
      mensagem: "O formato dos dados enviados é inválido.",
    });
  }

  // Corpo da requisição maior que o limite permitido.
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      mensagem: "O conteúdo enviado é muito grande.",
    });
  }

  // Não expõe detalhes internos ao cliente.
  console.error("Erro interno na API:", error.message);

  return res.status(500).json({
    mensagem: "Ocorreu um erro interno no servidor.",
  });
});

// ==================================================
// INICIALIZAÇÃO DO SERVIDOR
// ==================================================

async function iniciarServidor() {
  try {
    validarConfiguracao();

    // Confirma a conexão antes de aceitar requisições.
    await prisma.$connect();

    const servidor = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

    servidor.on("error", async (error) => {
      console.error("Erro ao iniciar o servidor:", error.message);

      await prisma.$disconnect().catch(() => {});
      process.exitCode = 1;
    });

    return servidor;
  } catch (error) {
    console.error("Não foi possível iniciar a API:", error.message);

    await prisma.$disconnect().catch(() => {});
    process.exitCode = 1;

    return null;
  }
}

// Permite importar o app nos testes sem iniciar outro servidor.
if (require.main === module) {
  iniciarServidor();
}

module.exports = app;
module.exports.iniciarServidor = iniciarServidor;
