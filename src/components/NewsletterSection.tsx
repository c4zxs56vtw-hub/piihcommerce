import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const NewsletterSection: React.FC = () => {
  const { addToast } = useCart();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
    addToast('Bienvenue chez C\'Kennedy', 'Votre accès exclusif a été envoyé à votre adresse.');
    setEmail('');
  };

  return (
    <section className="py-12 sm:py-16 px-4 md:px-8 max-w-[1440px] mx-auto" id="dispatch">
      <div className="relative bg-[#111315] text-white rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 md:p-16 text-center max-w-4xl mx-auto shadow-2xl overflow-hidden">

        {/* Décoration subtile */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-white/4 rounded-full blur-3xl pointer-events-none" />

        {/* Ligne décorative */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-12 bg-white/25" />
          <span className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase">
            Cercle Privé C'Kennedy
          </span>
          <span className="h-px w-12 bg-white/25" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight uppercase mt-2 mb-5 leading-tight">
          SUBLIMEZ VOTRE STYLE,<br />
          <span className="text-white/70">EN AVANT-PREMIÈRE.</span>
        </h2>

        <p className="text-sm text-white/55 max-w-lg mx-auto mb-3 font-normal leading-relaxed">
          Rejoignez le cercle privé C'Kennedy. Accédez en exclusivité aux nouvelles
          collections <strong className="text-white/80">Classique</strong>,{' '}
          <strong className="text-white/80">Urbain</strong> et{' '}
          <strong className="text-white/80">Accessoires</strong> avant tout le monde.
        </p>

        <p className="text-[11px] text-white/35 font-mono tracking-wider uppercase mb-8">
          « Sublimez votre style, scellez votre engagement »
        </p>

        {isSubmitted ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-5 max-w-md mx-auto flex items-center justify-center space-x-3 font-mono text-xs">
            <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white/80 text-left">
              Bienvenue dans le cercle. Vérifiez votre boîte mail pour votre accès exclusif.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              required
              className="flex-1 bg-white/10 border border-white/15 rounded-full px-5 py-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/40 font-sans transition-all"
            />
            <button
              type="submit"
              className="bg-white hover:bg-neutral-100 text-[#111315] font-bold text-xs uppercase px-8 py-3.5 rounded-full transition-all tracking-wider cursor-pointer active:scale-95 flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              Rejoindre
            </button>
          </form>
        )}

        {/* Avantages */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-wider">
          <span>✦ Accès avant-vente</span>
          <span>✦ Offres exclusives membres</span>
          <span>✦ Nouvelles collections en avant-première</span>
        </div>
      </div>
    </section>
  );
};
