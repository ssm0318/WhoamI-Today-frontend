import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Button, CheckBox, Layout, SvgIcon, Typo } from '@design-system';
import { useGetAppMessage } from '@hooks/useAppMessage';
import { Comment, Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { postComment } from '@utils/apis/comments';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import * as S from './CommentInputBox.styled';

interface CommentInputBoxProps {
  isReply?: boolean;
  replyTo?: Comment | null;
  isPrivate?: boolean;
  setIsPrivate?: () => void;
  resetReplyTo?: () => void;
  resetCommentTo: () => void;
  resetCommentType: () => void;
  postType: 'Response' | 'Comment' | 'Note';
  post: Response | Comment | Note;
  inputFocusDuration?: number;
  inputFocus?: boolean;
  setInputFocus?: Dispatch<SetStateAction<boolean>>;
  reloadComments?: () => void;
  setReload?: (reload: boolean) => void;
  from: 'COMMENT_LIST' | 'COMMENT_BOTTOM_SHEET';
}

function CommentInputBox({
  isReply,
  isPrivate,
  setIsPrivate,
  replyTo,
  resetReplyTo,
  resetCommentTo,
  resetCommentType,
  postType,
  post,
  inputFocusDuration = 0,
  inputFocus,
  setInputFocus,
  reloadComments,
  setReload,
  from,
}: CommentInputBoxProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const { featureFlags } = useBoundStore(UserSelector);

  const myProfile = useBoundStore((state) => state.myProfile);
  const [content, setContent] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const initialIsPrivateRef = useRef(isPrivate);
  const [initialIsPrivate, setInitialIsPrivate] = useState(initialIsPrivateRef.current);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAndroid } = getMobileDeviceInfo();
  const { emojiPickerTarget } = useBoundStore((state) => ({
    emojiPickerTarget: state.emojiPickerTarget,
  }));
  const isEmojiPickerVisible =
    emojiPickerTarget &&
    (emojiPickerTarget.type === 'CheckIn' ||
      (emojiPickerTarget.type === post?.type && emojiPickerTarget.id === post?.id));

  // 앱에서 키보드 높이 정보 수신
  useGetAppMessage({
    key: 'KEYBOARD_HEIGHT',
    cb: (data) => {
      setKeyboardOpen(data.height > 0 && !isEmojiPickerVisible);
    },
  });

  useEffect(() => {
    if (!inputFocus) return;
    setTimeout(() => {
      commentRef?.current?.focus();
      setInputFocus?.(false);
    }, inputFocusDuration);
  }, [inputFocus, commentRef, inputFocusDuration, setInputFocus]);

  useEffect(() => {
    if (!featureFlags?.friendList) return;
    initialIsPrivateRef.current = isPrivate;
  }, [isPrivate, featureFlags?.friendList]);

  useEffect(() => {
    if (!featureFlags?.friendList || !isReply) return;
    setInitialIsPrivate(initialIsPrivateRef.current);
  }, [isReply, replyTo, featureFlags?.friendList]);

  const handleCheckboxChange = () => {
    if (!featureFlags?.friendList || initialIsPrivate) return;
    setIsPrivate?.();
  };

  const commentTargetAuthor =
    isReply && replyTo ? replyTo.author_detail?.username : post?.author_detail?.username;

  const placeholder =
    isReply && replyTo
      ? t('reply_place_holder', {
          username: commentTargetAuthor,
        })
      : t('comment_place_holder', {
          username: commentTargetAuthor,
        });

  const handleSubmitComment = () => {
    if (isSubmitting || !content) return;

    setIsSubmitting(true);
    postComment({
      target_id: post.id,
      target_type: postType,
      content: content.trim(),
      is_private: isPrivate,
    })
      .then(() => {
        setContent('');
        reloadComments?.();
        resetCommentTo();
        resetCommentType();
        resetReplyTo?.();
        setReload?.(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;

    e.preventDefault();
    setReload?.(true);
    handleSubmitComment();
  };

  const handleClickCloseReply = () => {
    resetReplyTo?.();
    resetCommentTo();
    resetCommentType();
    // 비밀 댓글이었을 경우, 비밀 댓글 해제
    if (isPrivate) setIsPrivate?.();
  };

  return (
    <S.CommentInputWrapper
      gap={10}
      w="100%"
      pv={12}
      ph={16}
      bgColor="WHITE"
      style={{
        position: 'relative',
        transition: 'bottom 0.2s ease-out',
        bottom: from === 'COMMENT_BOTTOM_SHEET' && isAndroid && keyboardOpen ? 50 : 0,
        zIndex: 1000,
      }}
    >
      {/* isPrivate */}
      {featureFlags?.friendList && (
        <Layout.FlexRow gap={4} alignItems="center">
          <CheckBox
            name={t('private_comment') || ''}
            onChange={handleCheckboxChange}
            checked={isPrivate}
            disabled={initialIsPrivate}
          />
          <SvgIcon
            name={isPrivate ? 'private_comment_active' : 'private_comment_inactive'}
            size={17}
          />
        </Layout.FlexRow>
      )}
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
              <SvgIcon name="close_comment" size={24} onClick={handleClickCloseReply} />
            </Layout.FlexRow>
          )}
          <S.CommentInput
            ref={commentRef}
            placeholder={placeholder}
            onChange={handleChangeInput}
            value={content}
            onKeyDown={handleKeyDown}
          />
        </Layout.FlexCol>

        <Button.Primary
          text={t('post')}
          status={content && !isSubmitting ? 'normal' : 'disabled'}
          onClick={handleSubmitComment}
        />
      </Layout.FlexRow>
    </S.CommentInputWrapper>
  );
}

export default CommentInputBox;
