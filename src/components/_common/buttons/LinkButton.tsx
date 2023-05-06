import { ReactNode } from 'react';
import { ButtonType, StyledLinkButton } from './Button.styled';

interface ButtonLink {
  to: string;
  children: ReactNode;
  type: ButtonType;
}

function LinkButton({ to, children, type }: ButtonLink) {
  return (
    <StyledLinkButton buttonType={type} to={to}>
      {children}
    </StyledLinkButton>
  );
}

export default LinkButton;
