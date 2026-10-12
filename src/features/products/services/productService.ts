// ─── Product Service ──────────────────────────────────────────────────────────

import { http } from '../../../lib/http';
import { ENDPOINTS, hasBackend } from '../../../config/api';
import { loadProducts } from '../../../data/localProductStore';
import type { Product } from '../types';

export async function getProducts(): Promise<Product[]> {
  if (!hasBackend()) return loadProducts();
  return http.get<Product[]>(ENDPOINTS.products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!hasBackend()) return loadProducts().find((p) => p.id === id);
  return http.get<Product>(`${ENDPOINTS.products}/${id}`);
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  return http.post<Product>(ENDPOINTS.products, product);
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  return http.put<Product>(`${ENDPOINTS.products}/${id}`, product);
}

export async function deleteProduct(id: string): Promise<void> {
  return http.delete(`${ENDPOINTS.products}/${id}`);
}
