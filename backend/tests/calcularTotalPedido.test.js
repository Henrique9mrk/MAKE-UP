
const { test } = require("node:test");
const assert = require("node:assert/strict");

const calcularTotalPedido = require(
  "../src/utils/calcularTotalPedido"
);

test("calcula o total de duas unidades", () => {
  const itens = [
    { produtoId: 1, quantidade: 2 },
  ];

  const produtos = [
    { id: 1, preco: "129.90" },
  ];

  assert.equal(
    calcularTotalPedido(itens, produtos),
    259.8
  );
});

test("agrupa corretamente o cálculo de itens repetidos", () => {
  const itens = [
    { produtoId: 1, quantidade: 1 },
    { produtoId: 1, quantidade: 2 },
  ];

  const produtos = [
    { id: 1, preco: "129.90" },
  ];

  assert.equal(
    calcularTotalPedido(itens, produtos),
    389.7
  );
});

test("rejeita um produto que não foi encontrado", () => {
  assert.throws(
    () =>
      calcularTotalPedido(
        [{ produtoId: 99, quantidade: 1 }],
        []
      ),
    /Produto 99 não encontrado/
  );
});
