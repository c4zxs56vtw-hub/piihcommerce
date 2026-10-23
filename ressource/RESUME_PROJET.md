# 📋 Résumé d'Avancement du Projet — C'Kennedy E-Commerce

> **Dernière mise à jour :** Octobre 2026  
> **Architecture :** Frontend React + Vite + TypeScript | Backend Spring Boot 4 (Java 17) + PostgreSQL  
> **API de Production :** `https://ckennedy.yohandave.blitz.cloud`  
> **Numéro WhatsApp Commandes :** `+237 696 61 16 23`

---

## 1. Ce qui a déjà été fait ✅

### 🎨 Identité Visuelle, Marque & Devise
- **Rebranding complet** sous le nom **"C'Kennedy"** (SEO, titres, composants, en-têtes, pied de page).
- **Devise adaptée au Cameroun** : affichage et calculs en **FCFA (`fr-CM`)** sur l'ensemble du catalogue, du panier et des fiches produits.

### 🛍️ Boutique & Expérience Client (Frontend)
- **Catalogue Produits (`ProductCatalog.tsx`)** : filtrage par catégorie (`Tout voir`, `Classique`, `Urbain`, `Accessoires`), état vide propre lorsque aucun article n'est publié, modale d'aperçu détaillé (`ProductDetailModal.tsx`).
- **Section Favoris / Les Plus Aimés (`TopGearSection.tsx`)** : classement dynamique relié à `/api/products/trending` avec compteur de cœurs (`likesCount`) synchronisé en temps réel (`POST`/`DELETE /api/products/{id}/like`).
- **Lookbook & Studio (`LookbookCarousel.tsx` & `LookbookStudioModal.tsx`)** : présentation des tenues complètes et ajout groupé au panier.
- **Suppression totale des données fictives** :
  - Catalogue local (`src/data/products.ts`), looks (`src/data/looks.ts`) et slides (`src/features/hero/data/slides.ts`) vidés de toute donnée de démonstration.
  - Suppression du composant inutilisé `VideoModal.tsx`.
  - Masquage automatique des sections Lookbook et Favoris tant qu'aucune donnée n'est publiée.

### 🛒 Panier & Tunnel de Commande WhatsApp
- **Persistance locale** du panier (`ckennedy_cart_v1`) et de la liste de souhaits (`ckennedy_wishlist_v1`) dans `localStorage`.
- **Commande précise via WhatsApp (`CartDrawer.tsx`)** :
  - Formulaire client complet : Nom complet, Téléphone, Ville & Quartier de livraison, Mode de paiement préféré (*Orange Money*, *MTN MoMo*, *Espèces à la livraison*), et Notes/Instructions.
  - Génération d'une facture textuelle détaillée (articles, tailles, couleurs, quantités, prix unitaire, sous-total, livraison, total en FCFA, liens des photos produits).
  - Redirection directe vers `https://wa.me/237696611623`.

### 🔐 Authentification, Sécurité & Administration
- **Système d'inscription et connexion (`AuthModal.tsx` & `AdminLogin.tsx`)** :
  - Inscription client (`POST /api/auth/register`) et connexion (`POST /api/auth/login`).
  - Vérification stricte du rôle `ADMIN` pour accéder au tableau de bord (`/#admin` ou `/admin`). Un compte `CLIENT` est automatiquement bloqué sur l'écran de connexion admin.
- **État d'authentification réactif (`src/hooks/useAuth.ts` & `src/lib/http/interceptors.ts`)** :
  - Mise à jour instantanée du `Header`, des modales et de `App.tsx` à chaque connexion, déconnexion ou expiration de session.
  - Décodage de la date d'expiration (`exp`) du JWT et nettoyage complet du stockage local à la déconnexion.
- **Tableau de bord Administrateur (`AdminDashboard.tsx`)** :
  - Création, modification, publication/dépublication, gestion du stock et suppression des produits et des looks.
  - Upload d'images vers le backend (`POST /api/upload`).

