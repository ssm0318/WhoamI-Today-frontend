import styled from 'styled-components';
import { MAX_WINDOW_WIDTH, Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';

export const StyledCommentListFooter = styled(Layout.Fixed)`
  max-width: ${MAX_WINDOW_WIDTH}px;
  z-index: ${Z_INDEX.COMMENT_LIST};
`;
