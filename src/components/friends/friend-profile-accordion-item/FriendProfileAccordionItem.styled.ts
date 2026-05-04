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
  background-color: #ffe4e6;
  flex-shrink: 0;
`;

/** Hairline separator that only renders while the posts section is expanded.
 *  Anchors the eye to where the section opened from check-ins below. */
export const PostsSectionDivider = styled.hr`
  width: 100%;
  height: 1px;
  border: 0;
  margin: 14px 0;
  background-color: ${({ theme }) => theme.LIGHT_GRAY};
  opacity: 0.6;
`;

/** Compact inline [UP] used next to a single check-in pill (battery / mood /
 *  thought / song) so the viewer sees which row was updated. Smaller than the
 *  username-row UpdateBadge so it sits comfortably alongside the chip. */
export const InlineUpdateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #ffe4e6;
  color: ${({ theme }) => theme.WARNING};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 1px 5px;
  border-radius: 6px;
  flex-shrink: 0;
  user-select: none;
`;

export const PostsButton = styled.button<{ $hasNew?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${({ $hasNew, theme }) => ($hasNew ? theme.PRIMARY : theme.WHITE)};
  color: ${({ $hasNew, theme }) => ($hasNew ? theme.WHITE : theme.PRIMARY)};
  border: 1px solid ${({ theme }) => theme.PRIMARY};
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  &:active {
    opacity: 0.85;
  }
`;

export const NewPill = styled.span`
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => theme.WHITE};
  color: ${({ theme }) => theme.PRIMARY};
  border-radius: 6px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

export const CheckInDivider = styled.span`
  color: ${({ theme }) => theme.MEDIUM_GRAY};
  font-size: 14px;
  flex-shrink: 0;
  user-select: none;
`;

export const SeeAllPostsLink = styled.button`
  background: none;
  border: 0;
  padding: 8px 4px;
  color: ${({ theme }) => theme.PRIMARY};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
`;

export const NoPostsHint = styled(Layout.FlexCol).attrs({ gap: 8, alignItems: 'flex-start' })`
  padding: 12px 4px 4px;
`;

export const ProfileLinkButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.PRIMARY};
  color: ${({ theme }) => theme.PRIMARY};
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;
