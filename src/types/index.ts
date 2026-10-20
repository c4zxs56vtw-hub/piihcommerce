export type Currency = 'FCFA' | 'XAF' | 'EUR' | 'USD';

// Gammes C'Kennedy
export type Category = 'all' | 'classique' | 'urbain' | 'accessories';

// Catégories backend (valeurs stockées en base)
export type ProductCategory = 'classique' | 'urbain' | 'accessories';

export interface ProductColor {
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface ProductImage {
  primary: string;
  secondary?: string;
  detail?: string;
  cartThumbnail: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number; // Prix en FCFA (standard pour l'entité Java Spring Boot et DTO)
  priceFcfa?: number; // Alias explicite FCFA
  priceUsd?: number; // Alias rétrocompatible
  priceEur?: number;
  season: string;
  badge?: string;
  images: ProductImage;
  sizes: string[];
  colors: ProductColor[];
  description: string;
  specs: string[];
  inStock: boolean;
  rating?: number;
  reviewsCount?: number;
  likesCount?: number;
  // Champs gérés par le backend
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  isPublished?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface Look {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  date: string;
  deliveryTag: string;
  badge: string;
  heroImage: string;
  topLeftTitle: string;
  topLeftSubtitle: string;
  topRightTitle: string;
  topRightSubtitle: string;
  bottomLeftTitle: string;
  bottomLeftSubtitle: string;
  bottomRightTitle: string;
  bottomRightSubtitle: string;
  includedProductIds: string[];
}

// ─── Types Admin ──────────────────────────────────────────────────────────────
export interface CreateProductDto {
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number; // Prix en FCFA (standard pour l'entité Java Spring Boot et DTO)
  priceFcfa?: number; // Alias explicite FCFA
  priceUsd?: number; // Alias rétrocompatible
  priceEur?: number;
  season: string;
  badge?: string;
  images: ProductImage;
  sizes: string[];
  colors: ProductColor[];
  description: string;
  specs: string[];
  inStock: boolean;
  isPublished: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ApiError {
  message: string;
  status: number;
  field?: string;
}
