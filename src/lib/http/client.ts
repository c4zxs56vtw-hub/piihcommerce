// ─── HTTP Client ──────────────────────────────────────────────────────────────
// Thin wrapper around fetch. Swap for axios if needed.
// All services go through this — never call fetch() directly.

import { API_CONFIG } from '../../config/api';
import { getAuthHeaders, clearToken } from './interceptors';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  const isFormData = typeof FormData !== 'undefined' && options?.body instanceof FormData;

  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });

    if (res.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      throw new HttpError(401, 'Session expirée ou non autorisée.');
    }

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errorBody = await res.json();
        if (errorBody?.message) {
          errorMessage = errorBody.message;
        }
      } catch {
        // Fallback to statusText
      }
      throw new HttpError(res.status, errorMessage);
    }

    // Gérer les réponses vides (comme 204 No Content)
    const text = await res.text();
    if (!text || text.trim().length === 0) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new HttpError(
        408,
        'Le serveur met trop de temps à répondre. Réessayez dans quelques secondes.'
      );
    }
    throw new HttpError(
      0,
      `Impossible de joindre le serveur (${API_CONFIG.BASE_URL || 'API'}). Vérifiez que le backend est démarré.`
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const http = {
  get:    <T>(path: string)                        => request<T>(path),
  post:   <T>(path: string, body: unknown)         => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)         => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)                        => request<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, formData: FormData)    => request<T>(path, { method: 'POST',   body: formData }),
};
