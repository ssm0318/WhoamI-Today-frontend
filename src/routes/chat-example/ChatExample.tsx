import { useEffect, useState } from 'react';
import { getChatRooms } from '@utils/apis/chat';

function ChatExample() {
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    getChatRooms().then((res) => {
      setRooms(res);
    });
  }, []);

  return (
    <div>
      {rooms.map((room: any) => (
        <div key={room.id}>
          <a href={`/chat-example/room/${room.id}`}>{room.participants[0].username}</a>
        </div>
      ))}
    </div>
  );
}

export default ChatExample;
