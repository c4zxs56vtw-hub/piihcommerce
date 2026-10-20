import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  LogOut,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  LayoutDashboard,
} from 'lucide-react';
import { authService } from '../features/auth/services/authService';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Formulaire Connexion
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Formulaire Inscription
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    isAuthenticated: isUserLoggedIn,
    isAdmin,
    userName,
    userEmail,
  } = useAuth();

  if (!isOpen) return null;

  // Soumission Connexion
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.login({
        email: loginEmail,
        password: loginPassword,
      });

      if (res.role === 'ADMIN') {
        setSuccessMessage('Connexion administrateur réussie !');
        setTimeout(() => {
          onClose();
          onOpenAdmin();
        }, 500);
      } else {
        setSuccessMessage('Bienvenue sur votre compte client C\'Kennedy !');
        setTimeout(() => {
          onClose();
        }, 700);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Erreur lors de la connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Soumission Inscription
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        name: regName,
        email: regEmail,
        password: regPassword,
      });

      setSuccessMessage('Votre compte a été créé avec succès !');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Erreur lors de l'inscription.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setSuccessMessage('Déconnexion effectuée.');
    setTimeout(() => {
      setSuccessMessage(null);
      setMode('login');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#14171A] text-white border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden font-sans">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ─── VUE 1 : UTILISATEUR CONNECTÉ ─── */}
        {isUserLoggedIn ? (
          <div className="pt-2">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white text-black font-black flex items-center justify-center text-lg">
                {(userName || userEmail || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  {userName || 'Mon Compte'}
                </h2>
                <p className="text-xs font-mono text-neutral-400 truncate max-w-[240px]">
                  {userEmail}
                </p>
                <div className="mt-1">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      ADMINISTRATEUR (PROPRIÉTAIRE)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-neutral-300">
                      CLIENT PRIVILÈGE
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="w-full bg-white text-black hover:bg-neutral-200 transition-colors py-3.5 px-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Ouvrir Panneau Administrateur</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors py-3 px-4 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        ) : (
          /* ─── VUE 2 : CONNEXION OU INSCRIPTION ─── */
          <div>
            {/* Header / Tabs */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight mb-3">
                C'Kennedy Member Club
              </h2>

              <div className="flex bg-black/50 p-1 rounded-full border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-full font-bold transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-full font-bold transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Créer un compte
                </button>
              </div>
            </div>

            {/* Notification Erreur */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Notification Succès */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-400 text-xs font-mono">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Formulaire Connexion */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="votre-email@domaine.com"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 pr-11 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-white text-black hover:bg-neutral-200 transition-all py-3.5 rounded-2xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>SE CONNECTER</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Formulaire Inscription */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="jean.dupont@email.com"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Confirmation
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-white text-black hover:bg-neutral-200 transition-all py-3 rounded-2xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>CRÉER MON COMPTE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
