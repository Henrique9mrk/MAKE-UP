import {
  createContext,
  useContext,
  useState,
} from "react";

const FavoritesContext = createContext();

function FavoritesProvider({ children }) {
  const [favoriteItems, setFavoriteItems] = useState(() => {
    const savedFavorites = localStorage.getItem(
      "makeup-favorites"
    );

    return savedFavorites
      ? JSON.parse(savedFavorites)
      : [];
  });

  function saveFavorites(items) {
    setFavoriteItems(items);

    localStorage.setItem(
      "makeup-favorites",
      JSON.stringify(items)
    );
  }

  function addToFavorites(product) {
    const alreadyFavorite = favoriteItems.some(
      (item) => item.id === product.id
    );

    if (alreadyFavorite) {
      return;
    }

    saveFavorites([
      ...favoriteItems,
      product,
    ]);
  }

  function removeFromFavorites(productId) {
    const updatedFavorites = favoriteItems.filter(
      (item) => item.id !== productId
    );

    saveFavorites(updatedFavorites);
  }

  function isFavorite(productId) {
    return favoriteItems.some(
      (item) => item.id === productId
    );
  }

  const value = {
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

function useFavorites() {
  return useContext(FavoritesContext);
}

export {
  FavoritesProvider,
  useFavorites,
};