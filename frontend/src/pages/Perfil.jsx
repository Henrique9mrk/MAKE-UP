
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageSection from "../components/PageSection";
import { formatCurrency } from "../utils/formatCurrency";

function Perfil() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("makeup-user");
    const token = localStorage.getItem("makeup-token");

    if (!usuarioSalvo || !token) {
      return null;
    }

    try {
      return JSON.parse(usuarioSalvo);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);

      localStorage.removeItem("makeup-user");
      localStorage.removeItem("makeup-token");

      return null;
    }
  });

  const [pedidos, setPedidos] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);
  const [erroPedidos, setErroPedidos] = useState("");

  useEffect(() => {
    if (!usuario) {
      navigate("/login", { replace: true });
    }
  }, [usuario, navigate]);

  useEffect(() => {
  if (!usuario) {
    return;
  }

  let ativo = true;

    async function carregarPedidos() {
      try {
        setCarregandoPedidos(true);
        setErroPedidos("");

        const token = localStorage.getItem("makeup-token");

        if (!token) {
          localStorage.removeItem("makeup-user");
          localStorage.removeItem("makeup-token");

          navigate("/login", { replace: true });
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/pedidos/usuario/${usuario.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("makeup-user");
          localStorage.removeItem("makeup-token");

          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.mensagem || "Não foi possível carregar os pedidos."
          );
        }

        if (ativo) {
          setPedidos(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);

        if (ativo) {
          setErroPedidos(
            error.message ||
              "Não foi possível carregar seus pedidos. Tente novamente."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoPedidos(false);
        }
      }
    }

    carregarPedidos();

    return () => {
      ativo = false;
    };
  }, [usuario, navigate]);

  function handleLogout() {
    localStorage.removeItem("makeup-user");
    localStorage.removeItem("makeup-token");

    navigate("/login", { replace: true });
  }

  if (!usuario) {
    return null;
  }

  const tituloPerfil = `Olá, ${usuario.nome}!`;

  return (
    <PageSection
      eyebrow="Minha conta"
      title={tituloPerfil}
      description="Aqui você pode acessar as principais informações da sua conta."
      id="perfil-page"
    >
      <div className="profile-card">
        <div className="profile-card__header">
          <div className="profile-avatar">
            {usuario.nome?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{usuario.nome}</h2>
            <p>{usuario.email}</p>
          </div>
        </div>

        <div className="profile-card__content">
          <div className="profile-info">
            <span>Nome</span>
            <strong>{usuario.nome}</strong>
          </div>

          <div className="profile-info">
            <span>E-mail</span>
            <strong>{usuario.email}</strong>
          </div>
        </div>

        <div className="profile-card__actions">
          <Link
            to="/favoritos"
            className="button button--secondary"
          >
            Meus favoritos
          </Link>

          <Link
            to="/carrinho"
            className="button button--secondary"
          >
            Meu carrinho
          </Link>

          <button
            type="button"
            className="button button--primary"
            onClick={handleLogout}
          >
            Sair da conta
          </button>
        </div>
      </div>

      <div className="profile-orders">
        <div className="profile-orders__header">
          <div>
            <p className="section-eyebrow">Histórico</p>
            <h2>Meus pedidos</h2>
            <p>Confira os produtos que você já comprou.</p>
          </div>
        </div>

        {carregandoPedidos && (
          <div className="profile-orders__message">
            <p>Carregando seus pedidos...</p>
          </div>
        )}

        {!carregandoPedidos && erroPedidos && (
          <div className="profile-orders__message profile-orders__message--error">
            <p>{erroPedidos}</p>
          </div>
        )}

        {!carregandoPedidos &&
          !erroPedidos &&
          pedidos.length === 0 && (
            <div className="profile-orders__message">
              <p>Você ainda não possui pedidos.</p>

              <Link
                to="/produtos"
                className="button button--primary"
              >
                Ver produtos
              </Link>
            </div>
          )}

        {!carregandoPedidos &&
          !erroPedidos &&
          pedidos.length > 0 && (
            <div className="profile-orders__list">
              {pedidos.map((pedido) => (
                <article
                  key={pedido.id}
                  className="profile-order"
                >
                  <div className="profile-order__header">
                    <div>
                      <span>Pedido</span>
                      <strong>#{pedido.id}</strong>
                    </div>

                    <div>
                      <span>Data</span>
                      <strong>
                        {pedido.data
                          ? new Date(
                              pedido.data
                            ).toLocaleDateString("pt-BR")
                          : "Data não disponível"}
                      </strong>
                    </div>
                  </div>

                  <div className="profile-order__items">
                    {(pedido.itens || []).map((item) => (
                      <div
                        key={item.id}
                        className="profile-order__item"
                      >
                        {item.produto?.imagem && (
                          <img
                            src={item.produto.imagem}
                            alt={item.produto.nome}
                          />
                        )}

                        <div>
                          <span>
                            {item.produto?.categoria}
                          </span>
                          <h3>{item.produto?.nome}</h3>
                          <p>Quantidade: {item.quantidade}</p>
                        </div>

                        <strong>
                          {formatCurrency(
                            Number(item.preco) * item.quantidade
                          )}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="profile-order__total">
                    <span>Total do pedido</span>
                    <strong>
                      {formatCurrency(Number(pedido.total))}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </PageSection>
  );
}

export default Perfil;
