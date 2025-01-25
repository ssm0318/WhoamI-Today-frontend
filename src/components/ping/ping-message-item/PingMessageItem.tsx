import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { PingEmojiDict, RefinedPingMessage } from '@models/ping';

const MESSAGE_WIDTH = 200;

interface Props {
  message: RefinedPingMessage;
}

function PingMessageItem({ message }: Props) {
  const { username } = useParams();
  const { sender, content, emoji, created_at, show_date } = message;

  const isAuthor = sender.username === username;
  const date = new Date(created_at);

  return (
    <>
      {show_date && (
        <Layout.FlexRow w="100%" justifyContent="center">
          <Layout.FlexRow>
            <Typo type="label-medium" color="MEDIUM_GRAY">
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
          pv={8}
          ph={13}
          alignItems="center"
          justifyContent="center"
          gap={10}
          bgColor={isAuthor ? 'LIGHT' : 'PRIMARY'}
          style={
            isAuthor
              ? { borderRadius: '13px 13px 13px 0px' }
              : { borderRadius: '13px 13px 0px 13px' }
          }
        >
          {emoji && PingEmojiDict[emoji] && <Typo type="body-medium">{PingEmojiDict[emoji]}</Typo>}
          {content && (
            <Typo type="body-large" color={isAuthor ? 'BLACK' : 'WHITE'}>
              {content}
            </Typo>
          )}
        </Layout.FlexRow>
        <Layout.Absolute
          style={isAuthor ? { left: 'calc(50% + 110px)' } : { right: 'calc(50% + 110px)' }}
          b={0}
        >
          <Typo type="label-small" color="MEDIUM_GRAY">
            {format(date, 'h:mm aaa')}
          </Typo>
        </Layout.Absolute>
      </Layout.FlexRow>
    </>
  );
}

export default PingMessageItem;
