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
import { useIsVirtualKeyboardOpenInIOS } from '@components/comment-list/comment-input-box/_hooks/useIsVirtualKeyboardOpenInIOS';
import { Button, Layout, SvgIcon, Typo } from '@design-system';
import { Comment, Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { postComment } from '@utils/apis/comments';
import * as S from './CommentInputBox.styled';

interface CommentInputBoxProps {
  isReply?: boolean;
  replyTo?: Comment | null;
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
}

function CommentInputBox({
  isReply,
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
}: CommentInputBoxProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });

  const myProfile = useBoundStore((state) => state.myProfile);
  const [content, setContent] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!inputFocus) return;
    setTimeout(() => {
      commentRef?.current?.focus();
      setInputFocus?.(false);
    }, inputFocusDuration);
  }, [inputFocus, commentRef, inputFocusDuration, setInputFocus]);

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

  const isPosingCommentRef = useRef(false);

  const handleSubmitComment = () => {
    if (isPosingCommentRef.current) return;
    if (!content) {
      isPosingCommentRef.current = false;
      return;
    }

    isPosingCommentRef.current = true;

    postComment({
      target_id: post.id,
      target_type: postType,
      content: content.trim(),
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
        isPosingCommentRef.current = false;
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
  };

  const isVirtualKeyboardOpen = useIsVirtualKeyboardOpenInIOS();

  useEffect(() => {
    const blurInputOnTouchMoveOutside = (e: Event) => {
      if (!isVirtualKeyboardOpen) return;

      if (commentRef.current && !commentRef.current.contains(e.target as Node)) {
        commentRef?.current?.blur();
      }
    };

    document.addEventListener('touchmove', blurInputOnTouchMoveOutside);
    return () => {
      document.removeEventListener('touchmove', blurInputOnTouchMoveOutside);
    };
  }, [isVirtualKeyboardOpen]);

  return (
    <S.CommentInputWrapper gap={10} w="100%" pv={12} ph={16} bgColor="WHITE">
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
          status={content ? 'normal' : 'disabled'}
          onClick={handleSubmitComment}
        />
      </Layout.FlexRow>
    </S.CommentInputWrapper>
  );
}

export default CommentInputBox;
