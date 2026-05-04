import ReactEmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import CommonDialog, {
  CommonDialogProps,
} from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import DeleteAlert from '@components/_common/alert-dialog/delete-alert/DeleteAlert';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import EmojiButton from '@components/_common/emoji-button/EmojiButton';
import Icon from '@components/_common/icon/Icon';
import LikeButton from '@components/_common/like-button/LikeButton';
import LinkifiedText from '@components/_common/linkified-text/LinkifiedText';
import PostReactionItem from '@components/_common/post-reaction-item/PostReactionItem';
import PostReactionList from '@components/_common/post-reaction-list/PostReactionList';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { StyledSwipeButton } from '@components/_common/swipe-layout/SwipeButton.styled';
import { SwipeLayout } from '@components/_common/swipe-layout/SwipeLayout';
import { EMOJI_CATEGORIES } from '@components/emoji-picker/EmojiPicker.constants';
import { SCREEN_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import useDeleteCommentAlert from '@hooks/useDeleteCommentAlert';
import { Comment, POST_TYPE, PrivateComment, ReactionUserSample } from '@models/post';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { reportContent } from '@utils/apis/common';
import { deleteReaction, postReaction } from '@utils/apis/reaction';
import { getUnifiedEmoji } from '@utils/emojiHelpers';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import CommentLikesPopup from '../comment-likes-popup/CommentLikesPopup';
import CommentReactionsPopup from '../comment-reactions-popup/CommentReactionsPopup';

interface CommentItemProps {
  isPostAuthor?: boolean;
  comment: Comment | PrivateComment;
  replyAvailable?: boolean;
  onClickReplyBtn?: (comment?: Comment | PrivateComment) => void;
  onDeleteComplete: (commentId: number) => void;
  onConfirmReport?: (commentId: number) => void;
  privateThread?: boolean;
}

type AlertProps = Pick<
  CommonDialogProps,
  'title' | 'content' | 'confirmText' | 'onClickConfirm' | 'cancelText'
>;

const CommentEmojiHighlight = createGlobalStyle<{ unifiedList: string[] }>`
  ${({ unifiedList }) =>
    unifiedList.map(
      (unified) => `
      .comment-emoji-picker [data-unified='${unified}'] {
        background-color: #C8EEFF !important;
        border-radius: 50% !important;
      }
    `,
    )}
`;

function CommentItem({
  isPostAuthor,
  comment,
  onClickReplyBtn,
  onDeleteComplete,
  replyAvailable = true,
  onConfirmReport,
  privateThread = false,
}: CommentItemProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const {
    author_detail,
    created_at,
    is_private,
    replies,
    like_user_sample,
    like_reaction_user_sample,
    current_user_reaction_id_list,
  } = comment;
  const { username, profile_image } = author_detail ?? {};
  const navigate = useNavigate();
  const [createdAt] = useState(() => (created_at ? new Date(created_at) : null));
  const [currentDate] = useState(() => new Date());
  const [showAlert, setShowAlert] = useState<AlertProps>();
  const { openToast, isUserAuthor } = useBoundStore((state) => ({
    openToast: state.openToast,
    isUserAuthor: state.isUserAuthor,
  }));
  const { featureFlags, myProfile } = useBoundStore(UserSelector);
  const isVerW = !featureFlags?.postsVerQ;

  const isCommentAuthor = author_detail ? isUserAuthor((author_detail as User).id) : false;

  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [myReactionList, setMyReactionList] = useState<{ id: number; emoji: string }[]>(
    current_user_reaction_id_list ?? [],
  );
  const [reactionSampleList, setReactionSampleList] = useState<ReactionUserSample[]>(
    like_reaction_user_sample ?? [],
  );
  const myEmojiList = myReactionList.map((r) => r.emoji);
  const unifiedEmojiList = myEmojiList.map((e) => getUnifiedEmoji(e));

  useEffect(() => {
    setMyReactionList(current_user_reaction_id_list ?? []);
  }, [current_user_reaction_id_list]);

  useEffect(() => {
    setReactionSampleList(like_reaction_user_sample ?? []);
  }, [like_reaction_user_sample]);

  const handleEmojiClick = useCallback(
    async (emoji: EmojiClickData) => {
      if (!myProfile) return;
      const isAlreadySelected = myEmojiList.includes(emoji.emoji);

      if (isAlreadySelected) {
        const targetReaction = myReactionList.find((r) => r.emoji === emoji.emoji);
        if (!targetReaction) return;
        await deleteReaction(targetReaction.id);
        setMyReactionList((prev) => prev.filter((r) => r.emoji !== emoji.emoji));
        setReactionSampleList((prev) =>
          prev.filter((s) => !(s.reaction === emoji.emoji && s.id === myProfile.id)),
        );
      } else {
        const response = await postReaction('Comment', comment.id, emoji.emoji);
        setMyReactionList((prev) => [...prev, { id: response.id, emoji: response.emoji }]);
        setReactionSampleList((prev) => [
          ...prev,
          {
            id: myProfile.id,
            like: false,
            reaction: emoji.emoji,
            profile_image: myProfile.profile_image,
            profile_pic: myProfile.profile_pic,
            url: myProfile.url,
            username: myProfile.username,
            bio: myProfile.bio,
            pronouns: myProfile.pronouns,
            user_interests: myProfile.user_interests,
            user_personas: myProfile.user_personas,
            connection_status: myProfile.connection_status,
          },
        ]);
      }
      setIsEmojiPickerOpen(false);
    },
    [comment.id, myEmojiList, myProfile, myReactionList],
  );

  const handleReplyInput = () => {
    onClickReplyBtn?.(comment);
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

  const handleOnCloseAlert = () => setShowAlert(undefined);
  const handleOnConfirmAlert = () => {
    handleOnCloseAlert();
  };

  const handleClickReport = () => {
    if (!comment.id) return;
    setShowAlert({
      title: t('report'),
      content: t('report_content'),
      confirmText: t('report_confirm'),
      cancelText: t('report_cancel'),
      onClickConfirm: async () => {
        await reportContent({
          postId: comment.id,
          postType: POST_TYPE.COMMENT,
          onSuccess: () => {
            openToast({ message: t('report_success') });
          },
          onError: () => openToast({ message: t('report_error') }),
        });
        onConfirmReport?.(comment.id);
        handleOnConfirmAlert();
      },
    });
  };

  const handleClickLikes = () => {
    setIsLikesModalOpen(true);
  };

  const handleCloseLikesModal = () => {
    setIsLikesModalOpen(false);
  };

  const handleClickUser = (user: string) => {
    navigate(`/users/${user}`);
    setIsLikesModalOpen(false);
  };

  return (
    <>
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
          <Layout.FlexRow w="100%" alignItems="flex-start" gap={8} ph={16}>
            {/* Author Profile */}
            <Layout.FlexCol w={30} style={{ flexShrink: 0 }}>
              <ProfileImage imageUrl={profile_image} size={30} onClick={navigateToProfile} />
            </Layout.FlexCol>
            {/* Author name, time, content */}
            <Layout.FlexCol style={{ flex: '1 1 0', minWidth: 0 }} alignItems="center">
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
                >
                  {comment.content ? (
                    <LinkifiedText>{comment.content}</LinkifiedText>
                  ) : (
                    t('private_placeholder')
                  )}
                </Typo>
                {/* Reply & Message buttons */}
                <Layout.FlexRow w="100%" gap={16} alignItems="center">
                  {replyAvailable &&
                    (!is_private || privateThread || isCommentAuthor || isPostAuthor) && (
                      <button type="button" onClick={handleReplyInput}>
                        <Typo type="label-medium" color="DARK_GRAY" bold>
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
            {/* like / reaction button */}
            <Layout.FlexCol style={{ flexShrink: 0, marginLeft: 'auto' }}>
              {privateThread || isVerW ? (
                <Layout.FlexRow alignItems="center">
                  {reactionSampleList.length > 0 && (
                    <Layout.FlexRow onClick={() => setIsReactionsModalOpen(true)}>
                      <PostReactionList user_sample_list={reactionSampleList} />
                    </Layout.FlexRow>
                  )}
                  {(privateThread || !is_private || isPostAuthor || isCommentAuthor) && (
                    <EmojiButton onClick={() => setIsEmojiPickerOpen(true)} />
                  )}
                </Layout.FlexRow>
              ) : (
                <Layout.FlexCol w={24}>
                  {isCommentAuthor ? (
                    <Layout.FlexRow onClick={handleClickLikes}>
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
                    (!is_private || isPostAuthor) && (
                      <LikeButton
                        postType="Comment"
                        postId={comment.id}
                        currentUserLikeId={comment.current_user_like_id}
                        iconSize={15}
                      />
                    )
                  )}
                </Layout.FlexCol>
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
              privateThread={privateThread}
            />
          ))}
        </Layout.FlexCol>
        <DeleteAlert
          visible={!!deleteTarget}
          close={closeDeleteAlert}
          onClickConfirm={confirmDeleteAlert}
        />
      </Layout.FlexCol>
      {comment.id && (
        <CommentLikesPopup
          isOpen={isLikesModalOpen}
          onClose={handleCloseLikesModal}
          commentId={comment.id}
          onClickUser={handleClickUser}
        />
      )}
      {comment.id && (
        <CommentReactionsPopup
          isOpen={isReactionsModalOpen}
          onClose={() => setIsReactionsModalOpen(false)}
          commentId={comment.id}
          onClickUser={handleClickUser}
        />
      )}
      {showAlert && (
        <CommonDialog
          visible={!!showAlert}
          onClickClose={handleOnCloseAlert}
          confirmTextColor="WARNING"
          {...showAlert}
        />
      )}
      {(privateThread || isVerW) &&
        isEmojiPickerOpen &&
        createPortal(
          <BottomModal
            visible={isEmojiPickerOpen}
            onClose={() => setIsEmojiPickerOpen(false)}
            customHeight={Math.round(SCREEN_HEIGHT * 0.55)}
            draggable
          >
            <Layout.FlexCol w="100%" h="100%">
              <CommentEmojiHighlight unifiedList={unifiedEmojiList} />
              <ReactEmojiPicker
                width="100%"
                height="100%"
                onEmojiClick={handleEmojiClick}
                autoFocusSearch={false}
                skinTonesDisabled
                searchPlaceHolder="Search emoji"
                previewConfig={{ showPreview: false }}
                categories={EMOJI_CATEGORIES}
                lazyLoadEmojis
                className="comment-emoji-picker"
                style={
                  {
                    '--epr-emoji-size': '28px',
                    '--epr-emoji-padding': '10px',
                    '--epr-search-input-height': '46px',
                    '--epr-header-padding': '8px var(--epr-horizontal-padding)',
                  } as CSSProperties
                }
              />
            </Layout.FlexCol>
          </BottomModal>,
          document.getElementById('modal-container') || document.body,
        )}
    </>
  );
}

export default CommentItem;
