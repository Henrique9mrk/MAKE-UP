const MAX_ITENS_PEDIDO = 50;
const MAX_QUANTIDADE_PRODUTO = 99;

function validarItensPedido(itens) {
  if (
    !Array.isArray(itens) ||
    itens.length === 0 ||
    itens.length > MAX_ITENS_PEDIDO
  ) {
    return false;
  }

  const quantidadesPorProduto = new Map();

  for (const item of itens) {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      return false;
    }

    if (
      !Number.isSafeInteger(item.produtoId) ||
      item.produtoId <= 0 ||
      !Number.isSafeInteger(item.quantidade) ||
      item.quantidade <= 0 ||
      item.quantidade > MAX_QUANTIDADE_PRODUTO
    ) {
      return false;
    }

    const quantidadeAtual =
      quantidadesPorProduto.get(item.produtoId) || 0;

    const novaQuantidade =
      quantidadeAtual + item.quantidade;

    if (novaQuantidade > MAX_QUANTIDADE_PRODUTO) {
      return false;
    }

    quantidadesPorProduto.set(
      item.produtoId,
      novaQuantidade
    );
  }

  return true;
}

module.exports = validarItensPedido;
