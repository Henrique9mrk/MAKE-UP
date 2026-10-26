
import { useState } from "react";
import { Link } from "react-router-dom";

import PageSection from "../components/PageSection";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const usuarioSalvo = localStorage.getItem("makeup-user");
      const token = localStorage.getItem("makeup-token");

      if (!usuarioSalvo || !token) {
        setErro(
          "Sua sessão expirou. Entre novamente para finalizar o pedido."
        );
        return;
      }

      let usuario;

      try {
        usuario = JSON.parse(usuarioSalvo);
      } catch {
        setErro("Não foi possível identificar sua conta. Entre novamente.");
        return;
      }

      const itens = cartItems.map((item) => ({
        produtoId: Number(item.id),
        quantidade: Number(item.quantity),
      }));

      const response = await fetch(
        "http://localhost:3000/api/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            usuarioId: Number(usuario.id),
            itens,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.mensagem || "Não foi possível criar o pedido."
        );
      }

      clearCart();

      alert("Pedido realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);

      setErro(
        error.message ||
          "Não foi possível finalizar o pedido."
      );
    } finally {
      setCarregando(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <PageSection
        eyebrow="Checkout"
        title="Seu carrinho está vazio"
        description="Adicione produtos ao carrinho antes de finalizar sua compra."
        id="checkout-empty"
      >
        <Link
          to="/produtos"
          className="button button--primary"
        >
          Ver produtos
        </Link>
      </PageSection>
    );
  }

  return (
    <PageSection
      eyebrow="Finalizar compra"
      title="Confira seus dados"
      description="Preencha as informações abaixo para continuar com o pedido."
      id="checkout-page"
    >
      <div className="checkout-layout">
        <form
          className="form-card"
          onSubmit={handleSubmit}
        >
          <label htmlFor="name">
            Nome

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Digite seu nome"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="email">
            E-mail

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label htmlFor="address">
            Endereço

            <textarea
              id="address"
              name="address"
              placeholder="Digite seu endereço"
              value={form.address}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>

          {erro && (
            <p role="alert">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="button button--primary"
            disabled={carregando}
          >
            {carregando
              ? "Finalizando..."
              : "Confirmar pedido"}
          </button>
        </form>

        <aside className="cart-summary">
          <h2>Resumo do pedido</h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="cart-summary__line"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                {formatCurrency(
                  item.price * item.quantity
                )}
              </strong>
            </div>
          ))}

          <hr />

          <div className="cart-summary__total">
            <span>Total</span>

            <strong>
              {formatCurrency(subtotal)}
            </strong>
          </div>
        </aside>
      </div>
    </PageSection>
  );
}

export default Checkout;
