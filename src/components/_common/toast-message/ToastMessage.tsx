import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Z_INDEX } from '@constants/layout';
import { Font, Layout } from '@design-system';

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
    <Layout.Absolute
      z={Z_INDEX.TOAST_CONTAINER}
      t={top}
      l="50%"
      r={0}
      w="100%"
      tl={['-50%', 0]}
      justifyContent="center"
    >
      <Layout.FlexRow justifyContent="center" bgColor="SECONDARY" p={10} rounded={12}>
        <Font.Body type="12_regular">{text}</Font.Body>
      </Layout.FlexRow>
    </Layout.Absolute>,
    document.getElementById('toast-container') || document.body,
  );
}
