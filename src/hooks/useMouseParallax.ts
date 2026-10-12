import { useState, useEffect } from 'react';

interface Offset { x: number; y: number }

/**
 * Returns a normalised {x, y} mouse offset relative to viewport centre.
 * @param strength  multiplier — increase for more dramatic effect
 */
export function useMouseParallax(strength = 10): Offset {
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      setOffset({
        x: ((e.clientX - cx) / cx) * strength,
        y: ((e.clientY - cy) / cy) * strength,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [strength]);

  return offset;
}
