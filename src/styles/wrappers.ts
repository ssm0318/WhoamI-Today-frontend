import styled from 'styled-components';
import {
  BOTTOM_TABBAR_HEIGHT,
  MAX_WINDOW_WIDTH,
  TOP_NAVIGATION_HEIGHT,
  Z_INDEX,
} from '@constants/layout';
import { Layout } from '@design-system';

export const RootContainer = styled(Layout.FlexCol)`
  max-width: ${MAX_WINDOW_WIDTH}px;
  overflow: hidden;
  position: relative;

  /* NOTE: https://github.com/GooJinSun/WhoAmI-Today-frontend/issues/365#issuecomment-2143120139 */
  height: 100vh; // NOTE: 구 브라우저 대응
  height: 100dvh;
`;

export const MainWrapper = styled(Layout.FlexCol)`
  height: calc(
    100% - ${TOP_NAVIGATION_HEIGHT}px - ${BOTTOM_TABBAR_HEIGHT}px - env(safe-area-inset-bottom, 0px)
  );
  margin-top: ${TOP_NAVIGATION_HEIGHT}px;
  margin-bottom: calc(${BOTTOM_TABBAR_HEIGHT}px + env(safe-area-inset-bottom, 0px));
  width: 100%;
  overflow-y: auto;
  overflow-x: visible;
  /* iOS: input 포커스 시 스크롤이 막히는 현상 완화 (곳곳에서 보고된 이슈) */
  -webkit-overflow-scrolling: touch;
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
