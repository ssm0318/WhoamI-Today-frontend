import styled from 'styled-components';

export const UpdatedFriendItemWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px ${({ theme }) => theme.LIGHT} solid;
`;

export const StyledUpdatedItemWrapper = styled.div`
  position: relative;
`;
