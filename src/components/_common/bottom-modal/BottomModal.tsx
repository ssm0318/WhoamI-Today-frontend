import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { DEFAULT_MARGIN, SCREEN_HEIGHT } from '@constants/layout';
import { ColorKeys, Layout, SvgIcon } from '@design-system';
import { useGetAppMessage } from '@hooks/useAppMessage';
import { usePreventScroll } from '@hooks/usePreventScroll';
import { getMobileDeviceInfo } from '@utils/getUserAgent';
import * as S from './BottomModal.styled';

interface BottomModalProps {
  visible: boolean;
  onClose?: () => void;
  onTransitionEnd?: () => void;
  children: React.ReactNode;
  bgColor?: string;
  containerBgColor?: ColorKeys;
  heightMode?: 'content' | 'full' | 'custom';
  TopComponent?: React.ReactNode; // 바텀 모달 위 컴포넌트
  customHeight?: number;
}

function BottomModal({
  visible,
  onClose,
  onTransitionEnd,
  children,
  bgColor = 'rgba(0, 0, 0, 0.7)',
  containerBgColor = 'WHITE',
  heightMode = 'content',
  TopComponent,
  customHeight,
}: BottomModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const maxHeight = SCREEN_HEIGHT - 50;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { isAndroid } = getMobileDeviceInfo();

  // Get keyboard height from app
  useGetAppMessage({
    key: 'KEYBOARD_HEIGHT',
    cb: (data) => {
      const newKeyboardVisible = data.height > 0;
      setIsKeyboardVisible(newKeyboardVisible);
      setKeyboardHeight(data.height);
    },
  });

  useEffect(() => {
    if (!visible) return;
    if (bodyRef.current) {
      const bodyHeight = bodyRef.current.scrollHeight;
      let calculatedHeight;

      if (heightMode === 'content') {
        calculatedHeight = bodyHeight > maxHeight ? maxHeight : bodyHeight;
      } else if (heightMode === 'full') {
        calculatedHeight = maxHeight;
      } else if (heightMode === 'custom') {
        calculatedHeight = customHeight || maxHeight;
      } else {
        calculatedHeight = maxHeight;
      }

      // Adjust height for keyboard on Android
      if (isAndroid && isKeyboardVisible) {
        const adjustedHeight = Math.min(calculatedHeight, SCREEN_HEIGHT - keyboardHeight);
        setHeight(adjustedHeight);
      } else {
        setHeight(calculatedHeight);
      }
    }
  }, [visible, heightMode, maxHeight, customHeight, isKeyboardVisible, keyboardHeight, isAndroid]);

  usePreventScroll(visible);

  const onCloseModal = (e: MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  // NOTE: 모달 아래 클릭 영역이 있을 때 이벤트 전파 방지
  const onClickModal = (e: MouseEvent) => e.stopPropagation();

  const handleTransitionEnd = () => {
    onTransitionEnd?.();
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
        onTransitionEnd={handleTransitionEnd}
      >
        <Layout.Absolute
          w="100%"
          justifyContent="flex-end"
          r={DEFAULT_MARGIN}
          t={DEFAULT_MARGIN}
          onClick={onCloseModal}
        >
          <SvgIcon name="close" size={20} />
        </Layout.Absolute>
        <S.Body ref={bodyRef} onClick={onClickModal}>
          {children}
        </S.Body>
      </S.Container>
    </>
  );
}

export default BottomModal;
