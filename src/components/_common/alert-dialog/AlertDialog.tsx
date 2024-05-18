import { MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { usePreventScroll } from '@hooks/usePreventScroll';
import * as S from './AlertDialog.styled';

interface AlertDialogProps {
  children: ReactNode;
  visible: boolean;
  className?: string;
  position?: S.BodyProps['position'];
  onClickDimmed?: () => void;
}

function AlertDialog({
  children,
  visible,
  className,
  position = 'center',
  onClickDimmed,
}: AlertDialogProps) {
  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClickDimmed?.();
  };

  usePreventScroll(visible);

  if (!visible) return null;
  return createPortal(
    <S.Container className={className}>
      <S.Background onClick={onClick} />
      <S.Body className="body" position={position} onClick={(e) => e.stopPropagation()}>
        {children}
      </S.Body>
    </S.Container>,
    document.getElementById('modal-container') || document.body,
  );
}

export default AlertDialog;
