import { ChangeEvent, KeyboardEvent, useState } from 'react';
import {
  MessageInput,
  StyledMessageInputBox,
} from '@components/chat-room/message-input-box/MessageInputBox.styled';
import Icon from '@components/header/icon/Icon';
import { Layout } from '@design-system';
import { SocketMessageInput } from '@models/api/chat';
import { useBoundStore } from '@stores/useBoundStore';

const PLACE_HOLDER = 'Message...';

interface Props {
  sendSocketMsg: (msg: SocketMessageInput) => void;
}

export function MessageInputBox({ sendSocketMsg }: Props) {
  // TODO: input length 제한
  const [inputValue, setInputValue] = useState('');

  const handleChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDownInput = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    if (e.shiftKey) return;

    e.preventDefault();
    sendMessage();
  };

  const handleClickSendMsg = () => {
    sendMessage();
  };

  const currentUser = useBoundStore.getState().myProfile;

  const sendMessage = () => {
    if (!currentUser) return;

    sendSocketMsg({
      message: inputValue,
      userName: currentUser.username,
      userId: currentUser.id,
    });
    setInputValue('');
  };

  return (
    <StyledMessageInputBox>
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
        <MessageInput
          value={inputValue}
          placeholder={PLACE_HOLDER}
          onChange={handleChangeInput}
          onKeyDown={handleKeyDownInput}
        />
      </Layout.FlexRow>
      <Layout.LayoutBase>
        {inputValue ? (
          <Icon name="question_send" size={24} onClick={handleClickSendMsg} />
        ) : (
          <Layout.FlexRow w="100%">
            <Icon name="chat_media_image" size={24} />
            <Icon name="chat_media_gif" size={24} />
          </Layout.FlexRow>
        )}
      </Layout.LayoutBase>
    </StyledMessageInputBox>
  );
}
