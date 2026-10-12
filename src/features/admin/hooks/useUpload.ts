// ─── useUpload ────────────────────────────────────────────────────────────────
// Hook used by the admin panel to upload images from the client's phone.

import { useState } from 'react';
import { uploadImage } from '../services/uploadService';
import type { UploadTarget, UploadResponse } from '../services/uploadService';

interface UseUploadReturn {
  upload:    (file: File, target: UploadTarget) => Promise<UploadResponse | null>;
  uploading: boolean;
  error:     string | null;
  result:    UploadResponse | null;
  reset:     () => void;
}

export function useUpload(): UseUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [result,    setResult]    = useState<UploadResponse | null>(null);

  const upload = async (file: File, target: UploadTarget) => {
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const res = await uploadImage(file, target);
      setResult(res);
      return res;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => { setError(null); setResult(null); };

  return { upload, uploading, error, result, reset };
}
