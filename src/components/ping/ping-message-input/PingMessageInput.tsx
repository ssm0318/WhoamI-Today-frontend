import { ChangeEvent, useContext, useMemo, useState } from 'react';
import Icon from '@components/_common/icon/Icon';
import { StyledTextInput } from '@components/ping/ping-message-input/PingMessageInput.styled';
import { UserPageContext } from '@components/user-page/UserPage.context';
import {
  BOTTOM_TABBAR_HEIGHT,
  MAX_WINDOW_WIDTH,
  PING_MESSAGE_INPUT_HEIGHT,
} from '@constants/layout';
import { Layout } from '@design-system';
import { PingEmojiDict } from '@models/ping';
import { postPingMessage } from '@utils/apis/ping';

const MAX_LENGTH = 30;
// const INPUT_HEIGHT = PING_MESSAGE_INPUT_HEIGHT - PADDING * 2;

function PingMessageInput() {
  const { user } = useContext(UserPageContext);

  const userId = useMemo(() => {
    if (user.state !== 'hasValue' || !user.data) return;
    return user.data.id;
  }, [user.data, user.state]);

  const [messageInput, setMessageInput] = useState('');

  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleClickPost = () => {
    if (!messageInput || !userId) return;
    console.log('messageInput', messageInput);

    postPingMessage(userId, { content: messageInput, emoji: '' });
    setMessageInput('');
  };

  const [showEmojiList, setShowEmojiList] = useState(false);

  const handleToggleAddEmoji = () => {
    setShowEmojiList((prev) => !prev);
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
        <Icon name="ping_emoji_add" size={27} onClick={handleToggleAddEmoji} />
        {/** text */}
        <Layout.FlexRow w="100%" pr={5}>
          <StyledTextInput
            type="text"
            maxLength={MAX_LENGTH}
            placeholder="Send Ping .."
            value={messageInput}
            onChange={handleChangeMessage}
          />
          <Icon name="question_send" size={17} onClick={handleClickPost} color="MEDIUM_GRAY" />
        </Layout.FlexRow>
      </Layout.FlexRow>
      {showEmojiList && (
        <Layout.Absolute t={-20} l={14} bgColor="LIGHT" rounded={13} pv={4} ph={15}>
          <Layout.FlexRow gap={7}>
            {Object.entries(PingEmojiDict).map(([key, value]) => (
              <div key={key}>{value}</div>
            ))}
          </Layout.FlexRow>
        </Layout.Absolute>
      )}
    </Layout.Fixed>
  );
}

export default PingMessageInput;
