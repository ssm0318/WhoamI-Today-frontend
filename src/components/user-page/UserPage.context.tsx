import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useViewAs, useViewAsUser } from '@components/view-as/PreviewModeContext';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { UserProfile } from '@models/user';
import { getUserProfile } from '@utils/apis/user';

interface Props {
  children?: ReactNode | ReactNode[];
  usernameOverride?: string;
}

export const UserPageContext = createContext<{
  user: FetchState<UserProfile>;
  updateUser: () => Promise<void>;
}>({
  user: { state: 'loading' },
  updateUser: async () => {},
});

export function UserPageContextProvider({ children, usernameOverride }: Props) {
  const params = useParams();
  const username = usernameOverride ?? params.username;
  const viewAs = useViewAs();
  const viewAsUser = useViewAsUser();

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
    }
  }, [username, viewAs, viewAsUser]);
  useAsyncEffect(updateUser, [username, viewAs, viewAsUser]);

  const value = useMemo(
    () => ({
      user,
      updateUser,
    }),
    [user, updateUser],
  );

  return <UserPageContext.Provider value={value}>{children}</UserPageContext.Provider>;
}
