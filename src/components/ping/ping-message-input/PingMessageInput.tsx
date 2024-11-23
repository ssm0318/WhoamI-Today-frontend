import { forwardRef } from 'react';
import { StyledMessageInput } from '@components/ping/ping-message-input/PingMessageInput.styled';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';

const MAX_LENGTH = 30;

const PingMessageInput = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Layout.Fixed ref={ref} w="100%" b={BOTTOM_TABBAR_HEIGHT} p={10} bgColor="LIGHT">
      <Layout.FlexRow w="100%" gap={10}>
        {/** emoji */}
        <Layout.FlexRow bgColor="PRIMARY" rounded={8} p={8}>
          emoji picker
        </Layout.FlexRow>
        {/** text */}
        <Layout.FlexRow w="100%" bgColor="MEDIUM_GRAY" rounded={8} p={8}>
          <StyledMessageInput type="text" maxLength={MAX_LENGTH} placeholder="text" />
        </Layout.FlexRow>
      </Layout.FlexRow>
    </Layout.Fixed>
  );
});

export default PingMessageInput;
