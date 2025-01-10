import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { UserProfile } from '@models/user';
import { getUserProfile } from '@utils/apis/user';

interface Props {
  children?: ReactNode | ReactNode[];
}

export const UserPageContext = createContext<{
  user: FetchState<UserProfile>;
  updateUser: () => Promise<void>;
}>({
  user: { state: 'loading' },
  updateUser: async () => {},
});

export function UserPageContextProvider({ children }: Props) {
  const { username } = useParams();

  const [user, setUser] = useState<FetchState<UserProfile>>({ state: 'loading' });

  const updateUser = useCallback(async () => {
    console.log('update User');
    if (!username) {
      setUser({ state: 'hasError' });
      return;
    }

    try {
      const res = await getUserProfile(username);
      setUser({ state: 'hasValue', data: res });
    } catch (error) {
      setUser({ state: 'hasError' });
    }
  }, [username]);
  useAsyncEffect(updateUser, [username]);

  const value = useMemo(
    () => ({
      user,
      updateUser,
    }),
    [user, updateUser],
  );

  return <UserPageContext.Provider value={value}>{children}</UserPageContext.Provider>;
}
