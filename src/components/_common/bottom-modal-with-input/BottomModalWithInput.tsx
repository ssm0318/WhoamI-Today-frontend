import React, { MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react';
import { SCREEN_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
import { usePreventScroll } from '@hooks/usePreventScroll';
import { isApp } from '@utils/getUserAgent';
import * as S from './BottomModalWithInput.styled';

interface BottomModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  bgColor?: string;
  heightMode?: 'content' | 'full';
}

function BottomModalWithInput({
  visible,
  onClose,
  children,
  bgColor = 'rgba(0, 0, 0, 0.7)',
  heightMode = 'content',
}: BottomModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const maxHeight = SCREEN_HEIGHT - TOP_NAVIGATION_HEIGHT - 50;

  const startYRef = useRef<number | null>(null);
  const currentYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    if (bodyRef.current) {
      const bodyHeight = bodyRef.current.scrollHeight;
      let newHeight = 0;

      if (heightMode === 'content') {
        newHeight = Math.min(bodyHeight, maxHeight);
      } else if (heightMode === 'full') {
        newHeight = maxHeight;
      }

      requestAnimationFrame(() => {
        setHeight(newHeight);
      });
    }
  }, [visible, heightMode, maxHeight]);

  usePreventScroll(visible);

  const onClickModal = (e: MouseEvent) => e.stopPropagation();

  const onCloseModal = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (isApp) return;
    startYRef.current = e.touches[0].clientY;
    currentYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isApp) return;
    currentYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isApp) return;
    if (startYRef.current !== null && currentYRef.current !== null) {
      const distance = currentYRef.current - startYRef.current;
      const isDownwardSwipe = distance > 40; // adjust this value as needed
      if (isDownwardSwipe) {
        onCloseModal(e);
      }
    }

    startYRef.current = null;
    currentYRef.current = null;
  };

  return (
    <>
      {visible && <S.Background onClick={onCloseModal} backgroundColor={bgColor} />}
      <S.Container
        visible={visible}
        height={height}
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

export default BottomModalWithInput;