### ⚙️ Backend Spring Boot & Base PostgreSQL (`IdeaProjects\apipiih`)
- **Contrat OpenAPI P0 implémenté** :
  - Authentification JWT (`AuthController`, `AuthService`, `JwtService`, `JwtAuthenticationFilter`, `SecurityConfig`).
  - CRUD Produits, Trending et Likes (`ProductController`, `ProductService`, `ProductEntity`, `ProductMapper`).
  - CRUD Lookbook (`LookController`, `LookService`, `LookEntity`, `LookMapper`).
  - Upload de fichiers jusqu'à 5 Mo (`UploadController`, `UploadService`) servis sur `/uploads/**`.
- **Corrections Base de Données & Production** :
  - Colonnes d'URLs d'images (`image_primary`, `image_secondary`, `image_detail`, `cart_thumbnail`, `hero_image`, `image_url`) passées en type `TEXT` pour supporter les URLs longues (> 255 caractères).
  - `DataInitializer.java` configuré pour garantir la création du compte administrateur au démarrage et nettoyer automatiquement les anciens produits/looks de démonstration.
  - Configuration de `.env.production` sur le frontend (`VITE_API_URL=https://ckennedy.yohandave.blitz.cloud`) et délai d'attente HTTP relevé à 25 secondes (`src/config/api.ts`).

---

## 2. Ce qu'il reste à faire ⏳

### 🚀 1. Finaliser le déploiement en production (Priorité Haute)
- [ ] **Pousser les derniers changements Git** sur `main` (Backend `apipiih` et Frontend `site ecommer piih`).
- [ ] **Vérifier que le serveur Blitz Cloud (`https://ckennedy.yohandave.blitz.cloud`) est bien démarré** et ne renvoie plus `503 Service Unavailable`.
- [ ] **Définir les variables d'environnement définitives sur l'hébergeur (Blitz Cloud)** :
  - `CKENNEDY_JWT_SECRET` : une clé secrète unique d'au moins 32 caractères.
  - `CKENNEDY_ADMIN_EMAIL` : ton adresse email administrateur définitive.
  - `CKENNEDY_ADMIN_PASSWORD` : un mot de passe fort (pour remplacer le mot de passe de développement `Ck-dev-2026!`).
  - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` : identifiants de la base PostgreSQL de production.

### 🖼️ 2. Stockage persistant des images uploadées
- [ ] Actuellement, `POST /api/upload` enregistre les images dans le dossier `uploads/` du serveur. Sur un hébergeur cloud en conteneur, ce dossier peut être réinitialisé à chaque redéploiement :
  - **Option A :** Attacher un volume disque persistant sur Blitz Cloud monté sur le dossier `uploads` (`UPLOAD_DIR`).
  - **Option B :** Brancher un service de stockage d'images externe (ex. Cloudinary ou AWS S3) dans `UploadService.java`.

### 📦 3. Alimentation du vrai catalogue C'Kennedy
- [ ] Se connecter à l'interface d'administration (`/#admin`) en production et créer les **vrais produits** (noms, prix en FCFA, photos, tailles, couleurs, descriptions).
- [ ] Créer les **vrais looks** du Lookbook en les associant aux produits créés.
- [ ] Remplacer si besoin les 3 images statiques de présentation dans `public/images/` (`hero-1.png`, `hero-2.jpg`, `hero-3.png`) par les photos officielles de la marque.

### 🔒 4. Durcissement sécurité & Fonctionnalités P1 (Optionnel / Phase 2)
- [ ] **CORS en production** : dans `SecurityConfig.java` et `WebConfig.java`, remplacer `allowedOriginPatterns("*")` par le domaine exact du site frontend (ex: `https://ton-site.vercel.app`) une fois l'URL finale fixée.
- [ ] **Historique des commandes en base (`/api/orders`)** : enregistrer chaque commande en base PostgreSQL au moment du clic sur « Commander sur WhatsApp » pour suivre les ventes dans l'admin.
- [ ] **Newsletter (`/api/newsletter`) & Codes Promo (`/api/promo/validate`)** : relier le formulaire de pied de page et le champ code promo du panier au backend si tu souhaites les utiliser.
- [ ] **Gestion des slides Hero (`/api/hero-slides`)** : ajouter un onglet dans l'admin pour modifier les bannières d'accueil sans toucher au code.
