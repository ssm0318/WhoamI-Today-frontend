import { MouseEvent } from 'react';
import styled from 'styled-components';
import { IconNames, SvgIcon } from '@design-system';

interface IconButtonProps {
  size?: number;
  name: IconNames;
  onClick: (e: MouseEvent) => void;
}

function IconButton({ size = 24, name, onClick }: IconButtonProps) {
  return (
    <IconWrapper type="button" onClick={onClick} size={size}>
      <SvgIcon name={name} size={size} color="DARK" />
    </IconWrapper>
  );
}

const IconWrapper = styled.button<{ size: number }>`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
`;

export default IconButton;
