import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChatRoomList } from '@components/chats/chat-room-list/ChatRoomList';
import { ChatRoomSearchInput } from '@components/chats/chat-room-search-input/ChatRoomSearchInput';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

function Chats() {
  const [query, setQuery] = useState('');

  return (
    <>
      <Layout.FlexCol
        w="100%"
        h="100vh"
        justifyContent="flex-start"
        bgColor="BASIC_WHITE"
        mb={BOTTOM_TABBAR_HEIGHT + 10}
      >
        <ChatRoomSearchInput query={query} setQuery={setQuery} />
        <ChatRoomList />
      </Layout.FlexCol>
      <Outlet />
    </>
  );
}

export default Chats;
