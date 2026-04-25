import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  box-sizing: border-box;
  width: calc(100% - 32px);
  min-width: 0;
  flex-shrink: 0;
`;

export const PostsScrollContainer = styled(Layout.FlexRow)`
  overflow-x: auto;
  flex-wrap: nowrap;
  width: 100%;
  align-items: flex-start;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

export const PostsScrollItem = styled.div`
  flex: 0 0 280px;
  width: 280px;
  height: 220px;
  display: flex;
  overflow: hidden;
`;

export const StarIconContainer = styled(Layout.FlexRow).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${Colors.SECONDARY};
`;
