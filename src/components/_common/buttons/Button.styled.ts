import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const commonButtonStyles = css`
  width: 100%;
  padding: 10px 0;
  text-align: center;
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
  type: ButtonType;
}

export const StyledLinkButton = styled(Link)<ButtonProps>`
  ${(props) => (props.type === 'primary' ? primaryButtonStyles : secondaryButtonStyles)}
  text-decoration: none;
`;

export const StyledButton = styled.button`
  ${(props: ButtonProps) =>
    props.type === 'primary' ? primaryButtonStyles : secondaryButtonStyles}
`;
