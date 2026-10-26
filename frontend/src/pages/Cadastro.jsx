import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageSection from "../components/PageSection";

function Cadastro() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
password: "",
confirmPassword: "",
});

const [erro, setErro] = useState("");
const [sucesso, setSucesso] = useState("");
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
setSucesso("");

if (form.password !== form.confirmPassword) {
  setErro("As senhas não coincidem.");
  return;
}

setCarregando(true);

try {
  const response = await fetch(
    "http://localhost:3000/api/usuarios",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: form.name,
        email: form.email,
        senha: form.password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setErro(
      data.mensagem || "Não foi possível realizar o cadastro."
    );
    return;
  }

  setSucesso("Cadastro realizado com sucesso!");

  setForm({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  setTimeout(() => {
    navigate("/login");
  }, 1500);
} catch (error) {
  console.error(error);

  setErro(
    "Não foi possível conectar ao servidor. Tente novamente."
  );
} finally {
  setCarregando(false);
}

}

return ( <PageSection
   eyebrow="Crie sua conta"
   title="Cadastro"
   description="Crie sua conta para acompanhar pedidos e salvar seus produtos favoritos."
   id="register-page"
 > <form
     className="form-card"
     onSubmit={handleSubmit}
   > <label htmlFor="register-name">
Nome

      <input
        id="register-name"
        name="name"
        type="text"
        placeholder="Digite seu nome"
        value={form.name}
        onChange={handleChange}
        required
      />
    </label>

    <label htmlFor="register-email">
      E-mail

      <input
        id="register-email"
        name="email"
        type="email"
        placeholder="Digite seu e-mail"
        value={form.email}
        onChange={handleChange}
        required
      />
    </label>

    <label htmlFor="register-password">
      Senha

      <input
        id="register-password"
        name="password"
        type="password"
        placeholder="Digite sua senha"
        value={form.password}
        onChange={handleChange}
        required
      />
    </label>

    <label htmlFor="register-confirm-password">
      Confirmar senha

      <input
        id="register-confirm-password"
        name="confirmPassword"
        type="password"
        placeholder="Digite a senha novamente"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />
    </label>

    {erro && (
      <p role="alert">
        {erro}
      </p>
    )}

    {sucesso && (
      <p role="status">
        {sucesso}
      </p>
    )}

    <button
      type="submit"
      className="button button--primary"
      disabled={carregando}
    >
      {carregando ? "Criando conta..." : "Criar conta"}
    </button>

    <p>
      Já possui uma conta?{" "}
      <Link
        to="/login"
        className="text-link"
      >
        Entrar
      </Link>
    </p>
  </form>
</PageSection>

);
}

export default Cadastro;
