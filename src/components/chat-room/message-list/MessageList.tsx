import { useEffect, useMemo, useRef } from 'react';
import { MessageItem } from '@components/chat-room/message-item/MessageItem';
import { MOCK_MESSAGE_LIST } from '@components/chat-room/message-list/MessageList.helper';
import { Layout } from '@design-system';

export function MessageList() {
  const messageList = useMemo(() => {
    // TODO: api 연결
    return MOCK_MESSAGE_LIST;
  }, []);

  const bottomRef = useRef<HTMLDivElement>(null);

  // TODO: 스크롤 맨 위로 올리면 이전 메시지 불러오기

  // FIXME: 새 메시지 업데이트시 스크롤 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, []);

  return (
    <>
      <Layout.FlexCol w="100%" gap={48} pv={15}>
        {/* TODO: 시스템 메시지, 날짜 표기 */}
        {messageList.map((msg) => (
          <MessageItem key={msg.msgId} {...msg} />
        ))}
      </Layout.FlexCol>
      <div ref={bottomRef} />
    </>
  );
}
