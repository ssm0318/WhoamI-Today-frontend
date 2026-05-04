import { useCallback, useEffect, useRef } from 'react';
import { MessageReactionSummary, PostChatMessageRes } from '@models/chat';
import { getCurrentWsOrigin } from '@utils/devServer';

function getWebSocketUrl(userId: number, token: string) {
  if (process.env.NODE_ENV === 'development') {
    return `${getCurrentWsOrigin()}/ws/chat/${userId}/?token=${token}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}/ws/chat/${userId}/?token=${token}`;
}

function getAccessToken() {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('access_token='))
    ?.split('=')[1];
}

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY = 1000;

interface ReactionEvent {
  action: 'reaction';
  message_id: number;
  reactions: MessageReactionSummary[];
}

interface TypingEvent {
  action: 'typing';
  user_id: number;
  username: string;
}

interface FriendshipBrokenEvent {
  action: 'friendship_broken';
  broken_by: number;
}

interface Props {
  userId: number | undefined;
  onMessage: (msg: PostChatMessageRes) => void;
  onReaction?: (data: ReactionEvent) => void;
  onTyping?: (data: TypingEvent) => void;
  onFriendshipBroken?: (data: FriendshipBrokenEvent) => void;
}

export function useChatSocketProvider({
  userId,
  onMessage,
  onReaction,
  onTyping,
  onFriendshipBroken,
}: Props) {
  const socketRef = useRef<WebSocket>();
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const isMounted = useRef(true);

  const connect = useCallback(
    (targetUserId: number) => {
      const accessToken = getAccessToken();
      if (!accessToken) return;

      const socket = new WebSocket(getWebSocketUrl(targetUserId, accessToken));

      socket.addEventListener('open', () => {
        reconnectAttempts.current = 0;
      });

      socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.action === 'reaction') {
          onReaction?.(data);
        } else if (data.action === 'typing') {
          onTyping?.(data);
        } else if (data.action === 'friendship_broken') {
          onFriendshipBroken?.(data);
        } else {
          onMessage(data);
        }
      });

      socket.addEventListener('close', () => {
        if (!isMounted.current) return;
        if (socketRef.current !== socket) return;
        if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) return;

        const delay = BASE_RECONNECT_DELAY * 2 ** reconnectAttempts.current;
        reconnectAttempts.current += 1;
        reconnectTimer.current = setTimeout(() => {
          if (isMounted.current) {
            connect(targetUserId);
          }
        }, delay);
      });

      socketRef.current = socket;
    },
    [onFriendshipBroken, onMessage, onReaction, onTyping],
  );

  useEffect(() => {
    isMounted.current = true;

    if (!userId) return;

    connect(userId);

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
  }, [connect, userId]);

  // Send typing event (debounced by caller)
  const sendTyping = useCallback(() => {
    const ws = socketRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: 'typing' }));
    }
  }, []);

  return { sendTyping };
}
