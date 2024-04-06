import { useRef } from 'react';
import { MessageItem } from '@components/chat-room/message-item/MessageItem';
import { Layout } from '@design-system';
import { ChatRoom, ChatSocketData } from '@models/api/chat';

interface Props {
  room: ChatRoom;
  messages: ChatSocketData[];
}

export function MessageList({ room, messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <Layout.FlexCol w="100%" gap={48} pv={15}>
      {/* TODO: 시스템 메시지, 날짜 표기 */}
      {messages.map((msg, index) => {
        const key = `${msg.timestamp}_${index}`;
        return <MessageItem key={key} room={room} message={msg} />;
      })}
      <div ref={bottomRef} />
    </Layout.FlexCol>
  );
}
