import { MouseEventHandler, ReactNode } from 'react';
import { ButtonType, StyledButton } from './Button.styled';

interface ButtonProps {
  type: ButtonType;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}
function Button({ type, children, onClick }: ButtonProps) {
  return (
    <StyledButton type="button" buttonType={type} onClick={onClick}>
      {children}
    </StyledButton>
  );
}

export default Button;
