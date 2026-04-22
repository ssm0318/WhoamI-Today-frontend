import { MouseEvent, PropsWithChildren } from 'react';
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
  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    console.log('[EditorPopup] overlay click', {
      title,
      isBackdrop: e.target === e.currentTarget,
      targetTag: (e.target as HTMLElement).tagName,
    });
    // Close only when the backdrop itself is clicked.
    if (e.target === e.currentTarget) {
      console.log('[EditorPopup] onClose from overlay', { title });
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
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
          <CloseButton
            type="button"
            onClick={() => {
              console.log('[EditorPopup] Share clicked', { title });
              onShare();
            }}
          >
            Share
          </CloseButton>
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
