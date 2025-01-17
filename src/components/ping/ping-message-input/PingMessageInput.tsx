import { ChangeEvent, useContext, useMemo, useState } from 'react';
import { StyledTextInput } from '@components/ping/ping-message-input/PingMessageInput.styled';
import { UserPageContext } from '@components/user-page/UserPage.context';
import {
  BOTTOM_TABBAR_HEIGHT,
  MAX_WINDOW_WIDTH,
  PING_MESSAGE_INPUT_HEIGHT,
} from '@constants/layout';
import { Layout } from '@design-system';
import { postPingMessage } from '@utils/apis/ping';

const MAX_LENGTH = 30;
const PADDING = 10;
const INPUT_HEIGHT = PING_MESSAGE_INPUT_HEIGHT - PADDING * 2;

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
  return (
    <Layout.Fixed
      w="100%"
      style={{ maxWidth: MAX_WINDOW_WIDTH }}
      h={PING_MESSAGE_INPUT_HEIGHT}
      b={BOTTOM_TABBAR_HEIGHT}
      p={PADDING}
      bgColor="LIGHT"
    >
      <Layout.FlexRow w="100%" gap={10}>
        {/** emoji */}
        {/** TODO: emoji preset 입력 추가 */}
        <Layout.FlexRow bgColor="PRIMARY" h={INPUT_HEIGHT} rounded={8} p={8}>
          emoji picker
        </Layout.FlexRow>
        {/** text */}
        <Layout.FlexRow w="100%" h={INPUT_HEIGHT} bgColor="MEDIUM_GRAY" rounded={8} p={8}>
          <StyledTextInput
            type="text"
            maxLength={MAX_LENGTH}
            placeholder="text"
            value={messageInput}
            onChange={handleChangeMessage}
          />
          <Layout.FlexRow onClick={handleClickPost}>Post</Layout.FlexRow>
        </Layout.FlexRow>
      </Layout.FlexRow>
    </Layout.Fixed>
  );
}

export default PingMessageInput;
