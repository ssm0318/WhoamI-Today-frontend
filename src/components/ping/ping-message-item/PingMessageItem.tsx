import { format } from 'date-fns';
import { Layout, Typo } from '@design-system';
import { PingMessage } from '@models/ping';

interface Props {
  message: PingMessage;
}

function PingMessageItem({ message }: Props) {
  const { sender, content, emoji, created_at } = message;

  /** FIXME: 임시로 설정한 작성자 여부 로직 수정 */
  const isAuthor = sender.username === 'me';

  return (
    <Layout.FlexRow w="100%" justifyContent={isAuthor ? 'flex-end' : 'flex-start'}>
      <Layout.FlexRow
        gap={10}
        pv={6}
        ph={10}
        rounded={8}
        bgColor={isAuthor ? 'MEDIUM_GRAY' : 'PRIMARY'}
      >
        {emoji && <Typo type="body-medium">{emoji}</Typo>}
        {content && (
          <Typo type="body-large" color="LIGHT">
            {content}
          </Typo>
        )}
      </Layout.FlexRow>
      <Typo type="body-small" color="LIGHT_GRAY">
        {format(new Date(created_at), 'h:mm aaa')}
      </Typo>
    </Layout.FlexRow>
  );
}

export default PingMessageItem;
