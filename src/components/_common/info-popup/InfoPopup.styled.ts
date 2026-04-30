import styled from 'styled-components';
import { Z_INDEX } from '@constants/layout';
import { Colors, Layout } from '@design-system';

export const Overlay = styled(Layout.FlexCol)`
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

export const Content = styled.div`
  position: relative;
  width: 85%;
  max-width: 400px;
  max-height: 70vh;
  padding: 20px;
  border-radius: 16px;
  background-color: ${Colors.WHITE};
  overflow-y: auto;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;
