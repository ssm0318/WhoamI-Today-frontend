import { useEffect, useRef } from 'react';
import { MessageItem } from '@components/chat-room/message-item/MessageItem';
import { Layout } from '@design-system';
import { ChatRoom, SocketMessage } from '@models/api/chat';

interface Props {
  room: ChatRoom;
  messages: SocketMessage[];
}

export function MessageList({ room, messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // TODO: 스크롤 맨 위로 올리면 이전 메시지 불러오기

  // FIXME: 새 메시지 업데이트시 스크롤 아래로
  useEffect(() => {
    // 원래 scroll이 맨 아래에 있으면 msg 받을때 자동으로 아래로 감
    bottomRef.current?.scrollIntoView();
    // 스크롤이 맨 아래가 아니면 메시지 위치로 이동하는 버튼 노출!
  }, [messages]);

  return (
    <>
      <Layout.FlexCol w="100%" gap={48} pv={15}>
        {/* TODO: 시스템 메시지, 날짜 표기 */}
        {messages.map((msg) => (
          <MessageItem key={msg.timestamp} room={room} message={msg} />
        ))}
      </Layout.FlexCol>
      <div ref={bottomRef} />
    </>
  );
}
