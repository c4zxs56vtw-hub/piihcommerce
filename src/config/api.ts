// ─── API Configuration ────────────────────────────────────────────────────────
// Set VITE_API_URL in your .env file when Spring Boot is ready.
// Leave empty to use local fallback data.

export const API_CONFIG = {
  BASE_URL:   (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, ''),
  TIMEOUT_MS: 25_000,
} as const;

export const ENDPOINTS = {
  products:   '/api/products',
  looks:      '/api/looks',
  heroSlides: '/api/hero-slides',
  upload:     '/api/upload',
  auth:       '/api/auth/login',
} as const;

/** Returns true when a real Spring Boot URL is configured */
export const hasBackend = (): boolean => API_CONFIG.BASE_URL.length > 0;
