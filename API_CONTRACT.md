# Contrat API — C'Kennedy (Frontend React ⇄ Backend Spring Boot)

Document déduit du code **réel** du frontend (`src/config/api.ts`, `src/lib/http/*`,
`src/features/*/services/*`, `src/components/AdminDashboard.tsx`, `src/features/auth/services/authService.ts`).
Légende : ✅ appelé par l'interface aujourd'hui · 🟡 code présent mais non branché · 🆕 à créer côté front aussi.

---

## 0. Conventions générales

| Sujet | Règle imposée par le frontend |
|---|---|
| URL de base | `VITE_API_URL` (ex. `http://localhost:8080`). Vide = mode local (localStorage) |
| Format | JSON UTF-8, sauf `/api/upload` (multipart) |
| CORS | Autoriser l'origine du front (`http://localhost:3000` / `5173` en dev + domaine prod), méthodes `GET POST PUT DELETE OPTIONS`, headers `Authorization, Content-Type` |
| Timeout client | 8 s |
| Auth | Header `Authorization: Bearer <JWT>` envoyé automatiquement si un token existe |
| Erreur | Corps JSON `{ "message": "texte lisible en français" }` (le client affiche `message`). Champ optionnel `field` |
| Réponses vides | `204 No Content` accepté (DELETE, like/unlike) |
| **401** | ⚠️ Le client **efface le token et affiche « Session expirée »**. Renvoyer 401 **uniquement** pour token absent/invalide/expiré |
| Mauvais mot de passe | ⚠️ Renvoyer **400** (ou 422) avec `message`, **pas 401** (sinon message trompeur côté UI) |
| 403 | Rôle insuffisant (CLIENT qui appelle une route ADMIN) |
| Argent | **FCFA, entier** (pas de décimales). Type Java `Integer`/`Long`, jamais `Double` |
| IDs | **Chaînes** (`String`) : slug (`ckennedy-cargo-pant`) ou UUID. Le backend génère l'id à la création |

---

## 1. Authentification

