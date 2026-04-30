import useSWR from 'swr';
import { getUserProfile } from '@utils/apis/user';

/**
 * Lazy-loads mutuals + mutual traits for a target user via the existing
 * `/user/{username}/profile/` endpoint. The fetch is gated by `enabled`
 * so feed cards mount with zero network traffic; the request only fires
 * when the viewer opens a mutual-info popup, and SWR caches the response
 * so reopening the same popup is instant.
 */
export function useUserProfileMutuals(username: string, enabled: boolean) {
  const { data, isLoading } = useSWR(
    enabled && username ? `/user/${username}/profile/|mutuals` : null,
    () => getUserProfile(username),
  );

  return {
    mutuals: data?.mutuals ?? [],
    mutualInterests: data?.mutual_interests ?? [],
    mutualPersonas: data?.mutual_personas ?? [],
    isLoading,
  };
}
