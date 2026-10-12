// ─── Trending Service ─────────────────────────────────────────────────────────
// Récupère les produits les plus aimés depuis Spring Boot.
// Spring Boot trie par nombre de likes/wishlist décroissant.

import { http } from '../../../lib/http';
import { ENDPOINTS, hasBackend } from '../../../config/api';
import { loadProducts } from '../../../data/localProductStore';
import type { Product } from '../../../types';

const TRENDING_ENDPOINT = `${ENDPOINTS.products}/trending`;

/**
 * Retourne les produits les plus aimés.
 * @param limit  nombre de produits à retourner (défaut: 4)
 */
export async function getTrendingProducts(limit = 4): Promise<Product[]> {
  if (!hasBackend()) {
    // Fallback local : trier par rating + reviewsCount comme proxy des likes
    return [...loadProducts()]
      .sort((a, b) => (b.rating ?? 0) * (b.reviewsCount ?? 0) - (a.rating ?? 0) * (a.reviewsCount ?? 0))
      .slice(0, limit);
  }
  return http.get<Product[]>(`${TRENDING_ENDPOINT}?limit=${limit}`);
}

/**
 * Enregistre un like sur un produit (appelé quand l'utilisateur wishlist).
 * Spring Boot incrémente le compteur de likes.
 */
export async function likeProduct(productId: string): Promise<void> {
  if (!hasBackend()) return;
  return http.post(`${ENDPOINTS.products}/${productId}/like`, {});
}

/**
 * Retire un like sur un produit.
 */
export async function unlikeProduct(productId: string): Promise<void> {
  if (!hasBackend()) return;
  return http.delete(`${ENDPOINTS.products}/${productId}/like`);
}
