// ─── useProductAdmin ──────────────────────────────────────────────────────────
// Hook complet pour la gestion admin des produits.
// Gère : liste, création, modification, suppression, upload image, filtrage.

import { useState, useEffect, useCallback } from 'react';
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminTogglePublish,
  adminToggleStock,
  adminUploadProductImage,
} from '../services/productAdminService';
import type { Product, CreateProductDto, UpdateProductDto, Category } from '../../../types';

interface UseProductAdminReturn {
  // Données
  products:       Product[];
  filtered:       Product[];
  loading:        boolean;
  saving:         boolean;
  error:          string | null;

  // Filtres
  activeCategory: Category;
  setCategory:    (c: Category) => void;
  searchQuery:    string;
  setSearchQuery: (q: string) => void;

  // CRUD
  createProduct:  (dto: CreateProductDto)          => Promise<Product | null>;
  updateProduct:  (id: string, dto: UpdateProductDto) => Promise<Product | null>;
  deleteProduct:  (id: string)                     => Promise<boolean>;
  togglePublish:  (id: string, published: boolean) => Promise<void>;
  toggleStock:    (id: string, inStock: boolean)   => Promise<void>;

  // Upload
  uploadImage:    (file: File) => Promise<string | null>;
  uploading:      boolean;

  refetch:        () => void;
}

export function useProductAdmin(): UseProductAdminReturn {
  const [products,       setProducts]       = useState<Product[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [uploading,      setUploading]      = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery,    setSearchQuery]    = useState('');

  // ── Chargement ──────────────────────────────────────────────────────────────
  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetAllProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  // ── Filtrage local ───────────────────────────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const createProduct = async (dto: CreateProductDto): Promise<Product | null> => {
    setSaving(true);
    setError(null);
    try {
      const created = await adminCreateProduct(dto);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la création');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async (id: string, dto: UpdateProductDto): Promise<Product | null> => {
    setSaving(true);
    setError(null);
    try {
      const updated = await adminUpdateProduct(id, dto);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la modification');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      await adminDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la suppression');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, published: boolean): Promise<void> => {
    try {
      const updated = await adminTogglePublish(id, published);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de publication');
    }
  };

  const toggleStock = async (id: string, inStock: boolean): Promise<void> => {
    try {
      const updated = await adminToggleStock(id, inStock);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de stock');
    }
  };

  // ── Upload image ─────────────────────────────────────────────────────────────
  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const res = await adminUploadProductImage(file);
      return res.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur d\'upload');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    products,
    filtered,
    loading,
    saving,
    error,
    activeCategory,
    setCategory: setActiveCategory,
    searchQuery,
    setSearchQuery,
    createProduct,
    updateProduct,
    deleteProduct,
    togglePublish,
    toggleStock,
    uploadImage,
    uploading,
    refetch: fetch,
  };
}
