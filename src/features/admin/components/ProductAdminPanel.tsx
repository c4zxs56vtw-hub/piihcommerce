// ─── ProductAdminPanel ────────────────────────────────────────────────────────
// Interface admin pour gérer les produits C'Kennedy.
// Accessible via /admin (à protéger avec auth middleware).

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Package, Search, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useProductAdmin } from '../hooks/useProductAdmin';
import type { Product, Category, ProductCategory } from '../../../types';

// Labels des gammes C'Kennedy
const CATEGORY_LABELS: Record<string, string> = {
  all:         'Tout voir',
  classique:   'Classique',
  urbain:      'Urbain',
  accessories: 'Accessoires',
};

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Tout voir',    value: 'all' },
  { label: 'Classique',    value: 'classique' },
  { label: 'Urbain',       value: 'urbain' },
  { label: 'Accessoires',  value: 'accessories' },
];

// ─── Carte produit admin ──────────────────────────────────────────────────────
const AdminProductCard: React.FC<{
  product: Product;
  onEdit:          (p: Product) => void;
  onDelete:        (id: string) => void;
  onTogglePublish: (id: string, published: boolean) => void;
  onToggleStock:   (id: string, inStock: boolean)   => void;
}> = ({ product, onEdit, onDelete, onTogglePublish, onToggleStock }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
      product.isPublished === false ? 'opacity-60 border-black/10' : 'border-black/8'
    }`}>
      {/* Image */}
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        <img
          src={product.images.primary}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          <span className="text-[9px] font-mono uppercase tracking-wider bg-black/70 text-white px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
          {product.badge && (
            <span className="text-[9px] font-mono uppercase bg-white/90 text-black px-2 py-0.5 rounded-full">
              {product.badge}
            </span>
          )}
        </div>
        {/* Status publication */}
        <div className="absolute top-2 right-2">
          {product.isPublished === false ? (
            <span className="text-[9px] font-mono bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              BROUILLON
            </span>
          ) : (
            <span className="text-[9px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              PUBLIÉ
            </span>
          )}
        </div>
      </div>

      {/* Infos */}
      <div className="p-4">
        <h3 className="font-bold text-sm uppercase tracking-tight leading-tight">{product.name}</h3>
        <p className="text-[11px] text-black/50 mt-0.5">{product.subtitle}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono font-bold text-sm">{(product.price ?? product.priceUsd ?? 0).toLocaleString('fr-CM')} FCFA</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
            product.inStock
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-500'
          }`}>
            {product.inStock ? 'En stock' : 'Rupture'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2 flex-wrap">
        {/* Modifier */}
        <button
          onClick={() => onEdit(product)}
          className="flex items-center gap-1 text-[10px] font-mono uppercase bg-black text-white px-3 py-1.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <Pencil className="w-3 h-3" />
          Modifier
        </button>

        {/* Publier / Dépublier */}
        <button
          onClick={() => onTogglePublish(product.id, !(product.isPublished ?? true))}
          className="flex items-center gap-1 text-[10px] font-mono uppercase bg-white border border-black/15 text-black px-3 py-1.5 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          {product.isPublished === false
            ? <><Eye className="w-3 h-3" /> Publier</>
            : <><EyeOff className="w-3 h-3" /> Masquer</>
          }
        </button>

        {/* Stock */}
        <button
          onClick={() => onToggleStock(product.id, !product.inStock)}
          className="flex items-center gap-1 text-[10px] font-mono uppercase bg-white border border-black/15 text-black px-3 py-1.5 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <Package className="w-3 h-3" />
          {product.inStock ? 'Rupture' : 'En stock'}
        </button>

        {/* Supprimer */}
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onDelete(product.id); setConfirmDelete(false); }}
              className="text-[10px] font-mono uppercase bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 cursor-pointer"
            >
              Confirmer
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-[10px] font-mono uppercase bg-white border border-black/15 px-2 py-1.5 rounded-full cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1 text-[10px] font-mono uppercase bg-white border border-red-200 text-red-500 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer ml-auto"
          >
            <Trash2 className="w-3 h-3" />
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Panel principal ──────────────────────────────────────────────────────────
export const ProductAdminPanel: React.FC = () => {
  const {
    filtered, loading, saving, error,
    activeCategory, setCategory,
    searchQuery, setSearchQuery,
    deleteProduct, togglePublish, toggleStock,
    refetch,
  } = useProductAdmin();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-[#E8ECEE] p-4 sm:p-8">
      <div className="max-w-[1440px] mx-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight">
              Gestion Produits
            </h1>
            <p className="text-sm text-black/50 mt-1 font-mono">
              C'Kennedy — Interface Admin
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="text-xs font-mono uppercase bg-white border border-black/10 px-4 py-2 rounded-full hover:bg-neutral-50 cursor-pointer"
            >
              Actualiser
            </button>
            <button
              onClick={() => setEditingProduct({} as Product)}
              className="flex items-center gap-2 text-xs font-mono uppercase bg-black text-white px-5 py-2 rounded-full hover:bg-neutral-800 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-mono px-4 py-3 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Filtres + Recherche */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {/* Filtres catégories */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`text-xs font-mono uppercase px-4 py-2 rounded-full transition-all cursor-pointer ${
                  activeCategory === cat.value
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white border border-black/10 text-black/70 hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="flex items-center bg-white border border-black/10 rounded-full px-3 py-2 gap-2 ml-auto">
            <Search className="w-3.5 h-3.5 text-black/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="text-xs bg-transparent outline-none w-48 placeholder-black/30"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                <X className="w-3 h-3 text-black/40" />
              </button>
            )}
          </div>

          {/* Compteur */}
          <span className="text-xs font-mono text-black/40">
            {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grille produits */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/60 rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-black/40 font-mono text-sm">
            Aucun produit trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onEdit={setEditingProduct}
                onDelete={deleteProduct}
                onTogglePublish={togglePublish}
                onToggleStock={toggleStock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
