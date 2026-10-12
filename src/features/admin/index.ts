// Admin feature exports
export { useUpload }           from './hooks/useUpload';
export { useProductAdmin }     from './hooks/useProductAdmin';
export { ProductAdminPanel }   from './components/ProductAdminPanel';
export { uploadImage }         from './services/uploadService';
export { adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from './services/productAdminService';
export type { UploadTarget, UploadResponse } from './services/uploadService';
