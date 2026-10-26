
function validarItensPedido(itens) {
  if (!Array.isArray(itens) || itens.length === 0) {
    return false;
  }

  return itens.every((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item)
    ) {
      return false;
    }

    return (
      Number.isSafeInteger(item.produtoId) &&
      item.produtoId > 0 &&
      Number.isSafeInteger(item.quantidade) &&
      item.quantidade > 0
    );
  });
}

module.exports = validarItensPedido;