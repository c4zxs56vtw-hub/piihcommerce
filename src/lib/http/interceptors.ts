// ─── Interceptors ─────────────────────────────────────────────────────────────
// Attach JWT token to requests when auth is implemented.
// Currently a no-op — ready to wire up.

export const TOKEN_STORAGE_KEY = 'ckennedy_token';
export const USER_STORAGE_KEY = 'ckennedy_user_email';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function saveToken(token: string, email?: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  if (email) {
    localStorage.setItem(USER_STORAGE_KEY, email);
  }
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getCurrentUserEmail(): string | null {
  return localStorage.getItem(USER_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return Boolean(token && token.trim().length > 0);
}
