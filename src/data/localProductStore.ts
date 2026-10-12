// ─── Stockage local des produits et du lookbook ─────────────────────────────
// Tant que le backend Spring Boot n'est pas branché, les produits et les looks
// créés ou modifiés par l'administrateur sont enregistrés dans le navigateur
// (localStorage) et utilisés par toute la boutique.

import { PRODUCTS } from './products';
import { LOOKS } from './looks';
import type { Product, Look } from '../types';

const PRODUCTS_STORAGE_KEY = 'ckennedy_products_v1';
const LOOKS_STORAGE_KEY = 'ckennedy_looks_v1';

// ─── Gestion Produits ────────────────────────────────────────────────────────
/** Retourne les produits enregistrés par l'admin, sinon le catalogue par défaut. */
export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((p: any) => ({
          ...p,
          price: p.price ?? p.priceUsd ?? p.priceFcfa ?? 0,
          priceFcfa: p.priceFcfa ?? p.price ?? p.priceUsd ?? 0,
        })) as Product[];
      }
    }
  } catch {
    // Données corrompues ou localStorage indisponible → catalogue par défaut
  }
  return PRODUCTS;
}

/** Enregistre la liste complète des produits. Retourne false si l'espace est plein. */
export function saveProducts(products: Product[]): boolean {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch {
    return false;
  }
}

/** Remet le catalogue produits d'origine. */
export function resetProducts(): Product[] {
  localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  return PRODUCTS;
}

// ─── Gestion Lookbook ────────────────────────────────────────────────────────
/** Retourne les looks enregistrés par l'admin, sinon les looks par défaut. */
export function loadLooks(): Look[] {
  try {
    const raw = localStorage.getItem(LOOKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Look[];
    }
  } catch {
    // Fallback par défaut
  }
  return LOOKS;
}

/** Enregistre la liste complète des looks. */
export function saveLooks(looks: Look[]): boolean {
  try {
    localStorage.setItem(LOOKS_STORAGE_KEY, JSON.stringify(looks));
    return true;
  } catch {
    return false;
  }
}

/** Remet les looks d'origine. */
export function resetLooks(): Look[] {
  localStorage.removeItem(LOOKS_STORAGE_KEY);
  return LOOKS;
}

/**
 * Convertit une image choisie par l'admin en texte (data URL) redimensionné,
 * pour qu'elle reste visible après un rechargement de la page.
 */
export function imageFileToDataUrl(file: File, maxSize = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image invalide'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(reader.result as string);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
