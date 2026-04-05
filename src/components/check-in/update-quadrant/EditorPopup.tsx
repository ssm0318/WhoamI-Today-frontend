import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Z_INDEX } from '@constants/layout';
import { Colors, Layout, Typo } from '@design-system';

interface EditorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

function EditorPopup({ isOpen, onClose, title, children }: PropsWithChildren<EditorPopupProps>) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" mb={12}>
          <Typo type="title-medium">{title}</Typo>
          <CloseButton onClick={onClose}>Share</CloseButton>
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
