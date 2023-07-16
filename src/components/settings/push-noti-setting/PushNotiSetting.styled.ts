import styled from 'styled-components';

export const PermissionTextContainer = styled.button<{
  cursor?: 'pointer' | 'default';
}>`
  width: 100%;
  cursor: ${({ cursor }) => cursor};
  display: flex;
  flex-direction: column;
`;
