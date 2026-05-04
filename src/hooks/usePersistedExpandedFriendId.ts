import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getItemFromSessionStorage, setItemToSessionStorage } from '@utils/sessionStorage';

const SESSION_STORAGE_KEY = 'WHOAMI_TODAY_FRIENDS_EXPANDED_ID';

type ExpandedId = number | null;

const readInitial = (): ExpandedId => {
  const stored = getItemFromSessionStorage<ExpandedId>(SESSION_STORAGE_KEY, null);
  return typeof stored === 'number' || stored === null ? stored : null;
};

export function usePersistedExpandedFriendId(): [ExpandedId, Dispatch<SetStateAction<ExpandedId>>] {
  const [expandedFriendId, setExpandedFriendId] = useState<ExpandedId>(readInitial);

  useEffect(() => {
    setItemToSessionStorage<ExpandedId>(SESSION_STORAGE_KEY, expandedFriendId);
  }, [expandedFriendId]);

  return [expandedFriendId, setExpandedFriendId];
}
