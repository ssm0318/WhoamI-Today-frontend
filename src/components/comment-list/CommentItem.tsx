import { useTranslation } from 'react-i18next';
import LikeButton from '@components/_common/like-button/LikeButton';
import UserProfile from '@components/_common/user-profile/UserProfile';
import { Font, Layout, SvgIcon } from '@design-system';
import { Comment } from '@models/post';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });

  const { author_detail, replies, is_reply } = comment;
  const { id, profile_image, username } = author_detail as User;

  const myProfile = useBoundStore((state) => state.myProfile);
  const isCommentAuthor = id === myProfile?.id;

  const toggleReplyInput = () => {
    console.log('toggle reply input');
  };

  const deleteComment = () => {
    console.log('delete comment');
  };

  return (
    <Layout.FlexCol w="100%" justifyContent="space-between">
      <Layout.FlexRow w="100%">
        <Layout.FlexCol w="100%">
          <Layout.FlexRow w="100%" alignItems="center" gap={8}>
            {/* FIXME: reply icon 교체 */}
            {is_reply && <SvgIcon name="arrow_right" color="BASIC_BLACK" size={20} />}
            <Layout.FlexRow alignItems="center" gap={5}>
              <UserProfile
                className="profile_img"
                imageUrl={profile_image}
                username={username}
                size={24}
              />
              <Font.Body type="14_semibold">{username}</Font.Body>
            </Layout.FlexRow>
            <Font.Body type="14_regular">{comment.content}</Font.Body>
          </Layout.FlexRow>
          <Layout.FlexRow w="100%" gap={10}>
            <Font.Body type="12_regular" color="GRAY_12">
              {convertTimeDiffByString(new Date(), new Date(comment.created_at))}
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
          {/* TODO: 대댓글 작성 */}
        </Layout.FlexCol>
        <LikeButton postType="Comment" post={comment} isAuthor={isCommentAuthor} />
      </Layout.FlexRow>
      {replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} />
      ))}
    </Layout.FlexCol>
  );
}

export default CommentItem;
