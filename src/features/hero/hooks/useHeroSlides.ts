// ─── useHeroSlides ────────────────────────────────────────────────────────────
// Manages hero slides state. Components never call services directly.

import { useState, useEffect } from 'react';
import { getHeroSlides } from '../services/heroService';
import { HERO_SLIDES_FALLBACK } from '../data/slides';
import type { HeroSlide } from '../types';

interface UseHeroSlidesReturn {
  slides:  HeroSlide[];
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

export function useHeroSlides(): UseHeroSlidesReturn {
  const [slides,  setSlides]  = useState<HeroSlide[]>(HERO_SLIDES_FALLBACK);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHeroSlides();
      setSlides(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load slides');
      // keep fallback data displayed on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { slides, loading, error, refetch: fetch };
}
