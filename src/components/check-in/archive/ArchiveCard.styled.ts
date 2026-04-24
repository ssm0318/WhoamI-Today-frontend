import styled from 'styled-components';
import { Layout } from '@design-system';

/**
 * Square card shell for an archive grid cell.
 *
 * Follows the global 8px chip rules: 1px `#D9D9D9` border, white bg,
 * `border-radius: 8px`. Square via `aspect-ratio: 1 / 1` so the 2-col
 * grid produces visually consistent cells regardless of the per-component
 * body content.
 */
export const CardShell = styled(Layout.FlexCol)`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: ${({ theme }) => theme.WHITE};
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 8px;
  overflow: hidden;
  text-align: left;
  cursor: pointer;

  &:disabled,
  &[aria-disabled='true'] {
    cursor: default;
  }
`;

export const CardHeader = styled(Layout.FlexRow)`
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4px;
`;

export const HeaderActions = styled(Layout.FlexCol)`
  align-items: flex-end;
  gap: 2px;
`;

export const CardBodyWrapper = styled(Layout.FlexCol)`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-top: 4px;
  overflow: hidden;
`;

export const Grid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 8px;
  row-gap: 8px;
`;

/** Multi-line clamp for thought/song text that would otherwise overflow the square body. */
export const ClampText = styled.div<{ lines?: number }>`
  width: 100%;
  text-align: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ lines }) => lines ?? 4};
  overflow: hidden;
  word-break: break-word;
`;

export const AlbumCover = styled.img`
  width: 68px;
  height: 68px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;
