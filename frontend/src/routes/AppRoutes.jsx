import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Produtos from "../pages/Produtos";
import Produto from "../pages/Produto";
import Carrinho from "../pages/Carrinho";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Perfil from "../pages/Perfil";
import Favoritos from "../pages/Favoritos";
import Categorias from "../pages/Categorias";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/produto/:id" element={<Produto />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/categorias" element={<Categorias />} />
      
    </Routes>
  );
}

export default AppRoutes;
