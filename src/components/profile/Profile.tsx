import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import FriendStatus from '@components/_common/friend-status/FriendStatus';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import { Connection } from '@models/api/friends';
import { MyProfile } from '@models/api/user';
import { areFriends, isMyProfile, UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getUserProfile } from '@utils/apis/user';
import CheckInSection from '../check-in/CheckIn';
import MutualFriendsInfo from './mutual-friends-info/MutualFriendsInfo';

interface ProfileProps {
  user?: UserProfile | MyProfile;
}

function Profile({ user }: ProfileProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  const { featureFlags } = useBoundStore(UserSelector);

  const { myProfile } = useBoundStore((state) => ({ myProfile: state.myProfile }));
  const isMyPage = user?.id === myProfile?.id;
  const [friendData, setFriendData] = useState<UserProfile | null>(null);

  const { username } = useParams();
  const navigate = useNavigate();

  const handleClickEditProfile = () => {
    return navigate('/settings/edit-profile');
  };

  // TODO 친구의 friends를 가져오는 것도 처리가 필요함 (숫자 표기를 위해)
  const { allFriends } = useInfiniteFetchFriends();

  const handleClickFriendList = () => {
    if (isMyPage) return navigate('/my/friends/list');
    if (allFriends?.[0].count === 0) return;
    navigate(`users/${username}/friends/list`);
  };

  useAsyncEffect(async () => {
    if (isMyPage || !username) return;
    const friend = await getUserProfile(username);

    setFriendData(friend);
  }, [isMyPage, username]);

  const reloadPage = () => window.location.reload();

  const [showEditConnectionsModal, setShowEditConnectionsModal] = useState(false);

  const closeEditConnectionsModal = () => setShowEditConnectionsModal(false);

  const handleClickChangeConnection = async () => {
    if (!user || isMyProfile(user) || !areFriends(user)) return;

    setShowEditConnectionsModal(true);
  };

  return (
    <Layout.FlexCol w="100%" gap={16}>
      <Layout.FlexRow w="100%" gap={8}>
        <Layout.FlexRow>
          <ProfileImage imageUrl={user?.profile_image} username={username} size={80} />
        </Layout.FlexRow>
        <Layout.FlexCol gap={8} w="100%">
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
            <Layout.FlexRow w="100%" gap={8} alignItems="center">
              <Layout.FlexRow alignItems="center" gap={4}>
                {/* username */}
                <Typo type="title-large" numberOfLines={1}>
                  {isMyPage ? myProfile?.username || '' : username || ''}
                </Typo>
              </Layout.FlexRow>
              {/** connections */}
              {user && !isMyProfile(user) && areFriends(user) && (
                <>
                  {user.connection_status && (
                    <Layout.FlexRow
                      onClick={handleClickChangeConnection}
                      bgColor="SECONDARY"
                      pl={10}
                      pr={8}
                      pv={5}
                      rounded={8}
                      gap={5}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typo type="label-large" color="BLACK">
                        {user.connection_status === Connection.FRIEND
                          ? t('connection.friend')
                          : t('connection.close_friend')}
                      </Typo>
                      <Icon name="chevron_down" size={18} color="BLACK" />
                    </Layout.FlexRow>
                  )}
                  {showEditConnectionsModal && (
                    <EditConnectionsBottomSheet
                      user={user}
                      visible={showEditConnectionsModal}
                      closeBottomSheet={closeEditConnectionsModal}
                    />
                  )}
                </>
              )}
            </Layout.FlexRow>
            {/* edit icon */}
            {isMyPage && (
              <SvgIcon
                name="edit_filled"
                fill="DARK_GRAY"
                size={24}
                onClick={handleClickEditProfile}
              />
            )}
          </Layout.FlexRow>
          {/* pronouns */}
          {(isMyPage ? myProfile?.pronouns : friendData?.pronouns) && (
            <Layout.FlexRow alignItems="center">
              <Typo type="label-medium">(</Typo>
              <Typo type="label-medium" numberOfLines={1}>
                {isMyPage ? myProfile?.pronouns : friendData?.pronouns}
              </Typo>
              <Typo type="label-medium">)</Typo>
            </Layout.FlexRow>
          )}
          {/* 친구 수 */}
          {featureFlags?.friendFeed && (
            <button type="button" onClick={handleClickFriendList}>
              <Typo type="label-medium" color="DARK_GRAY" underline>
                {allFriends?.[0].count} {t('friends')}
              </Typo>
            </button>
          )}
          {/* bio */}
          {user?.bio && (
            <Layout.FlexCol w="100%">
              <Typo type="body-medium" numberOfLines={2}>
                {user.bio}
              </Typo>
            </Layout.FlexCol>
          )}
        </Layout.FlexCol>
      </Layout.FlexRow>
      {!isMyPage && user && (
        <>
          {!isMyProfile(user) && !areFriends(user) && (
            <FriendStatus
              type="user"
              user={user}
              onClickCancelRequest={reloadPage}
              onClickRequest={reloadPage}
              onClickConfirm={reloadPage}
              onClickReject={reloadPage}
              isUserPage
            />
          )}
          <MutualFriendsInfo mutualFriends={(user as UserProfile).mutuals} />
        </>
      )}
      {/* 체크인 (status) */}
      {featureFlags?.checkIn && user && <CheckInSection user={user} />}
    </Layout.FlexCol>
  );
}

export default Profile;
