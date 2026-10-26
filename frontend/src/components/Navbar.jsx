import { Link } from "react-router-dom";

import {
  FaSearch,
  FaUser,
  FaShoppingBag,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";

function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="site-header__content container">

        <Link to="/" className="brand">
          MAKE-UP
        </Link>

        <nav className="site-nav">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                Início
              </Link>
            </li>

            <li>
              <Link to="/produtos" className="nav-link">
                Produtos
              </Link>
            </li>

            <li>
              <Link to="/categorias" className="nav-link">
                Categorias
              </Link>
            </li>

            <li>
              <Link to="/contato" className="nav-link">
                Contato
              </Link>
            </li>
          </ul>
        </nav>

        <div className="navbar-icons">

          <Link
            to="/produtos"
            aria-label="Pesquisar produtos"
          >
            <FaSearch />
          </Link>

          <Link
            to="/perfil"
            aria-label="Perfil"
          >
            <FaUser />
          </Link>

          <Link
            to="/carrinho"
            className="cart-icon"
            aria-label={`Carrinho com ${totalItems} itens`}
          >
            <FaShoppingBag />

            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}
          </Link>

        </div>

      </div>
    </header>
  );
}

export default Navbar;

