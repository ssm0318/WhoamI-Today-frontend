import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE, POST_TYPE, Response } from '@models/post';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import Icon from '../icon/Icon';
import LikeButton from '../like-button/LikeButton';
import ProfileImageList from '../profile-image-list/ProfileImageList';

type PostFooterProps = {
  likedUserList: User[];
  isMyPage: boolean;
  post: Response | Note;
  displayType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
  refresh?: () => void;
};

// default 버전
// - 이모지 리액션 불가능
// - 리액션 숫자 노출
function PostFooterDefault({
  likedUserList,
  isMyPage,
  post,
  displayType = 'LIST',
  showComments,
  setInputFocus,
  refresh,
}: PostFooterProps) {
  const { comment_count, type, like_count } = post;
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);
  const [t] = useTranslation('translation', {
    keyPrefix: post.type === POST_TYPE.RESPONSE ? 'responses' : 'notes',
  });

  const handleClickCommentText = (e: MouseEvent) => {
    e.stopPropagation();
    showComments();
  };

  const handleClickCommentIcon = (e: MouseEvent) => {
    e.stopPropagation();
    showComments();
    setInputFocus();
  };

  const handleClickLikes = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(type === 'Response' ? `/responses/${post.id}/likes` : `/notes/${post.id}/likes`);
  };

  return (
    <Layout.FlexCol gap={8}>
      <Layout.FlexRow gap={8} alignItems="center">
        {/* 좋아요 리스트 */}
        {isMyPage && likedUserList?.length > 0 && (
          <button type="button" onClick={handleClickLikes}>
            <ProfileImageList images={likedUserList.map((user) => user.profile_image)} />
          </button>
        )}
        {!isMyPage && (
          <LikeButton postType={type} post={post} iconSize={23} m={0} refresh={refresh} />
        )}
        {/* 좋아요 수 */}
        {featureFlags?.reactionCount && !!like_count && like_count > 0 && (
          <button type="button" onClick={handleClickLikes}>
            <Typo type="label-large" color="BLACK" underline>
              {like_count} {t('likes')}
            </Typo>
          </button>
        )}
        <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
      </Layout.FlexRow>
      {!!comment_count && displayType === 'LIST' && (
        <Layout.FlexRow>
          <button type="button" onClick={handleClickCommentText}>
            <Typo type="label-large" color="BLACK" underline>
              {comment_count || 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
    </Layout.FlexCol>
  );
}

export default PostFooterDefault;
