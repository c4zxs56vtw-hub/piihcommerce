import React, { useState } from 'react';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../features/products';
import { Product } from '../types';

export const LookbookStudioModal: React.FC = () => {
  const {
    selectedLookForStudio,
    setSelectedLookForStudio,
    addToCart,
    formatPrice,
    setQuickViewProduct,
  } = useCart();

  const { products } = useProducts();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  if (!selectedLookForStudio) return null;

  const includedProducts: Product[] = selectedLookForStudio.includedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const outfitTotalPrice = includedProducts.reduce((sum, p) => sum + (p.price ?? p.priceUsd ?? 0), 0);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddEntireOutfit = () => {
    includedProducts.forEach((product) => {
      const size = selectedSizes[product.id] || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Taille Unique');
      addToCart(product, size);
    });
    setSelectedLookForStudio(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#1A1C1D] text-white rounded-[32px] overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#212427]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-white/50">
              COMPOSITION DU LOOK
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight">
              {selectedLookForStudio.name}
            </h2>
          </div>
          <button
            onClick={() => setSelectedLookForStudio(null)}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split view with look preview on left and outfit items on right */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Big Look image */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 h-80 md:h-[460px]">
            <img
              src={selectedLookForStudio.heroImage}
              alt={selectedLookForStudio.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-white/90">
              {selectedLookForStudio.deliveryTag}
            </div>
            <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-md p-3 rounded-xl text-center text-xs font-mono">
              <span className="text-white/70 block text-[10px]">TOTAL DE LA TENUE</span>
              <span className="text-base font-bold text-white">
                {formatPrice(outfitTotalPrice)}
              </span>
            </div>
          </div>

          {/* Right Column: List of items */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/60">
              Articles du look ({includedProducts.length})
            </h3>

            <div className="space-y-3">
              {includedProducts.map((product) => {
                const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
                const currentSize = selectedSizes[product.id] || (hasSizes ? product.sizes[0] : 'Taille Unique');

                return (
                  <div
                    key={product.id}
                    className="p-3.5 bg-white/5 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images.cartThumbnail}
                        alt={product.name}
                        className="w-14 h-16 object-cover rounded-xl bg-neutral-800 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-tight text-white">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-white/60 font-mono">
                          {formatPrice(product.price)}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedLookForStudio(null);
                            setQuickViewProduct(product);
                          }}
                          className="text-[10px] text-white/50 hover:text-white underline font-mono mt-0.5 cursor-pointer"
                        >
                          Voir la fiche produit
                        </button>
                      </div>
                    </div>

                    {/* Sizing & Quick Add for single item */}
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      {hasSizes && (
                        <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/10 text-[11px] font-mono">
                          {product.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSizeChange(product.id, sz)}
                              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                                currentSize === sz
                                  ? 'bg-white text-black font-bold'
                                  : 'text-white/60 hover:text-white'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => addToCart(product, currentSize)}
                        className="p-2 bg-white/10 hover:bg-white hover:text-black text-white rounded-lg transition-colors cursor-pointer"
                        title="Ajouter cet article"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Complete Bundle Add Action */}
            <div className="pt-4 border-t border-white/10 mt-6 space-y-3">
              <button
                onClick={handleAddEntireOutfit}
                className="w-full bg-white text-black hover:bg-neutral-200 py-3.5 px-6 rounded-full font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-98 shadow-xl cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ajouter la tenue complète au panier — {formatPrice(outfitTotalPrice)}</span>
              </button>
              <p className="text-[10px] font-mono text-center text-white/50">
                Livraison soignée et service client disponible pour vous conseiller.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
