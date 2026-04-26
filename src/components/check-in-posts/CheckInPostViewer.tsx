import { MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import LikeButton from '@components/_common/like-button/LikeButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Z_INDEX } from '@constants/layout';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPost, CheckInPostStory, CheckInPostVisibility } from '@models/checkInPost';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import {
  getCheckInPost,
  togglePinCheckInPost,
  updateCheckInPostPinVisibility,
} from '@utils/apis/checkInPost';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface CheckInPostViewerProps {
  story: CheckInPostStory;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Called after a successful pin toggle or pin_visibility change so the
   * parent (e.g. stories strip) can re-fetch and resort highlights. */
  onPinChange?: (post: CheckInPost) => void;
}

function CheckInPostViewer({
  story,
  onClose,
  onPrev,
  onNext,
  onPinChange,
}: CheckInPostViewerProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const [post, setPost] = useState<CheckInPost | null>(null);
  const [pinBusy, setPinBusy] = useState(false);

  const { myProfile } = useBoundStore(useShallow(UserSelector));
  const isOwn = myProfile?.id === story.author_detail.id;

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    getCheckInPost(story.id)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch(() => {
        if (!cancelled) setPost(null);
      });
    return () => {
      cancelled = true;
    };
  }, [story.id]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleLeft = (e: MouseEvent) => {
    e.stopPropagation();
    onPrev?.();
  };

  const handleRight = (e: MouseEvent) => {
    e.stopPropagation();
    onNext?.();
  };

  const handlePinToggle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!post || !isOwn || pinBusy) return;
    setPinBusy(true);
    try {
      const updated = await togglePinCheckInPost(post.id);
      setPost(updated);
      onPinChange?.(updated);
    } finally {
      setPinBusy(false);
    }
  };

  const handleCloseFriendsToggle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!post || !isOwn || pinBusy || !post.is_pinned) return;
    const next: CheckInPostVisibility =
      post.pin_visibility === 'close_friends' ? 'friends' : 'close_friends';
    setPinBusy(true);
    try {
      const updated = await updateCheckInPostPinVisibility(post.id, next);
      setPost(updated);
      onPinChange?.(updated);
    } finally {
      setPinBusy(false);
    }
  };

  return (
    <Backdrop onClick={handleBackdropClick}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Header>
          <Layout.FlexRow alignItems="center" gap={8}>
            <ProfileImage
              imageUrl={story.author_detail.profile_image}
              username={story.author_detail.username}
              size={32}
            />
            <Typo type="label-large" color="WHITE" bold>
              {story.author_detail.username}
            </Typo>
            <Typo type="label-small" color="LIGHT_GRAY">
              {convertTimeDiffByString({ day: new Date(story.created_at) })}
            </Typo>
          </Layout.FlexRow>
          <Layout.FlexRow alignItems="center" gap={8}>
            {isOwn && post && (
              <PinButton
                type="button"
                aria-label={(post.is_pinned ? t('unpin') : t('pin')) ?? ''}
                onClick={handlePinToggle}
                disabled={pinBusy}
              >
                <SvgIcon
                  name={post.is_pinned ? 'pin_filled' : 'pin_empty'}
                  size={20}
                  color={post.is_pinned ? 'PRIMARY' : 'WHITE'}
                />
              </PinButton>
            )}
            <CloseBtn type="button" onClick={onClose}>
              ×
            </CloseBtn>
          </Layout.FlexRow>
        </Header>

        {/* Close-friends-only toggle: only when own + pinned. */}
        {isOwn && post?.is_pinned && (
          <PinVisibilityRow>
            <CloseFriendsToggle type="button" onClick={handleCloseFriendsToggle} disabled={pinBusy}>
              <SvgIcon
                name={
                  post.pin_visibility === 'close_friends' ? 'checkbox_checked' : 'checkbox_default'
                }
                size={20}
              />
              <Typo type="label-small" color="WHITE">
                {t('visibility_close_friends_only')}
              </Typo>
            </CloseFriendsToggle>
          </PinVisibilityRow>
        )}

        {story.image_url && <StoryImage src={story.image_url} alt="daily snippet" />}

        {post?.caption && (
          <Caption>
            <Typo type="body-medium" color="WHITE">
              {post.caption}
            </Typo>
          </Caption>
        )}

        <Footer>
          {post && (
            <LikeButton
              postType="CheckInPost"
              postId={post.id}
              currentUserLikeId={post.current_user_like_id}
              iconSize={28}
            />
          )}
        </Footer>

        {onPrev && <NavZone $side="left" onClick={handleLeft} />}
        {onNext && <NavZone $side="right" onClick={handleRight} />}
      </Card>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.92);
  z-index: ${Z_INDEX.COMMENT_LIKES_POPUP};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: black;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
`;

const PinButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PinVisibilityRow = styled.div`
  position: absolute;
  top: 64px;
  right: 16px;
  display: flex;
  gap: 6px;
  z-index: 3;
`;

const CloseFriendsToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${Colors.WHITE};
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  padding: 0 8px;
`;

const StoryImage = styled.img`
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
`;

const Caption = styled.div`
  padding: 16px;
  text-align: center;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  display: flex;
  justify-content: flex-start;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
`;

const NavZone = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 25%;
  ${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
  cursor: pointer;
  z-index: 1;
`;

export default CheckInPostViewer;
