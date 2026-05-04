import { Dispatch, SetStateAction, useState } from 'react';

type ExpandedId = number | null;

/**
 * Tracks which friend card is currently expanded. Resets to `null` on every
 * mount of FriendsList so a page reload (or navigating away and back) lands
 * with all accordions closed — including the My-card sentinel `-1`. The
 * earlier sessionStorage-backed implementation kept My open across reloads
 * which felt sticky; in-tab toggling within a single mount still works
 * exactly the same because the state lives in the component.
 */
export function usePersistedExpandedFriendId(): [ExpandedId, Dispatch<SetStateAction<ExpandedId>>] {
  const [expandedFriendId, setExpandedFriendId] = useState<ExpandedId>(null);
  return [expandedFriendId, setExpandedFriendId];
}
