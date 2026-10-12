import { useState, useEffect } from 'react';
import { getLooks } from '../services/lookService';
import { loadLooks } from '../../../data/localProductStore';
import type { Look } from '../types';

interface UseLooksReturn {
  looks:   Look[];
  loading: boolean;
  error:   string | null;
  refetch: () => void;
}

export function useLooks(): UseLooksReturn {
  const [looks,   setLooks]   = useState<Look[]>(() => loadLooks());
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLooks();
      setLooks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load looks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { looks, loading, error, refetch: fetch };
}
