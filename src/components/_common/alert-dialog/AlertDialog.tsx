import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import * as S from './AlertDialog.styled';

interface AlertDialogProps {
  children: ReactNode;
  visible: boolean;
  className?: string;
  onClickDimmed?: () => void;
}

function AlertDialog({ children, visible, className, onClickDimmed }: AlertDialogProps) {
  if (!visible) return null;
  return createPortal(
    <S.Container className={className}>
      <S.Background onClick={onClickDimmed} />
      <S.Body className="body">{children}</S.Body>
    </S.Container>,
    document.getElementById('modal-container') || document.body,
  );
}

export default AlertDialog;
