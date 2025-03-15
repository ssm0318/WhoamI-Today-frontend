import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { PingEmojiDict, RefinedPingMessage } from '@models/ping';

const MESSAGE_WIDTH = 200;

interface Props {
  message: RefinedPingMessage;
}

function PingMessageItem({ message }: Props) {
  const { userId } = useParams();
  const { sender, content, emoji, created_at, show_date, is_read } = message;

  const isAuthor = sender.id !== Number(userId);
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
        id={`ping_${message.id}`}
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
          bgColor={isAuthor ? 'LIGHT' : 'SECONDARY'}
          style={{
            borderRadius: isAuthor ? '13px 13px 0px 13px' : '13px 13px 13px 0px',
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
          }}
        >
          {emoji && PingEmojiDict[emoji] && <Typo type="body-medium">{PingEmojiDict[emoji]}</Typo>}
          {content && (
            <Typo type="body-large" color="BLACK">
              {content}
            </Typo>
          )}
        </Layout.FlexRow>
        <Layout.Absolute
          style={isAuthor ? { left: 'calc(50% + 110px)' } : { right: 'calc(50% + 110px)' }}
          b={0}
        >
          <Layout.FlexCol alignItems="flex-end">
            {!isAuthor && !is_read && <Layout.FlexRow w={5} h={5} bgColor="NUDGE" rounded={5} />}
            <Typo type="label-small" color="MEDIUM_GRAY">
              {format(date, 'h:mm aaa')}
            </Typo>
          </Layout.FlexCol>
        </Layout.Absolute>
      </Layout.FlexRow>
    </>
  );
}

export default PingMessageItem;
