import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthorProfile from '@components/_common/author-profile/AuthorProfile';
import LikeButton from '@components/_common/like-button/LikeButton';
import { Font, Layout, SvgIcon } from '@design-system';
import { Comment } from '@models/post';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import CommentInputBox from '../comment-input-box/CommentInputBox';

interface CommentItemProps {
  comment: Comment;
  onClickReplyBtn?: () => void;
  onClickDeleteBtn: (comment: Comment) => void;
  reloadComments?: () => void;
}

function CommentItem({
  comment,
  onClickReplyBtn,
  onClickDeleteBtn,
  reloadComments,
}: CommentItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });

  const { author_detail, replies, is_reply, is_private } = comment;

  const isUserAuthor = useBoundStore((state) => state.isUserAuthor);
  const isCommentAuthor = isUserAuthor((author_detail as User).id);

  const [showReplyInput, setShowReplyInput] = useState(false);

  const toggleReplyInput = () => {
    setShowReplyInput((prev) => !prev);
    onClickReplyBtn?.();
  };

  const deleteComment = () => {
    onClickDeleteBtn?.(comment);
  };

  return (
    <Layout.FlexCol w="100%" justifyContent="space-between" gap={2}>
      <Layout.FlexRow w="100%" alignItems="center">
        <Layout.FlexCol w="100%">
          <Layout.FlexRow w="100%" alignItems="center" gap={8}>
            {/* FIXME: reply icon 교체 */}
            {is_reply && <SvgIcon name="arrow_right" color="BASIC_BLACK" size={20} />}
            {is_private && <SvgIcon name="lock_on" size={20} />}
            <AuthorProfile authorDetail={author_detail} profileImgSize={24} />
            {/* TODO: 줄바꿈 표시 */}
            <Font.Body type="14_regular">{comment.content}</Font.Body>
          </Layout.FlexRow>
          <Layout.FlexRow w="100%" gap={10}>
            <Font.Body type="12_regular" color="GRAY_12">
              {convertTimeDiffByString(
                new Date(),
                new Date(comment.created_at),
                'yyyy.MM.dd HH:mm',
              )}
            </Font.Body>
            <Layout.FlexRow gap={5}>
              <button type="button" onClick={toggleReplyInput}>
                <Font.Body type="12_semibold" color="GRAY_12">
                  {t('reply')}
                </Font.Body>
              </button>
              {isCommentAuthor && (
                <button type="button" onClick={deleteComment}>
                  <Font.Body type="12_semibold" color="GRAY_12">
                    {t('delete')}
                  </Font.Body>
                </button>
              )}
            </Layout.FlexRow>
          </Layout.FlexRow>
        </Layout.FlexCol>
        <LikeButton postType="Comment" post={comment} iconSize={15} />
      </Layout.FlexRow>
      <Layout.FlexCol w="100%" gap={2}>
        {replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            onClickReplyBtn={toggleReplyInput}
            onClickDeleteBtn={onClickDeleteBtn}
          />
        ))}
      </Layout.FlexCol>
      {!is_reply && showReplyInput && (
        <CommentInputBox
          isReply
          forcePrivate={is_private}
          post={comment}
          postType="Comment"
          reloadComments={reloadComments}
        />
      )}
    </Layout.FlexCol>
  );
}

export default CommentItem;
