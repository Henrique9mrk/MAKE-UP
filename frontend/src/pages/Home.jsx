import Hero from "../components/Hero";
import PageSection from "../components/PageSection";
import ProductCard from "../components/ProductCard";

import { products } from "../data/products";

function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="Beleza e praticidade"
        title="Seu espaço de maquiagem, organizado e intuitivo"
        description="Encontre produtos, monte combinações e tenha uma experiência mais clara e elegante para o seu dia a dia."
        actionLabel="Explorar catálogo"
        actionTo="/produtos"
      />

      <PageSection
        eyebrow="Seleção especial"
        title="Produtos que destacam seu estilo"
        description="Cada item foi pensado para oferecer acabamento, conforto e praticidade em uma navegação simples."
        id="home-highlights"
      >
        <div className="card-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </PageSection>
    </>
  );
}

export default Home;