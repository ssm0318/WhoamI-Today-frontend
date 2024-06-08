import styled from 'styled-components';
import { MAX_WINDOW_WIDTH, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';

export const RootContainer = styled(Layout.FlexCol)`
  max-width: ${MAX_WINDOW_WIDTH}px;
  overflow-y: auto;
  position: relative;

  /* NOTE: https://github.com/GooJinSun/WhoAmI-Today-frontend/issues/365#issuecomment-2143120139 */
  height: 100vh; // NOTE: 구 브라우저 대응
  height: 100dvh;
`;

export const MainWrapper = styled(Layout.FlexCol)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

export const ModalContainer = styled(Layout.Fixed)`
  width: 100%;
  max-width: ${MAX_WINDOW_WIDTH}px;
  height: 100%;
  top: 0;
  z-index: ${Z_INDEX.MODAL_CONTAINER};
  background-color: ${({ theme }) => theme.WHITE};
  align-items: center;
`;
