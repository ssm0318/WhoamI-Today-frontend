import styled from 'styled-components';
import { MAX_WINDOW_WIDTH } from '@constants/layout';
import { Layout } from '@design-system';

export const ChatRoomContainer = styled(Layout.Fixed)`
  max-width: ${MAX_WINDOW_WIDTH}px;
`;
