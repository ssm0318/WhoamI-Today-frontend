import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT, MAX_WINDOW_WIDTH, TOP_NAVIGATION_HEIGHT } from '@constants/layout';
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
  align-items: 'center';
  padding-top: ${TOP_NAVIGATION_HEIGHT}px;
  padding-bottom: ${BOTTOM_TABBAR_HEIGHT}px;
`;
