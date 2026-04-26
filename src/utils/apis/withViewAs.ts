import { VisibilityTier } from '@models/viewAs';

interface ViewAsParams {
  viewAs?: VisibilityTier | null;
  viewAsUser?: string | null;
}

/**
 * Append View As query parameters to a URL.
 *
 * - `viewAsUser` takes precedence: when set, appends `?view_as_user=<username>` only.
 *   Backend uses that user as the shadow viewer (real friendship status, real mutuals).
 * - `viewAs` (tier mode) is used when `viewAsUser` is not set: appends `?view_as=<tier>`.
 *   Used for the synthetic "Public stranger" preview where there's no specific viewer.
 * - When both are null/undefined, the URL is returned unchanged.
 *
 * The two modes are mutually exclusive on the backend — passing both is an error
 * we silently avoid here.
 */
export const withViewAs = (url: string, params: ViewAsParams = {}): string => {
  const { viewAs, viewAsUser } = params;
  if (viewAsUser) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}view_as_user=${encodeURIComponent(viewAsUser)}`;
  }
  if (viewAs) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}view_as=${encodeURIComponent(viewAs)}`;
  }
  return url;
};
