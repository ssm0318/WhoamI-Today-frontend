import { MouseEvent, PropsWithChildren, TouchEvent, useRef } from 'react';
import styled from 'styled-components';
import { Z_INDEX } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';

interface EditorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  title: string;
}

function EditorPopup({
  isOpen,
  onClose,
  onShare,
  title,
  children,
}: PropsWithChildren<EditorPopupProps>) {
  const shouldCloseFromBackdropRef = useRef(false);
  const suppressBackdropCloseUntilRef = useRef(0);

  const triggerShare = () => {
    console.log('[EditorPopup] Share triggered', { title });
    onShare();
  };

  const markBackdropMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (Date.now() < suppressBackdropCloseUntilRef.current) {
      shouldCloseFromBackdropRef.current = false;
      console.log('[EditorPopup] ignore overlay mousedown (suppressed)', { title });
      return;
    }
    const isBackdrop = e.target === e.currentTarget;
    shouldCloseFromBackdropRef.current = isBackdrop;
    console.log('[EditorPopup] overlay interaction start', {
      title,
      isBackdrop,
      targetTag: (e.target as HTMLElement).tagName,
    });
  };

  const markBackdropTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const isBackdrop = e.target === e.currentTarget;
    if (!isBackdrop) {
      // iOS WebView can emit follow-up ghost mouse events on backdrop.
      suppressBackdropCloseUntilRef.current = Date.now() + 700;
    }
    shouldCloseFromBackdropRef.current = isBackdrop;
    console.log('[EditorPopup] overlay touch start', {
      title,
      isBackdrop,
      targetTag: (e.target as HTMLElement).tagName,
    });
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (Date.now() < suppressBackdropCloseUntilRef.current) {
      shouldCloseFromBackdropRef.current = false;
      console.log('[EditorPopup] ignore overlay click (suppressed)', { title });
      return;
    }
    const isBackdrop = e.target === e.currentTarget;
    console.log('[EditorPopup] overlay click', {
      title,
      isBackdrop,
      shouldCloseFromBackdrop: shouldCloseFromBackdropRef.current,
      targetTag: (e.target as HTMLElement).tagName,
    });
    // Close only when interaction starts and ends on backdrop.
    if (isBackdrop && shouldCloseFromBackdropRef.current) {
      console.log('[EditorPopup] onClose from overlay', { title });
      onClose();
    }
    shouldCloseFromBackdropRef.current = false;
  };

  if (!isOpen) return null;

  return (
    <Overlay
      onMouseDown={markBackdropMouseDown}
      onTouchStart={markBackdropTouchStart}
      onClick={handleOverlayClick}
    >
      <Content
        onClick={(e) => {
          console.log('[EditorPopup] content click stopPropagation', { title });
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          console.log('[EditorPopup] content mousedown stopPropagation', { title });
          e.stopPropagation();
        }}
      >
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" mb={12}>
          <Typo type="title-medium">{title}</Typo>
          <Layout.FlexRow alignItems="center" gap={8}>
            <CloseButton
              type="button"
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                triggerShare();
              }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('[EditorPopup] Confirm clicked', { title });
                triggerShare();
              }}
            >
              Confirm
            </CloseButton>
          </Layout.FlexRow>
        </Layout.FlexRow>
        {children}
      </Content>
    </Overlay>
  );
}

const Overlay = styled(Layout.FlexCol)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${Z_INDEX.COMMENT_LIKES_POPUP};
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  position: relative;
  width: 85%;
  max-width: 400px;
  max-height: 70vh;
  padding: 20px;
  border-radius: 16px;
  background-color: ${Colors.WHITE};
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${Colors.PRIMARY};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
`;

export default EditorPopup;
