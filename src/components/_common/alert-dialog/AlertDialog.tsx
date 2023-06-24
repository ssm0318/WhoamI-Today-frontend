import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import * as S from './AlertDialog.styled';

interface AlertDialogProps {
  children: ReactNode;
  visible: boolean;
  onClickDimmed?: () => void;
}

function AlertDialog({ children, visible, onClickDimmed }: AlertDialogProps) {
  if (!visible) return null;
  return createPortal(
    <S.Container>
      <S.Background onClick={onClickDimmed} />
      <S.Body>{children}</S.Body>
    </S.Container>,
    document.getElementById('modal-container') || document.body,
  );
}

export default AlertDialog;
