ALTER TABLE "Produto"
ADD CONSTRAINT "Produto_preco_positivo"
CHECK ("preco" > 0);

ALTER TABLE "Pedido"
ADD CONSTRAINT "Pedido_total_positivo"
CHECK ("total" > 0);

ALTER TABLE "ItemPedido"
ADD CONSTRAINT "ItemPedido_quantidade_positiva"
CHECK ("quantidade" > 0);

ALTER TABLE "ItemPedido"
ADD CONSTRAINT "ItemPedido_preco_positivo"
CHECK ("preco" > 0);