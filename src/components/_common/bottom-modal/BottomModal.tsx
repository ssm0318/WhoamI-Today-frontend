import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { DEFAULT_MARGIN, SCREEN_HEIGHT } from '@constants/layout';
import { ColorKeys, SvgIcon } from '@design-system';
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
  heightMode?: 'content' | 'full';
  TopComponent?: React.ReactNode;
  customHeight?: number;
  bottomOffset?: number;
  draggable?: boolean;
  hideCloseButton?: boolean;
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
  bottomOffset = 0,
  draggable = false,
  hideCloseButton = false,
}: BottomModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const maxHeight = SCREEN_HEIGHT - 50;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { isAndroid } = getMobileDeviceInfo();

  const dragStartY = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const heightRef = useRef(height);

  onCloseRef.current = onClose;
  heightRef.current = height;

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
      let calculatedHeight;

      if (customHeight != null) {
        calculatedHeight = Math.min(customHeight, maxHeight);
      } else if (heightMode === 'content') {
        const container = containerRef.current;
        if (container) {
          // Temporarily allow overflow to measure true total height
          const prevOverflow = container.style.overflow;
          const prevHeight = container.style.height;
          container.style.overflow = 'visible';
          container.style.height = 'auto';
          const totalHeight = container.scrollHeight;
          container.style.overflow = prevOverflow;
          container.style.height = prevHeight;
          calculatedHeight = totalHeight > maxHeight ? maxHeight : totalHeight;
        } else {
          const bodyHeight = bodyRef.current.scrollHeight;
          calculatedHeight = bodyHeight > maxHeight ? maxHeight : bodyHeight;
        }
      } else if (heightMode === 'full') {
        calculatedHeight = maxHeight;
      } else {
        calculatedHeight = maxHeight;
      }

      if (isAndroid && isKeyboardVisible) {
        const adjustedHeight = Math.min(calculatedHeight, SCREEN_HEIGHT - keyboardHeight);
        setHeight(adjustedHeight);
      } else {
        setHeight(calculatedHeight);
      }
    }
  }, [
    visible,
    heightMode,
    maxHeight,
    customHeight,
    isKeyboardVisible,
    keyboardHeight,
    isAndroid,
    hideCloseButton,
  ]);

  // Clear inline transform when modal closes so CSS transition works
  useEffect(() => {
    if (!visible && containerRef.current) {
      containerRef.current.style.transform = '';
      containerRef.current.style.transition = '';
    }
  }, [visible]);

  // Drag-to-dismiss: Container only
  useEffect(() => {
    if (!draggable || !visible || !containerRef.current) return;

    const container = containerRef.current;
    const body = bodyRef.current;

    // Track touch Y for seamless scroll→drag transition
    const touchStartYRef = { current: 0 };
    const inScrollAreaRef = { current: false };
    const lastTouchYRef = { current: 0 };
    const downFramesRef = { current: 0 };

    const findScrollParent = (target: HTMLElement): HTMLElement | null => {
      let el: HTMLElement | null = target;
      while (el && el !== container) {
        if (el !== body) {
          const { overflowY } = window.getComputedStyle(el);
          if (overflowY === 'auto' || overflowY === 'scroll') return el;
        }
        el = el.parentElement;
      }
      return null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!e.target || !(e.target instanceof HTMLElement)) return;
      touchStartYRef.current = e.touches[0].clientY;
      lastTouchYRef.current = e.touches[0].clientY;
      downFramesRef.current = 0;
      const scrollParent = findScrollParent(e.target);
      if (scrollParent && scrollParent.scrollTop > 0) {
        inScrollAreaRef.current = true;
        isDraggingRef.current = false;
        return;
      }
      inScrollAreaRef.current = false;
      dragStartY.current = e.touches[0].clientY;
      isDraggingRef.current = true;
      dragOffsetRef.current = 0;
    };

    const onMouseDown = (e: globalThis.MouseEvent) => {
      if (!e.target || !(e.target instanceof HTMLElement)) return;
      const scrollParent = findScrollParent(e.target as HTMLElement);
      if (scrollParent && scrollParent.scrollTop > 0) {
        inScrollAreaRef.current = true;
        isDraggingRef.current = false;
        return;
      }
      inScrollAreaRef.current = false;
      dragStartY.current = e.clientY;
      isDraggingRef.current = true;
      dragOffsetRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const { clientY } = e.touches[0];

      // Seamless scroll→drag transition: require scrollTop===0 AND
      // sustained downward finger movement (3+ frames) to avoid
      // accidental triggers during upward scroll momentum.
      if (inScrollAreaRef.current && !isDraggingRef.current) {
        const scrollEl = findScrollParent(e.target as HTMLElement);
        if (scrollEl && scrollEl.scrollTop <= 0) {
          if (clientY > lastTouchYRef.current) {
            downFramesRef.current += 1;
          } else {
            downFramesRef.current = 0;
          }
          lastTouchYRef.current = clientY;
          if (downFramesRef.current >= 3) {
            inScrollAreaRef.current = false;
            isDraggingRef.current = true;
            dragStartY.current = clientY;
            dragOffsetRef.current = 0;
            return;
          }
        } else {
          downFramesRef.current = 0;
          lastTouchYRef.current = clientY;
        }
        return;
      }

      if (!isDraggingRef.current) return;
      const diff = clientY - dragStartY.current;
      if (diff <= 0) {
        dragOffsetRef.current = 0;
        return;
      }
      if (e.cancelable) e.preventDefault();
      dragOffsetRef.current = diff;
      container.style.transition = 'none';
      container.style.transform = `translateX(-50%) translateY(${diff}px)`;
    };

    const onEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      container.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
      if (dragOffsetRef.current > heightRef.current * 0.2) {
        container.style.transform = 'translateX(-50%) translateY(100%)';
        onCloseRef.current?.();
      } else {
        container.style.transform = 'translateX(-50%) translateY(0)';
      }
      dragOffsetRef.current = 0;
    };

    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDraggingRef.current) return;
      const diff = e.clientY - dragStartY.current;
      if (diff <= 0) {
        dragOffsetRef.current = 0;
        return;
      }
      e.preventDefault();
      dragOffsetRef.current = diff;
      container.style.transition = 'none';
      container.style.transform = `translateX(-50%) translateY(${diff}px)`;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('mousedown', onMouseDown);

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onEnd);
    };
  }, [draggable, visible]);

  usePreventScroll(visible);

  const onCloseModal = (e: MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

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
        ref={containerRef}
        data-bottom-modal="true"
        visible={visible}
        height={height}
        bgColor={containerBgColor}
        bottomOffset={bottomOffset}
        onTransitionEnd={handleTransitionEnd}
      >
        {draggable && (
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              padding: '12px 0 4px',
              touchAction: 'none',
              backgroundColor: '#FCFCFC',
              borderRadius: '17px 17px 0 0',
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#D9D9D9' }} />
          </div>
        )}
        {!hideCloseButton && (
          <div
            role="button"
            tabIndex={0}
            style={{
              position: 'absolute',
              top: DEFAULT_MARGIN,
              right: DEFAULT_MARGIN,
              zIndex: 10,
              cursor: 'pointer',
            }}
            onClick={onCloseModal}
          >
            <SvgIcon name="close" size={20} />
          </div>
        )}
        <S.Body ref={bodyRef} onClick={onClickModal}>
          {children}
        </S.Body>
      </S.Container>
    </>
  );
}

export default BottomModal;
