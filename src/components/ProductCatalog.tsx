import React, { useState } from 'react';
import { Heart, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../features/products';
import { Category, Product } from '../types';

export const ProductCatalog: React.FC = () => {
  const { formatPrice, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useCart();
  const { products, filtered, activeCategory, setCategory } = useProducts();

  const filteredProducts = filtered;

  const categories: { label: string; value: Category }[] = [
    { label: 'Tout voir', value: 'all' },
    { label: 'Classique', value: 'classique' },
    { label: 'Urbain', value: 'urbain' },
    { label: 'Accessoires', value: 'accessories' },
  ];

  const handleQuickAddSize = (e: React.MouseEvent, product: Product, size: string) => {
    e.stopPropagation();
    addToCart(product, size);
  };

  return (
    <section className="py-16 sm:py-20 px-4 md:px-8 max-w-[1440px] mx-auto" id="collection">
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="text-xs font-mono tracking-widest text-black/50 uppercase">
          LA COLLECTION C'KENNEDY
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase leading-tight mt-1">
          TROUVEZ VOTRE STYLE
        </h2>

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`text-xs font-mono tracking-wider uppercase px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white/60 hover:bg-white text-black/70 hover:text-black border border-black/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid: 4 items per row matching screenshots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isSaved = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => setQuickViewProduct(product)}
              className="group relative bg-[#1E2022] rounded-[28px] p-4 text-white flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl cursor-pointer"
            >
              {/* Image Area */}
              <div className="relative w-full h-[340px] sm:h-[360px] rounded-2xl overflow-hidden bg-neutral-800 mb-4">
                <img
                  src={product.images.primary}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
                />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-center pointer-events-none">
                  <span className="bg-white/90 text-black text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold shadow-sm uppercase">
                    {product.badge || product.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all pointer-events-auto cursor-pointer shadow-sm ${
                      isSaved
                        ? 'bg-red-500 text-white'
                        : 'bg-white/85 text-black hover:bg-white'
                    }`}
                    title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Quick Size Selector on Hover */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/85 backdrop-blur-md rounded-xl p-2 flex justify-around text-xs font-mono border border-white/10 z-10">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={(e) => handleQuickAddSize(e, product, sz)}
                        className="px-2 py-1 rounded hover:bg-white hover:text-black transition-colors font-medium cursor-pointer"
                        title={`Quick add size ${sz}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Footer Bar */}
              <div className="bg-[#D2D8DA] text-black rounded-2xl p-3 px-4 flex justify-between items-center transition-colors group-hover:bg-[#E1E6E8]">
                <div className="pr-2 truncate">
                  <h4 className="text-xs font-bold leading-tight uppercase truncate">
                    {product.name}
                  </h4>
                  <span className="text-xs font-mono font-medium text-black/80">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewProduct(product);
                  }}
                  className="w-7 h-7 rounded-full bg-black/10 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all flex-shrink-0 cursor-pointer"
                  title="View details"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-sm font-mono text-black/50 py-16">
          {products.length === 0
            ? 'Les nouveaux articles arrivent bientôt.'
            : 'Aucun article dans cette catégorie pour le moment.'}
        </p>
      )}

      {/* Center Call-To-Action Pill: SEE ALL BRANDS ↗ */}
      <div className="mt-14 flex justify-center">
        <a
          href="#lookbook"
          className="inline-flex items-center space-x-3 bg-black text-white hover:bg-neutral-800 text-xs font-mono tracking-widest uppercase px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-xl cursor-pointer"
        >
          <span>See All Brands</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
