import styled from 'styled-components';
import { BOTTOM_TABBAR_HEIGHT, SCREEN_HEIGHT, TOP_NAVIGATION_HEIGHT } from '@constants/layout';

export const PullToRefreshContainer = styled.div`
  min-height: ${SCREEN_HEIGHT - BOTTOM_TABBAR_HEIGHT - TOP_NAVIGATION_HEIGHT}px;
`;
