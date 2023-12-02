import { MouseEvent } from 'react';
import { SvgIcon } from '@design-system';

interface DeleteButtonProps {
  size?: number;
  onClick: (e: MouseEvent) => void;
}

function DeleteButton({ size = 24, onClick }: DeleteButtonProps) {
  return (
    <button type="button" onClick={onClick}>
      <SvgIcon name="delete_default" size={size} color="LIGHT_GRAY" />
    </button>
  );
}

export default DeleteButton;
