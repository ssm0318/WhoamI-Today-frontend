import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled.div`
  padding: 0;
  background-color: ${({ theme }) => theme.WHITE};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

export const ScrollableContent = styled(Layout.FlexCol)`
  overflow-y: auto;
  flex: 1;
  width: 100%;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
