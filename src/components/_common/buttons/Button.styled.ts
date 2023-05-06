import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const commonButtonStyles = css`
  width: 100%;
  padding: 10px 0;
  text-align: center;
  border: none;
  outline: none;
`;

const primaryButtonStyles = css`
  ${commonButtonStyles}
  background-color: black;
  color: white;
`;

const secondaryButtonStyles = css`
  ${commonButtonStyles}
  color: black;
`;

export type ButtonType = 'primary' | 'secondary';

interface ButtonProps {
  buttonType: ButtonType;
}

export const StyledLinkButton = styled(Link)<ButtonProps>`
  ${({ buttonType }) => (buttonType === 'primary' ? primaryButtonStyles : secondaryButtonStyles)}
  text-decoration: none;
`;

export const StyledButton = styled.button<ButtonProps>`
  ${({ buttonType }) => (buttonType === 'primary' ? primaryButtonStyles : secondaryButtonStyles)}
  outline: none;
`;
