import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Server,
} from 'lucide-react';
import { authService } from '../features/auth/services/authService';
import { hasBackend } from '../config/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBackendConfigured = hasBackend();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      onLoginSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F11] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-white selection:text-black font-sans">
      {/* Background Gradients & Ambient Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Bouton Retour Bouton */}
      <button
        onClick={onCancel}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>RETOUR À LA BOUTIQUE</span>
      </button>

      {/* Carte Centrale */}
      <div className="w-full max-w-md bg-[#14171A] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* En-tête Badge & Titre */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-black border border-white/15 flex items-center justify-center mb-4 shadow-inner">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-neutral-300 uppercase mb-2">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>ACCÈS PROPRIÉTAIRE</span>
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Connexion Admin
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Gérez vos produits, commandes et le catalogue C'Kennedy.
          </p>
        </div>

        {/* Indicateur d'état du Backend */}
        <div className="mb-6 p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400">SERVEUR :</span>
            {isBackendConfigured ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SPRING BOOT (EN LIGNE)
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                MODE LOCAL (STANDALONE)
              </span>
            )}
          </div>
        </div>

        {/* Message d'Erreur */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-mono leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre-email@domaine.com"
                className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all font-mono"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Bouton de Soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-white text-black hover:bg-neutral-200 active:scale-[0.98] transition-all py-4 rounded-2xl font-mono text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>VÉRIFICATION EN COURS...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>ACCÉDER À L'ADMINISTRATION</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer sécurité */}
      <div className="mt-8 text-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
        Système sécurisé C'Kennedy Technical &copy; 2025
      </div>
    </div>
  );
};
