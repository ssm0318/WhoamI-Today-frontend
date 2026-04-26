import { VisibilityTier } from '@models/viewAs';

export const withViewAs = (url: string, viewAs: VisibilityTier | null | undefined): string => {
  if (!viewAs) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}view_as=${encodeURIComponent(viewAs)}`;
};
