import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Layout } from '@design-system';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

function Popup({ isOpen, onClose, children }: PropsWithChildren<PopupProps>) {
  if (!isOpen) return null;

  return (
    <StyledPopupOverlay onClick={onClose}>
      <StyledPopupContent onClick={(e) => e.stopPropagation()}>{children}</StyledPopupContent>
    </StyledPopupOverlay>
  );
}

const StyledPopupOverlay = styled(Layout.FlexCol)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  justify-content: center;
  align-items: center;
`;

const StyledPopupContent = styled.div`
  position: relative;
  width: 70%;
  max-height: 50vh;
  margin: 20px;
  overflow-y: auto;
`;

export default Popup;
