import styled from 'styled-components';
import { Layout } from '@design-system';

export const ScrollableCardList = styled(Layout.FlexRow)`
  overflow-x: auto;
  overflow-y: visible;
  flex-wrap: nowrap;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const PlaylistCard = styled(Layout.FlexRow)`
  position: relative;
  flex-shrink: 0;
  align-items: center;
  /* 스타일링은 여기에 추가 */
`;
