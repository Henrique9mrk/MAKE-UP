
const test = require("node:test");
const assert = require("node:assert/strict");

const validarItensPedido = require("../src/utils/validarItensPedido");

test("aceita produto com quantidade positiva", () => {
  assert.equal(
    validarItensPedido([{ produtoId: 1, quantidade: 2 }]),
    true
  );
});

test("rejeita quantidade negativa", () => {
  assert.equal(
    validarItensPedido([{ produtoId: 1, quantidade: -1 }]),
    false
  );
});

test("rejeita quantidade igual a zero", () => {
  assert.equal(
    validarItensPedido([{ produtoId: 1, quantidade: 0 }]),
    false
  );
});

test("rejeita lista vazia", () => {
  assert.equal(validarItensPedido([]), false);
});

test("rejeita produto com identificador inválido", () => {
  assert.equal(
    validarItensPedido([{ produtoId: 0, quantidade: 1 }]),
    false
  );
});

test("rejeita quantidade decimal", () => {
  assert.equal(
    validarItensPedido([{ produtoId: 1, quantidade: 1.5 }]),
    false
  );
});

test("rejeita quantidade enviada como texto", () => {
  assert.equal(
    validarItensPedido([{ produtoId: 1, quantidade: "2" }]),
    false
  );
});

test("rejeita identificador enviado como texto", () => {
  assert.equal(
    validarItensPedido([{ produtoId: "1", quantidade: 2 }]),
    false
  );
});

test("rejeita quantidade acima do limite de inteiro seguro", () => {
  assert.equal(
    validarItensPedido([
      { produtoId: 1, quantidade: Number.MAX_SAFE_INTEGER + 1 }
    ]),
    false
  );
});

test("rejeita item nulo ou lista como item", () => {
  assert.equal(validarItensPedido([null]), false);
  assert.equal(validarItensPedido([[1, 2]]), false);
});
