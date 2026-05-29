export const getSafeSignInNext = (next: string | null | undefined): string | null => {
  if (!next) return null;
  if (!next.startsWith('/') || next.startsWith('//')) return null;
  return next;
};
