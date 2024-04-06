import { useCallback, useEffect, useRef } from 'react';
import { ResponseMessageAction, SendChatRoomSocketData } from '@models/api/chat';

const chatHost = 'localhost:8000';

interface Props {
  roomId: string | undefined;
  onSocketMessage: (msg: ResponseMessageAction) => void;
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

    // TODO: 임시토큰 제거
    const socket = new WebSocket(
      `ws://${chatHost}/ws/chat/${roomId}/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTE0Mjk4LCJpYXQiOjE3MTIzNzgyOTgsImp0aSI6Ijk0ZWMzNDc3MzBhNjRkMDdhYzY1ZjlkY2FjNjQzY2FkIiwidXNlcl9pZCI6MTN9.0q9nS2EUEuYWpyBcEx8GOE9p_nhcRv6SpMhMYOtBY90`,
    );
    addEventListenerToSocket(socket);
    chatSocket.current = socket;

    return () => {
      socket.close();
    };
  }, [addEventListenerToSocket, roomId]);

  const sendSocketData = useCallback((msg: SendChatRoomSocketData) => {
    chatSocket.current?.send(JSON.stringify(msg));
  }, []);

  return { sendSocketData };
}
