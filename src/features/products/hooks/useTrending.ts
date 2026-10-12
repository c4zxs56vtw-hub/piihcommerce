// ─── useTrending ──────────────────────────────────────────────────────────────
// Charge les produits les plus aimés depuis Spring Boot.
// Synchronise aussi les likes avec le backend quand l'utilisateur wishlist.

import { useState, useEffect } from 'react';
import { getTrendingProducts, likeProduct, unlikeProduct } from '../services/trendingService';
import { loadProducts } from '../../../data/localProductStore';
import type { Product } from '../../../types';

interface UseTrendingReturn {
  trending:  Product[];
  loading:   boolean;
  error:     string | null;
  refetch:   () => void;
  syncLike:  (productId: string, liked: boolean) => Promise<void>;
}

export function useTrending(limit = 4): UseTrendingReturn {
  const [trending, setTrending] = useState<Product[]>(() =>
    // Valeur initiale immédiate (fallback local) pour éviter un écran vide
    [...loadProducts()]
      .sort((a, b) => (b.rating ?? 0) * (b.reviewsCount ?? 0) - (a.rating ?? 0) * (a.reviewsCount ?? 0))
      .slice(0, limit)
  );
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTrendingProducts(limit);
      setTrending(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
      // fallback déjà en place — on ne reset pas trending
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  // Notifie le backend quand un utilisateur like/unlike un produit
  const syncLike = async (productId: string, liked: boolean) => {
    try {
      if (liked) await likeProduct(productId);
      else       await unlikeProduct(productId);
      // Re-fetch pour mettre à jour le classement
      await fetch();
    } catch {
      // Silencieux — le like local (wishlist) reste actif même si le backend échoue
    }
  };

  return { trending, loading, error, refetch: fetch, syncLike };
}
