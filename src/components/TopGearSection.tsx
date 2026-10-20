import React from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useTrending } from '../features/products/hooks/useTrending';

export const TopGearSection: React.FC = () => {
  const { setQuickViewProduct, toggleWishlist, isWishlisted, formatPrice } = useCart();
  const { trending, loading, syncLike } = useTrending(4);

  const handleWishlist = (productId: string) => {
    const wasLiked = isWishlisted(productId);
    toggleWishlist(productId);
    syncLike(productId, !wasLiked);
  };

  // Label gamme C'Kennedy
  const categoryLabel: Record<string, string> = {
    classique:   'Classique',
    urbain:      'Urbain',
    accessories: 'Accessoires',
    men:         'Classique',
    women:       'Urbain',
    compression: 'Urbain',
    outerwear:   'Classique',
  };

  // Aucun produit : on n'affiche pas la section Favoris
  if (!loading && trending.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1450px] px-4 py-16 sm:px-6 lg:px-8" id="trending">
      {/* En-tête */}
      <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="flex flex-col">
          <span className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
            LES PLUS AIMÉS
          </span>
          <h2
            className="text-5xl font-black uppercase tracking-tighter text-[#111315] sm:text-7xl lg:text-8xl"
            style={{ transform: 'scaleX(1.2)', transformOrigin: 'left' }}
          >
            FAVORIS
          </h2>
        </div>
        <div className="max-w-md md:pb-4">
          <p className="text-sm font-medium leading-relaxed text-neutral-600">
            Les pièces que notre communauté aime le plus. Classement mis à jour en
            temps réel — chaque cœur compte.
          </p>
        </div>
      </div>

      {/* Grille produits */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/60 rounded-[24px] h-72 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {trending.map((product, idx) => {
            const liked = isWishlisted(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative flex flex-col overflow-hidden rounded-[24px] bg-white shadow-sm border border-black/6 hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-neutral-100">
                  <img
                    src={product.images.primary}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Badge gamme */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] font-mono uppercase tracking-wider bg-black/70 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {categoryLabel[product.category] ?? product.category}
                    </span>
                  </div>

                  {/* Rang popularité */}
                  <div className="absolute top-3 right-10">
                    <span className="text-[9px] font-mono bg-white/90 text-black px-2 py-0.5 rounded-full font-bold">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Bouton wishlist */}
                  <button
                    onClick={() => handleWishlist(product.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all hover:scale-110 cursor-pointer"
                    aria-label={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-colors ${
                        liked ? 'fill-red-500 text-red-500' : 'text-black/50'
                      }`}
                    />
                  </button>

                  {/* Compteur likes */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                    <span className="text-[10px] font-mono text-white font-bold">
                      {product.likesCount ?? 0}
                    </span>
                  </div>
                </div>

                {/* Infos produit */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm uppercase tracking-tight leading-tight text-[#111315]">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-black/45 mt-0.5 font-mono">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-base text-[#111315]">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="flex items-center gap-1.5 text-[10px] font-mono uppercase bg-[#111315] text-white px-3.5 py-2 rounded-full hover:bg-neutral-700 transition-colors cursor-pointer active:scale-95"
                    >
                      Voir
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Note backend */}
      <p className="mt-6 text-center text-[10px] font-mono text-black/30 uppercase tracking-wider">
        ♥ Classement mis à jour en temps réel par notre communauté
      </p>
    </section>
  );
};
