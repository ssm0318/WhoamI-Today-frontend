import styled from 'styled-components';
import { Colors } from '@design-system';

export const StyledSwipeButton = styled.button<{ backgroundColor?: keyof typeof Colors }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 100%;
  min-height: 44px;
  border: none;
  cursor: pointer;
  background-color: ${({ backgroundColor, theme }) =>
    backgroundColor ? theme[backgroundColor] : theme.MEDIUM_GRAY};
`;
