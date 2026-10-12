import React, { useState } from 'react';
import { ShieldCheck, Zap, Activity } from 'lucide-react';

export const MaterialScience: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const pillars = [
    {
      index: '01',
      category: 'IDENTITÉ VISUELLE',
      title: 'UN STYLE QUI PARLE',
      icon: Zap,
      desc: 'C\'Kennedy, c\'est une signature. Chaque pièce est conçue pour celui qui n\'a pas besoin de crier pour être remarqué — son style le précède.',
      detail:
        'Des silhouettes travaillées, des matières sélectionnées avec exigence. Porter C\'Kennedy, c\'est choisir de ne ressembler à personne d\'autre.',
    },
    {
      index: '02',
      category: 'SAVOIR-FAIRE',
      title: 'COUPE & PRÉCISION',
      icon: Activity,
      desc: 'Chaque vêtement est pensé pour sublimer la silhouette masculine. Nos coupes s\'adaptent au mouvement sans jamais sacrifier l\'élégance.',
      detail:
        'De la première esquisse à la pièce finale, chaque détail est maîtrisé. Nos modèles passent par un processus rigoureux avant d\'atteindre votre garde-robe.',
    },
    {
      index: '03',
      category: 'EXPÉRIENCE CLIENT',
      title: 'VOTRE CONFIANCE, NOTRE STANDARD',
      icon: ShieldCheck,
      desc: 'Livraison soignée, retours simplifiés, service attentionné. Chez C\'Kennedy, l\'expérience ne s\'arrête pas à l\'achat — elle commence là.',
      detail:
        'Chaque commande est préparée avec soin. Nous croyons que l\'excellence dans le style doit s\'accompagner d\'une excellence dans le service.',
    },
  ];

  return (
    <section className="py-14 sm:py-16 px-4 md:px-8 max-w-[1440px] mx-auto" id="technical">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono tracking-widest text-black/50 uppercase">
          L'ESSENCE C'KENNEDY
        </span>
        <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight uppercase mt-1">
          PLUS QU'UNE MARQUE
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          const isExpanded = activePillar === idx;

          return (
            <div
              key={pillar.index}
              onClick={() => setActivePillar(isExpanded ? null : idx)}
              className="bg-white/80 hover:bg-white backdrop-blur rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-black/50 mb-3">
                  <span>{pillar.index} // {pillar.category}</span>
                  <Icon className="w-4 h-4 text-black/60" />
                </div>
                <h3 className="text-base sm:text-lg font-bold uppercase mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-black/70 leading-relaxed font-normal">
                  {pillar.desc}
                </p>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-black/10 text-xs font-mono text-black/80 bg-[#E8ECEE]/50 p-3 rounded-xl">
                    {pillar.detail}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-black/5 flex justify-between items-center text-[11px] font-mono text-black/60">
                <span>{isExpanded ? 'RÉDUIRE' : 'EN SAVOIR PLUS'}</span>
                <span className="font-bold">{isExpanded ? '−' : '+'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
