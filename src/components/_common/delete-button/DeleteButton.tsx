import { MouseEvent } from 'react';
import { SvgIcon } from '@design-system';

interface DeleteButtonProps {
  size?: number;
  onClick: (e: MouseEvent) => void;
}

function DeleteButton({ size = 24, onClick }: DeleteButtonProps) {
  return (
    <button type="button" onClick={onClick}>
      <SvgIcon name="delete_button" size={size} color="GRAY_2" />
    </button>
  );
}

export default DeleteButton;
