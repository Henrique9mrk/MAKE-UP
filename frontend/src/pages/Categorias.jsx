import "../styles/categorias.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      try {
        const resposta = await fetch("http://localhost:3000/api/produtos");

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os produtos.");
        }

        const produtos = await resposta.json();

        const categoriasUnicas = [
          ...new Set(
            produtos
              .map((produto) => produto.categoria?.trim())
              .filter(Boolean)
          ),
        ].sort((a, b) => a.localeCompare(b, "pt-BR"));

        if (ativo) {
          setCategorias(categoriasUnicas);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Ocorreu um erro ao carregar as categorias.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarCategorias();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return <main className="categorias-page"><p>Carregando categorias...</p></main>;
  }

  if (erro) {
    return (
      <main className="categorias-page">
        <h1>Categorias</h1>
        <p role="alert">{erro}</p>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </main>
    );
  }

  return (
    <main className="categorias-page">
      <header className="categorias-header">
        <p className="categorias-eyebrow">Explore nosso catálogo</p>
        <h1>Categorias</h1>
        <p>Encontre os produtos de beleza por categoria.</p>
      </header>

      {categorias.length === 0 ? (
        <section className="categorias-vazias">
          <p>Nenhuma categoria está disponível no momento.</p>
          <Link to="/produtos">Ver todos os produtos</Link>
        </section>
      ) : (
        <section className="categorias-grid" aria-label="Lista de categorias">
          {categorias.map((categoria) => (
            <article className="categoria-card" key={categoria}>
              <h2>{categoria}</h2>
              <Link
                to={`/produtos?categoria=${encodeURIComponent(categoria)}`}
              >
                Ver produtos
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Categorias;
