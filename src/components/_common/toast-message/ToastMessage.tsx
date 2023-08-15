import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Z_INDEX } from '@constants/layout';
import { Font } from '@design-system';
import * as S from './ToastMessage.styled';

interface ToastMessageProps {
  text: string;
  top?: number;
  closeToastMessage: () => void;
}

// TODO: 토스트 메시지 애니메이션 추가.
export default function ToastMessage({ text, top = 50, closeToastMessage }: ToastMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeToastMessage();
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [closeToastMessage]);

  return createPortal(
    <S.ToastContainer
      z={Z_INDEX.TOAST_CONTAINER}
      t={top}
      l={0}
      r={0}
      bgColor="SECONDARY"
      p={10}
      rounded={12}
    >
      <Font.Body type="12_regular">{text}</Font.Body>
    </S.ToastContainer>,
    document.getElementById('toast-container') || document.body,
  );
}
