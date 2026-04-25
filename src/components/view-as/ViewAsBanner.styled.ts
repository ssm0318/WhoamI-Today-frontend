import styled from 'styled-components';

export const Banner = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${({ theme }) => theme.LIGHT};
  border-bottom: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
`;

export const Label = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.BLACK};
`;

export const Strong = styled.strong`
  font-weight: 600;
`;
