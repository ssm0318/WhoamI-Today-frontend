import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const MusicHighlightWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.BLACK};
  border-radius: 16px;
  padding: 24px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

export const AlbumArtContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  max-height: 240px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const ListenButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  background-color: ${Colors.SPOTIFY_GREEN};
  cursor: pointer;
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none;

  &:active {
    opacity: 0.8;
  }
`;

export const PlaceholderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;
