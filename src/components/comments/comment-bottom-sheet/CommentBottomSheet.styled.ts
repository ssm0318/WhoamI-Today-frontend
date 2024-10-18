import styled from 'styled-components';
import { BOTTOMSHEET_HEADER_HEIGHT, DEFAULT_MARGIN } from '@constants/layout';
import { Layout } from '@design-system';

export const CommentBottomHeaderWrapper = styled(Layout.Absolute)`
  padding: 12px ${DEFAULT_MARGIN}px;
  width: 100%;
  height: 100%;
  border-bottom: 1.2px solid ${({ theme }) => theme.LIGHT_GRAY};
  top: 0;
  background-color: ${({ theme }) => theme.WHITE};
  height: ${BOTTOMSHEET_HEADER_HEIGHT}px;
  align-items: center;
`;

export const CommentBottomTitleWrapper = styled(Layout.Absolute)`
  left: 50%;
  transform: translateX(-50%);
`;

export const CommentBottomContentWrapper = styled(Layout.FlexCol)`
  width: 100%;
  padding: 15px;
  margin-top: ${BOTTOMSHEET_HEADER_HEIGHT}px;

  overflow-y: scroll;
  padding-bottom: 150px;
`;

export const CommentBottomFooterWrapper = styled(Layout.Fixed)`
  width: 100%;
  bottom: 0;
`;
