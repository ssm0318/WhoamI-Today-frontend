import { useState } from 'react';
import { ChatRoomList } from '@components/chats/chat-room-list/ChatRoomList';
import { ChatRoomSearchInput } from '@components/chats/chat-room-search-input/ChatRoomSearchInput';
import { Layout } from '@design-system';
import { MainScrollContainer } from './Root';

function Chats() {
  const [query, setQuery] = useState('');

  return (
    <MainScrollContainer>
      <Layout.FlexCol w="100%" bgColor="WHITE">
        <ChatRoomSearchInput query={query} setQuery={setQuery} />
        <ChatRoomList />
      </Layout.FlexCol>
    </MainScrollContainer>
  );
}

export default Chats;
