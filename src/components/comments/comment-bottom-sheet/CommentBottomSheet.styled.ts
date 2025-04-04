import styled from 'styled-components';
import {
  BOTTOMSHEET_HEADER_HEIGHT,
  DEFAULT_MARGIN,
  MAX_WINDOW_WIDTH,
  Z_INDEX,
} from '@constants/layout';
import { Layout } from '@design-system';

export const CommentBottomHeaderWrapper = styled(Layout.Fixed)`
  top: 0;
  display: flex;
  max-width: ${MAX_WINDOW_WIDTH}px;
  background-color: white;
  height: ${BOTTOMSHEET_HEADER_HEIGHT}px;
  padding: 0px ${DEFAULT_MARGIN}px;
  width: 100%;
  border-bottom: 1.2px solid ${({ theme }) => theme.LIGHT_GRAY};
  z-index: ${Z_INDEX.TITLE_HEADER};
`;

export const CommentBottomContentWrapper = styled(Layout.FlexCol)`
  width: 100%;
  padding: 15px 0;
  margin-top: ${BOTTOMSHEET_HEADER_HEIGHT}px;
  overflow: auto;
`;

export const CommentBottomFooterWrapper = styled(Layout.Fixed)`
  width: 100%;
  bottom: 0;
  z-index: ${Z_INDEX.BOTTOM_TAB};
`;
