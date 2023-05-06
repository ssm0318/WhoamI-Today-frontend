import styled, { css } from 'styled-components';
import { ColorKeys } from 'src/design-system/colors';

type ButtonProps = {
  outline?: ColorKeys;
  fill: ColorKeys;
  sizing?: 'fit-content' | 'stretch';
};
const Button = styled.div<ButtonProps>`
  background-color: ${({ theme, fill }) => theme[fill]};
  ${({ theme, outline }) =>
    !!outline &&
    css`
      border: 1px solid ${theme[outline]};
    `};
  ${({ sizing }) =>
    sizing === 'fit-content' &&
    css`
      align-self: flex-start;
    `}
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  word-break: keep-all;
`;

export const BUTTON_HEIGHT = {
  LARGE: 52,
  SMALL: 25,
};

export const LargeButton = styled(Button)`
  height: ${BUTTON_HEIGHT.LARGE}px;
  padding: 0 20px;
  border-radius: 12px;
`;

export const SmallButton = styled(Button)`
  height: ${BUTTON_HEIGHT.SMALL}px;
  padding: 4px 18px;
  border-radius: 12px;
`;

export const Container = styled.div<{ sizing?: 'fit-content' | 'stretch' }>`
  display: flex;
  flex-direction: column;
  ${({ sizing = 'fit-content' }) =>
    sizing === 'stretch' &&
    css`
      align-self: stretch;
    `}
`;
