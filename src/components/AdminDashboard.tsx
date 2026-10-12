import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Image as ImageIcon,
  Sparkles,
  Package,
  ChevronDown,
  ChevronUp,
  Check,
  Eye,
  LogOut,
  ArrowLeft,
  User,
} from 'lucide-react';
import { Product, ProductCategory, Look } from '../types';
import { ENDPOINTS, API_CONFIG, hasBackend } from '../config/api';
import {
  loadProducts,
  saveProducts,
  loadLooks,
  saveLooks,
  imageFileToDataUrl,
} from '../data/localProductStore';
import { getCurrentUserEmail } from '../lib/http/interceptors';
import { http } from '../lib/http';
import { uploadImage, type UploadTarget } from '../features/admin/services/uploadService';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DESCRIPTION_MAX = 400;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 Mo, aligné sur le contrat API

interface AdminDashboardProps {
  onLogout?: () => void;
  onBackToStore?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onBackToStore,
}) => {
  // Onglet actif : 'products' ou 'looks'
  const [activeTab, setActiveTab] = useState<'products' | 'looks'>('products');

  // ─── État Produits ──────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isProductLoading, setIsProductLoading] = useState(false);

  // ─── État Lookbook ──────────────────────────────────────────────────────────
  const [looks, setLooks] = useState<Look[]>([]);
  const [isEditingLook, setIsEditingLook] = useState(false);
  const [currentLook, setCurrentLook] = useState<Partial<Look>>({});
  const [isLookLoading, setIsLookLoading] = useState(false);
  const [showAdvancedLookFields, setShowAdvancedLookFields] = useState(false);

  const [isImageUploading, setIsImageUploading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const currentUserEmail = getCurrentUserEmail();

  // ─── Utilitaires ────────────────────────────────────────────────────────────
  const describeError = (e: unknown, fallback: string): string => {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return 'Le serveur ne répond pas (délai dépassé). Réessayez.';
    }
    if (e instanceof TypeError) {
      return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
    }
    if (e instanceof Error && e.message) return e.message;
    return fallback;
  };

  const showAdminError = (e: unknown, fallback: string) => {
    setAdminError(describeError(e, fallback));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Avec Spring Boot : envoie le fichier à /api/upload et retourne son URL publique.
   * Sans backend : image redimensionnée et stockée dans le navigateur (data-URL).
   */
  const resolveImageUrl = async (file: File, target: UploadTarget): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error("Le fichier choisi n'est pas une image.");
    }
    if (!hasBackend()) return imageFileToDataUrl(file);
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error('Image trop lourde (5 Mo maximum).');
    }
    const res = await uploadImage(file, target);
    if (!res?.url) throw new Error("Le serveur n'a pas renvoyé l'adresse de l'image.");
    return res.url;
  };

  // ─── Chargement Initial ─────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setIsProductLoading(true);
    try {
      if (hasBackend()) {
        setProducts(await http.get<Product[]>(ENDPOINTS.products));
        return;
      }
      setProducts(loadProducts());
    } catch (e) {
      // Avec un backend configuré, on n'affiche jamais de données locales périmées
      setProducts([]);
      showAdminError(e, 'Impossible de charger les produits.');
    } finally {
      setIsProductLoading(false);
    }
  };

  const fetchLooks = async () => {
    setIsLookLoading(true);
    try {
      if (hasBackend()) {
        setLooks(await http.get<Look[]>(ENDPOINTS.looks));
        return;
      }
      setLooks(loadLooks());
    } catch (e) {
      setLooks([]);
      showAdminError(e, 'Impossible de charger le lookbook.');
    } finally {
      setIsLookLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLooks();
  }, []);

  // ─── Sauvegarde Produits ───────────────────────────────────────────────────
  const persistProducts = (next: Product[]) => {
    setProducts(next);
    if (!API_CONFIG.BASE_URL && !saveProducts(next)) {
      alert('Espace de stockage plein : utilisez des images plus légères.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setIsProductLoading(true);

    try {
      if (hasBackend()) {
        if (!currentProduct.images?.primary) {
          throw new Error("Ajoutez l'image principale avant d'enregistrer le produit.");
        }

        const payload = {
          ...currentProduct,
          price: currentProduct.price ?? currentProduct.priceFcfa ?? currentProduct.priceUsd ?? 0,
          priceFcfa: currentProduct.priceFcfa ?? currentProduct.price ?? currentProduct.priceUsd ?? 0,
        };

        if (currentProduct.id) {
          await http.put<Product>(`${ENDPOINTS.products}/${currentProduct.id}`, payload);
        } else {
          await http.post<Product>(ENDPOINTS.products, payload);
        }
        setIsEditingProduct(false);
        await fetchProducts();
        return;
      }

      // Sauvegarde locale
      let next: Product[];
      if (currentProduct.id) {
        next = products.map((p) =>
          p.id === currentProduct.id ? ({ ...p, ...currentProduct } as Product) : p
        );
      } else {
        const newProduct: Product = {
          id: `prod-${Date.now()}`,
          name: currentProduct.name || 'Nouveau Produit',
          subtitle: currentProduct.subtitle || '',
          category: (currentProduct.category as ProductCategory) || 'classique',
          price: currentProduct.price ?? currentProduct.priceFcfa ?? currentProduct.priceUsd ?? 0,
          priceFcfa: currentProduct.priceFcfa ?? currentProduct.price ?? currentProduct.priceUsd ?? 0,
          season: 'Collection 2025',
          badge: currentProduct.badge || '',
          images: currentProduct.images || {
            primary: '/images/hero-1.png',
            cartThumbnail: '/images/hero-1.png',
          },
          sizes: currentProduct.sizes ?? [],
          colors: currentProduct.colors || [],
          description: currentProduct.description || '',
          specs: [],
          inStock: true,
          rating: 0,
          reviewsCount: 0,
        };
        next = [newProduct, ...products];
      }

      persistProducts(next);
      setIsEditingProduct(false);
    } catch (e) {
      showAdminError(e, "Erreur lors de l'enregistrement du produit.");
    } finally {
      setIsProductLoading(false);
    }
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setAdminError(null);
    setIsImageUploading(true);
    try {
      const url = await resolveImageUrl(file, 'products');
      setCurrentProduct((prev) => ({
        ...prev,
        images: {
          primary: url,
          cartThumbnail: url,
        },
        colors: (prev.colors || []).map(({ imageUrl, ...c }) => c),
      }));
    } catch (err) {
      showAdminError(err, "Impossible d'envoyer cette image.");
    } finally {
      setIsImageUploading(false);
      input.value = '';
    }
  };

  const toggleProductSize = (size: string) => {
    const existingSizes = currentProduct.sizes || [];
    if (existingSizes.includes(size)) {
      setCurrentProduct({
        ...currentProduct,
        sizes: existingSizes.filter((s) => s !== size),
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        sizes: AVAILABLE_SIZES.filter((s) => s === size || existingSizes.includes(s)),
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    setAdminError(null);
    try {
      if (hasBackend()) {
        await http.delete(`${ENDPOINTS.products}/${productId}`);
      }
      persistProducts(products.filter((p) => p.id !== productId));
    } catch (e) {
      showAdminError(e, 'Suppression du produit impossible.');
    }
  };

  // ─── Sauvegarde Lookbook ────────────────────────────────────────────────────
  const persistLooks = (next: Look[]) => {
    setLooks(next);
    if (!API_CONFIG.BASE_URL && !saveLooks(next)) {
      alert('Espace de stockage plein : utilisez des images plus légères.');
    }
  };

  const handleSaveLook = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setIsLookLoading(true);

    try {
      if (hasBackend()) {
        if (!currentLook.heroImage) {
          throw new Error("Ajoutez la photo de l'affiche avant d'enregistrer le look.");
        }
        if (currentLook.id) {
          await http.put<Look>(`${ENDPOINTS.looks}/${currentLook.id}`, currentLook);
        } else {
          await http.post<Look>(ENDPOINTS.looks, currentLook);
        }
        setIsEditingLook(false);
        await fetchLooks();
        return;
      }

      // Sauvegarde locale
      let next: Look[];
      if (currentLook.id) {
        next = looks.map((l) =>
          l.id === currentLook.id ? ({ ...l, ...currentLook } as Look) : l
        );
      } else {
        const nextNum = String(looks.length + 1).padStart(2, '0');
        const newLook: Look = {
          id: `look-${Date.now()}`,
          number: currentLook.number || nextNum,
          name: currentLook.name || `Look ${nextNum}`,
          subtitle: currentLook.subtitle || '',
          date: new Date().toLocaleDateString('fr-FR'),
          deliveryTag: currentLook.deliveryTag || 'LIVRAISON RAPIDE',
          badge: currentLook.badge || 'SUBLIMEZ VOTRE STYLE',
          heroImage: currentLook.heroImage || '/images/hero-1.png',
          topLeftTitle: currentLook.topLeftTitle || "C'KENNEDY",
          topLeftSubtitle: currentLook.topLeftSubtitle || 'COLLECTION',
          topRightTitle: currentLook.topRightTitle || 'NOUVELLE SAISON',
          topRightSubtitle: currentLook.topRightSubtitle || '2025',
          bottomLeftTitle: currentLook.bottomLeftTitle || 'ÉLÉGANCE',
          bottomLeftSubtitle: currentLook.bottomLeftSubtitle || 'INTEMPORELLE',
          bottomRightTitle: currentLook.bottomRightTitle || '• TENUE',
          bottomRightSubtitle: currentLook.bottomRightSubtitle || 'COMPLÈTE',
          includedProductIds: currentLook.includedProductIds || [],
        };
        next = [...looks, newLook];
      }

      persistLooks(next);
      setIsEditingLook(false);
    } catch (e) {
      showAdminError(e, "Erreur lors de l'enregistrement du look.");
    } finally {
      setIsLookLoading(false);
    }
  };

  const handleLookImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setAdminError(null);
    setIsImageUploading(true);
    try {
      const url = await resolveImageUrl(file, 'lookbook');
      setCurrentLook((prev) => ({
        ...prev,
        heroImage: url,
      }));
    } catch (err) {
      showAdminError(err, 'Impossible d\'envoyer cette image.');
    } finally {
      setIsImageUploading(false);
      input.value = '';
    }
  };

  const toggleIncludedProductInLook = (productId: string) => {
    const existing = currentLook.includedProductIds || [];
    if (existing.includes(productId)) {
      setCurrentLook({
        ...currentLook,
        includedProductIds: existing.filter((id) => id !== productId),
      });
    } else {
      setCurrentLook({
        ...currentLook,
        includedProductIds: [...existing, productId],
      });
    }
  };

  const handleDeleteLook = async (lookId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce look du Lookbook ?')) return;
    setAdminError(null);
    try {
      if (hasBackend()) {
        await http.delete(`${ENDPOINTS.looks}/${lookId}`);
      }
      persistLooks(looks.filter((l) => l.id !== lookId));
    } catch (e) {
      showAdminError(e, 'Suppression du look impossible.');
    }
  };

  return (
    <div className="min-h-screen bg-[#111315] text-white p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* En-tête Général */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black uppercase tracking-tight">Panneau Administrateur</h1>
              <span className="text-[10px] font-mono bg-white/10 text-neutral-300 px-2.5 py-1 rounded-full border border-white/10">
                PROPRIÉTAIRE
              </span>
            </div>
            <p className="text-neutral-400 font-mono text-xs mt-1">
              GESTION EN TEMPS RÉEL DU SITE C'KENNEDY
            </p>
          </div>

          {/* Actions & Navigation droite */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Onglets Produits / Lookbook */}
            <div className="flex bg-[#1C1F21] p-1.5 rounded-full border border-white/10 text-xs font-mono">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsEditingProduct(false);
                  setIsEditingLook(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                Produits ({products.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('looks');
                  setIsEditingProduct(false);
                  setIsEditingLook(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                  activeTab === 'looks'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Lookbook ({looks.length})
              </button>
            </div>

            {/* Profil & Bouton Boutique */}
            {onBackToStore && (
              <button
                onClick={onBackToStore}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1F21] hover:bg-[#252A2D] text-neutral-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
                title="Consulter la boutique en tant que client"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Boutique</span>
              </button>
            )}

            {/* Email Admin */}
            {currentUserEmail && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/5 text-[11px] font-mono text-neutral-400">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span className="truncate max-w-[150px]">{currentUserEmail}</span>
              </div>
            )}

            {/* Déconnexion */}
            {onLogout && (
              <button
                onClick={() => {
                  if (window.confirm('Voulez-vous vous déconnecter de la session administrateur ?')) {
                    onLogout();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono transition-all cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </div>

        {adminError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start justify-between gap-3 text-red-300 text-sm"
          >
            <span className="leading-relaxed">{adminError}</span>
            <button
              type="button"
              onClick={() => setAdminError(null)}
              className="shrink-0 text-red-300 hover:text-white cursor-pointer"
              aria-label="Fermer le message d'erreur"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            ONGLET 1 : GESTION DES PRODUITS
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-300">
                Catalogue Produits
              </h2>
              {!isEditingProduct && (
                <button
                  onClick={() => {
                    setCurrentProduct({
                      category: 'classique',
                      sizes: ['S', 'M', 'L', 'XL'],
                      colors: [],
                    });
                    setIsEditingProduct(true);
                  }}
                  className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Nouveau Produit
                </button>
              )}
            </div>

            {isEditingProduct ? (
              <div className="bg-[#1C1F21] p-8 rounded-3xl border border-white/10 animate-fade-in mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold uppercase">
                    {currentProduct.id ? 'Éditer' : 'Créer'} un Produit
                  </h3>
                  <button
                    onClick={() => setIsEditingProduct(false)}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nom */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Nom du Produit
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none"
                        value={currentProduct.name || ''}
                        placeholder="Ex: T-Shirt Signature"
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    {/* Catégorie */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Catégorie
                      </label>
                      <select
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none text-white"
                        value={currentProduct.category || 'classique'}
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            category: e.target.value as ProductCategory,
                          })
                        }
                      >
                        <option value="classique">Classique</option>
                        <option value="urbain">Urbain</option>
                        <option value="accessories">Accessoires</option>
                      </select>
                    </div>

                    {/* Prix FCFA */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Prix (FCFA)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none"
                        value={currentProduct.price ?? currentProduct.priceFcfa ?? currentProduct.priceUsd ?? ''}
                        placeholder="Ex: 45000"
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            price: parseFloat(e.target.value) || 0,
                            priceFcfa: parseFloat(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Image Principale */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Image Principale
                      </label>
                      <div className="relative w-full bg-[#111315] border border-white/10 border-dashed rounded-xl px-4 py-3 text-sm flex items-center justify-between">
                        <span className="text-neutral-500 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />{' '}
                          {isImageUploading ? 'Envoi de l\'image en cours...' : 'Uploader une image...'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleProductImageUpload}
                        />
                      </div>
                      {currentProduct.images?.primary && (
                        <img
                          src={currentProduct.images.primary}
                          alt="Preview"
                          className="mt-2 h-20 rounded-lg object-cover border border-white/10"
                        />
                      )}
                    </div>
                  </div>

                  {/* Accroche + Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Accroche courte (Sous-titre)
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none"
                        value={currentProduct.subtitle || ''}
                        placeholder="Ex: Veste élégante coupe structurée"
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, subtitle: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Badge (Optionnel)
                      </label>
                      <input
                        type="text"
                        maxLength={20}
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none"
                        value={currentProduct.badge || ''}
                        placeholder="Ex: Nouveau, Best-seller, Signature"
                        onChange={(e) =>
                          setCurrentProduct({ ...currentProduct, badge: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-mono text-neutral-400 uppercase">
                        Description du Produit
                      </label>
                      <span
                        className={`text-[11px] font-mono ${
                          (currentProduct.description || '').length > DESCRIPTION_MAX - 40
                            ? 'text-amber-400'
                            : 'text-neutral-500'
                        }`}
                      >
                        {(currentProduct.description || '').length} / {DESCRIPTION_MAX}
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      maxLength={DESCRIPTION_MAX}
                      className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm leading-relaxed focus:border-white focus:outline-none resize-y"
                      value={currentProduct.description || ''}
                      placeholder="Ex: La veste signature C'Kennedy : coupe structurée, tissu léger et respirant, finitions soignées. Elle se porte aussi bien au bureau qu'en sortie."
                      onChange={(e) =>
                        setCurrentProduct({ ...currentProduct, description: e.target.value })
                      }
                    />
                  </div>

                  {/* Tailles Disponibles */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                      Tailles Disponibles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SIZES.map((size) => {
                        const isSelected = (currentProduct.sizes || []).includes(size);
                        return (
                          <button
                            type="button"
                            key={size}
                            onClick={() => toggleProductSize(size)}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black'
                                : 'bg-[#111315] text-neutral-400 border border-white/10 hover:border-white/30'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-neutral-500 font-mono mt-1.5">
                      Laissez vide pour les articles à taille unique (ex: sacs, accessoires).
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="px-6 py-2.5 rounded-full text-xs font-bold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isProductLoading}
                      className="flex items-center gap-2 bg-white text-black px-8 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />{' '}
                      {isProductLoading ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {/* Table des Produits */}
            <div className="bg-[#1C1F21] rounded-3xl border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="px-6 py-4">Produit</th>
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4">Prix</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-neutral-500 font-mono text-sm"
                      >
                        Aucun produit trouvé.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-4">
                          {product.images?.cartThumbnail ? (
                            <img
                              src={product.images.cartThumbnail}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-black"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-500">
                              No img
                            </div>
                          )}
                          <div>
                            <p className="font-bold">{product.name}</p>
                            <p className="text-xs text-neutral-500 font-mono">
                              {product.subtitle || product.id}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-400 uppercase">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono">
                          {(product.price ?? product.priceUsd ?? 0)?.toLocaleString('fr-CM')} FCFA
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setCurrentProduct({ ...product });
                              setIsEditingProduct(true);
                            }}
                            className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-red-500 hover:text-red-400 transition-colors ml-2 cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            ONGLET 2 : GESTION DU LOOKBOOK
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'looks' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-300">
                  Looks du Lookbook
                </h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Affichez vos tenues complètes et permettez aux clients de commander en 1 clic
                </p>
              </div>
              {!isEditingLook && (
                <button
                  onClick={() => {
                    const nextNum = String(looks.length + 1).padStart(2, '0');
                    setCurrentLook({
                      number: nextNum,
                      name: `Look ${nextNum}`,
                      subtitle: 'Nouvelle inspiration C\'Kennedy',
                      badge: 'SUBLIMEZ VOTRE STYLE',
                      deliveryTag: 'LIVRAISON RAPIDE',
                      includedProductIds: products.slice(0, 2).map((p) => p.id),
                    });
                    setIsEditingLook(true);
                  }}
                  className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition-colors cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Nouveau Look
                </button>
              )}
            </div>

            {/* Formulaire d'Édition / Création de Look */}
            {isEditingLook ? (
              <div className="bg-[#1C1F21] p-8 rounded-3xl border border-white/10 animate-fade-in mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold uppercase">
                      {currentLook.id ? 'Éditer' : 'Créer'} un Look
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-1">
                      Configurez l'affiche et les articles inclus dans la tenue
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingLook(false)}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSaveLook} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Numéro du Look */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Numéro du Look
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none font-mono"
                        value={currentLook.number || ''}
                        placeholder="Ex: 01"
                        onChange={(e) =>
                          setCurrentLook({ ...currentLook, number: e.target.value })
                        }
                        required
                      />
                    </div>

                    {/* Nom / Titre du Look */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Titre du Look
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none"
                        value={currentLook.name || ''}
                        placeholder="Ex: C'Kennedy Core / Gamme Classique"
                        onChange={(e) =>
                          setCurrentLook({ ...currentLook, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sous-titre */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Sous-titre / Thème
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none"
                        value={currentLook.subtitle || ''}
                        placeholder="Ex: Élégance intemporelle & Couture moderne"
                        onChange={(e) =>
                          setCurrentLook({ ...currentLook, subtitle: e.target.value })
                        }
                      />
                    </div>

                    {/* Badge Central */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                        Badge Central sur l'Affiche
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white focus:outline-none"
                        value={currentLook.badge || ''}
                        placeholder="Ex: SUBLIMEZ VOTRE STYLE"
                        onChange={(e) =>
                          setCurrentLook({ ...currentLook, badge: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Photo Poster du Look */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                      Photo de l'Affiche du Look (Plein format vertical)
                    </label>
                    <div className="relative w-full bg-[#111315] border border-white/10 border-dashed rounded-xl px-4 py-3 text-sm flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />{' '}
                        {isImageUploading
                          ? 'Envoi de la photo en cours...'
                          : 'Choisir une photo sur votre appareil...'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleLookImageUpload}
                      />
                    </div>
                    {currentLook.heroImage && (
                      <div className="mt-3 flex items-center gap-4">
                        <img
                          src={currentLook.heroImage}
                          alt="Poster preview"
                          className="h-32 w-24 rounded-xl object-cover border border-white/20 shadow-md"
                        />
                        <span className="text-xs text-neutral-400 font-mono">
                          Aperçu de l'affiche du Look
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sélection des Produits Composant le Look */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-mono text-neutral-400 uppercase">
                        Produits inclus dans ce Look ({currentLook.includedProductIds?.length || 0}{' '}
                        sélectionnés)
                      </label>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Cochez les pièces qui composent la tenue
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-3 bg-[#111315] rounded-2xl border border-white/10">
                      {products.map((p) => {
                        const isIncluded = (currentLook.includedProductIds || []).includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => toggleIncludedProductInLook(p.id)}
                            className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                              isIncluded
                                ? 'bg-white/15 border-white text-white'
                                : 'bg-[#1C1F21] border-white/5 text-neutral-400 hover:border-white/20'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                                isIncluded ? 'bg-white text-black' : 'border border-white/20'
                              }`}
                            >
                              {isIncluded && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <img
                              src={p.images?.cartThumbnail || p.images?.primary}
                              alt={p.name}
                              className="w-9 h-9 rounded-lg object-cover bg-black flex-shrink-0"
                            />
                            <div className="truncate text-xs">
                              <p className="font-bold truncate text-white">{p.name}</p>
                              <p className="text-[10px] font-mono text-neutral-400">
                                {(p.price ?? p.priceUsd ?? 0)?.toLocaleString('fr-CM')} FCFA
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section Textes d'Angles Avancés (Collapsible) */}
                  <div className="border border-white/10 rounded-2xl p-4 bg-[#111315]/50">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedLookFields(!showAdvancedLookFields)}
                      className="w-full flex justify-between items-center text-xs font-mono uppercase text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <span>Textes des 4 coins de l'affiche (Optionnel)</span>
                      {showAdvancedLookFields ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {showAdvancedLookFields && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                        <div>
                          <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                            Coin Haut Gauche (Titre & Sous-titre)
                          </label>
                          <input
                            type="text"
                            placeholder="Titre (ex: C'KENNEDY // MODE)"
                            className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2 text-xs mb-1.5 focus:border-white focus:outline-none"
                            value={currentLook.topLeftTitle || ''}
                            onChange={(e) =>
                              setCurrentLook({ ...currentLook, topLeftTitle: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            placeholder="Sous-titre (ex: GAMME CLASSIQUE)"
                            className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-white focus:outline-none"
                            value={currentLook.topLeftSubtitle || ''}
                            onChange={(e) =>
                              setCurrentLook({ ...currentLook, topLeftSubtitle: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                            Coin Haut Droit (Titre & Sous-titre)
                          </label>
                          <input
                            type="text"
                            placeholder="Titre (ex: NOUVELLE SAISON)"
                            className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2 text-xs mb-1.5 focus:border-white focus:outline-none"
                            value={currentLook.topRightTitle || ''}
                            onChange={(e) =>
                              setCurrentLook({ ...currentLook, topRightTitle: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            placeholder="Sous-titre (ex: COLLECTION 2025)"
                            className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-white focus:outline-none"
                            value={currentLook.topRightSubtitle || ''}
                            onChange={(e) =>
                              setCurrentLook({ ...currentLook, topRightSubtitle: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                            Coin Bas Gauche (Titre & Sous-titre)
                          </label>
                          <input
                            type="text"
                            placeholder="Titre (ex: ÉLÉGANCE)"
                            className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2 text-xs mb-1.5 focus:border-white focus:outline-none"
                            value={currentLook.bottomLeftTitle || ''}
                            onChange={(e) =>
                              setCurrentLook({ ...currentLook, bottomLeftTitle: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            placeholder="Sous-titre (ex: INTEMPORELLE 2025)"
                            className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-white focus:outline-none"
                            value={currentLook.bottomLeftSubtitle || ''}
                            onChange={(e) =>
                              setCurrentLook({ ...currentLook, bottomLeftSubtitle: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-neutral-500 mb-1">
                            Coin Bas Droit (Titre & Sous-titre)
                          </label>
                          <input
                            type="text"
                            placeholder="Titre (ex: • VESTE & CHEMISE)"
                            className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2 text-xs mb-1.5 focus:border-white focus:outline-none"
                            value={currentLook.bottomRightTitle || ''}
                            onChange={(e) =>
                              setCurrentLook({ ...currentLook, bottomRightTitle: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            placeholder="Sous-titre (ex: COUPE AJUSTÉE)"
                            className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-white focus:outline-none"
                            value={currentLook.bottomRightSubtitle || ''}
                            onChange={(e) =>
                              setCurrentLook({
                                ...currentLook,
                                bottomRightSubtitle: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions du Look */}
                  <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingLook(false)}
                      className="px-6 py-2.5 rounded-full text-xs font-bold uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isLookLoading}
                      className="flex items-center gap-2 bg-white text-black px-8 py-2.5 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />{' '}
                      {isLookLoading ? 'Sauvegarde...' : 'Enregistrer le Look'}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {/* Grille / Liste des Looks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {looks.map((look) => {
                const includedCount = look.includedProductIds?.length || 0;
                return (
                  <div
                    key={look.id}
                    className="bg-[#1C1F21] rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all shadow-lg"
                  >
                    {/* Affiche Look */}
                    <div className="relative h-64 bg-neutral-900 overflow-hidden">
                      <img
                        src={look.heroImage}
                        alt={look.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white uppercase">
                        Look {look.number}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md p-2.5 rounded-xl">
                        <p className="text-[11px] font-bold text-white uppercase tracking-wider truncate">
                          {look.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono truncate">
                          {look.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Détails & Actions */}
                    <div className="p-4 flex items-center justify-between border-t border-white/10 bg-[#17191A]">
                      <div className="text-xs font-mono text-neutral-400">
                        <span className="font-bold text-white">{includedCount}</span>{' '}
                        {includedCount === 1 ? 'pièce liée' : 'pièces liées'}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setCurrentLook({ ...look });
                            setIsEditingLook(true);
                          }}
                          className="p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                          title="Modifier ce look"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLook(look.id)}
                          className="p-2 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Supprimer ce look"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
