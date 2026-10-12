// ─── Hero Service ─────────────────────────────────────────────────────────────
// Fetches hero slides from Spring Boot or returns local fallback.

import { http } from '../../../lib/http';
import { ENDPOINTS, hasBackend } from '../../../config/api';
import { HERO_SLIDES_FALLBACK } from '../data/slides';
import type { HeroSlide } from '../types';

export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (!hasBackend()) return HERO_SLIDES_FALLBACK;
  return http.get<HeroSlide[]>(ENDPOINTS.heroSlides);
}

export async function createHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<HeroSlide> {
  return http.post<HeroSlide>(ENDPOINTS.heroSlides, slide);
}

export async function updateHeroSlide(id: number, slide: Partial<HeroSlide>): Promise<HeroSlide> {
  return http.put<HeroSlide>(`${ENDPOINTS.heroSlides}/${id}`, slide);
}

export async function deleteHeroSlide(id: number): Promise<void> {
  return http.delete(`${ENDPOINTS.heroSlides}/${id}`);
}
