
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/server");
const jwt = require("jsonwebtoken");

let servidor;
let baseURL;

// Teste 1: bloquear criação de pedido sem token
test("bloqueia a criação de pedido sem token", async () => {
  servidor = app.listen(0);

  await new Promise((resolve, reject) => {
    servidor.once("listening", resolve);
    servidor.once("error", reject);
  });

  const endereco = servidor.address();
  baseURL = `http://127.0.0.1:${endereco.port}`;

  const resposta = await fetch(`${baseURL}/api/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itens: [{ produtoId: 1, quantidade: 1 }],
    }),
  });

  const dados = await resposta.json();

  assert.equal(resposta.status, 401);
  assert.equal(
    dados.mensagem,
    "Token de autenticação não informado."
  );
});

// Teste 2: bloquear consulta com token inválido
test("bloqueia consulta de pedidos com token inválido", async () => {
  const resposta = await fetch(
    `${baseURL}/api/pedidos/usuario/3`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer token-invalido",
      },
    }
  );

  const dados = await resposta.json();

  assert.equal(resposta.status, 401);
  assert.equal(
    dados.mensagem,
    "Token inválido ou expirado. Faça login novamente."
  );
});

// Teste 3: bloquear consulta com token expirado
test("bloqueia consulta de pedidos com token expirado", async () => {
  assert.ok(
    process.env.JWT_SECRET,
    "JWT_SECRET precisa estar configurado para executar este teste."
  );

  const token = jwt.sign(
    {
      id: 2,
      email: "teste@example.com",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "-1s",
      algorithm: "HS256",
    }
  );

  const resposta = await fetch(
    `${baseURL}/api/pedidos/usuario/2`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const dados = await resposta.json();

  assert.equal(resposta.status, 401);
  assert.equal(
    dados.mensagem,
    "Token inválido ou expirado. Faça login novamente."
  );
});

// Teste 4: bloquear token sem ID de usuário válido
test("bloqueia consulta com token sem ID de usuário válido", async () => {
  assert.ok(
    process.env.JWT_SECRET,
    "JWT_SECRET precisa estar configurado para executar este teste."
  );

  const token = jwt.sign(
    {
      email: "teste@example.com",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
      algorithm: "HS256",
    }
  );

  const resposta = await fetch(
    `${baseURL}/api/pedidos/usuario/2`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const dados = await resposta.json();

  assert.equal(resposta.status, 401);
  assert.equal(
    dados.mensagem,
    "Token inválido. Faça login novamente."
  );
});

// Teste 5: impedir acesso ao histórico de outra conta
test("impede que um usuário consulte pedidos de outra conta", async () => {
  assert.ok(
    process.env.JWT_SECRET,
    "JWT_SECRET precisa estar configurado para executar este teste."
  );

  const token = jwt.sign(
    {
      id: 2,
      email: "teste@example.com",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );

  const resposta = await fetch(
    `${baseURL}/api/pedidos/usuario/3`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const dados = await resposta.json();

  assert.equal(resposta.status, 403);
  assert.equal(
    dados.mensagem,
    "Você não tem permissão para consultar esses pedidos."
  );
});

// Teste 6: rejeitar quantidade inválida mesmo com token válido
test("rejeita quantidade inválida mesmo com token válido", async () => {
  assert.ok(
    process.env.JWT_SECRET,
    "JWT_SECRET precisa estar configurado para executar este teste."
  );

  const token = jwt.sign(
    {
      id: 2,
      email: "teste@example.com",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );

  const resposta = await fetch(`${baseURL}/api/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      itens: [{ produtoId: 1, quantidade: -1 }],
    }),
  });

  const dados = await resposta.json();

  assert.equal(resposta.status, 400);
  assert.equal(
    dados.mensagem,
    "Os produtos ou as quantidades são inválidos."
  );
});

// Teste 7: rejeitar pedido com produto inexistente
test("rejeita pedido com produto inexistente", async () => {
  assert.ok(
    process.env.JWT_SECRET,
    "JWT_SECRET precisa estar configurado para executar este teste."
  );

  const token = jwt.sign(
    {
      id: 2,
      email: "teste@example.com",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );

  const resposta = await fetch(`${baseURL}/api/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      itens: [
        {
          produtoId: 999999999,
          quantidade: 1,
        },
      ],
    }),
  });

  const dados = await resposta.json();

  assert.equal(resposta.status, 400);
  assert.equal(
    dados.mensagem,
    "Um ou mais produtos não foram encontrados."
  );
});

// Teste 8: rejeitar cabeçalho de autenticação malformado
test("rejeita cabeçalho de autenticação malformado", async () => {
  const resposta = await fetch(
    `${baseURL}/api/pedidos/usuario/2`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic token-invalido",
      },
    }
  );

  const dados = await resposta.json();

  assert.equal(resposta.status, 401);
  assert.equal(
    dados.mensagem,
    "Formato de autenticação inválido. Use Bearer <token>."
  );
});

// Teste 9: rejeitar token assinado com algoritmo não permitido
test("rejeita token assinado com algoritmo não permitido", async () => {
  assert.ok(
    process.env.JWT_SECRET,
    "JWT_SECRET precisa estar configurado para executar este teste."
  );

  const token = jwt.sign(
    {
      id: 2,
      email: "teste@example.com",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
      algorithm: "HS384",
    }
  );

  const resposta = await fetch(
    `${baseURL}/api/pedidos/usuario/2`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const dados = await resposta.json();

  assert.equal(resposta.status, 401);
  assert.equal(
    dados.mensagem,
    "Token inválido ou expirado. Faça login novamente."
  );
});

// Fechar o servidor ao terminar os testes
after(() => {
  if (servidor) {
    servidor.close();
  }
});
