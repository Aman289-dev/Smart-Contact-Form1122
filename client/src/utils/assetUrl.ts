// Uploaded files are served by the API under /api/uploads, on the same origin.
export function getAssetUrl(filePath: string | null | undefined): string {
  if (!filePath) return '';
  return `/api/${String(filePath).replace(/^\//, '')}`;
}
