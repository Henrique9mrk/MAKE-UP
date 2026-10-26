import PageSection from "../components/PageSection";
import ProductCard from "../components/ProductCard";

import { useFavorites } from "../context/useFavorites";

function Favoritos() {
  const { favoriteItems } = useFavorites();

  return (
    <PageSection
      eyebrow="Minha conta"
      title="Meus favoritos"
      description="Aqui ficam os produtos que você escolheu para guardar."
      id="favorites-page"
    >
      {favoriteItems.length > 0 ? (
        <div className="card-grid">
          {favoriteItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="products-empty">
          <h3>Você ainda não possui favoritos</h3>

          <p>
            Explore nossos produtos e salve os seus favoritos.
          </p>
        </div>
      )}
    </PageSection>
  );
}

export default Favoritos;