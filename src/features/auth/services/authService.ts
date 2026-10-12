
import { http } from '../../../lib/http/client';
import { ENDPOINTS, hasBackend } from '../../../config/api';
import {
  saveToken,
  clearToken,
  getToken,
  isAuthenticated,
  getCurrentUserEmail,
} from '../../../lib/http/interceptors';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'CLIENT';
}

export const ROLE_STORAGE_KEY = 'ckennedy_user_role';
export const NAME_STORAGE_KEY = 'ckennedy_user_name';
export const LOCAL_USERS_KEY = 'ckennedy_registered_users';

/**
 * Compte administrateur de TEST, utilisable uniquement :
 *  - en développement (`npm run dev`),
 *  - sans backend (VITE_API_URL vide),
 *  - si VITE_DEV_ADMIN_EMAIL / VITE_DEV_ADMIN_PASSWORD sont définis dans `.env.local`.
 * Jamais affiché dans l'interface. Absent des builds de production.
 */
function getDevAdmin(): { email: string; password: string; name: string } | null {
  if (!import.meta.env.DEV) return null;
  const email = String(import.meta.env.VITE_DEV_ADMIN_EMAIL ?? '').trim().toLowerCase();
  const password = String(import.meta.env.VITE_DEV_ADMIN_PASSWORD ?? '');
  if (!email || !password) return null;
  return { email, password, name: "Propriétaire C'Kennedy" };
}

interface LocalSavedUser {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CLIENT';
}

function getStoredLocalUsers(): LocalSavedUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUser(user: LocalSavedUser) {
  const users = getStoredLocalUsers();
  users.push(user);
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export const authService = {
  /**
   * Connexion utilisateur (Admin ou Client)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const trimmedEmail = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!trimmedEmail || !password) {
      throw new Error('Veuillez renseigner votre email et mot de passe.');
    }

    if (hasBackend()) {
      // Appel API Spring Boot réel
      const response = await http.post<AuthResponse>(ENDPOINTS.auth, {
        email: trimmedEmail,
        password,
      });

      if (!response.token) {
        throw new Error('Aucun jeton reçu du serveur.');
      }

      saveToken(response.token, trimmedEmail);
      if (response.role) localStorage.setItem(ROLE_STORAGE_KEY, response.role);
      if (response.name) localStorage.setItem(NAME_STORAGE_KEY, response.name);
      return response;
    }

    // ── Mode Local / Démo (quand Spring Boot n'est pas encore lancé) ──
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 1. Compte administrateur de test (développement uniquement, défini dans .env.local)
    const devAdmin = getDevAdmin();
    if (
      devAdmin &&
      trimmedEmail === devAdmin.email &&
      password === devAdmin.password
    ) {
      const mockToken = `jwt_admin_${Date.now()}`;
      saveToken(mockToken, trimmedEmail);
      localStorage.setItem(ROLE_STORAGE_KEY, 'ADMIN');
      localStorage.setItem(NAME_STORAGE_KEY, devAdmin.name);

      return {
        token: mockToken,
        email: trimmedEmail,
        name: devAdmin.name,
        role: 'ADMIN',
      };
    }

    // 2. Comptes clients créés via le formulaire d'inscription (jamais ADMIN en local)
    const localUsers = getStoredLocalUsers();
    const found = localUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (found) {
      const mockToken = `jwt_client_${Date.now()}`;
      saveToken(mockToken, found.email);
      localStorage.setItem(ROLE_STORAGE_KEY, 'CLIENT');
      localStorage.setItem(NAME_STORAGE_KEY, found.name);

      return {
        token: mockToken,
        email: found.email,
        name: found.name,
        role: 'CLIENT',
      };
    }

    throw new Error('Identifiants incorrects.');
  },

  /**
   * Inscription d'un nouveau compte client
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const trimmedName = data.name.trim();
    const trimmedEmail = data.email.trim().toLowerCase();
    const password = data.password;

    if (!trimmedName || trimmedName.length < 2) {
      throw new Error('Veuillez renseigner votre nom complet.');
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      throw new Error('Veuillez renseigner une adresse email valide.');
    }
    if (!password || password.length < 6) {
      throw new Error('Le mot de passe doit comporter au moins 6 caractères.');
    }

    if (hasBackend()) {
      // Appel API Spring Boot réel
      const response = await http.post<AuthResponse>('/api/auth/register', {
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (!response.token) {
        throw new Error('Erreur lors de la création du compte.');
      }

      saveToken(response.token, trimmedEmail);
      if (response.role) localStorage.setItem(ROLE_STORAGE_KEY, response.role);
      if (response.name) localStorage.setItem(NAME_STORAGE_KEY, response.name);
      return response;
    }

    // Mode Local
    await new Promise((resolve) => setTimeout(resolve, 600));

    const existingUsers = getStoredLocalUsers();
    const devAdmin = getDevAdmin();
    if (
      existingUsers.some((u) => u.email.toLowerCase() === trimmedEmail) ||
      (devAdmin && trimmedEmail === devAdmin.email)
    ) {
      throw new Error('Cette adresse email possède déjà un compte.');
    }

    const newUser: LocalSavedUser = {
      name: trimmedName,
      email: trimmedEmail,
      password,
      role: 'CLIENT',
    };
    saveLocalUser(newUser);

    const mockToken = `jwt_client_${Date.now()}`;
    saveToken(mockToken, trimmedEmail);
    localStorage.setItem(ROLE_STORAGE_KEY, 'CLIENT');
    localStorage.setItem(NAME_STORAGE_KEY, trimmedName);

    return {
      token: mockToken,
      email: trimmedEmail,
      name: trimmedName,
      role: 'CLIENT',
    };
  },

  /**
   * Déconnexion complète
   */
  logout(): void {
    clearToken();
    localStorage.removeItem(ROLE_STORAGE_KEY);
    localStorage.removeItem(NAME_STORAGE_KEY);
  },

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return isAuthenticated();
  },

  /**
   * Vérifie si l'utilisateur actuellement connecté est l'administrateur
   */
  isAdmin(): boolean {
    if (!isAuthenticated()) return false;
    return localStorage.getItem(ROLE_STORAGE_KEY) === 'ADMIN';
  },

  /**
   * Récupère le nom de l'utilisateur
   */
  getUserName(): string | null {
    return localStorage.getItem(NAME_STORAGE_KEY);
  },

  /**
   * Récupère l'email de l'utilisateur
   */
  getCurrentUserEmail(): string | null {
    return getCurrentUserEmail();
  },
};
