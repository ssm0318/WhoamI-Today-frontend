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
    if (!roomId || chatSocket.current) return;

    // FIXME: 토큰 전달방식 수정
    const accessToken = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('access_token='))
      ?.split('=')[1];

    const socket = new WebSocket(`ws://${chatHost}/ws/chat/${roomId}/?token=${accessToken}`);
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
