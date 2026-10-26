import { Link } from "react-router-dom";

import { formatCurrency } from "../utils/formatCurrency";
import { useFavorites } from "../context/useFavorites";

function ProductCard({ product }) {
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useFavorites();

  const favorite = isFavorite(product.id);

  function handleFavorite() {
    if (favorite) {
      removeFromFavorites(product.id);
      return;
    }

    addToFavorites(product);
  }

  return (
    <article className="product-card">
      <div className="product-card__image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__image"
        />

        <button
          type="button"
          className={
            favorite
              ? "favorite-button favorite-button--active"
              : "favorite-button"
          }
          onClick={handleFavorite}
          aria-label={
            favorite
              ? `Remover ${product.name} dos favoritos`
              : `Adicionar ${product.name} aos favoritos`
          }
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="product-card__body">
        <p className="product-card__category">
          {product.category}
        </p>

        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <div className="product-card__footer">
          <strong>
            {formatCurrency(product.price)}
          </strong>

          <Link
            to={`/produto/${product.id}`}
            className="text-link"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;