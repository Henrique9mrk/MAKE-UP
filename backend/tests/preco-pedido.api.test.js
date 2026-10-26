
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const { registerHooks } = require("node:module");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const jwt = require("jsonwebtoken");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const caminhoPrisma = pathToFileURL(
  path.resolve(__dirname, "../src/lib/prisma.js")
).href;

let servidor;

globalThis.__pedidoCriado = undefined;

const hooks = registerHooks({
  load(url, context, nextLoad) {
    if (url === caminhoPrisma) {
      return {
        format: "commonjs",
        shortCircuit: true,
        source: `
          module.exports = {
            produto: {
              findMany: async () => [
                {
                  id: 1,
                  nome: "Base Líquida Velvet",
                  preco: 129.90
                }
              ]
            },
            pedido: {
              create: async ({ data }) => {
                globalThis.__pedidoCriado = data;

                return {
                  id: 999,
                  ...data,
                  itens: {
                    create: data.itens.create
                  }
                };
              },
              findMany: async () => []
            }
          };
        `,
      };
    }

    return nextLoad(url, context);
  },
});

test("ignora preço adulterado enviado pelo cliente", async () => {
  assert.ok(
    process.env.JWT_SECRET,
    "JWT_SECRET precisa estar configurado no arquivo .env."
  );

  const app = require("../src/server");

  const token = jwt.sign(
    { id: 2, email: "teste@example.com" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  servidor = app.listen(0);

  await new Promise((resolve, reject) => {
    servidor.once("listening", resolve);
    servidor.once("error", reject);
  });

  const baseURL = `http://127.0.0.1:${servidor.address().port}`;

  const resposta = await fetch(`${baseURL}/api/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      itens: [
        {
          produtoId: 1,
          quantidade: 1,
          preco: 1.00,
        },
      ],
      total: 1.00,
    }),
  });

  const dados = await resposta.json();
  const pedidoCriado = globalThis.__pedidoCriado;

  assert.equal(resposta.status, 201);
  assert.ok(pedidoCriado, "O Prisma simulado não recebeu o pedido.");
  assert.equal(Number(pedidoCriado.total), 129.9);
  assert.equal(Number(pedidoCriado.itens.create[0].preco), 129.9);
  assert.notEqual(Number(pedidoCriado.total), 1.00);
  assert.equal(dados.mensagem, "Pedido criado com sucesso!");
});

test("usa o usuário autenticado e ignora usuarioId enviado pelo cliente", async () => {
  globalThis.__pedidoCriado = undefined;

  const app = require("../src/server");

  const token = jwt.sign(
    { id: 2, email: "teste@example.com" },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  const servidorTeste = app.listen(0);

  try {
    await new Promise((resolve, reject) => {
      servidorTeste.once("listening", resolve);
      servidorTeste.once("error", reject);
    });

    const baseURL = `http://127.0.0.1:${servidorTeste.address().port}`;

    const resposta = await fetch(`${baseURL}/api/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuarioId: 3,
        itens: [
          {
            produtoId: 1,
            quantidade: 1,
          },
        ],
      }),
    });

    assert.equal(resposta.status, 201);
    assert.ok(
      globalThis.__pedidoCriado,
      "O Prisma simulado não recebeu o pedido."
    );
    assert.equal(
      globalThis.__pedidoCriado.usuarioId,
      2,
      "O pedido deve pertencer ao usuário autenticado, não ao ID enviado pelo cliente."
    );
  } finally {
    await new Promise((resolve, reject) => {
      servidorTeste.close((erro) => {
        if (erro) reject(erro);
        else resolve();
      });
    });
  }
});

after(async () => {
  if (servidor) {
    await new Promise((resolve, reject) => {
      servidor.close((erro) => {
        if (erro) reject(erro);
        else resolve();
      });
    });
  }

  hooks.deregister();
  delete globalThis.__pedidoCriado;
});
