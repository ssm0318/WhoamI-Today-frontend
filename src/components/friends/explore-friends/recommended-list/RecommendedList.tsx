import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendItem from '@components/friends/explore-friends/friend-item/FriendItem';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { User } from '@models/user';
import { getRecommendedFriends } from '@utils/apis/user';

export default function RecommendedList() {
  const [t] = useTranslation('translation');

  const [recommendedList, setRecommendedList] = useState<User[]>();

  const fetchFriends = useCallback(async () => {
    const data = await getRecommendedFriends();
    setRecommendedList(data);
  }, []);
  useAsyncEffect(fetchFriends, [fetchFriends]);

  const updateList = () => {
    console.log('TODO: updateList');
  };

  if (!recommendedList) return <Loader />;
  return (
    <Layout.FlexCol w="100%" pv={12} ph={16} gap={4}>
      <Layout.LayoutBase pv={13}>
        <Typo type="body-medium" color="MEDIUM_GRAY" ml={5} mb={2}>
          {t('friends.explore_friends.recommended_list.title', { number: recommendedList.length })}
        </Typo>
      </Layout.LayoutBase>
      {recommendedList.length > 0 ? (
        <>
          {recommendedList.map((friend) => (
            <FriendItem
              key={friend.id}
              type="recommended"
              user={friend}
              onClickConfirm={updateList}
              onClickDelete={fetchFriends}
            />
          ))}
        </>
      ) : (
        <NoContents text={t('no_contents.friends')} />
      )}
    </Layout.FlexCol>
  );
}
