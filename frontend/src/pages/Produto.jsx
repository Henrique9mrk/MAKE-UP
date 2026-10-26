
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageSection from "../components/PageSection";
import { formatCurrency } from "../utils/formatCurrency";
import { useCart } from "../context/CartContext";

function Produto() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarProduto() {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const response = await fetch(
          `http://localhost:3000/api/produtos/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.mensagem || "Não foi possível carregar o produto."
          );
        }

        if (ativo) {
          setProduct({
            id: data.id,
            name: data.nome,
            category: data.categoria,
            price: Number(data.preco),
            description: data.descricao,
            image: data.imagem,
          });
        }
      } catch (erro) {
        if (ativo) {
          setError(erro.message || "Erro ao carregar o produto.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarProduto();

    return () => {
      ativo = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PageSection
        eyebrow="Produto"
        title="Carregando produto..."
        id="product-loading"
      >
        Aguarde enquanto buscamos as informações.
      </PageSection>
    );
  }

  if (error || !product) {
    return (
      <PageSection
        eyebrow="Produto"
        title="Produto indisponível"
        description={error || "O produto não foi encontrado."}
        id="product-not-found"
      >
        <Link to="/produtos" className="text-link">
          Voltar para produtos
        </Link>
      </PageSection>
    );
  }

  function handleAddToCart() {
    addToCart(product);
  }

  return (
    <PageSection
      eyebrow="Detalhes"
      title={product.name}
      description={product.description}
      id="product-detail"
    >
      <article className="product-detail">
        <img
          src={product.image}
          alt={product.name}
          className="product-detail__image"
        />

        <div className="product-detail__content">
          <p className="product-card__category">
            {product.category}
          </p>

          <h2>{product.name}</h2>
          <p>{product.description}</p>

          <p className="product-detail__price">
            {formatCurrency(product.price)}
          </p>

          <button
            type="button"
            className="button button--primary"
            onClick={handleAddToCart}
          >
            Adicionar ao carrinho
          </button>

          <Link to="/produtos" className="text-link">
            Continuar comprando
          </Link>
        </div>
      </article>
    </PageSection>
  );
}

export default Produto;
