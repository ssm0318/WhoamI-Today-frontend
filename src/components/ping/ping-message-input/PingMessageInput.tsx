import { ChangeEvent, KeyboardEvent, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@components/_common/icon/Icon';
import { StyledTextInput } from '@components/ping/ping-message-input/PingMessageInput.styled';
import { UserPageContext } from '@components/user-page/UserPage.context';
import {
  BOTTOM_TABBAR_HEIGHT,
  MAX_WINDOW_WIDTH,
  PING_MESSAGE_INPUT_HEIGHT,
} from '@constants/layout';
import { Layout } from '@design-system';
import { InputPingMessage, PingEmojiDict, PingEmojiType, PostPingMessageRes } from '@models/ping';
import { postPingMessage } from '@utils/apis/ping';

const MAX_LENGTH = 30;

interface Props {
  insertPing: (ping: PostPingMessageRes) => void;
}

function PingMessageInput({ insertPing }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'ping' });
  const { user } = useContext(UserPageContext);

  const userId = useMemo(() => {
    if (user.state !== 'hasValue' || !user.data) return;
    return user.data.id;
  }, [user.data, user.state]);

  const [messageInput, setMessageInput] = useState('');
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<PingEmojiType | undefined>();

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClickPost();
    }
  };

  const handleClickPost = () => {
    if (!userId) return;
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
      style={{ maxWidth: MAX_WINDOW_WIDTH }}
      h={PING_MESSAGE_INPUT_HEIGHT}
      b={BOTTOM_TABBAR_HEIGHT}
      ph={14}
      pv={10}
      bgColor="WHITE"
    >
      <Layout.FlexRow
        w="100%"
        gap={10}
        rounded={13}
        outline="DARK_GRAY"
        p={8}
        alignItems="center"
        justifyContent="space-between"
        style={{ position: 'relative' }}
      >
        {/** emoji */}
        {selectedEmoji ? (
          <button type="button" onClick={handleToggleAddEmoji}>
            <div style={{ fontSize: 22, width: 27 }}>{PingEmojiDict[selectedEmoji]}</div>
          </button>
        ) : (
          <Icon name="ping_emoji_add" size={27} onClick={handleToggleAddEmoji} />
        )}
        {/** text */}
        <Layout.FlexRow w="100%" pr={5}>
          <StyledTextInput
            type="text"
            maxLength={MAX_LENGTH}
            placeholder={t('input_placeholder') || ''}
            value={messageInput}
            onChange={handleChangeMessage}
            onKeyDown={handleKeyDownInput}
          />
          <Icon name="question_send" size={17} onClick={handleClickPost} color="MEDIUM_GRAY" />
        </Layout.FlexRow>
      </Layout.FlexRow>
      {showEmojiList && (
        <Layout.Absolute t={-28} l={14} bgColor="LIGHT" rounded={13} pv={2} ph={15}>
          <Layout.FlexRow gap={7}>
            {Object.entries(PingEmojiDict).map(([key, value]) => (
              <button key={key} type="button" onClick={handleClickEmoji(key)}>
                <div style={{ fontSize: 20 }}>{value}</div>
              </button>
            ))}
          </Layout.FlexRow>
        </Layout.Absolute>
      )}
    </Layout.Fixed>
  );
}

export default PingMessageInput;
