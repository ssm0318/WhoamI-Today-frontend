import { useMemo } from 'react';
import { MessageItem } from '@components/chat-room/message-item/MessageItem';
import { MOCK_MESSAGE_LIST } from '@components/chat-room/message-list/MessageList.helper';
import { Layout } from '@design-system';

export function MessageList() {
  const messageList = useMemo(() => {
    // TODO: api 연결
    return MOCK_MESSAGE_LIST;
  }, []);

  return (
    <Layout.FlexCol w="100%" h="100%" gap={48} pv={15}>
      {/* TODO: 날짜 분기 */}
      {messageList.map((msg) => (
        <MessageItem key={msg.msgId} {...msg} />
      ))}
    </Layout.FlexCol>
  );
}
