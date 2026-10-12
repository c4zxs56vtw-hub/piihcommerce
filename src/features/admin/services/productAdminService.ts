// ─── Product Admin Service ────────────────────────────────────────────────────
// Toutes les opérations CRUD réservées à l'admin.
// Requiert une authentification (token JWT dans les headers).

import { http } from '../../../lib/http';
import { getAuthHeaders } from '../../../lib/http';
import { ENDPOINTS } from '../../../config/api';
import type { Product, CreateProductDto, UpdateProductDto } from '../../../types';
import type { UploadResponse, UploadTarget } from './uploadService';

// ─── Lecture ──────────────────────────────────────────────────────────────────

/** Récupère tous les produits (publiés + non publiés) pour l'admin */
export async function adminGetAllProducts(): Promise<Product[]> {
  return http.get<Product[]>(`${ENDPOINTS.products}?admin=true`);
}

// ─── Création ─────────────────────────────────────────────────────────────────

/** Crée un nouveau produit */
export async function adminCreateProduct(dto: CreateProductDto): Promise<Product> {
  return http.post<Product>(ENDPOINTS.products, dto);
}

// ─── Modification ─────────────────────────────────────────────────────────────

/** Met à jour un produit existant */
export async function adminUpdateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
  return http.put<Product>(`${ENDPOINTS.products}/${id}`, dto);
}

/** Publie ou dépublie un produit */
export async function adminTogglePublish(id: string, published: boolean): Promise<Product> {
  return http.put<Product>(`${ENDPOINTS.products}/${id}`, { isPublished: published });
}

/** Met à jour le stock */
export async function adminToggleStock(id: string, inStock: boolean): Promise<Product> {
  return http.put<Product>(`${ENDPOINTS.products}/${id}`, { inStock });
}

// ─── Suppression ──────────────────────────────────────────────────────────────

/** Supprime définitivement un produit */
export async function adminDeleteProduct(id: string): Promise<void> {
  return http.delete(`${ENDPOINTS.products}/${id}`);
}

// ─── Upload image ─────────────────────────────────────────────────────────────

/** Upload une image produit et retourne son URL publique */
export async function adminUploadProductImage(
  file: File,
  target: UploadTarget = 'products'
): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('target', target);
  return http.upload<UploadResponse>(ENDPOINTS.upload, form);
}
