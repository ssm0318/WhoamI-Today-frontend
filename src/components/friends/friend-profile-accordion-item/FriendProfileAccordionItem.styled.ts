import styled from 'styled-components';
import { Layout } from '@design-system';

export const AccordionContainer = styled(Layout.FlexCol)<{ $isMyCard?: boolean }>`
  box-sizing: border-box;
  width: calc(100% - 32px);
  margin: 0 auto;
  min-width: 0;
  flex-shrink: 0;
  overflow: visible;
  background-color: ${({ $isMyCard }) => ($isMyCard ? '#EEE6F4' : 'white')};
`;

export const CollapsedRow = styled(Layout.FlexRow)`
  cursor: pointer;
  align-items: center;
  width: 100%;
  min-height: 48px;
`;

export const ExpandableSection = styled.div<{ $isExpanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isExpanded }) => ($isExpanded ? '1fr' : '0fr')};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  transition: grid-template-rows 0.25s ease, opacity 0.2s ease;
`;

export const ExpandableInner = styled.div`
  overflow: hidden;
`;

export const ExpandedContent = styled(Layout.FlexCol)`
  padding: 0 0 4px;
`;

export const ChevronButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
`;

export const UpdateBadge = styled(Layout.FlexRow).attrs({
  pv: 2,
  ph: 6,
  rounded: 8,
})`
  background-color: #eee6f4;
  flex-shrink: 0;
`;
