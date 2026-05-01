import { CSSProperties, MouseEvent, useState } from 'react';
import LikeButton from '@components/_common/like-button/LikeButton';
import LinkifiedText from '@components/_common/linkified-text/LinkifiedText';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPost, CheckInPostStory } from '@models/checkInPost';
import { togglePinCheckInPost } from '@utils/apis/checkInPost';
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
  return 'like_count' in post;
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
  const likeCount = isFullPost(post) ? post.like_count : null;
  const currentUserLikeId = isFullPost(post) ? post.current_user_like_id : null;
  const commentCount = isFullPost(post) ? post.comment_count : 0;

  const [pinned, setPinned] = useState(post.is_pinned);
  const [pinBusy, setPinBusy] = useState(false);

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
    <Layout.FlexCol
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
            {pinned && (
              <span style={visibilityBadgeStyle}>
                <Typo type="label-small" color="DARK_GRAY" fontWeight={600}>
                  {post.visibility === 'close_friends' ? 'Close Friends' : 'Friends'}
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

      {image_url && <S.PostImage src={image_url} alt="snippet" />}

      {caption && (
        <div style={{ marginTop: 8, width: '100%', textAlign: 'center' }}>
          <Typo type="body-large" color="BLACK" pre>
            <LinkifiedText>{caption}</LinkifiedText>
          </Typo>
        </div>
      )}

      {showLikeFooter && isFullPost(post) && (
        <Layout.FlexRow gap={8} w="100%" alignItems="center">
          {!isMyPage && (
            <LikeButton
              postType="CheckInPost"
              postId={id}
              currentUserLikeId={currentUserLikeId}
              iconSize={23}
              refresh={refresh}
            />
          )}
          {!!likeCount && (
            <Typo type="label-large" color="BLACK">
              {likeCount}
            </Typo>
          )}
          <SvgIcon name="add_comment" size={23} color="BLACK" />
          {!!commentCount && (
            <Typo type="label-large" color="BLACK">
              {commentCount}
            </Typo>
          )}
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

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
