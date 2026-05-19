import styled from 'styled-components';

import { Z_INDEX } from '@constants/layout';
import { Colors } from '@design-system';

export const FeatureTrigger = styled.button`
  display: inline;
  margin: 0;
  padding: 0 1px;
  border: 0;
  background: transparent;
  color: ${Colors.PRIMARY};
  cursor: pointer;
  font: inherit;
  font-weight: inherit;
  line-height: inherit;
  text-align: inherit;
  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  -webkit-tap-highlight-color: transparent;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${Z_INDEX.ALERT_DIALOG};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 14px calc(18px + env(safe-area-inset-bottom));
  background: rgba(0, 0, 0, 0.58);
`;

export const ModalCard = styled.div`
  width: min(460px, calc(100vw - 28px));
  max-height: min(760px, 86dvh);
  overflow: hidden;
  border-radius: 16px;
  background: ${Colors.WHITE};
  box-shadow: 0 18px 56px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 14px 10px 18px;
  border-bottom: 1px solid ${Colors.LIGHT_GRAY};
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  color: ${Colors.BLACK};
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
`;

export const IconButton = styled.button`
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: ${Colors.LIGHT};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

export const ScreenshotFrame = styled.div`
  position: relative;
  width: 100%;
`;

export const CarouselCounter = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 1;
  min-width: 44px;
  border-radius: 999px;
  padding: 5px 9px;
  background: rgba(0, 0, 0, 0.68);
  color: ${Colors.WHITE};
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
`;

export const CarouselNavButton = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $side }) => $side}: 24px;
  z-index: 1;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  transform: translateY(-50%);
  transition: opacity 140ms ease, transform 140ms ease;
  -webkit-tap-highlight-color: transparent;

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.96);
  }

  &:disabled {
    opacity: 0.34;
    cursor: default;
  }
`;

export const ScreenshotTrack = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ScreenshotSlide = styled.figure`
  flex: 0 0 100%;
  margin: 0;
  padding: 14px 14px 12px;
  scroll-snap-align: center;
`;

export const ScreenshotImage = styled.img`
  width: 100%;
  max-height: min(560px, 62dvh);
  object-fit: contain;
  display: block;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.LIGHT};
`;

export const Caption = styled.figcaption`
  margin-top: 8px;
  color: ${Colors.DARK_GRAY};
  font-size: 13px;
  line-height: 1.35;
  text-align: center;
`;

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 0 14px 14px;
`;

export const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? 24 : 9)}px;
  height: 9px;
  border: 0;
  border-radius: 999px;
  padding: 0;
  background: ${({ $active }) => ($active ? Colors.PRIMARY : Colors.LIGHT_GRAY)};
  cursor: pointer;
  transition: width 160ms ease, background 160ms ease;
`;
