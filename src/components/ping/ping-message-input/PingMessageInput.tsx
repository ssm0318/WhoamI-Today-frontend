import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@components/_common/icon/Icon';
import { StyledTextInput } from '@components/ping/ping-message-input/PingMessageInput.styled';
import {
  BOTTOM_TABBAR_HEIGHT,
  MAX_WINDOW_WIDTH,
  PING_EMOJI_AREA_SIZE,
  PING_EMOJI_FONT_SIZE,
  PING_MESSAGE_INPUT_HEIGHT,
} from '@constants/layout';
import { Colors, Layout } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import { InputPingMessage, PingEmojiDict, PingEmojiType, PostPingMessageRes } from '@models/ping';
import { postPingMessage } from '@utils/apis/ping';
import { isApp } from '@utils/getUserAgent';

const MAX_LENGTH = 10000;

interface Props {
  insertPing: (ping: PostPingMessageRes) => void;
  userId: number;
}

function PingMessageInput({ insertPing, userId }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'ping' });
  const sendMessage = usePostAppMessage();

  const [messageInput, setMessageInput] = useState('');
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<PingEmojiType | undefined>();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 키보드 높이 메시지 수신 - 앱에서 전달받음
  useGetAppMessage({
    key: 'KEYBOARD_HEIGHT',
    cb: (data) => {
      console.log('Received keyboard height from app:', data.height);
      setKeyboardHeight(data.height);
      setKeyboardOpen(data.height > 0);
    },
  });

  useEffect(() => {
    // 브라우저에서 테스트할 때는 visualViewport를 사용
    // 앱에서는 앱이 직접 높이를 전달함
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
    // 입력 필드에 포커스가 있을 때 스크롤 조정
    const handleFocus = () => {
      // 입력 필드로 스크롤 이동
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

      // ReactNative WebView에 키보드가 열렸음을 알림 (usePostAppMessage 훅 사용)
      if (isApp) {
        try {
          console.log('Sending KEYBOARD_OPENED to app');
          sendMessage('KEYBOARD_OPENED', {});
        } catch (error) {
          console.error('Error posting message to React Native WebView:', error);
        }
      }
    };

    // 안드로이드 WebView에서 추가 대응
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
      }
    };
  }, [sendMessage]);

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      handleClickPost();
    }
  };

  const handleClickPost = () => {
    if (!userId || (!messageInput && !selectedEmoji)) return;
    const inputData: InputPingMessage = { content: messageInput, emoji: selectedEmoji ?? '' };

    setMessageInput('');
    setSelectedEmoji(undefined);
    postPingMessage(userId, inputData).then(({ data: ping }) => {
      insertPing(ping);
    });
  };

  const handleToggleAddEmoji = () => {
    setShowEmojiList((prev) => !prev);
  };

  const handleClickEmoji = (emoji: string) => () => {
    setSelectedEmoji((prev) => {
      if (prev === emoji) return undefined;
      return emoji as PingEmojiType;
    });
    setShowEmojiList(false);
  };

  return (
    <Layout.Fixed
      w="100%"
      style={{
        maxWidth: MAX_WINDOW_WIDTH,
        borderTop: `1px solid ${Colors.LIGHT}`,
        bottom: keyboardOpen ? keyboardHeight : BOTTOM_TABBAR_HEIGHT,
        transition: 'bottom 0.2s ease-out',
        zIndex: 1000,
      }}
      h={PING_MESSAGE_INPUT_HEIGHT}
      ph={14}
      pv={8}
      bgColor="WHITE"
    >
      <Layout.FlexRow
        w="100%"
        gap={10}
        rounded={13}
        outline="LIGHT_GRAY"
        bgColor="LIGHT"
        ph={8}
        pv={9}
        alignItems="center"
        justifyContent="space-between"
        style={{ position: 'relative' }}
      >
        {/** emoji */}
        {selectedEmoji ? (
          <button type="button" onClick={handleToggleAddEmoji}>
            <div
              style={{
                fontSize: PING_EMOJI_FONT_SIZE,
                width: PING_EMOJI_AREA_SIZE,
                height: PING_EMOJI_AREA_SIZE,
              }}
            >
              {PingEmojiDict[selectedEmoji]}
            </div>
          </button>
        ) : (
          <Icon name="ping_emoji_add" size={PING_EMOJI_AREA_SIZE} onClick={handleToggleAddEmoji} />
        )}
        {/** text */}
        <Layout.FlexRow w="100%" pr={5} alignItems="center">
          <StyledTextInput
            ref={inputRef}
            type="text"
            maxLength={MAX_LENGTH}
            placeholder={t('input_placeholder') || ''}
            value={messageInput}
            onChange={handleChangeMessage}
            onKeyDown={handleKeyDownInput}
          />
          <Layout.FlexRow
            rounded={22}
            bgColor="PRIMARY"
            ph={6}
            pb={4}
            pt={6}
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="question_send" size={20} onClick={handleClickPost} color="LIGHT" />
          </Layout.FlexRow>
        </Layout.FlexRow>
      </Layout.FlexRow>
      {showEmojiList && (
        <Layout.Absolute
          t={-32}
          l={14}
          bgColor="LIGHT"
          outline="LIGHT_GRAY"
          rounded={13}
          pv={2}
          ph={15}
        >
          <Layout.FlexRow gap={10}>
            {Object.entries(PingEmojiDict).map(([key, value]) => (
              <button key={key} type="button" onClick={handleClickEmoji(key)}>
                <div style={{ fontSize: PING_EMOJI_FONT_SIZE }}>{value}</div>
              </button>
            ))}
          </Layout.FlexRow>
        </Layout.Absolute>
      )}
    </Layout.Fixed>
  );
}

export default PingMessageInput;
