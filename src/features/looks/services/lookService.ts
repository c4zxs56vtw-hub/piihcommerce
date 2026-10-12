import { http } from '../../../lib/http';
import { ENDPOINTS, hasBackend } from '../../../config/api';
import { loadLooks } from '../../../data/localProductStore';
import type { Look } from '../types';

export async function getLooks(): Promise<Look[]> {
  if (!hasBackend()) return loadLooks();
  return http.get<Look[]>(ENDPOINTS.looks);
}

export async function getLookById(id: string): Promise<Look | undefined> {
  if (!hasBackend()) return loadLooks().find((l) => l.id === id);
  return http.get<Look>(`${ENDPOINTS.looks}/${id}`);
}
