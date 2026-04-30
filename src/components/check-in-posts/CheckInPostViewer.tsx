import { MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import { Z_INDEX } from '@constants/layout';
import { Colors, Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPost, CheckInPostStory, CheckInPostVisibility } from '@models/checkInPost';
import { useBoundStore } from '@stores/useBoundStore';
import {
  getCheckInPost,
  togglePinCheckInPost,
  updateCheckInPostPinVisibility,
} from '@utils/apis/checkInPost';
import { deleteLike, postLike } from '@utils/apis/likes';
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
  const [showComments, setShowComments] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [likeId, setLikeId] = useState<number | null>(null);
  const [likeBusy, setLikeBusy] = useState(false);

  const { myProfile, openToast } = useBoundStore(
    useShallow((state) => ({ myProfile: state.myProfile, openToast: state.openToast })),
  );
  const isOwn = myProfile?.id === story.author_detail.id;

  // Drive the chrome (caption, pin state, visibility) from `story` immediately
  // so the layout doesn't flicker while the detail fetch resolves on each
  // navigation between snippets. `post` overrides once loaded.
  const isPinned = post?.is_pinned ?? story.is_pinned;
  const pinVisibility = post?.pin_visibility ?? story.pin_visibility;
  const caption = post?.caption ?? story.caption;

  const refreshPost = () => {
    getCheckInPost(story.id)
      .then((data) => setPost(data))
      .catch(() => {});
  };

  const openComments = (e: MouseEvent) => {
    e.stopPropagation();
    setShowComments(true);
  };

  const handleLikeToggle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!post || isOwn || likeBusy) return;
    setLikeBusy(true);
    try {
      if (likeId) {
        await deleteLike(likeId, (msg) => openToast({ message: msg }));
        setLikeId(null);
      } else {
        const res = await postLike({ target_id: post.id, target_type: 'CheckInPost' }, (msg) =>
          openToast({ message: msg }),
        );
        setLikeId(res.id);
      }
      refreshPost();
    } finally {
      setLikeBusy(false);
    }
  };

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

  useEffect(() => {
    setLikeId(post?.current_user_like_id ?? null);
  }, [post?.current_user_like_id]);

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

  return createPortal(
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
            {isOwn && (
              <PinButton
                type="button"
                aria-label={(isPinned ? t('unpin') : t('pin')) ?? ''}
                onClick={handlePinToggle}
                disabled={pinBusy || !post}
              >
                <SvgIcon
                  name={isPinned ? 'pin_filled' : 'pin_empty'}
                  size={24}
                  color={isPinned ? 'PRIMARY' : 'WHITE'}
                />
              </PinButton>
            )}
            <CloseBtn type="button" onClick={onClose}>
              ×
            </CloseBtn>
          </Layout.FlexRow>
        </Header>

        {isOwn && (
          <PinVisibilityRow>
            <VisibilityToggle
              type="button"
              onClick={handleCloseFriendsToggle}
              disabled={pinBusy || !post}
            >
              <SvgIcon name="eye" size={16} color="LIGHT_GRAY" />
              <Typo type="label-medium" color="LIGHT_GRAY" underline>
                {t(
                  pinVisibility === 'close_friends'
                    ? 'visibility_close_friends'
                    : 'visibility_friends',
                )}
              </Typo>
            </VisibilityToggle>
          </PinVisibilityRow>
        )}

        {story.image_url && (
          <ImageStage>
            <StoryImage src={story.image_url} alt="daily snippet" />
          </ImageStage>
        )}

        {caption && (
          <Caption>
            <Typo type="body-medium" color="WHITE">
              {caption}
            </Typo>
          </Caption>
        )}

        <Footer>
          <ActionPill onClick={(e) => e.stopPropagation()}>
            {!isOwn && (
              <PillIconButton
                type="button"
                onClick={handleLikeToggle}
                disabled={likeBusy || !post}
                aria-label="like"
              >
                {likeId ? (
                  <svg width="22" height="22" viewBox="0 0 22.5 22" fill={Colors.PRIMARY}>
                    <path d="M16.2297 2.30029C14.086 2.30029 12.2543 3.82825 11.248 4.88166C10.2416 3.82825 8.41398 2.30029 6.27136 2.30029C2.5783 2.30029 0 4.8745 0 8.55939C0 12.6196 3.20216 15.2439 6.3 17.7824C7.7625 18.982 9.27614 20.2216 10.4369 21.5961C10.6323 21.8262 10.9186 21.9592 11.2193 21.9592H11.2786C11.5803 21.9592 11.8657 21.8252 12.06 21.5961C13.2228 20.2216 14.7355 18.981 16.199 17.7824C19.2958 15.245 22.5 12.6206 22.5 8.55939C22.5 4.8745 19.9217 2.30029 16.2297 2.30029Z" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 23 20" fill="none">
                    <path
                      d="M16.2295 1C17.837 1 19.1423 1.55605 20.043 2.45508C20.9434 3.354 21.4999 4.65601 21.5 6.25879C21.5 7.99804 20.8221 9.45583 19.7305 10.8164C18.6198 12.2007 17.1314 13.4249 15.5654 14.708C14.1175 15.8939 12.5304 17.1927 11.2979 18.6494C11.2913 18.6571 11.2828 18.6592 11.2783 18.6592H11.2197C11.2142 18.6592 11.2056 18.6559 11.1992 18.6484C9.96865 17.1918 8.37974 15.8944 6.93457 14.709H6.93359C5.36693 13.4252 3.87898 12.1999 2.76855 10.8154C1.67733 9.45489 1 7.99764 1 6.25879C1.00007 4.65601 1.55646 3.35398 2.45703 2.45508C3.35778 1.55605 4.66338 1 6.27148 1C7.97247 1.00006 9.54511 2.24739 10.5244 3.27246L11.248 4.0293L11.9707 3.27246C12.9492 2.24821 14.5269 1.00008 16.2295 1Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </PillIconButton>
            )}
            {!!post?.like_count && (
              <Typo type="label-large" color="WHITE">
                {post.like_count}
              </Typo>
            )}
            <PillIconButton
              type="button"
              onClick={openComments}
              aria-label={t('comment') ?? ''}
              disabled={!post}
            >
              <svg width="22" height="22" viewBox="0 0 23 23" fill="none">
                <path
                  d="M3.1 2H19.9C20.5075 2 21 2.49249 21 3.1V20.1L16.4004 16.8H3.1C2.49249 16.8 2 16.3075 2 15.7V3.1C2 2.49249 2.49249 2 3.1 2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                />
                <path
                  d="M12.4585 13.4167H10.5418V10.5417H7.66683V8.625H10.5418V5.75H12.4585V8.625H15.3335V10.5417H12.4585V13.4167Z"
                  fill="currentColor"
                />
              </svg>
            </PillIconButton>
            {!!post?.comment_count && (
              <Typo type="label-large" color="WHITE">
                {post.comment_count}
              </Typo>
            )}
          </ActionPill>
        </Footer>

        {onPrev && <NavZone $side="left" onClick={handleLeft} />}
        {onNext && <NavZone $side="right" onClick={handleRight} />}
      </Card>

      {post && (
        <CommentBottomSheet
          postType="CheckInPost"
          post={post}
          visible={showComments}
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          closeBottomSheet={() => setShowComments(false)}
        />
      )}
    </Backdrop>,
    document.body,
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.92);
  z-index: ${Z_INDEX.MODAL_CONTAINER - 1};
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
  max-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #1c1c1e;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px;
  padding-top: calc(16px + env(safe-area-inset-top));
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
  top: calc(64px + env(safe-area-inset-top));
  right: 16px;
  display: flex;
  gap: 6px;
  z-index: 3;
`;

const VisibilityToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
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

const ImageStage = styled.div`
  width: 100%;
  height: 60vh;
  height: 60dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StoryImage = styled.img`
  max-width: 100%;
  max-height: 100%;
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
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  display: flex;
  justify-content: flex-start;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
`;

const ActionPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 9999px;
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
`;

const PillIconButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${Colors.WHITE};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
