import { MouseEvent } from 'react';
import LikeButton from '@components/_common/like-button/LikeButton';
import LinkifiedText from '@components/_common/linkified-text/LinkifiedText';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, SvgIcon, Typo } from '@design-system';
import { CheckInPost, CheckInPostStory } from '@models/checkInPost';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import * as S from './CheckInPostItem.styled';

interface CheckInPostItemProps {
  post: CheckInPostStory | CheckInPost;
  onClick?: () => void;
  showLikeFooter?: boolean;
  refresh?: () => void;
  isMyPage?: boolean;
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
}: CheckInPostItemProps) {
  const { id, author_detail, image_url, is_pinned, created_at } = post;
  const caption = isFullPost(post) ? post.caption : '';
  const likeCount = isFullPost(post) ? post.like_count : null;
  const currentUserLikeId = isFullPost(post) ? post.current_user_like_id : null;
  const commentCount = isFullPost(post) ? post.comment_count : 0;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <Layout.FlexCol
      w="100%"
      p={12}
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
        {is_pinned && (
          <span aria-label="pinned" style={{ display: 'inline-flex' }}>
            <SvgIcon name="pin_filled" size={24} color="PRIMARY" />
          </span>
        )}
      </Layout.FlexRow>

      {image_url && <S.PostImage src={image_url} alt="snippet" />}

      {caption && (
        <Typo type="body-medium" color="BLACK" pre>
          <LinkifiedText>{caption}</LinkifiedText>
        </Typo>
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

export default CheckInPostItem;
