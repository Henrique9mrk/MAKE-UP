
function calcularTotalPedido(itens, produtos) {
  const totalEmCentavos = itens.reduce((soma, item) => {
    const produto = produtos.find(
      (p) => p.id === item.produtoId
    );

    if (!produto) {
      throw new Error(
        `Produto ${item.produtoId} não encontrado.`
      );
    }

    const precoEmCentavos = Math.round(
      Number(produto.preco) * 100
    );

    return soma + precoEmCentavos * item.quantidade;
  }, 0);

  return totalEmCentavos / 100;
}

module.exports = calcularTotalPedido;
