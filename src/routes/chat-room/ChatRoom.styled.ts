import styled from 'styled-components';
import { SubHeaderWrapper } from '@components/sub-header/SubHeader.styled';
import { TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { MainWrapper } from '@styles/wrappers';

export const ChatRoomHeaderWrapper = styled(SubHeaderWrapper)`
  border-bottom: 1.2px solid ${({ theme }) => theme.MEDIUM_GRAY};
`;

export const MessageListScrollContainer = styled(MainWrapper)`
  align-items: center;
  padding-top: ${TOP_NAVIGATION_HEIGHT}px;
`;
