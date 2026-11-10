
const { test, after } = require("node:test");
const assert = require("node:assert/strict");

const app = require("../src/server");
const prisma = require("../src/lib/prisma");

const servidor = app.listen(0);

const baseURL = new Promise((resolve) => {
  servidor.on("listening", () => {
    const { port } = servidor.address();
    resolve(`http://127.0.0.1:${port}`);
  });
});

after(async () => {
  await new Promise((resolve, reject) => {
    servidor.close((erro) => {
      if (erro) reject(erro);
      else resolve();
    });
  });

  await prisma.$disconnect();
});

test("GET /api/produtos deve listar os produtos", async () => {
  const resposta = await fetch(
    `${await baseURL}/api/produtos`
  );

  assert.equal(resposta.status, 200);

  const produtos = await resposta.json();

  assert.ok(Array.isArray(produtos));
});

test("GET /api/produtos/:id deve retornar 400 para ID inválido", async () => {
  const resposta = await fetch(
    `${await baseURL}/api/produtos/abc`
  );

  assert.equal(resposta.status, 400);

  const dados = await resposta.json();

  assert.equal(dados.mensagem, "ID do produto inválido.");
});

test("GET /api/produtos/:id deve retornar 404 para produto inexistente", async () => {
  const resposta = await fetch(
    `${await baseURL}/api/produtos/999999999`
  );

  assert.equal(resposta.status, 404);

  const dados = await resposta.json();

  assert.equal(dados.mensagem, "Produto não encontrado.");
});

const idsInvalidos = [
  "1.5",
  "1e2",
  "%201%20",
  "0",
  "-1",
  "9007199254740992",
];

for (const id of idsInvalidos) {
  test(`GET /api/produtos/${id} deve rejeitar ID inválido`, async () => {
    const resposta = await fetch(
      `${await baseURL}/api/produtos/${id}`
    );

    assert.equal(resposta.status, 400);

    const dados = await resposta.json();

    assert.equal(dados.mensagem, "ID do produto inválido.");
  });
}
