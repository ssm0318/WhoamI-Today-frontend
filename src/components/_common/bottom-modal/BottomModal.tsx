import React, { useEffect, useRef, useState } from 'react';
import * as S from './BottomModal.styled';

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  bgColor?: string;
  maxHeight?: number; // 바텀 모달의 최대 높이
}

function BottomModal({
  visible,
  onClose,
  children,
  bgColor = 'rgba(0, 0, 0, 0.7)',
  maxHeight = 450,
}: BottomModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Body안의 height을 계산 후 Container에 그 값을 넣어줌 -> 자동 높이 계산
  useEffect(() => {
    if (!visible) return;
    if (bodyRef.current) {
      const bodyHeight = bodyRef.current.scrollHeight;
      setHeight(Math.min(bodyHeight, maxHeight));
    }
  }, [maxHeight, visible]);

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
