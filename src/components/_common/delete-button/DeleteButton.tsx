import { MouseEvent } from 'react';
import { SvgIcon } from '@design-system';

interface DeleteButtonProps {
  size?: number;
  onClick: (e: MouseEvent) => void;
}

// FIXME(anyone): 가능하면 추후에 IconButton으로 통일
function DeleteButton({ size = 24, onClick }: DeleteButtonProps) {
  return (
    <button type="button" onClick={onClick}>
      <SvgIcon name="delete_button" size={size} color="GRAY_2" />
    </button>
  );
}

export default DeleteButton;
