
import { useContext } from "react";
import { FavoritesContext } from "./FavoritesContextValue";

export function useFavorites() {
  return useContext(FavoritesContext);
}
