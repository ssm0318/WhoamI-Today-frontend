import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { Note, POST_DP_TYPE, POST_TYPE, Response } from '@models/post';
import Icon from '../icon/Icon';

type PostFooterProps = {
  post: Response | Note;
  displayType?: POST_DP_TYPE;
  showComments: () => void;
  setInputFocus: () => void;
};

// default 버전
// - 이모지 리액션 불가능
// - 리액션 숫자 노출
function PostFooterDefault({
  post,
  displayType = 'LIST',
  showComments,
  setInputFocus,
}: PostFooterProps) {
  const { comment_count } = post;
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
    <Layout.FlexRow gap={8} alignItems="center">
      <Layout.FlexRow gap={8} alignItems="center">
        {displayType === 'LIST' && (
          <Icon name="add_comment" size={23} onClick={handleClickCommentIcon} />
        )}
      </Layout.FlexRow>
      {!!comment_count && (
        <Layout.FlexRow>
          <button
            type="button"
            onClick={displayType === 'LIST' ? handleClickCommentText : undefined}
          >
            <Typo type="label-large" color="BLACK" underline>
              {comment_count || 0} {t('comments')}
            </Typo>
          </button>
        </Layout.FlexRow>
      )}
    </Layout.FlexRow>
  );
}

export default PostFooterDefault;
