import styled from 'styled-components';

export const StyledFriendListWrapper = styled.ul`
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: stretch;
  gap: 20px;
  background: white;
  padding: 8px 20px;
`;

export const StyledFriendProfile = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  img {
    border-radius: 50%;
    width: 66px;
    height: 66px;
  }
`;
