import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageSection from "../components/PageSection";

function Login() {
const navigate = useNavigate();

const [form, setForm] = useState({
email: "",
password: "",
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
  const response = await fetch(
    "http://localhost:3000/api/usuarios/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        senha: form.password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setErro(
      data.mensagem || "Não foi possível realizar o login."
    );

    return;
  }

 localStorage.setItem(
  "makeup-user",
  JSON.stringify(data.usuario)
);

localStorage.setItem(
  "makeup-token",
  data.token
);

navigate("/perfil");
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
   eyebrow="Acesse sua conta"
   title="Entrar"
   description="Entre na sua conta para acompanhar seus pedidos e acessar seus favoritos."
   id="login-page"
 > <form
     className="form-card"
     onSubmit={handleSubmit}
   > <label htmlFor="login-email">
E-mail

      <input
        id="login-email"
        name="email"
        type="email"
        placeholder="Digite seu e-mail"
        value={form.email}
        onChange={handleChange}
        required
      />
    </label>

    <label htmlFor="login-password">
      Senha

      <input
        id="login-password"
        name="password"
        type="password"
        placeholder="Digite sua senha"
        value={form.password}
        onChange={handleChange}
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
      {carregando ? "Entrando..." : "Entrar"}
    </button>

    <p>
      Ainda não possui uma conta?{" "}
      <Link
        to="/cadastro"
        className="text-link"
      >
        Criar conta
      </Link>
    </p>
  </form>
</PageSection>

);
}

export default Login;
