import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: ${({ theme }) => theme.WHITE};
`;

export const ScrollContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const TrackItemContainer = styled(Layout.FlexRow)`
  width: 100%;
  padding: 12px 0;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.WHITE};
`;

export const TrackItemSeparator = styled.div`
  width: 100vw;
  height: 1px;
  background-color: ${({ theme }) => theme.LIGHT};
  margin-left: -16px;
`;

export const AlbumArtWrapper = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
`;

export const ProfileImageOverlay = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 30px;
  height: 30px;
  padding: 3px;
  border-radius: 50%;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
`;
