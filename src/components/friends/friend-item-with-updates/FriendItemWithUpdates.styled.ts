import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  box-sizing: border-box;
  width: calc(100% - 32px);
  min-width: 0;
  flex-shrink: 0;
  overflow: visible;
`;

export const PostsScrollContainer = styled(Layout.FlexRow)`
  overflow-x: auto;
  flex-wrap: nowrap;
  width: calc(100% + 64px);
  margin-left: -32px;
  margin-right: -32px;
  padding-left: 32px;
  padding-right: 32px;
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

export const EmptyPostsContainer = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
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
