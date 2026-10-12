// ─── Upload Service ───────────────────────────────────────────────────────────
// Sends image files to Spring Boot which saves them and returns a public URL.

import { http } from '../../../lib/http';
import { ENDPOINTS } from '../../../config/api';

export interface UploadResponse {
  url:      string;
  filename: string;
  size:     number;
}

export type UploadTarget = 'hero' | 'products' | 'lookbook';

export async function uploadImage(
  file: File,
  target: UploadTarget
): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('target', target);
  return http.upload<UploadResponse>(ENDPOINTS.upload, form);
}
