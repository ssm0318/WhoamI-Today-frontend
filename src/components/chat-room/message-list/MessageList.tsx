import { useRef } from 'react';
import { MessageItem } from '@components/chat-room/message-item/MessageItem';
import { Layout } from '@design-system';
import { ChatRoom, ResponseMessageAction, SendChatRoomSocketData } from '@models/api/chat';

interface Props {
  room: ChatRoom;
  messages: ResponseMessageAction[];
  sendSocketData: (msg: SendChatRoomSocketData) => void;
}

export function MessageList({ room, messages, sendSocketData }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const likeMsg = (messageId: number) => {
    sendSocketData({
      action: 'like',
      messageId,
    });
  };

  const removeLikeMsg = (messageLikeId: number) => {
    sendSocketData({
      action: 'remove_like',
      messageLikeId,
    });
  };

  return (
    <>
      <Layout.FlexCol w="100%" gap={48} pv={15}>
        {messages.map((msg, index) => {
          const key = `${msg.timestamp}_${index}`;
          return (
            <MessageItem
              key={key}
              room={room}
              message={msg}
              like={likeMsg}
              removeLike={removeLikeMsg}
            />
          );
        })}
      </Layout.FlexCol>
      <div ref={bottomRef} />
    </>
  );
}
