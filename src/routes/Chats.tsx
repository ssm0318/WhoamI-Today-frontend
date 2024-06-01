import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChatRoomList } from '@components/chats/chat-room-list/ChatRoomList';
import { ChatRoomSearchInput } from '@components/chats/chat-room-search-input/ChatRoomSearchInput';
import { Layout } from '@design-system';
import { MainWrapper } from '@styles/wrappers';

function Chats() {
  const [query, setQuery] = useState('');

  return (
    <MainWrapper>
      <Layout.FlexCol w="100%" bgColor="WHITE">
        <ChatRoomSearchInput query={query} setQuery={setQuery} />
        <ChatRoomList />
      </Layout.FlexCol>
      <Outlet />
    </MainWrapper>
  );
}

export default Chats;
