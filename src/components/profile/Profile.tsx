import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import FriendStatus from '@components/_common/friend-status/FriendStatus';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import useInfiniteFetchFriends from '@hooks/useInfiniteFetchFriends';
import useInfiniteFetchUserFriends from '@hooks/useInfiniteFetchUserFriends';
import { Connection } from '@models/api/friends';
import { MyProfile } from '@models/api/user';
import { areFriends, isMyProfile, UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getUserProfile } from '@utils/apis/user';
import CheckInSection from '../check-in/CheckIn';
import MutualFriendsInfo from './mutual-friends-info/MutualFriendsInfo';
import PersonaChip from './persona/PersonaChip';
import BioPlaceholder from './placeholders/BioPlaceholder';
import PersonaPlaceholder from './placeholders/PersonaPlaceholder';
import PronounPlaceholder from './placeholders/PronounPlaceholder';

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

  const handleClickEditProfile = (e: MouseEvent) => {
    e.stopPropagation();
    return navigate('/settings/edit-profile');
  };

  const { allFriends } = useInfiniteFetchFriends();
  const { allFriends: friendFriends } = useInfiniteFetchUserFriends(username);

  const handleClickFriendList = () => {
    if (isMyPage) {
      if (allFriends?.[0].count === 0) return;
      return navigate('/my/friends/list');
    }
    if (friendFriends?.[0].count === 0) return;
    navigate(`friends/list`);
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

  // persona 영역 collapse ui 구현
  const personaContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPersonaContainerExpanded, setIsPersonaContainerExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [chipHeight, setChipHeight] = useState(0);

  useEffect(() => {
    if (!personaContainerRef.current) return;

    const container = personaContainerRef.current;
    const firstRowHeight = container.firstElementChild
      ? container.firstElementChild.clientHeight
      : 0;

    setChipHeight(firstRowHeight);
  }, [user?.persona]);

  useEffect(() => {
    if (!personaContainerRef.current) return;
    if (chipHeight === 0) return;

    const container = personaContainerRef.current;
    const isOverflow = container.scrollHeight > container.clientHeight;

    setIsOverflowing(isOverflow);
  }, [chipHeight, user?.persona]);

  return (
    <Layout.FlexCol w="100%" gap={16}>
      <Layout.FlexRow w="100%" gap={8}>
        <Layout.FlexRow>
          <ProfileImage imageUrl={user?.profile_image} username={username} size={80} expandible />
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
              <Layout.FlexRow
                w="100%"
                alignItems="center"
                gap={2}
                justifyContent="flex-end"
                onClick={handleClickEditProfile}
              >
                <SvgIcon name="edit_filled" fill="DARK_GRAY" size={16} />
                <Typo type="label-medium" color="DARK_GRAY" underline>
                  {t('edit_profile')}
                </Typo>
              </Layout.FlexRow>
            )}
          </Layout.FlexRow>
          {/* 친구 수 */}
          {featureFlags?.friendFeed && (isMyPage || (user && areFriends(user))) && (
            <button type="button" onClick={handleClickFriendList}>
              <Typo type="label-medium" color="DARK_GRAY" underline>
                {isMyPage ? allFriends?.[0].count : friendFriends?.[0].count} {t('friends')}
              </Typo>
            </button>
          )}
          {/* pronouns */}
          {isMyPage ? (
            !myProfile?.pronouns ? (
              <PronounPlaceholder />
            ) : (
              <Layout.FlexRow alignItems="center">
                <Typo type="label-medium">(</Typo>
                <Typo type="label-medium" numberOfLines={1}>
                  {myProfile?.pronouns}
                </Typo>
                <Typo type="label-medium">)</Typo>
              </Layout.FlexRow>
            )
          ) : (
            friendData?.pronouns && (
              <Layout.FlexRow alignItems="center">
                <Typo type="label-medium">(</Typo>
                <Typo type="label-medium" numberOfLines={1}>
                  {friendData?.pronouns}
                </Typo>
                <Typo type="label-medium">)</Typo>
              </Layout.FlexRow>
            )
          )}

          {/* bio */}
          {isMyPage ? (
            !myProfile?.bio ? (
              <BioPlaceholder />
            ) : (
              <Layout.FlexCol w="100%">
                <Typo type="body-medium" numberOfLines={2}>
                  {myProfile?.bio}
                </Typo>
              </Layout.FlexCol>
            )
          ) : (
            friendData?.bio && (
              <Layout.FlexCol w="100%">
                <Typo type="body-medium" numberOfLines={2}>
                  {friendData.bio}
                </Typo>
              </Layout.FlexCol>
            )
          )}
        </Layout.FlexCol>
      </Layout.FlexRow>
      {featureFlags?.persona && (
        <Layout.FlexCol w="100%">
          {user && (areFriends(user) || isMyPage) && user?.persona && user?.persona.length > 0 ? (
            <Layout.FlexRow w="100%">
              <Layout.FlexRow
                w="100%"
                gap={8}
                alignItems="center"
                style={{
                  position: 'relative',
                  flexWrap: 'wrap',
                  maxHeight: isPersonaContainerExpanded ? 'none' : `${chipHeight + 8}px`,
                  overflow: isPersonaContainerExpanded ? 'visible' : 'hidden',
                }}
                ref={personaContainerRef}
              >
                {user?.persona.map((persona) => (
                  <PersonaChip key={persona} persona={persona} />
                ))}
              </Layout.FlexRow>
              <Layout.LayoutBase style={{ visibility: isOverflowing ? 'visible' : 'hidden' }}>
                <Icon
                  name={isPersonaContainerExpanded ? 'expand_close' : 'expand_open'}
                  size={24}
                  onClick={() => setIsPersonaContainerExpanded((prev) => !prev)}
                />
              </Layout.LayoutBase>
            </Layout.FlexRow>
          ) : (
            isMyPage && <PersonaPlaceholder />
          )}
        </Layout.FlexCol>
      )}
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
