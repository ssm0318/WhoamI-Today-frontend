import styled from 'styled-components';
import { SubHeaderWrapper } from '@components/sub-header/SubHeader.styled';
import { MAX_WINDOW_WIDTH } from '@constants/layout';
import { Layout } from '@design-system';
import { MainWrapper } from '@styles/wrappers';

export const ChatRoomContainer = styled(Layout.Fixed)`
  max-width: ${MAX_WINDOW_WIDTH}px;
`;

export const ChatRoomHeaderWrapper = styled(SubHeaderWrapper)`
  border-bottom: 1.2px solid ${({ theme }) => theme.MEDIUM_GRAY};
`;

export const MessageListScrollContainer = styled(MainWrapper)`
  padding-bottom: 0px;
`;
