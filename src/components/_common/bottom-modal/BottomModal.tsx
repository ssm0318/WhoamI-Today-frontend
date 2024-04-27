/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_MARGIN } from '@constants/layout';
import { ColorKeys } from '@design-system';
import * as S from './BottomModal.styled';

interface BottomModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  bgColor?: string;
  containerBgColor?: ColorKeys;
  h?: number;
  maxHeight?: number; // 바텀 모달의 최대 높이
  TopComponent?: React.ReactNode; // 바텀 모달 위 컴포넌트
}

function BottomModal({
  visible,
  onClose,
  children,
  bgColor = 'rgba(0, 0, 0, 0.7)',
  containerBgColor = 'WHITE',
  h,
  maxHeight = 650,
  TopComponent,
}: BottomModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(h || 0);

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
      {visible && (
        <S.Background onClick={onClose} backgroundColor={bgColor}>
          {TopComponent && (
            <S.TopComponentContainer
              w="100%"
              b={height + 16}
              justifyContent="flex-end"
              r={DEFAULT_MARGIN}
              visible={visible}
            >
              {TopComponent}
            </S.TopComponentContainer>
          )}
        </S.Background>
      )}
      <S.Container visible={visible} height={height} bgColor={containerBgColor}>
        <S.Body ref={bodyRef}>{children}</S.Body>
      </S.Container>
    </>
  );
}

export default BottomModal;
