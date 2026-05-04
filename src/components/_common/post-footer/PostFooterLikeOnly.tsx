import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE, POST_TYPE, Response } from '@models/post';
import Icon from '../icon/Icon';
import LikeButton from '../like-button/LikeButton';

type PostFooterLikeOnlyProps = {
  post: Response | Note;
  displayType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
  refresh?: () => void;
  onLikeUpdated?: (liked: boolean, likeId: number | null) => void;
};

function PostFooterLikeOnly({
  post,
  displayType = 'LIST',
  showComments,
  setInputFocus,
  refresh,
  onLikeUpdated,
}: PostFooterLikeOnlyProps) {
  const navigate = useNavigate();
  const { comment_count, current_user_like_id, like_count, like_user_sample } = post;
  const [t] = useTranslation('translation', {
    keyPrefix: post.type === POST_TYPE.RESPONSE ? 'responses' : 'notes',
  });

  const navigateToLikes = (e: MouseEvent) => {
    e.stopPropagation();
    if (post.type === POST_TYPE.RESPONSE) {
      navigate(`/responses/${post.id}/likes`);
    } else {
      navigate(`/notes/${post.id}/likes`);
    }
  };

  const navigateToUser = (e: MouseEvent, username: string) => {
    e.stopPropagation();
    navigate(`/users/${username}`);
  };

  const handleClickCommentText = (e: MouseEvent) => {
    e.stopPropagation();
    showComments();
  };

  const handleClickCommentIcon = (e: MouseEvent) => {
    e.stopPropagation();
    showComments();
    setInputFocus();
  };

  const sampleUsers = like_user_sample ?? [];
  const showLikeMeta = typeof like_count === 'number' ? like_count > 0 : (like_count ?? 0) > 0;
  const canOpenCommentsInline = displayType !== 'DETAIL';

  return (
    <Layout.FlexCol
      gap={8}
      w="100%"
      style={{
        position: displayType === 'DETAIL' ? 'relative' : undefined,
        flexShrink: 0,
        marginTop: 'auto',
      }}
    >
      <Layout.FlexRow
        gap={12}
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        style={{ flexWrap: 'wrap' }}
      >
        {/* 하트 바로 오른쪽: 좋아요 수 → 샘플 프로필(최대 3) */}
        <Layout.FlexRow gap={0} alignItems="center" style={{ flexWrap: 'nowrap', minWidth: 0 }}>
          <LikeButton
            postType={post.type === POST_TYPE.RESPONSE ? 'Response' : 'Note'}
            postId={post.id}
            currentUserLikeId={current_user_like_id}
            iconSize={23}
            iconAlign="start"
            m={3}
            outerSize={30}
            refresh={refresh}
            onLikeUpdated={onLikeUpdated}
          />
          {showLikeMeta && (
            <button type="button" onClick={navigateToLikes}>
              <Typo type="label-large" color="BLACK" underline>
                {like_count} {t('likes')}
              </Typo>
            </button>
          )}
          {sampleUsers.length > 0 && (
            <Layout.FlexRow alignItems="center" ml={4}>
              {sampleUsers.slice(0, SAMPLE_AVATAR_COUNT).map((user, index) => (
                <Layout.FlexRow
                  key={user.username}
                  ml={index === 0 ? 0 : -AVATAR_OVERLAP}
                  z={SAMPLE_AVATAR_COUNT - index}
                  style={{ position: 'relative' }}
                >
                  <button
                    type="button"
                    onClick={(e) => navigateToUser(e, user.username)}
                    aria-label={user.username}
                  >
                    <ProfileImage
                      imageUrl={user.profile_image}
                      username={user.username}
                      size={26}
                    />
                  </button>
                </Layout.FlexRow>
              ))}
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>

        <Layout.FlexRow gap={8} alignItems="center">
          {canOpenCommentsInline && (
            <Layout.FlexRow w={48} h={48} alignItems="center" justifyContent="center">
              <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
            </Layout.FlexRow>
          )}
          {!!comment_count && (
            <button
              type="button"
              onClick={canOpenCommentsInline ? handleClickCommentText : undefined}
            >
              <Typo type="label-large" color="BLACK" underline>
                {comment_count ?? 0} {t('comments')}
              </Typo>
            </button>
          )}
        </Layout.FlexRow>
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

const SAMPLE_AVATAR_COUNT = 3;
const AVATAR_OVERLAP = 10;

export default PostFooterLikeOnly;
