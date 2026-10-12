import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/productService';
import { loadProducts } from '../../../data/localProductStore';
import type { Product, Category } from '../types';

interface UseProductsReturn {
  products:        Product[];
  filtered:        Product[];
  loading:         boolean;
  error:           string | null;
  activeCategory:  Category;
  setCategory:     (c: Category) => void;
  refetch:         () => void;
}

export function useProducts(): UseProductsReturn {
  const [products,       setProducts]       = useState<Product[]>(() => loadProducts());
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() =>
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  return {
    products,
    filtered,
    loading,
    error,
    activeCategory,
    setCategory: setActiveCategory,
    refetch: fetch,
  };
}
