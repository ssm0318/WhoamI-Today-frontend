import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import FriendStatus from '@components/_common/friend-status/FriendStatus';
import Icon from '@components/_common/icon/Icon';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { Connection } from '@models/api/friends';
import { MyProfile } from '@models/api/user';
import { areFriends, isMyProfile, UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getUserProfile } from '@utils/apis/user';
import CheckInSection from '../check-in/CheckIn';
import InterestChip from './interest/InterestChip';
import MoreAboutBottomSheet from './more-about-bottom-sheet/MoreAboutBottomSheet';
import MutualFriendsInfo from './mutual-friends-info/MutualFriendsInfo';
import PersonaChip from './persona/PersonaChip';
import PinnedPostsSection from './pinned-posts-section/PinnedPostsSection';
import BioPlaceholder from './placeholders/BioPlaceholder';
import PronounPlaceholder from './placeholders/PronounPlaceholder';

interface ProfileProps {
  user?: UserProfile | MyProfile;
}

function Profile({ user }: ProfileProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  const { featureFlags, myProfile } = useBoundStore(useShallow(UserSelector));
  const isMyPage = user?.id === myProfile?.id;
  const [friendData, setFriendData] = useState<UserProfile | null>(null);

  const { username } = useParams();
  const navigate = useNavigate();

  const handleClickEditProfile = (e: MouseEvent) => {
    e.stopPropagation();
    return navigate('/settings/edit-profile');
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

  const [showMoreAbout, setShowMoreAbout] = useState(false);

  // Friends-only visibility: backend strips hidden fields for non-friends
  const isNonFriend = user && !isMyPage && !isMyProfile(user) && !areFriends(user);

  // For non-friends, friendData fields come pre-stripped from the backend:
  // - username → "****" when name_friends_only
  // - pronouns → null when pronouns_friends_only
  // - bio → null when bio_friends_only
  // - user_interests → [] when interests_friends_only
  // - user_personas → [] when persona_friends_only

  // Display name (real name): from backend for non-friends (may be "****"), from myProfile for own page
  const displayedName = isMyPage ? myProfile?.name : friendData?.name;

  const hasInterestsOrPersonas =
    (user?.user_interests && user.user_interests.length > 0) ||
    (user?.user_personas && user.user_personas.length > 0);

  return (
    <Layout.FlexCol w="100%" gap={8}>
      <Layout.FlexRow w="100%" gap={8}>
        <Layout.FlexRow>
          <ProfileImage imageUrl={user?.profile_image} username={username} size={80} expandible />
        </Layout.FlexRow>
        <Layout.FlexCol gap={8} w="100%">
          <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
            <Layout.FlexRow w="100%" gap={8} alignItems="center">
              <Layout.FlexRow alignItems="center" gap={4}>
                <Typo type="title-large" numberOfLines={1}>
                  {username || ''}
                </Typo>
                {displayedName && (
                  <Typo type="label-medium" color="MEDIUM_GRAY" numberOfLines={1}>
                    ({displayedName})
                  </Typo>
                )}
              </Layout.FlexRow>
              {/** friend connection badge */}
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
          {/* pronouns + connection degree */}
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
          ) : isNonFriend && friendData ? (
            // Non-friend: show "pronouns | Nth degree connection"
            <Layout.FlexRow alignItems="center" gap={4}>
              {friendData.pronouns && <Typo type="label-medium">{friendData.pronouns}</Typo>}
              {friendData.pronouns &&
                friendData.friendship_level &&
                friendData.friendship_level !== '1st' && (
                  <Typo type="label-medium" color="MEDIUM_GRAY">
                    |
                  </Typo>
                )}
              {friendData.friendship_level && friendData.friendship_level !== '1st' && (
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {friendData.friendship_level === '2nd'
                    ? t('connection.second_degree')
                    : t('connection.third_degree')}
                </Typo>
              )}
            </Layout.FlexRow>
          ) : (
            // Friend: show pronouns in parentheses
            friendData?.pronouns && (
              <Layout.FlexRow alignItems="center">
                <Typo type="label-medium">(</Typo>
                <Typo type="label-medium" numberOfLines={1}>
                  {friendData.pronouns}
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

          {/* See more details */}
          {featureFlags?.persona && hasInterestsOrPersonas && (
            <Layout.FlexRow onClick={() => setShowMoreAbout(true)} style={{ cursor: 'pointer' }}>
              <Typo type="label-medium" color="PRIMARY">
                {t('see_more_details')}
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexCol>
      </Layout.FlexRow>

      {featureFlags?.persona && isMyPage && (
        <PinnedPostsSection pinnedPostsCount={myProfile?.pinned_cnt ?? 0} />
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
          {/* Mutual traits for non-friend users (from discover context) */}
          {!isMyProfile(user) &&
            !areFriends(user) &&
            friendData &&
            ((friendData.mutual_interests && friendData.mutual_interests.length > 0) ||
              (friendData.mutual_personas && friendData.mutual_personas.length > 0)) && (
              <Layout.FlexCol gap={8} w="100%">
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {t('shared_traits')}
                </Typo>
                <Layout.FlexRow w="100%" gap={6} style={{ flexWrap: 'wrap' }}>
                  {friendData.mutual_interests?.map((interest) => (
                    <InterestChip key={interest.id} interest={interest.content} />
                  ))}
                  {friendData.mutual_personas?.map((persona) => (
                    <PersonaChip key={persona.id} persona={persona.content} />
                  ))}
                </Layout.FlexRow>
              </Layout.FlexCol>
            )}
        </>
      )}
      {/* 체크인 (status) */}
      {featureFlags?.checkIn && user && <CheckInSection user={user} />}

      {/* More about bottom sheet */}
      {user && showMoreAbout && (
        <MoreAboutBottomSheet
          visible={showMoreAbout}
          onClose={() => setShowMoreAbout(false)}
          user={user}
          username={isMyPage ? myProfile?.username || '' : username || ''}
          isMyPage={isMyPage}
        />
      )}
    </Layout.FlexCol>
  );
}

export default Profile;
