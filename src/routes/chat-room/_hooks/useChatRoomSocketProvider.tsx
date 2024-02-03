import { useCallback, useEffect, useRef } from 'react';
import { ChatRoom, SocketMessage, SocketMessageInput } from '@models/api/chat';

const chatHost = 'localhost:8000';

interface Props {
  chatRoom: ChatRoom | undefined;
  onSocketMessage: (msg: SocketMessage) => void;
}

export function useChatRoomSocketProvider({ chatRoom, onSocketMessage }: Props) {
  const chatSocket = useRef<WebSocket>();

  const addEventListenerToSocket = useCallback(
    (socket: WebSocket) => {
      socket.addEventListener('message', (e) => {
        const message = JSON.parse(e.data);
        onSocketMessage(message);
      });

      socket.addEventListener('open', (e) => {
        console.log('socket has been opened', e);
      });

      socket.addEventListener('close', (e) => {
        console.log('socket has been closed', e);
      });
    },
    [onSocketMessage],
  );

  useEffect(() => {
    if (!chatRoom) return;

    const socket = new WebSocket(`ws://${chatHost}/ws/chat/${chatRoom.id}/`);

    addEventListenerToSocket(socket);
    chatSocket.current = socket;

    return () => {
      socket.close();
    };
  }, [addEventListenerToSocket, chatRoom]);

  const sendSocketMsg = useCallback((msg: SocketMessageInput) => {
    chatSocket.current?.send(JSON.stringify(msg));
  }, []);

  return { sendSocketMsg };
}
