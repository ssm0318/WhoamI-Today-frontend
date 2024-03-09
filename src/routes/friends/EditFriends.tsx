import { useTranslation } from 'react-i18next';
import Icon from '@components/_common/icon/Icon';
import { Loader } from '@components/_common/loader/Loader.styled';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { UpdatedFriendItemWrapper } from '@components/friends/updated-friend-item/UpdatedFriendItem.styled';
import SubHeader from '@components/sub-header/SubHeader';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { addFriendToFavorite, deleteFavorite, hideFriend } from '@utils/apis/friends';
import updateFriendsList from '@utils/updateFriendsList';
import useInfiniteFetchFriends from './_hooks/useInfiniteFetchFriends';

function EditFriends() {
  const [t] = useTranslation('translation', { keyPrefix: 'friends.edit_friends' });

  const { isLoadingMoreAllFriends, allFriends, setAllFriends, fetchAllFriends, targetRef } =
    useInfiniteFetchFriends({ filterHidden: false });

  useAsyncEffect(fetchAllFriends);

  const handleToggleFavorite = (userId: number, is_favorite: boolean) => async () => {
    try {
      if (is_favorite) {
        updateFriendsList({ userId, type: 'is_favorite', value: false, setAllFriends });
        await deleteFavorite(userId);
        return;
      }
      updateFriendsList({ userId, type: 'is_favorite', value: true, setAllFriends });
      await addFriendToFavorite(userId);
    } catch {
      // TODO
    }
  };

  const handleToggleHide = (userId: number, is_hidden: boolean) => async () => {
    try {
      if (is_hidden) {
        updateFriendsList({ userId, type: 'is_hidden', value: false, setAllFriends });
        // TODO: 숨김 취소 API
        return;
      }
      updateFriendsList({ userId, type: 'is_hidden', value: true, setAllFriends });
      await hideFriend(userId);
    } catch {
      // TODO
    }
  };

  const handleClickDelete = () => {
    // TODO
  };

  return (
    <>
      <SubHeader title={t('title')} />
      <Layout.FlexCol
        w="100%"
        h="100vh"
        justifyContent="flex-start"
        bgColor="WHITE"
        pv={12}
        mb={BOTTOM_TABBAR_HEIGHT + 10}
      >
        {allFriends.state === 'loading' && <Loader />}
        {allFriends.state === 'hasValue' && (
          <>
            {allFriends.data?.results?.map(
              ({ id, username, profile_image, is_hidden, is_favorite }) => (
                <UpdatedFriendItemWrapper key={username}>
                  <Layout.FlexRow gap={8}>
                    {is_hidden ? (
                      <Icon
                        name="star_outline"
                        size={20}
                        padding={12}
                        color="MEDIUM_GRAY"
                        disabled
                      />
                    ) : (
                      <Icon
                        name={is_favorite ? 'star' : 'star_outline'}
                        size={20}
                        padding={12}
                        color="NO_STATUS_CHIP"
                        onClick={handleToggleFavorite(id, is_favorite)}
                      />
                    )}
                    <Layout.FlexRow gap={8} alignItems="center">
                      <ProfileImage imageUrl={profile_image} username={username} size={44} />
                      <Typo type="title-small">{username}</Typo>
                    </Layout.FlexRow>
                  </Layout.FlexRow>
                  <Layout.FlexRow>
                    <Icon
                      name={is_hidden ? 'hide_true' : 'hide_false'}
                      size={44}
                      onClick={handleToggleHide(id, is_hidden)}
                    />
                    <Icon name="close" size={16} padding={14} onClick={handleClickDelete} />
                  </Layout.FlexRow>
                </UpdatedFriendItemWrapper>
              ),
            )}
            {isLoadingMoreAllFriends && allFriends.data.next && <Loader />}
            <div ref={targetRef} />
          </>
        )}
      </Layout.FlexCol>
    </>
  );
}

export default EditFriends;
