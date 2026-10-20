import React, { useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../features/products';

type Card = 'left' | 'center' | 'right';

// Largeurs relatives selon le focus (en flex-grow)
const SIZE: Record<Card, Record<Card | 'none', number>> = {
  left:   { left: 5.5, center: 3,   right: 1.5, none: 3 },
  center: { left: 1.5, center: 7,   right: 1.5, none: 6 },
  right:  { left: 1.5, center: 3,   right: 5.5, none: 3 },
};

// Hauteurs des cartes selon le focus
const HEIGHT: Record<Card, Record<Card | 'none', string>> = {
  left:   { left: '480px', center: '340px', right: '260px', none: '220px' },
  center: { left: '260px', center: '520px', right: '260px', none: '420px' },
  right:  { left: '260px', center: '340px', right: '480px', none: '220px' },
};

const SPRING = { type: 'spring' as const, stiffness: 220, damping: 26 };

export const SegmentedShowcase: React.FC = () => {
  const { setQuickViewProduct, addToCart } = useCart();
  const { products } = useProducts();

  const lycraProduct  = products[0];
  const ninjaProduct  = products[1];
  const anorakProduct = products[2];

  const [focused, setFocused] = useState<Card | null>(null);

  const toggle = (card: Card) => setFocused((p) => (p === card ? null : card));
  const f = focused ?? 'none';

  const cards: { id: Card; img: string; alt: string; label: string; product: typeof lycraProduct }[] = [
    {
      id: 'left',
      img: '/images/hero-1.png',
      alt: 'C\'Kennedy Look 01',
      label: 'LOOK 01',
      product: lycraProduct,
    },
    {
      id: 'center',
      img: '/images/hero-2.jpg',
      alt: 'C\'Kennedy Signature',
      label: 'SIGNATURE',
      product: ninjaProduct,
    },
    {
      id: 'right',
      img: '/images/hero-3.png',
      alt: 'C\'Kennedy Look 02',
      label: 'LOOK 02',
      product: anorakProduct,
    },
  ];

  return (
    <section className="py-14 sm:py-16 px-4 md:px-8 max-w-[1440px] mx-auto" id="new-collection">
      <div className="relative bg-gradient-to-b from-[#CAD2D5] to-[#D5DCDE] rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 md:p-12 border border-white/50 overflow-hidden shadow-inner">

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[100px] sm:text-[180px] md:text-[280px] font-display font-black watermark-text opacity-30 tracking-tighter whitespace-nowrap">
            STYLE
          </span>
        </div>

        {/* Section header */}
        <div className="relative z-10 mb-6 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-black/50 uppercase">
              C'KENNEDY // ÉDITORIAL
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight uppercase leading-none mt-0.5">
              LA COLLECTION
            </h2>
          </div>
          <AnimatePresence>
            {focused && (
              <motion.button
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setFocused(null)}
                className="text-[11px] font-mono text-black/50 hover:text-black underline underline-offset-2 cursor-pointer"
              >
                Réinitialiser
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Cards row */}
        <div className="relative z-10 flex items-end gap-3 sm:gap-4" style={{ minHeight: '520px' }}>
          {cards.map((card) => {
            const isFocused = focused === card.id;
            const grow = SIZE[card.id][f];
            const height = HEIGHT[card.id][f];
            const isOther = focused !== null && !isFocused;

            return (
              <motion.div
                key={card.id}
                onClick={() => toggle(card.id)}
                animate={{ flexGrow: grow }}
                transition={SPRING}
                className="relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-white/40 shadow-lg flex-shrink-0"
                style={{ minWidth: 0 }}
              >
                {/* Image container with animated height */}
                <motion.div
                  animate={{ height }}
                  transition={SPRING}
                  className="relative w-full overflow-hidden"
                >
                  <img
                    src={card.img}
                    alt={card.alt}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{
                      transform: isFocused ? 'scale(1.03)' : 'scale(1)',
                      filter: isOther ? 'brightness(0.7)' : 'brightness(1)',
                      transition: 'transform 0.7s ease, filter 0.4s ease',
                    }}
                    draggable={false}
                  />

                  {/* Gradient bas */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                  {/* Label bas */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                      {card.label}
                    </span>
                    <AnimatePresence>
                      {isFocused && card.product && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-1.5"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); setQuickViewProduct(card.product); }}
                            className="bg-white/90 text-black p-1.5 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(card.product, 'M'); }}
                            className="bg-black text-white p-1.5 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Badge "FOCUS" quand actif */}
                  <AnimatePresence>
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-3 left-3 bg-white text-black text-[9px] font-bold font-mono uppercase px-2.5 py-1 rounded-full shadow-md tracking-widest"
                      >
                        ● EN VEDETTE
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Hint en bas */}
        <p className="relative z-10 mt-5 text-center text-[10px] font-mono text-black/35 tracking-wider uppercase">
          {focused ? 'Cliquez à nouveau pour réduire' : 'Cliquez sur une image pour l\'agrandir'}
        </p>
      </div>
    </section>
  );
};
