import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main id="conteudo-principal" className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
