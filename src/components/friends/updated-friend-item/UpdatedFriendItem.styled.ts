import styled from 'styled-components';

export const UpdatedFriendItemWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  border-bottom: 1px ${({ theme }) => theme.LIGHT} solid;

  &:last-child {
    border-bottom: 0;
  }
`;

export const StyledUpdatedItemWrapper = styled.div`
  position: relative;
`;
