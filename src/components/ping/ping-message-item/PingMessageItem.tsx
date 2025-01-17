import { format } from 'date-fns';
import { Layout, Typo } from '@design-system';
import { RefinedPingMessage } from '@models/ping';

const MESSAGE_WIDTH = 200;

interface Props {
  message: RefinedPingMessage;
}

function PingMessageItem({ message }: Props) {
  const { sender, content, emoji, created_at, show_date } = message;

  /** FIXME: 임시로 설정한 작성자 여부 로직 수정 */
  const isAuthor = sender.username === 'me';
  const date = new Date(created_at);

  return (
    <>
      {show_date && (
        <Layout.FlexRow w="100%" justifyContent="center">
          <Layout.FlexRow>
            <Typo type="body-medium" color="MEDIUM_GRAY">
              {format(date, 'y.M.d (E)')}
            </Typo>
          </Layout.FlexRow>
        </Layout.FlexRow>
      )}
      <Layout.FlexRow
        w="100%"
        justifyContent="center"
        style={{ position: 'relative', overflow: 'visible' }}
      >
        <Layout.FlexRow
          w={MESSAGE_WIDTH}
          rounded={8}
          pv={6}
          ph={10}
          alignItems="center"
          justifyContent="center"
          gap={10}
          bgColor={isAuthor ? 'MEDIUM_GRAY' : 'PRIMARY'}
        >
          {emoji && <Typo type="body-medium">{emoji}</Typo>}
          {content && (
            <Typo type="body-large" color="LIGHT">
              {content}
            </Typo>
          )}
        </Layout.FlexRow>
        <Layout.Absolute
          style={isAuthor ? { left: 'calc(50% + 110px)' } : { right: 'calc(50% + 110px)' }}
          b={0}
        >
          <Typo type="body-small" color="MEDIUM_GRAY">
            {format(date, 'h:mm aaa')}
          </Typo>
        </Layout.Absolute>
      </Layout.FlexRow>
    </>
  );
}

export default PingMessageItem;
