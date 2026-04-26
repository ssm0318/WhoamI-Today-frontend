import styled from 'styled-components';
import { Colors } from '@design-system';

export const Container = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${Colors.BLACK};
  color: ${Colors.WHITE};
  padding: 56px 24px 32px;
  box-sizing: border-box;
  overflow-y: auto;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 24px;
  line-height: 1.3;
  white-space: pre-line;
`;

export const IllustrationWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 320px;
  gap: 8px;
`;

export const ArrowButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: ${Colors.WHITE};
  font-size: 22px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
`;

export const PhoneFrame = styled.div`
  width: 200px;
  height: 380px;
  border: 3px solid ${Colors.DARK_GRAY};
  border-radius: 36px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 18px 24px;
  box-sizing: border-box;
  overflow: hidden;
`;

export const HomeIndicator = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 6px;
  border-radius: 999px;
  background: ${Colors.DARK_GRAY};
`;

export const EditBadge = styled.div`
  align-self: flex-start;
  background: rgba(255, 200, 0, 0.18);
  color: #ffc800;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 8px;
`;

export const AppGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
`;

export const AppDot = styled.span`
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  background: ${Colors.DARK_GRAY};
  opacity: 0.6;
`;

export const OverlayLabel = styled.div`
  position: absolute;
  top: 18px;
  left: 18px;
  background: rgba(255, 255, 255, 0.12);
  color: ${Colors.WHITE};
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 10px;
  white-space: nowrap;
`;

export const SearchBar = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.12);
  color: ${Colors.WHITE};
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 999px;
  margin-bottom: 16px;
  text-align: center;
`;

export const WidgetResult = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 16px;
`;

export const WidgetIcon = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
`;

export const WidgetLabel = styled.span`
  color: ${Colors.WHITE};
  font-size: 12px;
  font-weight: 600;
`;

export const WidgetPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
`;

export const WidgetPreviewBox = styled.div`
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
`;

export const EmptyAreaHighlight = styled.div`
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 2px dashed rgba(255, 255, 255, 0.45);
`;

export const BottomCard = styled.div`
  position: absolute;
  bottom: 28px;
  left: 14px;
  right: 14px;
  background: rgba(40, 40, 42, 0.95);
  border-radius: 14px;
  padding: 8px 6px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`;

export const BottomCardItem = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 8px;
  background: ${({ $highlighted }) => ($highlighted ? 'rgba(255, 200, 0, 0.18)' : 'transparent')};
`;

export const BottomCardIcon = styled.div<{ $highlighted?: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: ${({ $highlighted }) => ($highlighted ? '#ffc800' : Colors.MEDIUM_GRAY)};
`;

export const BottomCardLabel = styled.span<{ $highlighted?: boolean }>`
  color: ${({ $highlighted }) => ($highlighted ? '#ffc800' : Colors.WHITE)};
  font-size: 9px;
  font-weight: ${({ $highlighted }) => ($highlighted ? 700 : 500)};
`;

export const WidgetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const WidgetListItem = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: ${({ $highlighted }) =>
    $highlighted ? 'rgba(255, 200, 0, 0.12)' : 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid
    ${({ $highlighted }) => ($highlighted ? 'rgba(255, 200, 0, 0.6)' : 'transparent')};
`;

export const DummyAppIcon = styled.div<{ $color: string }>`
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const DummyAppLabel = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.18);
`;

export const DraggingWidget = styled.div`
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-4deg);
  width: 110px;
  height: 110px;
  border-radius: 16px;
  background: #ffc800;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DraggingWidgetIcon = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
`;

export const StepText = styled.p`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin: 24px 0 20px;
  line-height: 1.4;
  min-height: 56px;
  white-space: pre-line;
`;

export const Dots = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

export const Dot = styled.span<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? Colors.WHITE : Colors.DARK_GRAY)};
  transition: background 0.2s ease;
`;

export const CtaButton = styled.button<{ $active: boolean }>`
  width: 100%;
  max-width: 360px;
  padding: 16px 24px;
  border-radius: 999px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  background: ${({ $active }) => ($active ? Colors.WHITE : '#1F1F1F')};
  color: ${({ $active }) => ($active ? Colors.BLACK : Colors.MEDIUM_GRAY)};
  cursor: pointer;
`;
