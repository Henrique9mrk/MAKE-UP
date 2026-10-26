import { BrowserRouter } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;