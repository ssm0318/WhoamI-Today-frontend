import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteAlert from '@components/_common/alert-dialog/delete-alert/DeleteAlert';
import Icon from '@components/_common/icon/Icon';
import LikeButton from '@components/_common/like-button/LikeButton';
import PostReactionItem from '@components/_common/post-reaction-item/PostReactionItem';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { StyledSwipeButton } from '@components/chats/chat-room-list/ChatRoomItem.styled';
import { Layout, Typo } from '@design-system';
import useDeleteCommentAlert from '@hooks/useDeleteCommentAlert';
import { Comment, PrivateComment } from '@models/post';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface CommentItemProps {
  isPostAuthor?: boolean;
  comment: Comment | PrivateComment;
  replyAvailable?: boolean;
  onClickReplyBtn?: () => void;
  onDeleteComplete: (commentId: number) => void;
}

function CommentItem({
  isPostAuthor,
  comment,
  onClickReplyBtn,
  onDeleteComplete,
  replyAvailable = true,
}: CommentItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const { author_detail, created_at, is_private, replies, like_user_sample } = comment;
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

  const navigateToProfile = () => {
    navigate(`/users/${username}`);
  };

  const { deleteTarget, setDeleteTarget, confirmDeleteAlert, closeDeleteAlert } =
    useDeleteCommentAlert({
      onDeleteComplete,
    });

  const handleClickDelete = () => {
    setDeleteTarget(comment);
  };

  const handleClickReport = () => {
    // TODO
  };

  const handleClickLikes = () => {
    navigate(`/comments/${comment.id}/likes`);
  };

  return (
    <Layout.FlexCol w="100%">
      <SwipeLayout
        rightContent={[
          isCommentAuthor ? (
            <StyledSwipeButton key="hide" backgroundColor="ERROR" onClick={handleClickDelete}>
              <Typo type="body-medium" color="WHITE" textAlign="center">
                {t('delete')}
              </Typo>
            </StyledSwipeButton>
          ) : (
            <StyledSwipeButton key="hide" backgroundColor="ERROR" onClick={handleClickReport}>
              <Typo type="body-medium" color="WHITE" textAlign="center">
                {t('report')}
              </Typo>
            </StyledSwipeButton>
          ),
        ]}
      >
        <Layout.FlexRow
          w="100%"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={8}
          ph={16}
        >
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
          {/* like button */}
          <Layout.FlexCol w={24}>
            {isCommentAuthor ? (
              <Layout.FlexRow onClick={handleClickLikes}>
                {/* <ProfileImageList images={like_user_sample.map((user) => user.profile_image)} /> */}
                {like_user_sample.map((user) => (
                  <PostReactionItem
                    key={user.username}
                    imageUrl={user.profile_image}
                    like
                    emoji={null}
                  />
                ))}
              </Layout.FlexRow>
            ) : (
              <LikeButton postType="Comment" post={comment} iconSize={15} />
            )}
          </Layout.FlexCol>
        </Layout.FlexRow>
      </SwipeLayout>
      {/* replies */}
      <Layout.FlexCol w="100%" gap={8} pl={34} mt={14}>
        {replies?.map((reply) => (
          <CommentItem
            key={reply.id}
            isPostAuthor={isPostAuthor}
            comment={reply}
            onClickReplyBtn={onClickReplyBtn}
            onDeleteComplete={onDeleteComplete}
          />
        ))}
      </Layout.FlexCol>
      <DeleteAlert
        visible={!!deleteTarget}
        close={closeDeleteAlert}
        onClickConfirm={confirmDeleteAlert}
      />
    </Layout.FlexCol>
  );
}
export default CommentItem;
