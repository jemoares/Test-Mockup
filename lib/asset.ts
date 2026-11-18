// Prefixes asset paths with the version basePath in production export.
// Empty in dev, so `npm run dev` serves assets at /assets/... unchanged.
export const asset = (p: string): string =>
  (process.env.NEXT_PUBLIC_BASE_PATH || "") + p;
