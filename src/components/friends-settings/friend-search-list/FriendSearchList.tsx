import { useEffect, useState } from 'react';
import Loader from '@components/_common/loader/Loader';
import FriendItem from '@components/friends-settings/friend-item/FriendItem';
import { Layout } from '@design-system';
import { UserProfile } from '@models/user';
import { searchUser } from '@utils/apis/user';

interface Props {
  query: string;
}

export default function FriendSearchList({ query }: Props) {
  const [searchList, setSearchList] = useState<UserProfile[]>();
  useEffect(() => {
    if (!query) return;
    searchUser(query).then(({ results }) => {
      setSearchList(results ?? []);
    });
  }, [query]);

  if (!searchList) return <Loader />;
  return (
    <Layout.FlexCol w="100%" pl={10} pr={10} gap={8}>
      {searchList.length > 0 ? (
        <>
          {searchList.map((user) => (
            <FriendItem key={user.id} type="search" user={user} />
          ))}
        </>
      ) : (
        <>TODO: Not Found</>
      )}
    </Layout.FlexCol>
  );
}
