import { MouseEvent, ReactNode, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import ChatRequestButton from '@components/_common/chat-request-button/ChatRequestButton';
import FriendStatus from '@components/_common/friend-status/FriendStatus';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import SubscriptionPopup from '@components/friends/subscription-popup/SubscriptionPopup';
import EditConnectionsBottomSheet from '@components/profile/edit-connections/EditConnectionsBottomSheet';
import { UserPageContext } from '@components/user-page/UserPage.context';
import { useIsPreviewMode, useViewAs, useViewAsUser } from '@components/view-as/PreviewModeContext';
import { FeatureFlagKey } from '@constants/featureFlag';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { useChipCategories } from '@hooks/useChipCategories';
import { Connection } from '@models/api/friends';
import { MyProfile } from '@models/api/user';
import { normalizeChipText } from '@models/chips';
import { areFriends, isMyProfile, receivedFriendRequest, UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { editProfile } from '@utils/apis/my';
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
  const [tViewAs] = useTranslation('translation', { keyPrefix: 'view_as' });
  const { categories } = useChipCategories();

  const { featureFlags, myProfile } = useBoundStore(useShallow(UserSelector));
  const previewMode = useIsPreviewMode();
  const viewAs = useViewAs();
  const viewAsUser = useViewAsUser();
  const isMyPage = !previewMode && user?.id === myProfile?.id;
  const [friendData, setFriendData] = useState<UserProfile | null>(null);
  const subscriptionBellEnabled = !!featureFlags?.[FeatureFlagKey.SUBSCRIPTION_POPUP];
  const isFriendUser = !!user && !isMyProfile(user) && areFriends(user);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  const { updateUser, refreshAfterFriendshipChange } = useContext(UserPageContext);

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

  const { updateMyProfile, openToast } = useBoundStore((state) => ({
    updateMyProfile: state.updateMyProfile,
    openToast: state.openToast,
  }));

  const [showSwitchToPrivateDialog, setShowSwitchToPrivateDialog] = useState(false);
  const [showSwitchToPublicDialog, setShowSwitchToPublicDialog] = useState(false);

  const performTogglePublicPrivate = () => {
    if (!myProfile) return;
    const switchingToPublic = !myProfile.is_public;
    editProfile({
      profile: { is_public: switchingToPublic },
      onSuccess: (data) => {
        updateMyProfile({ is_public: data.is_public });
        const msg = switchingToPublic ? t('switch_to_public_toast') : t('switch_to_private_toast');
        openToast({ message: msg ?? '' });
      },
    });
  };

  const handleTogglePublicPrivate = (e: MouseEvent) => {
    e.stopPropagation();
    if (!myProfile) return;

    if (myProfile.is_public) {
      setShowSwitchToPrivateDialog(true);
    } else {
      setShowSwitchToPublicDialog(true);
    }
  };

  const handleConfirmSwitchToPrivate = () => {
    setShowSwitchToPrivateDialog(false);
    performTogglePublicPrivate();
  };

  const handleConfirmSwitchToPublic = () => {
    setShowSwitchToPublicDialog(false);
    performTogglePublicPrivate();
  };

  useAsyncEffect(async () => {
    if (isMyPage || !username) return;
    const friend = await getUserProfile(username, viewAs, viewAsUser);

    setFriendData(friend);
  }, [isMyPage, username, viewAs, viewAsUser]);

  const [showEditConnectionsModal, setShowEditConnectionsModal] = useState(false);
  const closeEditConnectionsModal = () => setShowEditConnectionsModal(false);

  const handleClickChangeConnection = async () => {
    if (!user || isMyProfile(user) || !areFriends(user)) return;
    setShowEditConnectionsModal(true);
  };

  const [showMoreAbout, setShowMoreAbout] = useState(false);

  const isVerQ = !!featureFlags?.postsVerQ;

  // In preview mode, friendData is null (no username param to fetch with),
  // so fall back to the user prop which is already view_as-filtered.
  const viewData = previewMode ? (user as UserProfile | null) : friendData;

  // Backend already masks per-field visibility; null/empty means hidden.
  const showPronouns = !!user?.pronouns;
  const showBio = !!user?.bio;

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
            <Layout.FlexRow w="100%">
              <Layout.FlexCol gap={2}>
                {/* Name + badges on same line */}
                <Layout.FlexRow gap={6} alignItems="center">
                  <Typo type="title-large" numberOfLines={1}>
                    {isMyPage
                      ? (myProfile as any)?.name || myProfile?.username || ''
                      : (viewData as any)?.name || viewData?.username || username || ''}
                  </Typo>
                  {isMyPage && isVerQ && (
                    <AccountStatusBadge>
                      {myProfile?.is_public
                        ? t('account_status_public')
                        : t('account_status_private')}
                    </AccountStatusBadge>
                  )}
                  {/** connections badge for friends — inside name row for vertical alignment */}
                  {user && !isMyProfile(user) && (areFriends(user) || previewMode) && (
                    <>
                      {(user.connection_status || previewMode) && (
                        <SvgIcon
                          name={
                            !previewMode && user.connection_status === Connection.CLOSE_FRIEND
                              ? 'close_friend'
                              : 'default_friend'
                          }
                          size={16}
                          onClick={previewMode ? undefined : handleClickChangeConnection}
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
                            cursor: 'pointer',
                            display: 'inline-flex',
                          }}
                        >
                          <SvgIcon
                            name="notification_inline"
                            size={20}
                            color={(user as UserProfile).is_subscribed ? 'PRIMARY' : 'BLACK'}
                            fill={(user as UserProfile).is_subscribed ? 'PRIMARY' : undefined}
                          />
                        </button>
                      )}
                    </>
                  )}
                </Layout.FlexRow>
                {/* Pronouns | Degree inline */}
                {!isMyPage && (
                  <Layout.FlexRow gap={4} alignItems="center">
                    {showPronouns && viewData?.pronouns && (
                      <Typo type="label-medium" color="DARK_GRAY">
                        {viewData.pronouns}
                      </Typo>
                    )}
                    {showPronouns &&
                      viewData?.pronouns &&
                      viewData?.connection_degree &&
                      !featureFlags?.postsVerQ && (
                        <Typo type="label-medium" color="MEDIUM_GRAY">
                          |
                        </Typo>
                      )}
                    {viewData?.connection_degree && !featureFlags?.postsVerQ && (
                      <Typo type="label-medium" color="DARK_GRAY">
                        {viewData.connection_degree === 2
                          ? '2nd degree connection'
                          : '3rd+ degree connection'}
                      </Typo>
                    )}
                  </Layout.FlexRow>
                )}
              </Layout.FlexCol>
              {/* Modals/popups — positioned independently, kept outside name row */}
              {user && !isMyProfile(user) && areFriends(user) && (
                <>
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
            viewData?.bio && (
              <Layout.FlexCol w="100%">
                <Typo type="body-medium" numberOfLines={2}>
                  {viewData.bio}
                </Typo>
              </Layout.FlexCol>
            )
          )}

          {/* friend count link (version_q my page only) */}
          {featureFlags?.postsVerQ && isMyPage && (
            <Layout.FlexRow
              onClick={() => navigate('/my/friends/list')}
              style={{ cursor: 'pointer' }}
            >
              <Typo type="title-small" color="BLACK" underline>
                {`${myProfile?.friend_count ?? 0} ${t('friends')}`}
              </Typo>
            </Layout.FlexRow>
          )}

          {/* interests placeholder (my page only, when user has no interests) */}
          {!featureFlags?.postsVerQ &&
            isMyPage &&
            (myProfile?.user_interests ?? []).length === 0 && <InterestPlaceholder />}

          {/* See more details */}
          {!featureFlags?.postsVerQ &&
            featureFlags?.persona &&
            (isMyPage || previewMode || (user && areFriends(user))) &&
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
          {!isMyProfile(user) && !areFriends(user) && !receivedFriendRequest(user) && (
            <Layout.FlexRow w="100%" gap={8}>
              <FriendStatus
                type="user"
                user={user}
                onClickCancelRequest={updateUser}
                onClickRequest={updateUser}
                onClickConfirm={refreshAfterFriendshipChange}
                onClickReject={updateUser}
                isUserPage
              />
              <ChatRequestButton user={user} />
            </Layout.FlexRow>
          )}
          <MutualFriendsInfo mutualFriends={(user as UserProfile).mutuals} />

          {/* Mutual traits for non-friend users (from discover context) */}
          {!featureFlags?.postsVerQ &&
            !isMyProfile(user) &&
            !areFriends(user) &&
            viewData &&
            ((viewData.mutual_interests && viewData.mutual_interests.length > 0) ||
              (viewData.mutual_personas && viewData.mutual_personas.length > 0)) && (
              <Layout.FlexCol gap={8} w="100%">
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {t('shared_traits')}
                </Typo>
                <Layout.FlexRow w="100%" gap={6} style={{ flexWrap: 'wrap' }}>
                  {[...(viewData.mutual_interests ?? []), ...(viewData.mutual_personas ?? [])].map(
                    (trait) => {
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
                    },
                  )}
                </Layout.FlexRow>
              </Layout.FlexCol>
            )}
        </>
      )}
      {/* my-page actions: Edit Profile + Public/Private toggle (Q) or View As (W) */}
      {isMyPage && (
        <Layout.FlexRow w="100%" gap={8}>
          <ProfileActionButton
            status="normal"
            text={t('edit_profile')}
            sizing="stretch"
            fontType="button-medium"
            onClick={handleClickEditProfile}
          />
          {featureFlags?.postsVerQ ? (
            <ProfileActionButton
              status="normal"
              text={t('switch_visibility')}
              sizing="stretch"
              fontType="button-medium"
              onClick={handleTogglePublicPrivate}
            />
          ) : (
            <ViewAsButton
              status="normal"
              text={tViewAs('entry_label_long', { defaultValue: 'View As (Privacy)' })}
              sizing="stretch"
              fontType="button-medium"
              onClick={() => navigate('/my/view-as')}
            />
          )}
        </Layout.FlexRow>
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

      {isMyPage && isVerQ && (
        <>
          <CommonDialog
            visible={showSwitchToPrivateDialog}
            title={t('switch_to_private_dialog.title')}
            content={t('switch_to_private_dialog.content')}
            cancelText={t('switch_to_private_dialog.cancel')}
            confirmText={t('switch_to_private_dialog.confirm')}
            confirmTextColor="WARNING"
            onClickConfirm={handleConfirmSwitchToPrivate}
            onClickClose={() => setShowSwitchToPrivateDialog(false)}
          />
          <CommonDialog
            visible={showSwitchToPublicDialog}
            title={t('switch_to_public_dialog.title')}
            content={t('switch_to_public_dialog.content')}
            cancelText={t('switch_to_public_dialog.cancel')}
            confirmText={t('switch_to_public_dialog.confirm')}
            confirmTextColor="WARNING"
            onClickConfirm={handleConfirmSwitchToPublic}
            onClickClose={() => setShowSwitchToPublicDialog(false)}
          />
        </>
      )}
    </Layout.FlexCol>
  );
}

export default Profile;

const ProfileActionButton = styled(Button.Secondary)`
  && > button > .button_component {
    border-width: 2px;
  }
`;

const ViewAsButton = styled(Button.Secondary)`
  && > button > .button_component {
    border-width: 2px;
    border-color: ${({ theme }) => theme.PRIMARY};
  }
  && > button > .button_component span {
    color: ${({ theme }) => theme.PRIMARY};
  }
`;

function AccountStatusBadge({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '1px 8px',
        borderRadius: 999,
        border: '1px solid #555555',
        color: '#555555',
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
