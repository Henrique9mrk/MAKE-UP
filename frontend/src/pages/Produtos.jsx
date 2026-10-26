
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PageSection from "../components/PageSection";
import ProductCard from "../components/ProductCard";

import { getProducts } from "../services/productService";

function Produtos() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("categoria") || "Todos"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carrega os produtos da API.
  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (!Array.isArray(data)) {
          throw new Error("A API retornou uma lista de produtos inválida.");
        }

        const produtosFormatados = data.map((product) => ({
          id: product.id,
          name: product.nome,
          category: product.categoria,
          price: Number(product.preco),
          description: product.descricao ?? "",
          image: product.imagem,
        }));

        if (ativo) {
          setProducts(produtosFormatados);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);

        if (ativo) {
          setError(
            "Não foi possível carregar os produtos. Verifique se o servidor está funcionando e tente novamente."
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, []);

  // Cria uma lista de categorias sem repetições.
  const categories = useMemo(() => {
    const categoriasUnicas = [
      ...new Set(
        products
          .map((product) => product.category?.trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b, "pt-BR"));

    return ["Todos", ...categoriasUnicas];
  }, [products]);

  // Mantém o filtro sincronizado com a URL.
  useEffect(() => {
    const categoriaDaUrl = searchParams.get("categoria") || "Todos";

    const categoriaValida = categories.includes(categoriaDaUrl)
      ? categoriaDaUrl
      : "Todos";

    setCategory(categoriaValida);

    // Corrige uma categoria inválida ou inexistente na URL.
    if (categoriaDaUrl !== categoriaValida) {
      setSearchParams(
        categoriaValida === "Todos"
          ? {}
          : { categoria: categoriaValida },
        { replace: true }
      );
    }
  }, [searchParams, categories, setSearchParams]);

  // Atualiza o filtro e o endereço da página.
  function selecionarCategoria(novaCategoria) {
    setCategory(novaCategoria);

    setSearchParams(
      novaCategoria === "Todos"
        ? {}
        : { categoria: novaCategoria }
    );
  }

  // Filtra os produtos por nome, descrição e categoria.
  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLocaleLowerCase("pt-BR");

    return products.filter((product) => {
      const nome = product.name ?? "";
      const descricao = product.description ?? "";

      const matchesSearch =
        nome.toLocaleLowerCase("pt-BR").includes(searchTerm) ||
        descricao.toLocaleLowerCase("pt-BR").includes(searchTerm);

      const matchesCategory =
        category === "Todos" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <PageSection
      eyebrow="Nosso catálogo"
      title="Encontre seus produtos favoritos"
      description="Explore nossa seleção de produtos de maquiagem e encontre o que combina com seu estilo."
      id="products-page"
    >
      <div className="products-toolbar">
        <div className="products-search">
          <label htmlFor="product-search">Buscar produto</label>

          <input
            id="product-search"
            type="search"
            placeholder="Digite o nome do produto..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            disabled={loading || Boolean(error)}
          />
        </div>

        <div className="products-filter">
          <span>Categoria</span>

          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "filter-button filter-button--active"
                    : "filter-button"
                }
                onClick={() => selecionarCategoria(item)}
                disabled={loading || Boolean(error)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="products-empty" role="status">
          <p>Carregando produtos...</p>
        </div>
      )}

      {!loading && error && (
        <div className="products-empty" role="alert">
          <h3>Não foi possível carregar o catálogo</h3>
          <p>{error}</p>

          <button
            type="button"
            className="button button--primary"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="products-result" aria-live="polite">
            <p>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "produto encontrado"
                : "produtos encontrados"}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="card-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="products-empty">
              <h3>Nenhum produto encontrado</h3>

              <p>
                Tente buscar por outro nome ou selecionar uma categoria
                diferente.
              </p>

              {category !== "Todos" && (
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => selecionarCategoria("Todos")}
                >
                  Ver todos os produtos
                </button>
              )}
            </div>
          )}
        </>
      )}
    </PageSection>
  );
}

export default Produtos;
