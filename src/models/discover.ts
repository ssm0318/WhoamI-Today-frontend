export enum DiscoverFilter {
  follow = 'follow',
  MUTUAL_FRIENDS = 'mutual_friends',
  MUTUAL_TRAITS = 'mutual_traits',
}

export const DiscoverFilterLabel = {
  [DiscoverFilter.follow]: 'People I follow',
  [DiscoverFilter.MUTUAL_FRIENDS]: 'People I have mutual friends with',
  [DiscoverFilter.MUTUAL_TRAITS]: 'People I have mutual traits with',
};
