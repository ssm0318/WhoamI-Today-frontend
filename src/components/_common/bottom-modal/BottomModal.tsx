import React, { MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react';
import { DEFAULT_MARGIN, SCREEN_HEIGHT } from '@constants/layout';
import { ColorKeys } from '@design-system';
import { usePreventScroll } from '@hooks/usePreventScroll';
import * as S from './BottomModal.styled';

interface BottomModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  bgColor?: string;
  containerBgColor?: ColorKeys;
  heightMode?: 'content' | 'full';
  TopComponent?: React.ReactNode; // 바텀 모달 위 컴포넌트
}

function BottomModal({
  visible,
  onClose,
  children,
  bgColor = 'rgba(0, 0, 0, 0.7)',
  containerBgColor = 'WHITE',
  heightMode = 'content',
  TopComponent,
}: BottomModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const maxHeight = SCREEN_HEIGHT - 50;

  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    if (bodyRef.current) {
      const bodyHeight = bodyRef.current.scrollHeight;
      if (heightMode === 'content') {
        return setHeight(bodyHeight > maxHeight ? maxHeight : bodyHeight);
      }

      if (heightMode === 'full') {
        return setHeight(maxHeight);
      }
    }
  }, [visible, heightMode, maxHeight]);

  usePreventScroll(visible);

  // NOTE: 모달 아래 클릭 영역이 있을 때 이벤트 전파 방지
  const onClickModal = (e: MouseEvent) => e.stopPropagation();

  const onCloseModal = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  const handleTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (startY !== null && currentY !== null) {
      const distance = currentY - startY;
      const isDownwardSwipe = distance > 40; // adjust this value as needed
      if (isDownwardSwipe) {
        onCloseModal(e);
      }
    }
    setStartY(null);
    setCurrentY(null);
  };

  return (
    <>
      {visible && (
        <S.Background onClick={onCloseModal} backgroundColor={bgColor}>
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
      <S.Container
        visible={visible}
        height={height}
        bgColor={containerBgColor}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <S.Body ref={bodyRef} onClick={onClickModal}>
          {children}
        </S.Body>
      </S.Container>
    </>
  );
}

export default BottomModal;
