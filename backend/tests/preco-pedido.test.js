
const { test } = require("node:test");
const assert = require("node:assert/strict");

const calcularTotalPedido = require("../src/utils/calcularTotalPedido");

test("calcula o pedido usando o preço cadastrado, não o preço enviado pelo cliente", () => {
  const produtosDoBanco = [
    {
      id: 1,
      nome: "Base Líquida Velvet",
      preco: 129.90,
    },
  ];

  const itensValidados = [
    {
      produtoId: 1,
      quantidade: 1,
    },
  ];

  const total = calcularTotalPedido(
    itensValidados,
    produtosDoBanco
  );

  assert.equal(total, 129.9);
  assert.notEqual(total, 1.00);
});
