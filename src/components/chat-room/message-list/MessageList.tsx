import { useMemo } from 'react';
import { MessageItem } from '@components/chat-room/message-item/MessageItem';
import { MOCK_MESSAGE_LIST } from '@components/chat-room/message-list/MessageList.helper';
import { Layout } from '@design-system';

export function MessageList() {
  const messageList = useMemo(() => {
    // TODO: api 연결
    return MOCK_MESSAGE_LIST;
  }, []);

  // TODO: 처음 채팅방 진입시 스크롤 맨 아래로.

  return (
    <Layout.FlexCol w="100%" gap={48} pv={15}>
      {/* TODO: 날짜 분기 */}
      {messageList.map((msg) => (
        <MessageItem key={msg.msgId} {...msg} />
      ))}
    </Layout.FlexCol>
  );
}
