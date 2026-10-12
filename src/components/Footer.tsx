import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-black/10 py-12 px-4 md:px-8 max-w-[1440px] mx-auto text-xs text-black/60">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

        {/* Colonne marque */}
        <div className="col-span-2 space-y-3">
          <div className="font-display font-black text-2xl tracking-tighter text-black uppercase">
            C'Kennedy
          </div>
          <p className="text-xs text-black/55 max-w-sm leading-relaxed">
            Mode masculine haut de gamme — entre élégance classique, style urbain
            et accessoires de caractère. Sublimez votre style, scellez votre engagement.
          </p>
          <p className="text-[11px] font-mono text-black/35 pt-1 uppercase tracking-wider">
            Mode & Couture — Disponible en ligne
          </p>
        </div>

        {/* Nos gammes */}
        <div>
          <h4 className="font-bold text-black uppercase tracking-wider mb-3 font-mono text-[11px]">
            Nos Gammes
          </h4>
          <ul className="space-y-2 font-medium">
            <li>
              <a className="hover:text-black transition-colors" href="#trending">
                Classique
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#collections">
                Urbain
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#editorial">
                Accessoires
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#lookbook">
                Lookbook
              </a>
            </li>
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h4 className="font-bold text-black uppercase tracking-wider mb-3 font-mono text-[11px]">
            Informations
          </h4>
          <ul className="space-y-2 font-medium">
            <li>
              <a className="hover:text-black transition-colors" href="#technical">
                L'Atelier C'Kennedy
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#dispatch">
                Suivi de commande
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#dispatch">
                Retours & Échanges
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#dispatch">
                Contactez-nous
              </a>
            </li>
          </ul>
        </div>

        {/* Communauté */}
        <div>
          <h4 className="font-bold text-black uppercase tracking-wider mb-3 font-mono text-[11px]">
            Communauté
          </h4>
          <ul className="space-y-2 font-medium">
            <li>
              <a className="hover:text-black transition-colors" href="#dispatch">
                Cercle Privé
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#technical">
                Notre Engagement
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#dispatch">
                Programme Fidélité
              </a>
            </li>
            <li>
              <a className="hover:text-black transition-colors" href="#dispatch">
                Devenir Partenaire
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Barre copyright */}
      <div className="pt-6 border-t border-black/10 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-black/40 gap-4">
        <div>© 2026 C'Kennedy. Tous droits réservés.</div>
        <div className="flex space-x-6">
          <a className="hover:text-black transition-colors" href="#">Mentions légales</a>
          <a className="hover:text-black transition-colors" href="#">Confidentialité</a>
          <a className="hover:text-black transition-colors" href="#">Accessibilité</a>
          <a className="hover:text-black transition-colors text-black/60 font-bold" href="#admin">Espace Propriétaire</a>
        </div>
      </div>
    </footer>
  );
};
