import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageItem } from '@components/chat-room/message-item/MessageItem';
import { Layout } from '@design-system';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { ChatMessage } from '@models/api/chat';
import { getChatMessages } from '@utils/apis/chat';

interface Props {
  roomId: number;
}

const chatHost = 'localhost:8000';

export function MessageList({ roomId }: Props) {
  const chatSocket = useRef<WebSocket>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const fetchChatMessages = useCallback(async () => {
    if (!roomId) return;
    const data = await getChatMessages(roomId);
    setMessages(data);
  }, [roomId]);
  useAsyncEffect(fetchChatMessages, [fetchChatMessages]);

  const addEventListenerToSocket = useCallback((socket: WebSocket) => {
    socket.addEventListener('message', (e) => {
      const message = JSON.parse(e.data);
      setMessages((prev) => [...prev, message]);
    });

    socket.addEventListener('open', (e) => {
      console.log('socket has been opened', e);
    });

    socket.addEventListener('close', (e) => {
      console.log('socket has been closed', e);
    });
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const socket = new WebSocket(`ws://${chatHost}/ws/chat/${roomId}/`);

    addEventListenerToSocket(socket);
    chatSocket.current = socket;

    return () => {
      socket.close();
    };
  }, [addEventListenerToSocket, fetchChatMessages, roomId]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // TODO: 스크롤 맨 위로 올리면 이전 메시지 불러오기

  // FIXME: 새 메시지 업데이트시 스크롤 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  return (
    <>
      <Layout.FlexCol w="100%" gap={48} pv={15}>
        {/* TODO: 시스템 메시지, 날짜 표기 */}
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </Layout.FlexCol>
      <div ref={bottomRef} />
    </>
  );
}
