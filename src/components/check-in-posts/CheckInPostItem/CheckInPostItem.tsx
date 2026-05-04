import { CSSProperties, MouseEvent, useState } from 'react';
import { createPortal } from 'react-dom';
import LikeButton from '@components/_common/like-button/LikeButton';
import LinkifiedText from '@components/_common/linkified-text/LinkifiedText';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import LikesListModal from '@components/check-in-posts/LikesListModal';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import { Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPost, CheckInPostStory } from '@models/checkInPost';
import { getCheckInPost, togglePinCheckInPost } from '@utils/apis/checkInPost';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import * as S from './CheckInPostItem.styled';

interface CheckInPostItemProps {
  post: CheckInPostStory | CheckInPost;
  onClick?: () => void;
  showLikeFooter?: boolean;
  refresh?: () => void;
  isMyPage?: boolean;
  onMoreClick?: () => void;
}

function isFullPost(post: CheckInPostStory | CheckInPost): post is CheckInPost {
  return 'comment_count' in post;
}

function CheckInPostItem({
  post,
  onClick,
  showLikeFooter = false,
  refresh,
  isMyPage = false,
  onMoreClick,
}: CheckInPostItemProps) {
  const { id, author_detail, image_url, caption, created_at } = post;
  const likeCount = post.like_count ?? null;
  const currentUserLikeId = isFullPost(post) ? post.current_user_like_id : null;
  const commentCount = post.comment_count ?? 0;

  const [pinned, setPinned] = useState(post.is_pinned);
  const [pinBusy, setPinBusy] = useState(false);
  const [likesPostId, setLikesPostId] = useState<number | null>(null);
  const [commentPost, setCommentPost] = useState<CheckInPost | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handlePinToggle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (pinBusy) return;
    setPinBusy(true);
    try {
      const updated = await togglePinCheckInPost(id);
      setPinned(updated.is_pinned);
      refresh?.();
    } finally {
      setPinBusy(false);
    }
  };

  return (
    <>
      <Layout.FlexCol
        id={`post-${id}`}
        w="100%"
        p={12}
        pb={16}
        gap={8}
        outline="LIGHT"
        rounded={12}
        bgColor="WHITE"
        onClick={handleClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between">
          <Layout.FlexRow alignItems="center" gap={8}>
            <ProfileImage
              imageUrl={author_detail.profile_image}
              username={author_detail.username}
              size={36}
            />
            <Layout.FlexCol>
              <Typo type="title-medium" ellipsis={{ enabled: true, maxWidth: 180 }}>
                {author_detail.username}
              </Typo>
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {convertTimeDiffByString({ day: new Date(created_at) })}
              </Typo>
            </Layout.FlexCol>
          </Layout.FlexRow>
          {isMyPage && (
            <Layout.FlexRow alignItems="center" gap={6}>
              {pinned && post.visibility === 'close_friends' && (
                <span style={visibilityBadgeStyle}>
                  <Typo type="label-small" color="DARK_GRAY" fontWeight={600}>
                    Close Friends
                  </Typo>
                </span>
              )}
              <button
                type="button"
                onClick={handlePinToggle}
                disabled={pinBusy}
                aria-label={pinned ? 'unpin' : 'pin'}
                style={iconBtnStyle}
              >
                <SvgIcon
                  name={pinned ? 'pin_filled' : 'pin_empty'}
                  size={24}
                  color={pinned ? 'PRIMARY' : 'MEDIUM_GRAY'}
                />
              </button>
              {onMoreClick && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoreClick();
                  }}
                  aria-label="more"
                  style={iconBtnStyle}
                >
                  <SvgIcon name="dots_menu" size={20} color="DARK_GRAY" />
                </button>
              )}
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>

        {image_url && (
          <S.PostImageButton
            type="button"
            aria-label="Open image preview"
            onClick={(e) => {
              e.stopPropagation();
              setShowImagePopup(true);
            }}
          >
            <S.PostImage src={image_url} alt="snippet" />
          </S.PostImageButton>
        )}

        {caption && (
          <div style={{ marginTop: 8, width: '100%', textAlign: 'center' }}>
            <Typo type="body-large" color="BLACK" pre>
              <LinkifiedText>{caption}</LinkifiedText>
            </Typo>
          </div>
        )}

        {isMyPage && !showLikeFooter && (!!likeCount || !!commentCount) && (
          <Layout.FlexRow gap={12} alignItems="center" style={statsRowStyle}>
            {!!likeCount && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLikesPostId(id);
                }}
                style={statBtnStyle}
              >
                <svg width="22" height="22" viewBox="0 0 23 20" fill="none">
                  <path
                    d="M16.2295 1C17.837 1 19.1423 1.55605 20.043 2.45508C20.9434 3.354 21.4999 4.65601 21.5 6.25879C21.5 7.99804 20.8221 9.45583 19.7305 10.8164C18.6198 12.2007 17.1314 13.4249 15.5654 14.708C14.1175 15.8939 12.5304 17.1927 11.2979 18.6494C11.2913 18.6571 11.2828 18.6592 11.2783 18.6592H11.2197C11.2142 18.6592 11.2056 18.6559 11.1992 18.6484C9.96865 17.1918 8.37974 15.8944 6.93457 14.709H6.93359C5.36693 13.4252 3.87898 12.1999 2.76855 10.8154C1.67733 9.45489 1 7.99764 1 6.25879C1.00007 4.65601 1.55646 3.35398 2.45703 2.45508C3.35778 1.55605 4.66338 1 6.27148 1C7.97247 1.00006 9.54511 2.24739 10.5244 3.27246L11.248 4.0293L11.9707 3.27246C12.9492 2.24821 14.5269 1.00008 16.2295 1Z"
                    stroke="#8700FF"
                    strokeWidth="2"
                  />
                </svg>
                <Typo type="label-large" color="BLACK">
                  {likeCount}
                </Typo>
              </button>
            )}
            {!!commentCount && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  getCheckInPost(id).then((full) => {
                    setCommentPost(full);
                    setShowComments(true);
                  });
                }}
                style={statBtnStyle}
              >
                <SvgIcon name="add_comment" size={23} />
                <Typo type="label-large" color="BLACK">
                  {commentCount}
                </Typo>
              </button>
            )}
          </Layout.FlexRow>
        )}

        {showLikeFooter && isFullPost(post) && (
          <Layout.FlexRow gap={8} w="100%" alignItems="center">
            <LikeButton
              postType="CheckInPost"
              postId={id}
              currentUserLikeId={currentUserLikeId}
              iconSize={23}
              refresh={refresh}
            />
            {!!likeCount && (
              <Typo type="label-large" color="BLACK">
                {likeCount}
              </Typo>
            )}
            <SvgIcon name="add_comment" size={23} />
            {!!commentCount && (
              <Typo type="label-large" color="BLACK">
                {commentCount}
              </Typo>
            )}
          </Layout.FlexRow>
        )}
      </Layout.FlexCol>

      <LikesListModal postId={likesPostId} onClose={() => setLikesPostId(null)} />

      {image_url &&
        showImagePopup &&
        createPortal(
          <S.ImagePreviewBackdrop type="button" onClick={() => setShowImagePopup(false)}>
            <S.ImagePreview src={image_url} alt="Full size snippet" />
          </S.ImagePreviewBackdrop>,
          document.body,
        )}

      {commentPost && (
        <CommentBottomSheet
          postType="CheckInPost"
          post={commentPost}
          visible={showComments}
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          closeBottomSheet={() => setShowComments(false)}
        />
      )}
    </>
  );
}

const statsRowStyle: CSSProperties = {
  paddingLeft: 4,
  marginTop: 4,
};

const statBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: 0,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const iconBtnStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
};

const visibilityBadgeStyle: CSSProperties = {
  backgroundColor: '#efefef',
  borderRadius: 6,
  padding: '2px 6px',
};

export default CheckInPostItem;
