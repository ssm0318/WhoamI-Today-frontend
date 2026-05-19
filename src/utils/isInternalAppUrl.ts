// Hosts that should route in-app via React Router instead of opening
// externally. Update this list if a new app domain ships.
const INTERNAL_HOSTS = new Set([
  'whoami.gina-park.site',
  'whoami-test-group.gina-park.site',
  'localhost',
  '127.0.0.1',
]);

export interface InternalUrl {
  pathname: string;
  search: string;
  hash: string;
}

/**
 * If `raw` parses as an absolute URL whose host is one of our app hosts,
 * return the in-app path/search/hash. Otherwise return null.
 *
 * Relative URLs (no host) are treated as internal — they're already paths.
 */
export function parseInternalAppUrl(raw: string): InternalUrl | null {
  if (!raw) return null;

  // Try absolute parse first. If it has no protocol, URL() throws —
  // fall through to the relative-path branch.
  try {
    const u = new URL(raw);
    if (INTERNAL_HOSTS.has(u.hostname)) {
      return { pathname: u.pathname, search: u.search, hash: u.hash };
    }
    return null;
  } catch {
    // Not an absolute URL. Treat anything starting with "/" as an in-app path.
    if (raw.startsWith('/')) {
      const [pathPart, hashPart = ''] = raw.split('#');
      const [pathname, searchPart = ''] = pathPart.split('?');
      return {
        pathname,
        search: searchPart ? `?${searchPart}` : '',
        hash: hashPart ? `#${hashPart}` : '',
      };
    }
    return null;
  }
}
