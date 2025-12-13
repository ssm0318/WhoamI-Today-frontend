import styled from 'styled-components';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  padding: 12px;
  border-radius: 12px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  background-color: ${({ theme }) => theme.WHITE};
  cursor: pointer;
`;

interface ContentWrapperProps {
  hideContent: boolean;
}

export const ContentWrapper = styled.div<ContentWrapperProps>`
  position: relative;
  ${({ hideContent }) =>
    hideContent
      ? `
    max-height: 3em;
    overflow: hidden;
  `
      : ''}
  line-height: 1.5em;
  word-break: break-word;
`;

export const FadeOutOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.5em;
  background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.WHITE});
  pointer-events: none;
`;
