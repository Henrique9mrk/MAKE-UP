import { apiUrl } from "./api";
const API_URL = apiUrl("/api/produtos");
/**
 * Busca todos os produtos cadastrados no backend.
 */
export async function getProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os produtos.");
  }

  const products = await response.json();

  return products;
}
