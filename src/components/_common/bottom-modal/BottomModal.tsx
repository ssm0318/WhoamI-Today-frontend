/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
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

  // 모달창 열리면 뒷 배경 스크롤 방지
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [visible]);

  const onCloseModal = (e: MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  // NOTE: 모달 아래 클릭 영역이 있을 때 이벤트 전파 방지
  const onClickModal = (e: MouseEvent) => e.stopPropagation();

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
      <S.Container visible={visible} height={height} bgColor={containerBgColor}>
        <S.Body ref={bodyRef} onClick={onClickModal}>
          {children}
        </S.Body>
      </S.Container>
    </>
  );
}

export default BottomModal;
