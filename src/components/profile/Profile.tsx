import { MouseEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import ChatRequestButton from '@components/_common/chat-request-button/ChatRequestButton';
import FriendStatus from '@components/_common/friend-status/FriendStatus';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SubscriptionPopup from '@components/friends/subscription-popup/SubscriptionPopup';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useChipCategories } from '@hooks/useChipCategories';
import { Connection } from '@models/api/friends';
import { MyProfile } from '@models/api/user';
import { normalizeChipText } from '@models/chips';
import { areFriends, isMyProfile, UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { getUserProfile } from '@utils/apis/user';
import CheckInSection from '../check-in/CheckIn';
import CategoryChip from './chip/CategoryChip';
import MoreAboutBottomSheet from './more-about-bottom-sheet/MoreAboutBottomSheet';
import MutualFriendsInfo from './mutual-friends-info/MutualFriendsInfo';
import PinnedPostsSection from './pinned-posts-section/PinnedPostsSection';
import BioPlaceholder from './placeholders/BioPlaceholder';
import InterestPlaceholder from './placeholders/InterestPlaceholder';
import PronounPlaceholder from './placeholders/PronounPlaceholder';
import PronounsBioPlaceholder from './placeholders/PronounsBioPlaceholder';

interface ProfileProps {
  user?: UserProfile | MyProfile;
}

function Profile({ user }: ProfileProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });
  const { categories } = useChipCategories();

  const { featureFlags, myProfile } = useBoundStore(useShallow(UserSelector));
  const isMyPage = user?.id === myProfile?.id;
  const [friendData, setFriendData] = useState<UserProfile | null>(null);
  const subscriptionBellEnabled = !!featureFlags?.[FeatureFlagKey.SUBSCRIPTION_POPUP];
  const isFriendUser = !!user && !isMyProfile(user) && areFriends(user);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  const { updateUser } = useContext(UserPageContext);

  const { username } = useParams();
  const navigate = useNavigate();

  const handleOpenSubscriptionPopup = (e: MouseEvent) => {
    e.stopPropagation();
    setShowSubscriptionPopup(true);
  };

  const handleCloseSubscriptionPopup = () => {
    setShowSubscriptionPopup(false);
    updateUser?.();
  };

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

  // Friends-only visibility: hide fields for non-friends if marked as friends-only
  const isFriend = user && !isMyProfile(user) && areFriends(user);
  const canSeeFriendsOnly = isMyPage || isFriend;

  const showName = canSeeFriendsOnly || !(friendData as any)?.name_friends_only;
  const showPronouns = canSeeFriendsOnly || !friendData?.pronouns_friends_only;
  const showBio = canSeeFriendsOnly || !friendData?.bio_friends_only;

  // Backend already filters user_interests / user_personas per-category for non-friends,
  // so presence of items is the source of truth for whether to render the sections.
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
              <Layout.FlexCol gap={2}>
                {/* Name or masked */}
                <Typo type="title-large" numberOfLines={1}>
                  {isMyPage
                    ? (myProfile as any)?.name || myProfile?.username || ''
                    : showName
                    ? (friendData as any)?.name || username || ''
                    : '****'}
                </Typo>
                {/* Pronouns | Degree inline */}
                {!isMyPage && (
                  <Layout.FlexRow gap={4} alignItems="center">
                    {showPronouns && friendData?.pronouns && (
                      <Typo type="label-medium" color="DARK_GRAY">
                        {friendData.pronouns}
                      </Typo>
                    )}
                    {showPronouns &&
                      friendData?.pronouns &&
                      friendData?.connection_degree &&
                      !featureFlags?.postsVerQ && (
                        <Typo type="label-medium" color="MEDIUM_GRAY">
                          |
                        </Typo>
                      )}
                    {friendData?.connection_degree && !featureFlags?.postsVerQ && (
                      <Typo type="label-medium" color="DARK_GRAY">
                        {friendData.connection_degree === 2
                          ? '2nd degree connection'
                          : '3rd+ degree connection'}
                      </Typo>
                    )}
                  </Layout.FlexRow>
                )}
              </Layout.FlexCol>
              {/** connections badge for friends */}
              {user && !isMyProfile(user) && areFriends(user) && (
                <>
                  {user.connection_status && (
                    <SvgIcon
                      name={
                        user.connection_status === Connection.CLOSE_FRIEND
                          ? 'close_friend'
                          : 'default_friend'
                      }
                      size={16}
                      onClick={handleClickChangeConnection}
                    />
                  )}
                  {subscriptionBellEnabled && isFriendUser && (
                    <button
                      type="button"
                      onClick={handleOpenSubscriptionPopup}
                      aria-label={t('check_in_subscription.aria.subscribe') ?? ''}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: 16,
                        lineHeight: 1,
                        cursor: 'pointer',
                      }}
                    >
                      🔔
                    </button>
                  )}
                  {subscriptionBellEnabled && isFriendUser && (
                    <SubscriptionPopup
                      isOpen={showSubscriptionPopup}
                      onClose={handleCloseSubscriptionPopup}
                      friendId={user.id}
                      username={user.username}
                      currentVersion={myProfile?.current_ver}
                    />
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
          {/* pronouns + bio (my page only — friend page shows inline above) */}
          {isMyPage ? (
            !myProfile?.pronouns && !myProfile?.bio ? (
              <PronounsBioPlaceholder />
            ) : (
              <>
                {myProfile?.pronouns ? (
                  <Layout.FlexRow alignItems="center">
                    <Typo type="label-medium" color="DARK_GRAY">
                      {myProfile.pronouns}
                    </Typo>
                  </Layout.FlexRow>
                ) : (
                  <PronounPlaceholder />
                )}
                {myProfile?.bio ? (
                  <Layout.FlexCol w="100%">
                    <Typo type="body-medium" numberOfLines={2}>
                      {myProfile.bio}
                    </Typo>
                  </Layout.FlexCol>
                ) : (
                  <BioPlaceholder />
                )}
              </>
            )
          ) : (
            showBio &&
            friendData?.bio && (
              <Layout.FlexCol w="100%">
                <Typo type="body-medium" numberOfLines={2}>
                  {friendData.bio}
                </Typo>
              </Layout.FlexCol>
            )
          )}

          {/* interests placeholder (my page only, when user has no interests) */}
          {!featureFlags?.postsVerQ &&
            isMyPage &&
            (myProfile?.user_interests ?? []).length === 0 && <InterestPlaceholder />}

          {/* See more details */}
          {!featureFlags?.postsVerQ &&
            featureFlags?.persona &&
            (isMyPage || (user && areFriends(user))) &&
            hasInterestsOrPersonas && (
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
            <>
              <FriendStatus
                type="user"
                user={user}
                onClickCancelRequest={reloadPage}
                onClickRequest={reloadPage}
                onClickConfirm={reloadPage}
                onClickReject={reloadPage}
                isUserPage
              />
              <ChatRequestButton user={user} />
            </>
          )}
          <MutualFriendsInfo mutualFriends={(user as UserProfile).mutuals} />
          {/* Mutual traits for non-friend users (from discover context) */}
          {!featureFlags?.postsVerQ &&
            !isMyProfile(user) &&
            !areFriends(user) &&
            friendData &&
            ((friendData.mutual_interests && friendData.mutual_interests.length > 0) ||
              (friendData.mutual_personas && friendData.mutual_personas.length > 0)) && (
              <Layout.FlexCol gap={8} w="100%">
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {t('shared_traits')}
                </Typo>
                <Layout.FlexRow w="100%" gap={6} style={{ flexWrap: 'wrap' }}>
                  {[
                    ...(friendData.mutual_interests ?? []),
                    ...(friendData.mutual_personas ?? []),
                  ].map((trait) => {
                    const matchedCat = categories.find((cat) =>
                      cat.chips.some(
                        (c) => normalizeChipText(c) === normalizeChipText(trait.content),
                      ),
                    );
                    return (
                      <CategoryChip
                        key={trait.id}
                        label={trait.content}
                        category={matchedCat?.key ?? categories[0].key}
                        isSelected
                      />
                    );
                  })}
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
