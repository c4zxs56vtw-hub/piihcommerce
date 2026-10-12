import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Check, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductColor } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    formatPrice,
    wishlist,
    toggleWishlist,
  } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageKey, setActiveImageKey] = useState<string>('primary');
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  // Synchronise les valeurs dès qu'un produit est sélectionné
  useEffect(() => {
    if (quickViewProduct) {
      const defaultSize = quickViewProduct.sizes?.[0] || '';
      const defaultColor = quickViewProduct.colors?.[0] || null;
      setSelectedSize(defaultSize);
      setSelectedColor(defaultColor);
      setQuantity(1);
      setActiveImageKey('primary');
      setIsAddedAnimation(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const currentSize = selectedSize || (hasSizes ? product.sizes[0] : '');
  const hasColors = Array.isArray(product.colors) && product.colors.length > 1;
  const currentColor = selectedColor || (product.colors?.[0] ?? null);
  const isSaved = wishlist.includes(product.id);

  // Gestion robuste des images (compatible avec les uploads de l'admin)
  const primaryImage =
    typeof product.images === 'string'
      ? product.images
      : product.images?.primary || '';
  const secondaryImage = product.images?.secondary || '';
  const detailImage = product.images?.detail || '';

  const imagesAvailable = [
    primaryImage ? { key: 'primary', url: primaryImage, label: 'Vue principale' } : null,
    secondaryImage ? { key: 'secondary', url: secondaryImage, label: 'Profil' } : null,
    detailImage ? { key: 'detail', url: detailImage, label: 'Détail' } : null,
  ].filter(Boolean) as { key: string; url: string; label: string }[];

  const currentImageUrl =
    activeImageKey === 'primary' && currentColor?.imageUrl
      ? currentColor.imageUrl
      : activeImageKey === 'secondary' && secondaryImage
      ? secondaryImage
      : activeImageKey === 'detail' && detailImage
      ? detailImage
      : primaryImage;

  const handleAddToCart = () => {
    addToCart(
      product,
      hasSizes ? currentSize : 'Taille Unique',
      currentColor || undefined,
      quantity
    );
    setIsAddedAnimation(true);
    setTimeout(() => {
      setIsAddedAnimation(false);
    }, 1200);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setQuickViewProduct(null);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-black/10 max-h-[92vh] flex flex-col md:flex-row">
        {/* Bouton Fermer */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-black hover:text-white text-black flex items-center justify-center transition-all shadow-md cursor-pointer"
          title="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Côté Gauche : Affichage Image */}
        <div className="md:w-1/2 bg-[#1C1F21] p-6 flex flex-col justify-between items-center relative overflow-hidden">
          {/* Image principale */}
          <div className="w-full h-72 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden bg-neutral-900 flex items-center justify-center">
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center select-none"
              />
            ) : (
              <div className="text-neutral-500 font-mono text-xs uppercase">
                Aucune image disponible
              </div>
            )}
          </div>

          {/* Miniatures uniquement si plusieurs photos existent */}
          {imagesAvailable.length > 1 && (
            <div className="flex space-x-2 mt-4">
              {imagesAvailable.map((img) => (
                <button
                  key={img.key}
                  type="button"
                  onClick={() => setActiveImageKey(img.key)}
                  className={`w-14 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageKey === img.key
                      ? 'border-white scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Côté Droit : Détails Produit & Achat */}
        <div className="md:w-1/2 p-6 sm:p-8 flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            {/* Catégorie */}
            {product.category && (
              <div className="text-xs font-mono text-black/50 uppercase tracking-widest font-bold">
                {product.category}
              </div>
            )}

            {/* Titre du Produit */}
            <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-black leading-tight">
              {product.name}
            </h2>

            {/* Prix en FCFA */}
            <div className="text-xl sm:text-2xl font-mono font-bold text-black">
              {formatPrice(product.price)}
            </div>

            {/* Description (si saisie par l'admin) */}
            {product.description && (
              <p className="text-xs sm:text-sm text-black/70 leading-relaxed pt-1 whitespace-pre-line">
                {product.description}
              </p>
            )}

            {/* Choix de la Couleur (uniquement si plusieurs couleurs existent) */}
            {hasColors && (
              <div className="pt-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-black/60 block mb-1.5 font-semibold">
                  Couleur : <span className="text-black">{currentColor?.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                        currentColor?.name === c.name
                          ? 'border-black bg-black text-white shadow-sm'
                          : 'border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Choix de la Taille (uniquement si des tailles sont définies) */}
            {hasSizes && (
              <div className="pt-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-black/60 block mb-1.5 font-semibold">
                  Taille
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        currentSize === sz
                          ? 'bg-black text-white shadow-md'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sélecteur de Quantité */}
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-black/60 font-semibold">
                Quantité :
              </span>
              <div className="flex items-center bg-neutral-100 rounded-full border border-neutral-200 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors font-bold text-sm cursor-pointer"
                  title="Diminuer"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors font-bold text-sm cursor-pointer"
                  title="Augmenter"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Pied de la modal : Boutons d'Action & Réassurance */}
          <div className="pt-6 border-t border-black/10 mt-6 space-y-3">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddedAnimation}
                className={`flex-1 py-3.5 px-6 rounded-full font-mono text-xs uppercase tracking-widest font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                  isAddedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black text-white hover:bg-neutral-800 active:scale-98'
                }`}
              >
                {isAddedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Ajouté au panier !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Ajouter au panier — {formatPrice((product.price ?? product.priceUsd ?? 0) * quantity)}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-black/15 hover:border-black text-black'
                }`}
                title={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Réassurance adaptée au site */}
            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-1">
              <span className="flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1 text-black" />
                Livraison rapide & soignée
              </span>
              <span className="flex items-center">
                <RefreshCw className="w-3 h-3 mr-1 text-black" />
                Échanges & retours faciles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
