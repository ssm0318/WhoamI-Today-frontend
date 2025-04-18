import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
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
import { InputPingMessage, PingEmojiDict, PingEmojiType, PostPingMessageRes } from '@models/ping';
import { postPingMessage } from '@utils/apis/ping';

const MAX_LENGTH = 10000;

interface Props {
  insertPing: (ping: PostPingMessageRes) => void;
  userId: number;
}

function PingMessageInput({ insertPing, userId }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'ping' });

  const [messageInput, setMessageInput] = useState('');
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<PingEmojiType | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

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
        bottom: BOTTOM_TABBAR_HEIGHT,
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
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
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
