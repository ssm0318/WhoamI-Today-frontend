import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE, POST_TYPE, Response } from '@models/post';
import Icon from '../icon/Icon';
import LikeButton from '../like-button/LikeButton';

type PostFooterLikeOnlyProps = {
  isMyPage: boolean;
  post: Response | Note;
  displayType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
  refresh?: () => void;
};

function PostFooterLikeOnly({
  isMyPage,
  post,
  displayType = 'LIST',
  showComments,
  setInputFocus,
  refresh,
}: PostFooterLikeOnlyProps) {
  const { comment_count, current_user_like_id } = post;
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

  return (
    <Layout.FlexRow
      gap={8}
      w="100%"
      style={{
        position: displayType === 'DETAIL' ? 'relative' : undefined,
        flexShrink: 0,
        marginTop: 'auto',
      }}
      alignItems="center"
    >
      {!isMyPage && (
        <LikeButton
          postType={post.type === POST_TYPE.RESPONSE ? 'Response' : 'Note'}
          postId={post.id}
          currentUserLikeId={current_user_like_id}
          iconSize={23}
          refresh={refresh}
        />
      )}
      {displayType === 'LIST' && (
        <Layout.FlexRow w={48} h={48} alignItems="center" justifyContent="center">
          <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
        </Layout.FlexRow>
      )}
      {!!comment_count && (
        <Layout.FlexRow>
          <button
            type="button"
            onClick={displayType === 'LIST' ? handleClickCommentText : undefined}
          >
            <Typo type="label-large" color="BLACK" underline>
              {comment_count ?? 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
    </Layout.FlexRow>
  );
}

export default PostFooterLikeOnly;
