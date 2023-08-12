import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Font, Layout } from '@design-system';

interface ToastMessageProps {
  text: string;
  closeToastMessage: () => void;
}

export default function ToastMessage({ text, closeToastMessage }: ToastMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      closeToastMessage();
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [closeToastMessage]);
  return createPortal(
    <Layout.LayoutBase>
      <Font.Body type="12_regular">{text}</Font.Body>
    </Layout.LayoutBase>,
    document.getElementById('toast-container') || document.body,
  );
}
