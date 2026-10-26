import PageSection from "../components/PageSection";
import { useCart } from "../context/useCart";
import { formatCurrency } from "../utils/formatCurrency";
import { Link } from "react-router-dom";

function Carrinho() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <PageSection
        eyebrow="Seu carrinho"
        title="Seu carrinho está vazio"
        description="Adicione alguns produtos para começar sua compra."
        id="cart-empty"
      />
    );
  }

  return (
    <PageSection
      eyebrow="Seu carrinho"
      title="Produtos selecionados"
      description="Confira os produtos que você adicionou ao carrinho."
      id="cart-page"
    >
      <div className="cart-layout">

        <div className="cart-items">
          {cartItems.map((item) => (
            <article
              key={item.id}
              className="cart-item"
            >
              <img
                src={item.image}
                alt={item.name}
                className="cart-item__image"
              />

              <div className="cart-item__content">

                <p className="product-card__category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                <strong>
                  {formatCurrency(item.price)}
                </strong>

                <div className="cart-item__actions">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  type="button"
                  className="cart-remove"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  Remover
                </button>

              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">

          <h2>Resumo da compra</h2>

          <div className="cart-summary__line">
            <span>Subtotal</span>

            <strong>
              {formatCurrency(subtotal)}
            </strong>
          </div>

          <div className="cart-summary__line">
            <span>Frete</span>

            <span>A calcular</span>
          </div>

          <hr />

          <div className="cart-summary__total">
            <span>Total</span>

            <strong>
              {formatCurrency(subtotal)}
            </strong>
          </div>

          <Link
            to="/checkout"
            className="button button--primary"
          >
            Finalizar compra
          </Link>

          <button
            type="button"
            className="cart-clear"
            onClick={clearCart}
          >
            Limpar carrinho
          </button>

        </aside>

      </div>
    </PageSection>
  );
}

export default Carrinho;