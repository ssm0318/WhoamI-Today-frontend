import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Layout, SvgIcon } from '@design-system';
import { Comment, MomentPost, QuestionResponse } from '@models/post';
import { postComment } from '@utils/apis/comments';
import * as S from './CommentInputBox.styled';

interface CommentInputBoxProps {
  isReply?: boolean;
  postType: 'Moment' | 'Response' | 'Comment';
  post: MomentPost | QuestionResponse | Comment;
  reloadComments?: () => void;
}

function CommentInputBox({ isReply, postType, post, reloadComments }: CommentInputBoxProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const placeholder = isReply ? t('reply_place_holder') : t('comment_place_holder');

  const [content, setContent] = useState('');

  const handleSubmitComment = () => {
    if (!content) return;
    postComment({ target_id: post.id, target_type: postType, content: content.trim() }).then(() => {
      setContent('');
      reloadComments?.();
    });
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between" gap={5}>
      {/* FIXME: reply icon 교체 */}
      {isReply && <SvgIcon name="arrow_right" color="BASIC_BLACK" size={20} />}
      <S.CommentInput placeholder={placeholder} onChange={handleChangeInput} value={content} />
      <Button.Small
        text={t('post')}
        type="white_fill"
        status="normal"
        onClick={handleSubmitComment}
      />
    </Layout.FlexRow>
  );
}

export default CommentInputBox;
