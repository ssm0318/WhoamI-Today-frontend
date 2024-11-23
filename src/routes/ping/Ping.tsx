import PingMessageItem from '@components/ping/ping-message-item/PingMessageItem';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout } from '@design-system';
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
  { id: 8, author_detail: { username: 'user_1' }, text: '', emoji: '🤑' },
  { id: 9, author_detail: { username: 'me' }, text: 'ping', emoji: '' },
  { id: 10, author_detail: { username: 'user_1' }, text: 'bye~', emoji: '👋' },
];

function Ping() {
  // TODO: 스타일 반영
  return (
    <MainScrollContainer>
      {/** title */}
      <SubHeader title="Ping!" />
      {/** ping list */}
      <Layout.FlexCol w="100%" gap={10} p={10}>
        {MOCK_PING_LIST.map((message) => (
          <PingMessageItem key={message.id} message={message} />
        ))}
      </Layout.FlexCol>
      {/** ping input */}
    </MainScrollContainer>
  );
}

export default Ping;
