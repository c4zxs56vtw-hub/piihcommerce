// ─── Interceptors ─────────────────────────────────────────────────────────────
// Gestion du jeton JWT : stockage, en-têtes Authorization, expiration et
// notification des changements d'état d'authentification.

export const TOKEN_STORAGE_KEY = 'ckennedy_token';
export const USER_STORAGE_KEY = 'ckennedy_user_email';
export const AUTH_CHANGED_EVENT = 'auth:changed';

// Clés annexes nettoyées à la déconnexion (définies aussi dans authService)
const ROLE_KEY = 'ckennedy_user_role';
const NAME_KEY = 'ckennedy_user_name';

/** Prévient l'interface (Header, App, modales) que la session a changé. */
function notifyAuthChanged(): void {
  if (typeof window === 'undefined') return;
  // Différé d'un tick : laisse authService écrire rôle et nom avant la notification.
  queueMicrotask(() => window.dispatchEvent(new Event(AUTH_CHANGED_EVENT)));
}

/** Lit la date d'expiration (secondes) d'un vrai JWT, ou null (jeton de démo). */
function getTokenExpiry(token: string): number | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function isTokenExpired(token: string): boolean {
  const exp = getTokenExpiry(token);
  return exp !== null && exp * 1000 <= Date.now();
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (!token || isTokenExpired(token)) return {};
  return { Authorization: `Bearer ${token}` };
}

export function saveToken(token: string, email?: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  if (email) {
    localStorage.setItem(USER_STORAGE_KEY, email);
  }
  notifyAuthChanged();
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
  notifyAuthChanged();
}

export function getCurrentUserEmail(): string | null {
  return localStorage.getItem(USER_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token || token.trim().length === 0) return false;
  return !isTokenExpired(token);
}
