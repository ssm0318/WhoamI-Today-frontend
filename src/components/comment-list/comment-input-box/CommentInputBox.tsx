import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, CheckBox, Layout, SvgIcon, Typo } from '@design-system';
import { Comment, Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { postComment } from '@utils/apis/comments';
import * as S from './CommentInputBox.styled';

interface CommentInputBoxProps {
  isReply?: boolean;
  replyTo?: Comment | null;
  setReplyTo?: () => void;
  postType: 'Response' | 'Comment' | 'Note';
  post: Response | Comment | Note;
  reloadComments?: () => void;
}

function CommentInputBox({
  isReply,
  replyTo,
  setReplyTo,
  postType,
  post,
  reloadComments,
}: CommentInputBoxProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const myProfile = useBoundStore((state) => state.myProfile);
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const commentTargetAuthor =
    isReply && replyTo ? replyTo.author_detail.username : post?.author_detail.username;

  const placeholder =
    isReply && replyTo
      ? t('reply_place_holder', {
          username: commentTargetAuthor,
        })
      : t('comment_place_holder', {
          username: commentTargetAuthor,
        });

  const handleSubmitComment = () => {
    if (!content) return;
    postComment({
      target_id: post.id,
      target_type: postType,
      content: content.trim(),
      is_private: isPrivate,
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
    <Layout.FlexCol gap={10} w="100%" pv={12} ph={16} outline="LIGHT_GRAY">
      {/* isPrivate */}
      <Layout.FlexRow gap={4} alignItems="center">
        <CheckBox name={t('private_comment') || ''} onChange={togglePrivate} checked={isPrivate} />
        <SvgIcon
          name={isPrivate ? 'private_comment_active' : 'private_comment_inactive'}
          size={17}
        />
      </Layout.FlexRow>
      <Layout.FlexRow w="100%" alignItems="flex-end" justifyContent="space-between">
        {myProfile && <ProfileImage imageUrl={myProfile.profile_image} size={36} />}
        <Layout.FlexCol w="100%" ml={4} mr={8} outline="LIGHT_GRAY" rounded={18}>
          {isReply && replyTo && (
            <Layout.FlexRow
              ph={10}
              pv={5}
              bgColor="LIGHT_GRAY"
              alignItems="center"
              w="100%"
              justifyContent="space-between"
            >
              <Typo type="body-medium" color="DARK_GRAY">
                {t('replying_to', {
                  username: commentTargetAuthor,
                })}
              </Typo>
              <SvgIcon name="close_comment" size={24} onClick={setReplyTo} />
            </Layout.FlexRow>
          )}
          <S.CommentInput
            placeholder={placeholder}
            onChange={handleChangeInput}
            value={content}
            onKeyDown={handleKeyDown}
          />
        </Layout.FlexCol>

        <Button.Primary text={t('post')} status="normal" onClick={handleSubmitComment} />
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

export default CommentInputBox;
