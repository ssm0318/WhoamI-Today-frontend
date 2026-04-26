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

export const LabelRow = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  flex: 1;
  min-width: 0;
`;

export const Label = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.BLACK};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Strong = styled.strong`
  font-weight: 600;
`;

export const ChangeHint = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.MEDIUM_GRAY};
  text-decoration: underline;
  flex-shrink: 0;
`;
