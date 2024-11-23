import { useEffect, useRef } from 'react';
import PingMessageInput from '@components/ping/ping-message-input/PingMessageInput';
import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout, Typo } from '@design-system';
import { PingMessage } from '@models/ping';
import { MainScrollContainer } from '../Root';

// TODO: api 응답 반영
const MOCK_PING_LIST: PingMessage[] = [
  { id: 1, author_detail: { username: 'user_1' }, text: 'hi', emoji: '😃' },
  { id: 2, author_detail: { username: 'me' }, text: 'hi', emoji: '😄' },
  { id: 3, author_detail: { username: 'user_1' }, text: '', emoji: '🩵' },
  { id: 4, author_detail: { username: 'user_1' }, text: 'test test test test', emoji: '' },
  { id: 5, author_detail: { username: 'me' }, text: 'text text', emoji: '🐸' },
  {
    id: 6,
    author_detail: { username: 'me' },
    text: '?? ?? ?? abcdefg !!! !!! !!!',
    emoji: '🐸',
  },
  { id: 7, author_detail: { username: 'user_1' }, text: 'ping', emoji: '' },
  { id: 8, author_detail: { username: 'user_1' }, text: 'ping', emoji: '' },
  { id: 9, author_detail: { username: 'user_1' }, text: 'ping', emoji: '' },
  { id: 10, author_detail: { username: 'user_1' }, text: '', emoji: '🤑' },
  { id: 11, author_detail: { username: 'me' }, text: 'ping', emoji: '' },
  { id: 12, author_detail: { username: 'user_1' }, text: 'bye~', emoji: '👋' },
  { id: 13, author_detail: { username: 'me' }, text: 'bye~', emoji: '👋' },
  { id: 14, author_detail: { username: 'me' }, text: '', emoji: '👋' },
  { id: 15, author_detail: { username: 'me' }, text: '', emoji: '👋' },
];

function Ping() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
  }, []);

  const handleClickRefresh = () => {
    // TODO: refresh ping
  };

  // TODO: 스타일 반영, 다국어 추가
  return (
    <MainScrollContainer scrollRef={scrollRef}>
      {/** title */}
      <SubHeader
        title="Ping!"
        RightComponent={
          <button type="button" onClick={handleClickRefresh}>
            <Typo type="title-medium" color="PRIMARY">
              Refresh
            </Typo>
          </button>
        }
      />
      {/** ping list */}
      {MOCK_PING_LIST.length > 1 && (
        <Layout.FlexCol w="100%" gap={10} p={10} mb={PING_MESSAGE_INPUT_HEIGHT}>
          {MOCK_PING_LIST.map((message) => (
            <PingMessageItem key={message.id} message={message} />
          ))}
        </Layout.FlexCol>
      )}
      {/** ping input */}
      <PingMessageInput />
    </MainScrollContainer>
  );
}

export default Ping;
