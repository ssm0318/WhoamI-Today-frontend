import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Layout, SvgIcon } from '@design-system';
import { Comment, MomentPost, QuestionResponse, Response } from '@models/post';
import { postComment } from '@utils/apis/comments';
import * as S from './CommentInputBox.styled';

interface CommentInputBoxProps {
  isReply?: boolean;
  forcePrivate?: boolean;
  postType: 'Moment' | 'Response' | 'Comment';
  post: MomentPost | QuestionResponse | Response | Comment;
  reloadComments?: () => void;
}

function CommentInputBox({
  isReply,
  forcePrivate,
  postType,
  post,
  reloadComments,
}: CommentInputBoxProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const placeholder = isReply ? t('reply_place_holder') : t('comment_place_holder');

  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmitComment = () => {
    if (!content) return;
    postComment({
      target_id: post.id,
      target_type: postType,
      content: content.trim(),
      is_private: forcePrivate || isPrivate,
    }).then(() => {
      setContent('');
      reloadComments?.();
    });
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;

    e.preventDefault();
    handleSubmitComment();
  };

  const togglePrivate = () => {
    setIsPrivate((prev) => !prev);
  };

  return (
    <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between" gap={5}>
      {/* FIXME: reply icon 교체 */}
      {isReply && <SvgIcon name="arrow_right" color="BASIC_BLACK" size={20} />}
      {isReply && forcePrivate && <SvgIcon name="lock_on" size={20} />}
      <S.CommentInput
        placeholder={placeholder}
        onChange={handleChangeInput}
        value={content}
        onKeyDown={handleKeyDown}
      />
      {!isReply && (
        <Layout.FlexRow>
          <button type="button" onClick={togglePrivate}>
            <SvgIcon name={isPrivate ? 'lock_on' : 'lock_off'} size={24} />
          </button>
        </Layout.FlexRow>
      )}
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
