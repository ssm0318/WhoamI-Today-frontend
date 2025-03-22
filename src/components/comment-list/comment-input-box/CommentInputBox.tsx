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
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import { Comment, Note, Response } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { postComment } from '@utils/apis/comments';
import { isApp } from '@utils/getUserAgent';
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
}: CommentInputBoxProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'comment' });
  const { featureFlags } = useBoundStore(UserSelector);
  const sendMessage = usePostAppMessage();

  const myProfile = useBoundStore((state) => state.myProfile);
  const [content, setContent] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const initialIsPrivateRef = useRef(isPrivate);
  const [initialIsPrivate, setInitialIsPrivate] = useState(initialIsPrivateRef.current);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // 앱에서 키보드 높이 정보 수신
  useGetAppMessage({
    key: 'KEYBOARD_HEIGHT',
    cb: (data) => {
      setKeyboardHeight(data.height);
      setKeyboardOpen(data.height > 0);
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

  // 브라우저에서 테스트할 때는 visualViewport를 사용 (앱에서는 필요 없음)
  useEffect(() => {
    if (!isApp && window.visualViewport) {
      const handleResize = () => {
        if (!window.visualViewport) return;

        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;

        // 뷰포트 높이가 창 높이보다 작아지면 키보드가 열린 것으로 간주
        if (viewportHeight < windowHeight) {
          setKeyboardOpen(true);
          // 키보드 높이 계산
          const calculatedKeyboardHeight = windowHeight - viewportHeight;
          setKeyboardHeight(calculatedKeyboardHeight);
        } else {
          setKeyboardOpen(false);
          setKeyboardHeight(0);
        }
      };

      const { visualViewport } = window;
      visualViewport.addEventListener('resize', handleResize);

      return () => {
        visualViewport.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // 입력 필드 포커스 처리
  useEffect(() => {
    const handleFocus = () => {
      // ReactNative WebView에 키보드가 열렸음을 알림
      if (isApp) {
        try {
          sendMessage('KEYBOARD_OPENED', {});
        } catch (error) {
          console.error('Error posting message to React Native WebView:', error);
        }
      }
    };

    const inputElement = commentRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
      }
    };
  }, [sendMessage]);

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
        bottom: keyboardOpen ? keyboardHeight : 0,
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
          status={content ? 'normal' : 'disabled'}
          onClick={handleSubmitComment}
        />
      </Layout.FlexRow>
    </S.CommentInputWrapper>
  );
}

export default CommentInputBox;
