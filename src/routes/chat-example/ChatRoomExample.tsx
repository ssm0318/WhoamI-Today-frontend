import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoundStore } from '@stores/useBoundStore';
import { getChatMessages } from '@utils/apis/chat';

interface Message {
  message: string;
  userName: string;
  userId: string;
  timestamp: string;
}

export function ChatRoomExample() {
  const { roomId } = useParams();
  const chatHost = 'localhost:8000';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatSocket = useRef<WebSocket>();
  const currentUser = useBoundStore.getState().myProfile;

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

    getChatMessages(roomId).then((res) => {
      const data = res.map((rawData: any) => ({
        message: rawData.content,
        userName: rawData.sender.username,
        userId: rawData.sender.id,
        timestamp: rawData.timestamp,
      }));
      setMessages(data);
    });

    const socket = new WebSocket(`ws://${chatHost}/ws/chat/${roomId}/`);

    addEventListenerToSocket(socket);

    chatSocket.current = socket;

    return () => {
      socket.close();
    };
  }, [roomId, addEventListenerToSocket]);

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  function handleSubmit() {
    chatSocket.current?.send(
      JSON.stringify({
        message: input,
        userName: currentUser?.username,
        userId: currentUser?.id,
      }),
    );
    setInput('');
  }

  return (
    <div style={{ width: '80%', height: '80%' }}>
      <textarea
        id="chat-log"
        value={messages
          .map(({ userName, message, timestamp }) => {
            return `${userName === currentUser?.username ? 'me' : userName}: ${message} -${new Date(
              timestamp,
            )}`;
          })
          .join('\n')}
        readOnly
        style={{ width: '100%', height: '100%' }}
      />
      <input
        id="chat-message-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={handleEnter}
      />
      <input id="chat-message-submit" type="button" value="Send" onClick={handleSubmit} />
    </div>
  );
}
