// ─── Local fallback data ───────────────────────────────────────────────────────
// Used when no backend is configured (VITE_API_URL is empty).
// Replace these URLs with your own images when ready.

import type { HeroSlide } from '../types';

export const HERO_SLIDES_FALLBACK: HeroSlide[] = [
  {
    id: 0,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfc5uFY9trryNAgjnmsb7ndbHIvDWlChz-x7bVoF_c7ZBPsM6vL07g_6XY440wX5YrPNIB9b1E-TJv2hUSyDT69LG2Fw6hnTmTVM6HT5Rxu_l-_WqvPJdacC-b7iYLa74WsBbHrk555DVgoYzrVh54QWJKtezg8FeH4wc3ZDSYUElfe93g36IJpOSE1pJthPgX-BBjZQQVWWvYPqQ95urSuh7EtdbGq3khTJiCDPpNwIG1RojmZLPYiQ',
    label: 'WINTER COLLECTION',
    tag: '01 / 03',
    order: 0,
  },
  {
    id: 1,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAddC5iYK9ywj0Ecd6GNqDm4JU8F0sQtPTo58812RqIx7BIASvPJXEZHem9jaBXHROcXg7ZY6Pf9jCyAWu4rtW2B1ufqsvW8ew_5pgdUgPgYVQGdO8xTLRX83uHyaeZ-Ev68ttKvMgzkCWNgNmrMyPXYoYuMAvZNflz0a_mlQOVNZfp1QpnKs-eYQ4gBBfGNSuaBnsx4TBhLkOzuIRz9CqGes-9iVjc9zbFyzUYgzmFPGiQGgVM_mLmxQ',
    label: 'STUDIO EDITION',
    tag: '02 / 03',
    order: 1,
  },
  {
    id: 2,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9bLiOJEmQ_xElT-HzdVG4FN8VSnqY9wdz2gI30vt1hbDqJVbNJ7JsRNwcMB7cBdKeZOe88CZUn1fvzK59ZytdaMwceAzdXvwj79sE4UJVsPBnWqQH2Omxtdf1ditooVZllFqy8GN4dODIIYwfvSLaECGTeD3gQ1UbQYwvUOTh9tww0UP5LUppgE57NO-nPi_ydC84md4nEuJKN3LorfdxOntvItLr3GizWGOJaGqgD-BVThCIjdk9Rg',
    label: 'PERFORMANCE LAB',
    tag: '03 / 03',
    order: 2,
  },
];
