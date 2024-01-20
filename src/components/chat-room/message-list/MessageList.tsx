import { useLayoutEffect, useRef } from 'react';
import { MessageItem } from '@components/chat-room/message-item/MessageItem';
import { Layout } from '@design-system';
import { ChatRoom, SocketMessage } from '@models/api/chat';

interface Props {
  room: ChatRoom;
  messages: SocketMessage[];
}

export function MessageList({ room, messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // 처음 입장시 스크롤 맨 아래로
  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  return (
    <Layout.FlexCol w="100%" gap={48} pv={15}>
      {/* TODO: 시스템 메시지, 날짜 표기 */}
      {messages.map((msg, index) => {
        const key = `${msg.timestamp}_${index}`;
        return <MessageItem key={key} room={room} message={msg} />;
      })}
    </Layout.FlexCol>
  );
}
