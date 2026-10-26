import { Link } from "react-router-dom";
import { accountLinks, navigationItems } from "../data/navigation";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__content">
        <p>© 2026 Make-up. Todos os direitos reservados.</p>

        <nav aria-label="Links úteis" className="footer-nav">
          <ul className="footer-links">
            {navigationItems.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            {accountLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
