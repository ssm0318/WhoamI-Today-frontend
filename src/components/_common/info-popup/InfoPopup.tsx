import { MouseEvent, PropsWithChildren, TouchEvent, useRef } from 'react';
import { Layout, SvgIcon, Typo } from '@design-system';
import * as S from './InfoPopup.styled';

interface InfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

function InfoPopup({ isOpen, onClose, title, children }: PropsWithChildren<InfoPopupProps>) {
  const shouldCloseFromBackdropRef = useRef(false);
  const suppressBackdropCloseUntilRef = useRef(0);

  const markBackdropMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Always stop propagation so ancestor click handlers (e.g. a post card)
    // never see a backdrop tap meant only to dismiss the popup.
    e.stopPropagation();
    if (Date.now() < suppressBackdropCloseUntilRef.current) {
      shouldCloseFromBackdropRef.current = false;
      return;
    }
    shouldCloseFromBackdropRef.current = e.target === e.currentTarget;
  };

  const markBackdropTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const isBackdrop = e.target === e.currentTarget;
    if (!isBackdrop) {
      // iOS WebView can emit follow-up ghost mouse events on backdrop.
      suppressBackdropCloseUntilRef.current = Date.now() + 700;
    }
    shouldCloseFromBackdropRef.current = isBackdrop;
  };

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (Date.now() < suppressBackdropCloseUntilRef.current) {
      shouldCloseFromBackdropRef.current = false;
      return;
    }
    const isBackdrop = e.target === e.currentTarget;
    if (isBackdrop && shouldCloseFromBackdropRef.current) {
      onClose();
    }
    shouldCloseFromBackdropRef.current = false;
  };

  if (!isOpen) return null;

  return (
    <S.Overlay
      onMouseDown={markBackdropMouseDown}
      onTouchStart={markBackdropTouchStart}
      onClick={handleOverlayClick}
    >
      <S.Content onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" mb={12}>
          <Typo type="title-medium">{title}</Typo>
          <S.CloseButton
            type="button"
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <SvgIcon name="close" size={20} />
          </S.CloseButton>
        </Layout.FlexRow>
        {children}
      </S.Content>
    </S.Overlay>
  );
}

export default InfoPopup;
