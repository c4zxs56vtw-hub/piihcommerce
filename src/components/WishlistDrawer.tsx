import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../features/products';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    formatPrice,
    setQuickViewProduct,
  } = useCart();

  const { products } = useProducts();

  if (!isWishlistOpen) return null;

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between animate-slide-left border-l border-black/10">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div>
              <h2 className="text-lg font-display font-black tracking-tight uppercase flex items-center space-x-2">
                <Heart className="w-4 h-4 fill-black text-black" />
                <span>SAVED GEAR LOCKER</span>
              </h2>
              <p className="text-xs text-neutral-500 font-mono">
                {savedProducts.length} {savedProducts.length === 1 ? 'ITEM' : 'ITEMS'} RESERVED
              </p>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
            {savedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-3">
                <Heart className="w-12 h-12 stroke-[1.2]" />
                <p className="text-xs font-mono uppercase tracking-wider">
                  Your gear locker is empty.
                </p>
                <p className="text-[11px] text-neutral-400 max-w-xs">
                  Click the heart icon on any product or look to save it for quick access later.
                </p>
              </div>
            ) : (
              savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex space-x-3.5 border-b border-neutral-100 pb-4"
                >
                  <div
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setQuickViewProduct(product);
                    }}
                    className="w-20 h-24 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0 border border-black/5 cursor-pointer"
                  >
                    <img
                      src={product.images.cartThumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setQuickViewProduct(product);
                          }}
                          className="text-xs font-bold uppercase tracking-tight cursor-pointer hover:text-neutral-600"
                        >
                          {product.name}
                        </h3>
                        <span className="text-xs font-mono font-bold">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        {product.season} • {product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        onClick={() => {
                          addToCart(product, product.sizes[0]);
                          toggleWishlist(product.id);
                        }}
                        className="bg-black text-white hover:bg-neutral-800 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move To Bag</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-[11px] text-neutral-400 hover:text-red-500 font-mono flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {savedProducts.length > 0 && (
            <div className="pt-4 border-t border-black/10">
              <button
                onClick={() => {
                  savedProducts.forEach((p) => addToCart(p, p.sizes[0]));
                  setIsWishlistOpen(false);
                }}
                className="w-full bg-black text-white py-3 rounded-full text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Move All ({savedProducts.length}) To Bag
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
