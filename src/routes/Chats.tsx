import { useState } from 'react';
import { ChatRoomSearchInput } from '@components/chats/chat-room-search-input/ChatRoomSearchInput';
import { Layout } from '@design-system';

function Chats() {
  const [query, setQuery] = useState('');

  return (
    <Layout.FlexCol w="100%" justifyContent="flex-start" h="100vh" bgColor="BASIC_WHITE">
      <ChatRoomSearchInput query={query} setQuery={setQuery} />
    </Layout.FlexCol>
  );
}

export default Chats;
