import styled from 'styled-components';
import { Typo } from '@design-system';

export const StyledFriendListWrapper = styled.ul`
  display: flex;
  overflow-x: auto;
  align-items: stretch;
  gap: 9px;
  background: white;
  padding: 0 16px 16px 16px;
  width: 100%;
  flex-shrink: 0;
`;

export const UpdatedProfileWrapper = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  width: 61px;
  position: relative;
`;

export const UpdatedChatNumber = styled(Typo)`
  position: absolute;
  top: -8px;
  right: -7px;
`;
