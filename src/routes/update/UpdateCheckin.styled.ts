import styled from 'styled-components';
import { Colors } from '@design-system';

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  padding: 16px;
  width: 100%;
  height: calc(100vh - 200px);
  max-height: 500px;
`;

export const QuadrantCard = styled.div<{ $isEmpty?: boolean; $isArchived?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.1s ease;

  ${({ $isEmpty, $isArchived }) => {
    if ($isEmpty) {
      return `
        border: 1.5px dashed ${Colors.LIGHT_GRAY};
        background-color: #FAFAFA;
      `;
    }
    if ($isArchived) {
      return `
        border: 1px solid ${Colors.LIGHT_GRAY};
        background-color: ${Colors.WHITE};
        opacity: 0.6;
      `;
    }
    return `
      border: 1px solid ${Colors.LIGHT_GRAY};
      background-color: ${Colors.WHITE};
    `;
  }}

  &:active {
    transform: scale(0.97);
  }
`;

export const ArchivedBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: ${Colors.MEDIUM_GRAY};
  color: ${Colors.WHITE};
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
`;

export const QuadrantLabel = styled.span`
  font-size: 12px;
  color: ${Colors.MEDIUM_GRAY};
  font-weight: 500;
`;

export const SaveButtonWrapper = styled.div`
  padding: 0 16px 16px 16px;
  width: 100%;
`;
