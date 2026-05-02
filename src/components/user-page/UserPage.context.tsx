import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mutate } from 'swr';
import { useShallow } from 'zustand/react/shallow';
import { useViewAs, useViewAsUser } from '@components/view-as/PreviewModeContext';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getUserProfile } from '@utils/apis/user';

interface Props {
  children?: ReactNode | ReactNode[];
  usernameOverride?: string;
}

export const UserPageContext = createContext<{
  user: FetchState<UserProfile>;
  updateUser: () => Promise<void>;
  refreshAfterFriendshipChange: () => Promise<void>;
}>({
  user: { state: 'loading' },
  updateUser: async () => {},
  refreshAfterFriendshipChange: async () => {},
});

export function UserPageContextProvider({ children, usernameOverride }: Props) {
  const params = useParams();
  const username = usernameOverride ?? params.username;
  const viewAs = useViewAs();
  const viewAsUser = useViewAsUser();
  const { featureFlags } = useBoundStore(useShallow(UserSelector));
  const useAllPosts = !!featureFlags?.questionResponseFeature;

  const [user, setUser] = useState<FetchState<UserProfile>>({ state: 'loading' });

  const updateUser = useCallback(async () => {
    if (!username) {
      setUser({ state: 'hasError' });
      return;
    }

    try {
      const res = await getUserProfile(username, viewAs, viewAsUser);
      setUser({ state: 'hasValue', data: res });
    } catch (error) {
      setUser({ state: 'hasError' });
      mutate((key) => typeof key === 'string' && key.startsWith('/user/friends/'), undefined);
    }
  }, [username, viewAs, viewAsUser]);
  useAsyncEffect(updateUser, [username, viewAs, viewAsUser]);

  const refreshAfterFriendshipChange = useCallback(async () => {
    if (!username) {
      await updateUser();
      return;
    }
    const encoded = encodeURIComponent(username);
    await Promise.all([
      updateUser(),
      mutate(useAllPosts ? `/user/${encoded}/all-posts/` : `/user/${encoded}/notes/`),
    ]);
  }, [username, useAllPosts, updateUser]);

  const value = useMemo(
    () => ({
      user,
      updateUser,
      refreshAfterFriendshipChange,
    }),
    [user, updateUser, refreshAfterFriendshipChange],
  );

  return <UserPageContext.Provider value={value}>{children}</UserPageContext.Provider>;
}
