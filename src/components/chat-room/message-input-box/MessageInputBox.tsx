import { ChangeEvent, KeyboardEvent, useState } from 'react';
import Icon from '@components/_common/icon/Icon';
import {
  MessageInput,
  StyledMessageInputBox,
} from '@components/chat-room/message-input-box/MessageInputBox.styled';
import { Layout } from '@design-system';
import { SendChatRoomSocketData } from '@models/api/chat';
import { User } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';

const PLACE_HOLDER = 'Message...';

interface Props {
  participants?: User[];
  sendSocketData: (data: SendChatRoomSocketData) => void;
}

export function MessageInputBox({ participants, sendSocketData }: Props) {
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
    if (!currentUser || !participants) return;

    const parentId = participants[0].id;
    sendSocketData({
      action: 'message',
      content: inputValue,
      userName: currentUser.username,
      userId: currentUser.id,
      parentId,
    });
    setInputValue('');
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <StyledMessageInputBox>
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center" gap={8}>
        {!isFocused && !inputValue && <Icon name="chat_media_image" size={24} fill="DARK_GRAY" />}
        <MessageInput
          value={inputValue}
          placeholder={PLACE_HOLDER}
          onChange={handleChangeInput}
          onKeyDown={handleKeyDownInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Layout.FlexRow>
      {(isFocused || !!inputValue) && (
        <Layout.FlexRow w="100%" justifyContent="space-between">
          <Icon name="chat_media_image" size={24} fill="DARK_GRAY" />
          {inputValue && (
            <Icon name="question_send" size={24} onClick={handleClickSendMsg} color="PRIMARY" />
          )}
        </Layout.FlexRow>
      )}
    </StyledMessageInputBox>
  );
}
