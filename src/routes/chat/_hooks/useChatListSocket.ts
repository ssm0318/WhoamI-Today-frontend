import { useCallback, useEffect, useRef } from 'react';

interface ChatListUpdate {
  opponent_id: number;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

function getWebSocketUrl(token: string) {
  if (process.env.NODE_ENV === 'development') {
    return `ws://localhost:8000/ws/chat/list/?token=${token}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}/ws/chat/list/?token=${token}`;
}

function getAccessToken() {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('access_token='))
    ?.split('=')[1];
}

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 1000;

export function useChatListSocket(onUpdate: (data: ChatListUpdate) => void) {
  const socketRef = useRef<WebSocket>();
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    const socket = new WebSocket(getWebSocketUrl(accessToken));

    socket.addEventListener('open', () => {
      reconnectAttempts.current = 0;
      console.log('[ChatListSocket] connected');
    });

    socket.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      console.log('[ChatListSocket] received:', data);
      onUpdate(data);
    });

    socket.addEventListener('close', (e) => {
      console.log('[ChatListSocket] closed, code:', e.code);
    });

    socket.addEventListener('error', () => {
      console.log('[ChatListSocket] error');
    });

    socket.addEventListener('close', () => {
      if (!isMounted.current) return;
      if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) return;

      const delay = BASE_RECONNECT_DELAY * 2 ** reconnectAttempts.current;
      reconnectAttempts.current += 1;
      reconnectTimer.current = setTimeout(() => {
        if (isMounted.current) {
          connect();
        }
      }, delay);
    });

    socketRef.current = socket;
  }, [onUpdate]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      clearTimeout(reconnectTimer.current);
      const ws = socketRef.current;
      if (!ws) return;
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      } else {
        ws.addEventListener('open', () => {
          ws.close();
        });
      }
    };
  }, [connect]);
}
