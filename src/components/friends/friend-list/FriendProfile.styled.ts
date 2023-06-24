import styled from 'styled-components';
import { Z_INDEX } from '@constants/layout';

export const StyledFriendListWrapper = styled.ul`
  display: flex;
  overflow-x: auto;
  align-items: stretch;
  gap: 20px;
  background: white;
  padding: 8px 20px;
  width: 100%;
  flex-shrink: 0;
  position: fixed;
  z-index: ${Z_INDEX.FRIEND_FEED_FRIEND_LIST};
`;

export const StyledFriendProfile = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  .selected {
    border: 2px solid ${({ theme }) => theme.CALENDAR_TODAY};
  }
`;
