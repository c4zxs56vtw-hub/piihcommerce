import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, ArrowUpRight, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../features/products';
import { Product } from '../types';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onNavigateCategory?: (category: string) => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateCategory, onOpenAuth }) => {
  const {
    totalCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    currency,
    setCurrency,
    formatPrice,
    setQuickViewProduct,
  } = useCart();

  const { isAuthenticated: isAuth, isAdmin, userName } = useAuth();

  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const searchResults = products.filter((p) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }).slice(0, 4);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product: Product) => {
    setQuickViewProduct(product);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#E8ECEE]/92 backdrop-blur-md border-b border-black/10">
      {/* Main Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Logo & Nav */}
        <div className="flex items-center space-x-8 lg:space-x-10">
          <a href="#" className="flex items-center group">
            <img
              src="/images/logo.png"
              alt="C'Kennedy"
              className="h-10 w-auto object-contain group-hover:opacity-80 transition-opacity"
              onError={(e) => {
                // Fallback texte si logo pas encore uploadé
                const t = e.currentTarget;
                t.style.display = 'none';
                const span = document.createElement('span');
                span.className = "font-display text-xl font-black tracking-widest uppercase";
                span.textContent = "C'KENNEDY";
                t.parentElement?.appendChild(span);
              }}
            />
          </a>

          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-wider uppercase text-black/70">
            <a href="#trending" className="hover:text-black transition-colors group relative py-1">
              Favoris
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#new-collection" className="hover:text-black transition-colors group relative py-1">
              New Collection
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#collection" className="hover:text-black transition-colors group relative py-1">
              Collection
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#lookbook" className="hover:text-black transition-colors group relative py-1">
              Lookbook
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300" />
            </a>
          </nav>
        </div>

        {/* Right: Search, Wishlist, Currency, Bag */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Predictive Search */}
          <div className="relative hidden sm:block" ref={searchContainerRef}>
            <div className="flex items-center bg-white/70 hover:bg-white focus-within:bg-white rounded-full px-4 py-1.5 border border-black/10 transition-all w-48 lg:w-60 focus-within:w-72 shadow-sm">
              <Search className="w-3.5 h-3.5 text-black/50 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search gear, lycra, jackets..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-transparent border-none p-0 text-xs text-black placeholder-black/40 focus:ring-0 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-black/40 hover:text-black text-xs ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Predictive Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-black/10 p-4 z-50">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-black/40 mb-2 pb-1 border-b border-black/5">
                  <span>Instant Gear Query</span>
                  <span>{searchResults.length} Results</span>
                </div>

                {searchQuery.trim() === '' ? (
                  <div className="space-y-1">
                    <p className="text-[11px] text-black/50 font-mono mb-2">Suggested Searches:</p>
                    {products.slice(0, 3).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        className="w-full text-left p-2 hover:bg-[#D2D8DA]/40 rounded-xl cursor-pointer flex justify-between items-center transition-colors text-xs font-medium"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={p.images.cartThumbnail}
                            alt={p.name}
                            className="w-7 h-7 object-cover rounded-md bg-neutral-200"
                          />
                          <span className="truncate">{p.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-black/60">
                          {formatPrice(p.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1.5">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="w-full text-left p-2 hover:bg-[#D2D8DA]/40 rounded-xl cursor-pointer flex justify-between items-center transition-colors text-xs font-medium group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={product.images.cartThumbnail}
                            alt={product.name}
                            className="w-9 h-9 object-cover rounded-lg bg-neutral-200"
                          />
                          <div>
                            <p className="font-semibold text-black group-hover:text-neutral-800">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-neutral-500 font-mono">
                              {product.season} • {product.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-black">
                            {formatPrice(product.price)}
                          </span>
                          <span className="block text-[10px] font-mono text-emerald-600">
                            In Stock
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-neutral-500 font-mono">
                    Aucun résultat pour "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Account / Connexion Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 p-2 text-black/80 hover:text-black transition-colors rounded-full hover:bg-white/50 cursor-pointer"
              title={
                isAuth
                  ? isAdmin
                    ? 'Panneau Administrateur'
                    : 'Mon Compte Client'
                  : 'Connexion / Inscription'
              }
            >
              <div className="relative">
                <User className="w-5 h-5" />
                {isAuth && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${
                      isAdmin ? 'bg-emerald-500 animate-pulse' : 'bg-black'
                    }`}
                  />
                )}
              </div>
              <span className="hidden xl:inline text-xs font-mono font-bold uppercase tracking-wider">
                {isAuth
                  ? isAdmin
                    ? 'Admin'
                    : userName
                    ? userName.split(' ')[0]
                    : 'Compte'
                  : 'Connexion'}
              </span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-black/80 hover:text-black transition-colors rounded-full hover:bg-white/50"
            title="Saved Gear Locker"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />
            )}
          </button>

          {/* Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 bg-black text-white hover:bg-neutral-800 transition-all text-xs font-mono py-2 px-4 rounded-full shadow-md active:scale-95"
            title="Open Dispatch Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 hidden sm:inline" />
            <span className="tracking-wider">BAG</span>
            <span className="bg-white/20 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
              {totalCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-black hover:text-neutral-700"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-black/10 px-6 py-4 space-y-3 font-mono text-xs uppercase tracking-wider">
          {onOpenAuth && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full text-left flex justify-between items-center py-2.5 border-b border-black/10 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-black" />
                <span className="font-bold">
                  {isAuth
                    ? isAdmin
                      ? 'Espace Administrateur'
                      : `Mon Compte (${userName || 'Client'})`
                    : 'Connexion / Inscription'}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black/40" />
            </button>
          )}
          <a href="#trending" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between items-center py-2.5 border-b border-black/5">
            <div>
              <span className="font-bold">Favoris</span>
              <span className="block text-[9px] text-black/40 normal-case tracking-normal mt-0.5">Les pièces les plus aimées</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-black/40" />
          </a>
          <a href="#new-collection" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between items-center py-2.5 border-b border-black/5">
            <div>
              <span className="font-bold">New Collection</span>
              <span className="block text-[9px] text-black/40 normal-case tracking-normal mt-0.5">Dernières nouveautés</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-black/40" />
          </a>
          <a href="#collection" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between items-center py-2.5 border-b border-black/5">
            <div>
              <span className="font-bold">Collection</span>
              <span className="block text-[9px] text-black/40 normal-case tracking-normal mt-0.5">Tout le catalogue</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-black/40" />
          </a>
          <a href="#lookbook" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between items-center py-2.5">
            <div>
              <span className="font-bold">Lookbook</span>
              <span className="block text-[9px] text-black/40 normal-case tracking-normal mt-0.5">Inspirations de la saison</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-black/40" />
          </a>
        </div>
      )}
    </header>
  );
};
