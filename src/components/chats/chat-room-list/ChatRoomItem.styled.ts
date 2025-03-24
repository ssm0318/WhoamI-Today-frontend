import styled from 'styled-components';
import { ColorKeys } from '@design-system';

interface StyledSwipeButtonProps {
  backgroundColor: ColorKeys;
}

export const StyledSwipeButton = styled.button.attrs<StyledSwipeButtonProps>({
  type: 'button',
})<StyledSwipeButtonProps>`
  background-color: ${({ theme, backgroundColor }) => theme[backgroundColor]};
  width: 100%;
  height: 52px;
`;
