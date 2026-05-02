import { MouseEvent, ReactNode, useContext, useEffect, useRef, useState } from 'react';
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
import { useTrackEvent } from '@hooks/useTrackEvent';
import { useVisibleDwell } from '@hooks/useVisibleDwell';
import { Connection } from '@models/api/friends';
import { MyProfile } from '@models/api/user';
import { areFriends, isMyProfile, UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { editProfile } from '@utils/apis/my';
import { getUserProfile } from '@utils/apis/user';
import CheckInSection from '../check-in/CheckIn';
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
  const trackEvent = useTrackEvent();

  // Section-level visible-dwell — measures actual viewport time on each
  // major part of the profile, so research can answer "did the user
  // even look at the pinned posts? the check-in panel?" rather than
  // "did the page render". Refs are attached to wrapper divs below.
  const pinnedPostsRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const mutualFriendsRef = useRef<HTMLDivElement>(null);
  // Disambiguate "viewing my own profile" from "viewing someone else's"
  // in dashboards — they're very different engagement contexts.
  const sectionParams = { is_my_page: isMyPage ? 'true' : 'false' };
  useVisibleDwell(pinnedPostsRef, 'profile_section_dwell', {
    ...sectionParams,
    section: 'pinned_posts',
  });
  useVisibleDwell(checkInRef, 'profile_section_dwell', {
    ...sectionParams,
    section: 'check_in',
  });
  useVisibleDwell(mutualFriendsRef, 'profile_section_dwell', {
    ...sectionParams,
    section: 'mutual_friends',
  });

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
  }, [isMyPage, username, viewAs, viewAsUser, user]);

  const [showEditConnectionsModal, setShowEditConnectionsModal] = useState(false);
  const closeEditConnectionsModal = () => setShowEditConnectionsModal(false);

  const handleClickChangeConnection = async () => {
    if (!user || isMyProfile(user) || !areFriends(user)) return;
    setShowEditConnectionsModal(true);
  };

  const [showMoreAbout, setShowMoreAbout] = useState(false);

  // One-time-per-session prompt for users grandfathered in with more than the
  // new 20-chip cap. Surfaced on their own profile page (a passive banner in
  // Edit Profile already covers the editing flow). Tracks shown-state in
  // sessionStorage so we don't pop it on every profile re-render.
  const MAX_TOTAL_PROFILE_CHIPS = 20;
  const OVER_CAP_PROMPT_SHOWN_KEY = 'profile.overCapPrompt.shown.v1';
  const myChipCount = isMyPage
    ? Object.values(myProfile?.chips_by_category ?? {}).reduce(
        (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
        0,
      )
    : 0;
  const [showOverCapPrompt, setShowOverCapPrompt] = useState(false);
  useEffect(() => {
    if (!isMyPage) return;
    if (myChipCount <= MAX_TOTAL_PROFILE_CHIPS) return;
    try {
      if (window.sessionStorage.getItem(OVER_CAP_PROMPT_SHOWN_KEY)) return;
      window.sessionStorage.setItem(OVER_CAP_PROMPT_SHOWN_KEY, '1');
    } catch {
      // sessionStorage unavailable — show anyway, the banner is the only
      // backstop and a single prompt-per-page-load is acceptable.
    }
    setShowOverCapPrompt(true);
  }, [isMyPage, myChipCount]);

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
                      : (viewData as any)?.name ||
                        viewData?.username ||
                        (user as any)?.name ||
                        user?.username ||
                        username ||
                        ''}
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
              <Layout.FlexRow
                onClick={() => {
                  // Tap on "See more details" — the gateway into the
                  // chip-category sheet (interests / personas etc.).
                  // Pairs with the section-dwell events inside the sheet
                  // to tell us "users open this, but how engaged?"
                  trackEvent('profile_see_more_details_tapped', {
                    is_my_page: isMyPage ? 'true' : 'false',
                  });
                  setShowMoreAbout(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                <Typo type="label-medium" color="PRIMARY">
                  {t('see_more_details')}
                </Typo>
              </Layout.FlexRow>
            )}
        </Layout.FlexCol>
      </Layout.FlexRow>

      {featureFlags?.persona && isMyPage && (
        <div ref={pinnedPostsRef}>
          <PinnedPostsSection pinnedPostsCount={myProfile?.pinned_cnt ?? 0} />
        </div>
      )}

      {!isMyPage && user && (
        <>
          {!isMyProfile(user) && !areFriends(user) && (
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
          <div ref={mutualFriendsRef} style={{ width: '100%' }}>
            <MutualFriendsInfo mutualFriends={(user as UserProfile).mutuals} />
          </div>
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
      {featureFlags?.checkIn && user && (
        <div ref={checkInRef} style={{ width: '100%' }}>
          <CheckInSection user={user} />
        </div>
      )}

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
      {/* Grandfathered over-cap prompt: surfaces once per session on the
          user's own profile when they have more chips than the new cap. */}
      {isMyPage && (
        <CommonDialog
          visible={showOverCapPrompt}
          title="A small design change"
          content={`We've capped profile chips at ${MAX_TOTAL_PROFILE_CHIPS}. Sorry for the inconvenience, and thanks for understanding! You currently have ${myChipCount} — please trim ${
            myChipCount - MAX_TOTAL_PROFILE_CHIPS
          } to fit the new limit.`}
          cancelText="Maybe later"
          confirmText="Got it, let's go change that now"
          onClickConfirm={() => {
            setShowOverCapPrompt(false);
            navigate('/settings/edit-profile?tab=interests');
          }}
          onClickCancel={() => setShowOverCapPrompt(false)}
          onClickClose={() => setShowOverCapPrompt(false)}
          trackingId="profile_chip_over_cap_prompt"
        />
      )}
    </Layout.FlexCol>
  );
}

export default Profile;

const ProfileActionButton = styled(Button.Secondary)`
  && > button > .button_component {
    border-width: 2px;
    padding: 4px 8px;
  }
  && > button > .button_component span {
    font-size: 14.4px;
  }
`;

const ViewAsButton = styled(Button.Secondary)`
  && > button > .button_component {
    border-width: 2px;
    border-color: ${({ theme }) => theme.PRIMARY};
    padding: 4px 8px;
  }
  && > button > .button_component span {
    color: ${({ theme }) => theme.PRIMARY};
    font-size: 14.4px;
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
