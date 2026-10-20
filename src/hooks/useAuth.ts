import { useEffect, useState } from 'react';
import { authService } from '../features/auth/services/authService';
import { AUTH_CHANGED_EVENT } from '../lib/http/interceptors';

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userName: string | null;
  userEmail: string | null;
}

function readAuthState(): AuthState {
  return {
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.isAdmin(),
    userName: authService.getUserName(),
    userEmail: authService.getCurrentUserEmail(),
  };
}

/**
 * État d'authentification réactif : se met à jour à chaque connexion,
 * déconnexion, expiration (401) ou modification dans un autre onglet.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>(readAuthState);

  useEffect(() => {
    const sync = () => setState(readAuthState());

    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    window.addEventListener('auth:unauthorized', sync);
    window.addEventListener('storage', sync);
    // Re-vérifie l'expiration du jeton chaque minute
    const timer = window.setInterval(sync, 60_000);
    sync();

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, sync);
      window.removeEventListener('auth:unauthorized', sync);
      window.removeEventListener('storage', sync);
      window.clearInterval(timer);
    };
  }, []);

  return state;
}
