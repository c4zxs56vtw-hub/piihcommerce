import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Currency, ProductColor, Look } from '../types';

interface ToastMessage {
  id: string;
  title: string;
  description: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: ProductColor, quantity?: number) => void;
  removeFromCart: (itemId: string, size: string, colorName: string) => void;
  updateQuantity: (itemId: string, size: string, colorName: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  discount: number;
  total: number;
  isFreeShippingQualified: boolean;
  freeShippingProgress: number;
  promoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;

  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  isVideoModalOpen: boolean;
  setIsVideoModalOpen: (open: boolean) => void;

  selectedLookForStudio: Look | null;
  setSelectedLookForStudio: (look: Look | null) => void;

  toasts: ToastMessage[];
  addToast: (title: string, description: string) => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ckennedy_cart_v1';
const WISHLIST_STORAGE_KEY = 'ckennedy_wishlist_v1';

function loadStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadStoredCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => loadStoredWishlist());
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedLookForStudio, setSelectedLookForStudio] = useState<Look | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronisation continue du panier
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Synchronisation continue de la wishlist
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  const addToast = (title: string, description: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const formatPrice = (amount: number): string => {
    return `${amount.toLocaleString('fr-CM')} FCFA`;
  };

  const addToCart = (
    product: Product,
    size?: string,
    color?: ProductColor,
    quantity = 1
  ) => {
    const chosenSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Taille Unique');
    const chosenColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Standard', hex: '#111315' });

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          (item.selectedColor?.name || 'Standard') === (chosenColor?.name || 'Standard')
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }

      return [
        ...prev,
        {
          id: product.id,
          product,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
          quantity,
        },
      ];
    });

    addToast('Article ajouté', `${product.name} (${chosenSize}) ajouté à votre panier.`);
  };

  const removeFromCart = (itemId: string, size: string, colorName: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === itemId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          )
      )
    );
  };

  const updateQuantity = (
    itemId: string,
    size: string,
    colorName: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === itemId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price ?? item.product.priceUsd ?? 0) * item.quantity, 0);
  }, [cart]);

  const discount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const freeShippingThreshold = 90000;
  const isFreeShippingQualified = subtotal >= freeShippingThreshold;
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CKENNEDY10') {
      setPromoCode(clean);
      setDiscountPercent(10);
      addToast('Promo Code Applied', '10% promotional discount applied to total.');
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'WINTER25') {
      setPromoCode(clean);
      setDiscountPercent(25);
      addToast('Winter Pass Applied', '25% VIP Seasonal discount applied.');
      return { success: true, message: '25% Winter Pass applied!' };
    }
    return { success: false, message: 'Code promo invalide. Essayez CKENNEDY10' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Saved Gear Updated', 'Item removed from your locker.');
        return prev.filter((id) => id !== productId);
      }
      addToast('Saved to Gear Locker', 'Item added to your locker wishlist.');
      return [...prev, productId];
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discount,
        total,
        isFreeShippingQualified,
        freeShippingProgress,
        promoCode,
        applyPromoCode,
        removePromoCode,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isWishlistOpen,
        setIsWishlistOpen,
        currency,
        setCurrency,
        formatPrice,
        quickViewProduct,
        setQuickViewProduct,
        isVideoModalOpen,
        setIsVideoModalOpen,
        selectedLookForStudio,
        setSelectedLookForStudio,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const DEFAULT_CART_CONTEXT: CartContextType = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalCount: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  promoCode: '',
  applyPromoCode: () => ({ success: false, message: '' }),
  removePromoCode: () => {},
  isFreeShippingQualified: false,
  freeShippingProgress: 0,
  wishlist: [],
  toggleWishlist: () => {},
  isWishlisted: () => false,
  isWishlistOpen: false,
  setIsWishlistOpen: () => {},
  isCartOpen: false,
  setIsCartOpen: () => {},
  currency: 'USD',
  setCurrency: () => {},
  formatPrice: (amount: number) => `${amount.toLocaleString('fr-CM')} FCFA`,
  quickViewProduct: null,
  setQuickViewProduct: () => {},
  isVideoModalOpen: false,
  setIsVideoModalOpen: () => {},
  selectedLookForStudio: null,
  setSelectedLookForStudio: () => {},
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return DEFAULT_CART_CONTEXT;
  }
  return context;
};