### `POST /api/auth/login` ✅ — public
```json
// Requête
{ "email": "admin@ckennedy.com", "password": "********" }
// 200
{ "token": "<jwt>", "email": "admin@ckennedy.com", "name": "Propriétaire C'Kennedy", "role": "ADMIN" }
```
- `role` ∈ `"ADMIN" | "CLIENT"` (obligatoire : l'UI ouvre le panneau admin si `ADMIN`).
- Échec → `400 { "message": "Identifiants incorrects." }`.

### `POST /api/auth/register` ✅ — public (création compte client)
```json
// Requête (validations front : name ≥ 2 car., email valide, password ≥ 6 car.)
{ "name": "Jean Dupont", "email": "jean@mail.com", "password": "secret1" }
// 201 ou 200 — même corps que login (connexion directe)
{ "token": "<jwt>", "email": "jean@mail.com", "name": "Jean Dupont", "role": "CLIENT" }
```
- Le rôle est **toujours `CLIENT`** à l'inscription (ignorer tout `role` envoyé).
- Email déjà pris → `409` (ou 400) `{ "message": "Cette adresse email possède déjà un compte." }`.

### JWT
- Claims : `sub` = email, `role`, `exp` (ex. 24 h). Le front ne décode **pas** le JWT et ne vérifie pas `exp` : l'expiration se détecte par un `401`.
- Mots de passe : **BCrypt**. Compte admin créé par migration/variable d'environnement — **jamais** en dur dans le code ni dans l'UI.

---

## 2. Produits

### Modèle `Product` (JSON échangé)
```json
{
  "id": "ckennedy-cargo-pant",
  "name": "Pantalon Cargo",
  "subtitle": "Coupe droite",
  "category": "urbain",
  "price": 69600,
  "season": "Collection 2025",
  "badge": "Nouveau",
  "images": {
    "primary": "https://.../a.jpg",
    "secondary": "https://.../b.jpg",
    "detail": "https://.../c.jpg",
    "cartThumbnail": "https://.../a-small.jpg"
  },
  "sizes": ["S", "M", "L", "XL"],
  "colors": [ { "name": "Onyx Black", "hex": "#111315", "imageUrl": null } ],
  "description": "Texte libre modifiable par l'admin (retours à la ligne conservés).",
  "specs": [],
  "inStock": true,
  "isPublished": true,
  "rating": 0,
  "reviewsCount": 0,
  "createdAt": "2026-10-12T10:00:00Z",
  "updatedAt": "2026-10-12T10:00:00Z"
}
```

| Champ | Obligatoire | Notes |
|---|---|---|
| `id` | auto | généré par le backend (le front local génère `prod-<timestamp>`, à ignorer) |
| `name`, `category`, `price` | ✅ | `category` ∈ **`classique` \| `urbain` \| `accessories`** (orthographe exacte, `accessories` en anglais) |
| `subtitle`, `badge`, `season` | non | défaut `""` |
| `images.primary`, `images.cartThumbnail` | ✅ | URL (voir §5 pour les uploads) ; `secondary`/`detail` optionnels |
| `sizes` | non | liste libre ; valeurs proposées par l'admin : `XS S M L XL XXL`. **Vide autorisé** (accessoires) |
| `colors` | non | **Vide autorisé** ; `hex` = `#RRGGBB` |
| `description` | non | texte long (prévoir `TEXT`, front limite à 400 car. dans l'admin) |
| `inStock` | non | défaut `true` |
| `isPublished` | non | défaut `true`. Non publié = invisible du public |
| `rating`, `reviewsCount`, `specs` | non | **hérités** : plus affichés ni éditables. Défaut `0` / `0` / `[]`. Servent seulement de tri de secours « tendance » en mode local |
| `priceFcfa`, `priceUsd`, `priceEur` | — | **dépréciés** : le front envoie encore `priceFcfa` (= `price`) et peut envoyer `priceUsd`. **Accepter et ignorer** (config Jackson `FAIL_ON_UNKNOWN_PROPERTIES=false`). Renvoyer `price` (et `priceFcfa` identique si possible) |

### Endpoints

| Méthode | Route | Accès | Détail |
|---|---|---|---|
| `GET` | `/api/products` ✅ | public | Produits **publiés**. Si le token est **ADMIN** → renvoie **tous** (le panneau admin appelle cette route avec son token et gère publiés + brouillons). `?admin=true` accepté comme équivalent (🟡 service admin alternatif) |
| `GET` | `/api/products/{id}` ✅ | public | `404 { message }` si inconnu / non publié |
| `GET` | `/api/products/trending?limit=4` ✅ | public | Tableau de `Product` publiés, triés par popularité (likes) décroissante. **Route littérale** : à déclarer sans conflit avec `/{id}` |
| `POST` | `/api/products/{id}/like` ✅ | public | Incrémente le compteur de likes. Corps `{}`. `204`. Appelé quand un visiteur ajoute aux favoris (peut être anonyme) |
| `DELETE` | `/api/products/{id}/like` ✅ | public | Décrémente (min 0). `204` |
| `POST` | `/api/products` ✅ | ADMIN | Corps = `Product` sans `id` → `201` + `Product` créé |
| `PUT` | `/api/products/{id}` ✅ | ADMIN | Corps = objet **complet** modifié (le front renvoie tout, y compris `id`) ; accepter aussi un corps **partiel** (`{ "isPublished": false }`, `{ "inStock": false }`) → `200` + `Product` |
| `DELETE` | `/api/products/{id}` ✅ | ADMIN | `204` |

> Like : prévoir en base `likesCount` (entier). Le champ n'est pas encore dans le type TypeScript `Product` : le renvoyer en option est sans risque.
> Anti-abus conseillé : limite de débit par IP sur `/like`.

---

## 3. Lookbook

### Modèle `Look`
```json
{
  "id": "look-01",
  "number": "01",
  "name": "C'Kennedy Core / Gamme Classique",
  "subtitle": "Élégance intemporelle & Couture moderne",
  "date": "12/08/2024",
  "deliveryTag": "LIVRAISON MONDIALE",
  "badge": "SUBLIMEZ VOTRE STYLE",
  "heroImage": "https://.../look-01.jpg",
  "topLeftTitle": "C'KENNEDY // MODE",       "topLeftSubtitle": "GAMME CLASSIQUE",
  "topRightTitle": "NOUVELLE SAISON",        "topRightSubtitle": "COLLECTION",
  "bottomLeftTitle": "ÉLÉGANCE",             "bottomLeftSubtitle": "INTEMPORELLE 2025",
  "bottomRightTitle": "• VESTE & CHEMISE",   "bottomRightSubtitle": "COUPE AJUSTÉE",
  "includedProductIds": ["ckennedy-cargo-pant", "ckennedy-modular-sling"]
}
```
- Tous les champs texte sont des `String` (y compris `number` = `"01"` et `date`, affichée telle quelle : `jj/MM/aaaa`).
- `includedProductIds` : liste d'**ids de produits** (relation N-N ou `@ElementCollection`). Ids inconnus → ignorer ou `400`. Si un produit est supprimé, le retirer des looks.
- Valeurs par défaut utilisées par l'admin à la création : voir `handleSaveLook` (`AdminDashboard.tsx`).

| Méthode | Route | Accès | Détail |
|---|---|---|---|
| `GET` | `/api/looks` ✅ | public | Liste ordonnée (par `number`) |
| `GET` | `/api/looks/{id}` ✅ | public | `404` si inconnu |
| `POST` | `/api/looks` ✅ | ADMIN | `201` + `Look` (id généré) |
| `PUT` | `/api/looks/{id}` ✅ | ADMIN | objet complet, `200` + `Look` |
| `DELETE` | `/api/looks/{id}` ✅ | ADMIN | `204` |

---

## 4. Upload d'images

### `POST /api/upload` ✅ — ADMIN — `multipart/form-data`
| Champ | Type | Valeurs |
|---|---|---|
| `file` | fichier | JPEG / PNG / WebP, **≤ 5 Mo** (valider type MIME **et** extension) |
| `target` | texte | `hero` \| `products` \| `lookbook` (sous-dossier de stockage) |

```json
// 200
{ "url": "https://api.domaine.com/uploads/products/9f3a-cargo.jpg", "filename": "9f3a-cargo.jpg", "size": 183422 }
```
- Renommer le fichier (UUID) ; servir `/uploads/**` en statique (ou Cloudinary/S3).
- `Spring: spring.servlet.multipart.max-file-size=5MB`.
- **Côté front** : avec `VITE_API_URL`, le panneau admin envoie chaque image à cette route puis place l'`url` reçue dans `images.primary` / `images.cartThumbnail` (produit) ou `heroImage` (look). Le backend reçoit donc des **URLs**, jamais de base64. `target` vaut `products` pour les produits et `lookbook` pour les looks. L'`url` renvoyée doit être **absolue** (affichée telle quelle dans `<img src>`). Le front refuse en amont tout fichier non image ou > 5 Mo.

---

## 5. Hero (carrousel d'accueil) — 🟡 optionnel

Le composant `HeroSection` utilise aujourd'hui 3 images fixes (`/images/hero-*.png`) ; `heroService` / `useHeroSlides` existent mais ne sont **pas branchés**. À implémenter seulement si l'admin doit les gérer.

```json
{ "id": 0, "img": "https://.../hero.jpg", "label": "WINTER COLLECTION", "tag": "01 / 03", "order": 0 }
```
`GET /api/hero-slides` (public) · `POST` / `PUT /{id}` / `DELETE /{id}` (ADMIN). Ici `id` est **numérique**.

---

## 6. À créer des deux côtés (pas encore dans le frontend) 🆕

Proposition, car aujourd'hui la commande part uniquement par **WhatsApp** (`237696611623`, `CartDrawer.tsx`) et rien n'est enregistré.

### Commandes
`POST /api/orders` (public) → `201 { "id", "reference": "CKENNEDY-123456", "status": "NEW" }`
```json
{
  "customer": { "name": "…", "phone": "+237…", "city": "Douala", "address": "…" },
  "items": [ { "productId": "…", "size": "M", "color": "Onyx Black", "quantity": 2 } ],
  "promoCode": "CKENNEDY10"
}
```
- **Le backend recalcule tous les prix** depuis la base (ne jamais faire confiance au front) : sous-total, remise, livraison, total.
- `GET /api/orders` (ADMIN), `GET /api/orders/{id}` (ADMIN), `PUT /api/orders/{id}/status` (ADMIN) : `NEW → CONFIRMED → SHIPPED → DELIVERED | CANCELLED`.

### Règles métier aujourd'hui **codées en dur** dans le front
| Règle | Où | Valeur |
|---|---|---|
| Codes promo | `CartContext.tsx` | `CKENNEDY10` = −10 %, `WINTER25` = −25 % |
| Frais de livraison | `CartDrawer.tsx` | 2 000 FCFA |
| Livraison gratuite dès | `CartContext.tsx` | 90 000 FCFA |
→ à terme : `POST /api/promo/validate { code } → { valid, percent }` et `GET /api/settings → { shippingFee, freeShippingThreshold, whatsappNumber }` (modifiables par l'admin).

### Newsletter / Cercle Privé
`POST /api/newsletter { "email": "…" }` (public) → `201`. Aujourd'hui `NewsletterSection.tsx` affiche seulement un toast sans rien enregistrer. Dédoublonner sur l'email. `GET /api/newsletter` (ADMIN) pour l'export.

---

## 7. Récapitulatif des routes

| Méthode | Route | Accès | Statut front |
|---|---|---|---|
| POST | `/api/auth/login` | public | ✅ |
| POST | `/api/auth/register` | public | ✅ |
| GET | `/api/products` | public (ADMIN → tout) | ✅ |
| GET | `/api/products/{id}` | public | ✅ |
| GET | `/api/products/trending?limit=` | public | ✅ |
| POST / DELETE | `/api/products/{id}/like` | public | ✅ |
| POST | `/api/products` | ADMIN | ✅ |
| PUT | `/api/products/{id}` | ADMIN | ✅ |
| DELETE | `/api/products/{id}` | ADMIN | ✅ |
| GET | `/api/looks`, `/api/looks/{id}` | public | ✅ |
| POST / PUT / DELETE | `/api/looks[/{id}]` | ADMIN | ✅ |
| POST | `/api/upload` | ADMIN | ✅ |
| GET/POST/PUT/DELETE | `/api/hero-slides` | public / ADMIN | 🟡 |
| POST | `/api/orders` · GET/PUT admin | public / ADMIN | 🆕 |
| POST | `/api/newsletter` | public | 🆕 |
| POST | `/api/promo/validate` · GET `/api/settings` | public | 🆕 |

---

## 8. Sécurité côté Spring Boot (obligatoire)

1. **Toute autorisation est faite par le backend.** `authService.isAdmin()` du front lit `localStorage` (rôle + email) : c'est de l'affichage, contournable. Les routes ADMIN doivent vérifier le rôle du JWT (`@PreAuthorize("hasRole('ADMIN')")`).
2. Ne **jamais** autoriser l'inscription avec l'email admin ni un `role` fourni par le client.
3. Hash BCrypt, JWT signé (secret en variable d'environnement), expiration courte, réponses `401` / `403` conformes au §0.
4. Valider les entrées (Bean Validation) : `price ≥ 0`, `category` dans l'enum, tailles/couleurs bornées, `hex` valide, taille des textes.
5. Échapper/valider les URLs d'images ; vérifier le type réel des fichiers uploadés.
6. Rate limiting sur `/api/auth/*`, `/like`, `/newsletter`.

---

## 9. Écarts du frontend à corriger avant/pendant le branchement

| # | Sévérité | Constat | Où |
|---|---|---|---|
| 1 | ✅ corrigé | ~~Identifiants admin de démo visibles~~ : supprimés de `AdminLogin` / `AuthModal` (bouton, texte, placeholder). Le compte de test local vient de `.env.local` (`VITE_DEV_ADMIN_*`), actif **uniquement** en `npm run dev` sans backend, absent du build. `isAdmin()` se base sur le rôle renvoyé par le serveur, plus sur un email | `authService.ts`, `AdminLogin.tsx`, `AuthModal.tsx` |
| 2 | ✅ corrigé | ~~Repli silencieux sur le stockage local~~ : avec `VITE_API_URL`, toute erreur serveur est affichée (bannière rouge), le formulaire reste ouvert, la suppression n'est appliquée qu'après confirmation du serveur, un échec de chargement n'affiche plus de données locales périmées | `AdminDashboard.tsx` |
| 3 | ✅ corrigé | ~~Images en base64~~ : avec backend, les images produit et look passent par `POST /api/upload` (≤ 5 Mo, type image vérifié) et seule l'URL est envoyée. Sans backend : data-URL locale comme avant | `AdminDashboard.tsx` |
| 4 | 🟠 | Un `401` au login est affiché « Session expirée » → le backend doit répondre `400` (§0) ou le client être adapté | `lib/http/client.ts` |
| 5 | 🟠 | `isAuthenticated()` = « un token existe » (pas de contrôle d'expiration). Les appels de l'admin passent désormais par le client HTTP : un `401` déconnecte bien l'admin | `interceptors.ts` |
| 6 | 🟡 | Deux panneaux admin : celui utilisé (`AdminDashboard`) et un autre **non utilisé** (`features/admin/*`, `useProductAdmin`, `useUpload`) → supprimer ou fusionner | `src/features/admin` |
| 7 | 🟡 | Champs hérités `priceUsd`, `priceEur`, `rating`, `reviewsCount`, `specs`, `season` encore dans les types alors que l'UI ne les gère plus | `types/index.ts` |
| 8 | 🟡 | Promo / livraison codés en dur, commande non enregistrée, newsletter non enregistrée (§6) | `CartContext.tsx`, `CartDrawer.tsx`, `NewsletterSection.tsx` |

*Vérification effectuée : `npx tsc --noEmit` ne signale aucune erreur.*

---

## 10. Schéma de base suggéré (JPA)

- `users(id, name, email UNIQUE, password_hash, role)`
- `products(id VARCHAR PK, name, subtitle, category, price INT, season, badge, description TEXT, in_stock, is_published, likes_count INT, rating, reviews_count, image_primary TEXT, image_secondary TEXT, image_detail TEXT, image_cart_thumbnail TEXT, created_at, updated_at)`
- `product_sizes(product_id, size)` · `product_colors(product_id, name, hex, image_url)` · `product_specs(product_id, spec)`
- `looks(id VARCHAR PK, number, name, subtitle, date_label, delivery_tag, badge, hero_image TEXT, top_left_title, top_left_subtitle, top_right_title, top_right_subtitle, bottom_left_title, bottom_left_subtitle, bottom_right_title, bottom_right_subtitle)` · `look_products(look_id, product_id)`
- 🆕 `orders`, `order_items`, `newsletter_subscribers(email UNIQUE, created_at)`, `hero_slides(id BIGINT, img, label, tag, sort_order)`
