import { StyledTextInput } from '@components/ping/ping-message-input/PingMessageInput.styled';
import { BOTTOM_TABBAR_HEIGHT, PING_MESSAGE_INPUT_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

const MAX_LENGTH = 30;
const PADDING = 10;
const INPUT_HEIGHT = PING_MESSAGE_INPUT_HEIGHT - PADDING * 2;

function PingMessageInput() {
  // TODO: ping 메시지 보내는 기능 추가
  return (
    <Layout.Fixed
      w="100%"
      h={PING_MESSAGE_INPUT_HEIGHT}
      b={BOTTOM_TABBAR_HEIGHT}
      p={PADDING}
      bgColor="LIGHT"
    >
      <Layout.FlexRow w="100%" gap={10}>
        {/** emoji */}
        {/** TODO: emoji preset 입력 추가 */}
        <Layout.FlexRow bgColor="PRIMARY" h={INPUT_HEIGHT} rounded={8} p={8}>
          emoji picker
        </Layout.FlexRow>
        {/** text */}
        <Layout.FlexRow w="100%" h={INPUT_HEIGHT} bgColor="MEDIUM_GRAY" rounded={8} p={8}>
          <StyledTextInput type="text" maxLength={MAX_LENGTH} placeholder="text" />
        </Layout.FlexRow>
      </Layout.FlexRow>
    </Layout.Fixed>
  );
}

export default PingMessageInput;
