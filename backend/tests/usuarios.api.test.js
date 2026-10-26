
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const { registerHooks } = require("node:module");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET ||= "segredo-de-teste-local-nao-usar-em-producao";

const usuarios = new Map();
let proximoId = 1;

const prismaFalso = {
  usuario: {
    async findUnique({ where }) {
      return usuarios.get(where.email) || null;
    },

    async create({ data }) {
      const usuario = {
        id: proximoId++,
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      };

      usuarios.set(usuario.email, usuario);
      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      };
    },
  },

  async $connect() {},
  async $disconnect() {},
};

const removerHook = registerHooks({
  resolve(specifier, context, nextResolve) {
    const resultado = nextResolve(specifier, context);

    if (
      specifier === "../lib/prisma" &&
      context.parentURL?.endsWith("/routes/usuarios.js")
    ) {
      return {
        ...resultado,
        url: "data:text/javascript,export default {}",
      };
    }

    return resultado;
  },

  load(url, context, nextLoad) {
    if (url === "data:text/javascript,export default {}") {
      return {
        format: "commonjs",
        source: "module.exports = globalThis.__prismaFalsoUsuarios;",
        shortCircuit: true,
      };
    }

    return nextLoad(url, context);
  },
});

// Disponibiliza o Prisma falso apenas para este processo de testes.
globalThis.__prismaFalsoUsuarios = prismaFalso;

const app = require("../src/server");
const servidor = app.listen(0);
let baseURL;

test("preparar endereço local dos testes", async () => {
  if (!servidor.listening) {
    await new Promise((resolve, reject) => {
      servidor.once("listening", resolve);
      servidor.once("error", reject);
    });
  }

  baseURL = `http://127.0.0.1:${servidor.address().port}`;
});

async function requisitar(caminho, dados) {
  return fetch(`${baseURL}${caminho}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
}

after(async () => {
  await new Promise((resolve, reject) => {
    servidor.close((erro) => (erro ? reject(erro) : resolve()));
  });

  removerHook.deregister();
  delete globalThis.__prismaFalsoUsuarios;
  usuarios.clear();
});

test("cadastro válido normaliza nome e email e não expõe senha", async () => {
  const resposta = await requisitar("/api/usuarios", {
    nome: "  Usuário Teste  ",
    email: " TESTE-CADASTRO@EXEMPLO.COM ",
    senha: "senha-segura-123",
  });

  assert.equal(resposta.status, 201);

  const corpo = await resposta.json();

  assert.equal(corpo.usuario.nome, "Usuário Teste");
  assert.equal(corpo.usuario.email, "teste-cadastro@exemplo.com");
  assert.equal("senha" in corpo.usuario, false);
  assert.equal("token" in corpo, false);
});

test("cadastro rejeita campos obrigatórios ausentes", async () => {
  const resposta = await requisitar("/api/usuarios", {
    nome: "Usuário Teste",
    email: "incompleto@exemplo.com",
  });

  assert.equal(resposta.status, 400);
});

test("cadastro rejeita email inválido", async () => {
  const resposta = await requisitar("/api/usuarios", {
    nome: "Usuário Teste",
    email: "email-invalido",
    senha: "senha-segura-123",
  });

  assert.equal(resposta.status, 400);
});

test("cadastro rejeita senha curta", async () => {
  const resposta = await requisitar("/api/usuarios", {
    nome: "Usuário Teste",
    email: "senha-curta@exemplo.com",
    senha: "123",
  });

  assert.equal(resposta.status, 400);
});

test("cadastro rejeita email já cadastrado", async () => {
  const resposta = await requisitar("/api/usuarios", {
    nome: "Outra Pessoa",
    email: "teste-cadastro@exemplo.com",
    senha: "senha-segura-456",
  });

  assert.equal(resposta.status, 409);
});

test("login válido retorna token e não expõe senha", async () => {
  const resposta = await requisitar("/api/usuarios/login", {
    email: "teste-cadastro@exemplo.com",
    senha: "senha-segura-123",
  });

  assert.equal(resposta.status, 200);

  const corpo = await resposta.json();

  assert.equal(typeof corpo.token, "string");
  assert.ok(corpo.token.length > 0);
  assert.equal(corpo.usuario.email, "teste-cadastro@exemplo.com");
  assert.equal("senha" in corpo.usuario, false);

  const dadosToken = jwt.verify(
    corpo.token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] }
  );

  assert.equal(dadosToken.id, corpo.usuario.id);
});

test("login rejeita senha incorreta", async () => {
  const resposta = await requisitar("/api/usuarios/login", {
    email: "teste-cadastro@exemplo.com",
    senha: "senha-errada-123",
  });

  assert.equal(resposta.status, 401);
});

test("login rejeita email inexistente", async () => {
  const resposta = await requisitar("/api/usuarios/login", {
    email: "nao-existe@exemplo.com",
    senha: "senha-segura-123",
  });

  assert.equal(resposta.status, 401);

  const corpo = await resposta.json();
  assert.equal(corpo.mensagem, "Email ou senha inválidos.");
});

test("listagem de usuários permanece desativada", async () => {
  const resposta = await fetch(`${baseURL}/api/usuarios`);

  assert.equal(resposta.status, 403);
});
