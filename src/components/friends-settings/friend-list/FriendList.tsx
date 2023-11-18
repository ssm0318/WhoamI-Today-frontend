import { useTranslation } from 'react-i18next';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import FriendItem from '@components/friends-settings/friend-item/FriendItem';
import { Font, Layout } from '@design-system';
import useFriendList from '@hooks/useFriendList';

function FriendList() {
  const [t] = useTranslation('translation');

  const { friendList, isLoading, iniFiniteLoadingRef, fetchFriends } = useFriendList();

  if (!friendList) return <Loader />;
  return (
    <Layout.FlexCol w="100%" ph={10} gap={8}>
      <Font.Body type="14_regular" color="GRAY_12" ml={5} mb={2}>
        {t('settings.friends.friend_list.title', { number: friendList.length })}
      </Font.Body>
      <Layout.FlexCol w="100%" gap={8}>
        {friendList.length > 0 ? (
          <>
            {friendList.map((friend) => (
              <FriendItem key={friend.id} type="friends" user={friend} updateList={fetchFriends} />
            ))}
            <div ref={iniFiniteLoadingRef} />
            {isLoading && <Loader />}
          </>
        ) : (
          <NoContents text={t('no_contents.friends')} ph={10} />
        )}
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default FriendList;
