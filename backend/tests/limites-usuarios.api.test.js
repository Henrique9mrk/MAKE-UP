const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

const app = require("../src/server");

let servidor;
let baseURL;

before(async () => {
  servidor = app.listen(0);

  if (!servidor.listening) {
    await new Promise((resolve, reject) => {
      servidor.once("listening", resolve);
      servidor.once("error", reject);
    });
  }

  const endereco = servidor.address();
  baseURL = `http://127.0.0.1:${endereco.port}`;
});

after(async () => {
  if (servidor?.listening) {
    await new Promise((resolve, reject) => {
      servidor.close((erro) => {
        if (erro) reject(erro);
        else resolve();
      });
    });
  }
});

test("cadastro bloqueia a sexta tentativa em 15 minutos", async () => {
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    const resposta = await fetch(`${baseURL}/api/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    assert.equal(
      resposta.status,
      400,
      `A tentativa ${tentativa} deveria retornar 400`
    );
  }

  const resposta = await fetch(`${baseURL}/api/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.equal(resposta.status, 429);

  const corpo = await resposta.json();

  assert.match(corpo.mensagem, /muitas tentativas de cadastro/i);
});

test("login bloqueia a sexta tentativa em 15 minutos", async () => {
  for (let tentativa = 1; tentativa <= 5; tentativa++) {
    const resposta = await fetch(`${baseURL}/api/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    assert.equal(
      resposta.status,
      400,
      `A tentativa ${tentativa} deveria retornar 400`
    );
  }

  const resposta = await fetch(`${baseURL}/api/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.equal(resposta.status, 429);

  const corpo = await resposta.json();

  assert.match(corpo.mensagem, /muitas tentativas de login/i);
});