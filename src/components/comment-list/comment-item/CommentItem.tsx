import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Icon from '@components/_common/icon/Icon';
import LikeButton from '@components/_common/like-button/LikeButton';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Layout, Typo } from '@design-system';
import { Comment, PrivateComment } from '@models/post';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface CommentItemProps {
  isPostAuthor?: boolean;
  comment: Comment | PrivateComment;
  replyAvailable?: boolean;
  onClickReplyBtn?: () => void;
}

function CommentItem({
  isPostAuthor,
  comment,
  onClickReplyBtn,
  replyAvailable = true,
}: CommentItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const { author_detail, created_at, is_private, replies } = comment;
  const { username, profile_image } = author_detail ?? {};
  const navigate = useNavigate();
  const [createdAt] = useState(() => (created_at ? new Date(created_at) : null));
  const [currentDate] = useState(() => new Date());

  const isUserAuthor = useBoundStore((state) => state.isUserAuthor);
  const isCommentAuthor = author_detail ? isUserAuthor((author_detail as User).id) : false;

  const handleReplyInput = () => {
    onClickReplyBtn?.();
  };

  // const handleSendMessage = () => {
  //   // TODO : 채팅방으로 이동
  // };

  const handleClickMore = () => {
    // TBU
  };

  const navigateToProfile = () => {
    navigate(`/users/${username}`);
  };

  return (
    <Layout.FlexCol w="100%">
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="flex-start" gap={8}>
        {/* Author Profile */}
        <Layout.FlexCol w={30}>
          <ProfileImage imageUrl={profile_image} size={30} onClick={navigateToProfile} />
        </Layout.FlexCol>
        {/* Author name, time, content */}
        <Layout.FlexCol flex={1} alignItems="center">
          <Layout.FlexCol w="100%" gap={4}>
            <Layout.FlexRow w="100%" alignItems="center">
              {is_private && <Icon name="private_comment" size={16} />}
              <Typo ml={3} type="label-medium">
                {username ?? 'Anonymous'}
              </Typo>
              <Layout.FlexRow ml={8}>
                <Typo type="label-small" color="MEDIUM_GRAY">
                  {createdAt &&
                    convertTimeDiffByString({
                      now: currentDate,
                      day: createdAt,
                      isShortFormat: true,
                    })}
                </Typo>
              </Layout.FlexRow>
            </Layout.FlexRow>
            <Typo
              pre
              type="body-medium"
              italic={comment.is_private && !comment.content}
              color={comment.is_private && !comment.content ? 'DARK_GRAY' : 'BLACK'}
            >{`${comment.content ?? t('private_placeholder')}`}</Typo>
            {/* Reply & Message buttons */}
            <Layout.FlexRow w="100%" gap={16} alignItems="center">
              {replyAvailable && (
                <button type="button" onClick={handleReplyInput}>
                  <Typo type="label-medium" color="DARK_GRAY">
                    {t('reply')}
                  </Typo>
                </button>
              )}
              {/* {!isCommentAuthor && isPostAuthor && (
                <button type="button" onClick={handleSendMessage}>
                  <Typo type="label-medium" color="DARK_GRAY">
                    {t('message')}
                  </Typo>
                </button>
              )} */}
            </Layout.FlexRow>
          </Layout.FlexCol>
        </Layout.FlexCol>
        {/* more button / like button */}
        <Layout.FlexCol w={24}>
          {isCommentAuthor ? (
            <Layout.FlexRow>
              <Icon name="dots_menu" size={24} onClick={handleClickMore} />
            </Layout.FlexRow>
          ) : (
            <LikeButton postType="Comment" post={comment} iconSize={15} />
          )}
        </Layout.FlexCol>
      </Layout.FlexRow>
      {/* replies */}
      <Layout.FlexCol w="100%" gap={8} pl={34} mt={14}>
        {replies?.map((reply) => (
          <CommentItem
            key={reply.id}
            isPostAuthor={isPostAuthor}
            comment={reply}
            onClickReplyBtn={onClickReplyBtn}
          />
        ))}
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default CommentItem;
