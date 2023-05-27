import React, { useRef } from 'react';
import * as S from './BottomModal.styled';

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height: number;
  bgColor?: string;
}

function BottomModal({
  visible,
  onClose,
  children,
  height,
  bgColor = 'rgba(0, 0, 0, 0.7)',
}: BottomModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {visible && <S.Background onClick={onClose} backgroundColor={bgColor} />}
      <S.Container visible={visible} height={height}>
        <S.Body ref={bodyRef}>{children}</S.Body>
      </S.Container>
    </>
  );
}

export default BottomModal;
