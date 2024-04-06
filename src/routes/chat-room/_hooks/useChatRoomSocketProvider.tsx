import { useCallback, useEffect, useRef } from 'react';
import { ChatSocketData, SendChatSocketData } from '@models/api/chat';

const chatHost = 'localhost:8000';

interface Props {
  roomId: string | undefined;
  onSocketMessage: (msg: ChatSocketData) => void;
}

export function useChatRoomSocketProvider({ roomId, onSocketMessage }: Props) {
  const chatSocket = useRef<WebSocket>();

  const addEventListenerToSocket = useCallback(
    (socket: WebSocket) => {
      socket.addEventListener('message', (e) => {
        const message = JSON.parse(e.data);
        console.log('on socket message', message);
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
    if (!roomId) return;

    const socket = new WebSocket(`ws://${chatHost}/ws/chat/${roomId}/`);
    addEventListenerToSocket(socket);
    chatSocket.current = socket;

    return () => {
      socket.close();
    };
  }, [addEventListenerToSocket, roomId]);

  const sendSocketData = useCallback((msg: SendChatSocketData) => {
    chatSocket.current?.send(JSON.stringify(msg));
  }, []);

  return { sendSocketData };
}
