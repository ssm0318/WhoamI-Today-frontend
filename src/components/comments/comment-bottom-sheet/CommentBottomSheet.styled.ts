import styled from 'styled-components';
import { Z_INDEX } from '@constants/layout';
import { Layout } from '@design-system';

export const CommentBottomContentWrapper = styled(Layout.FlexCol)`
  width: 100%;
  padding: 15px 0;
  overflow: auto;
`;

export const CommentBottomFooterWrapper = styled(Layout.Fixed)`
  width: 100%;
  bottom: 0;
  z-index: ${Z_INDEX.BOTTOM_TAB};
`;
