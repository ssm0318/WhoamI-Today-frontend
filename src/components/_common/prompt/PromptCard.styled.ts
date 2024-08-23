import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledPromptCard = styled(Layout.FlexCol)`
  padding: 16px;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.WHITE};
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const StyledPromptCardButtons = styled(Layout.FlexRow)`
  bottom: 16px;
`;

export const StyledNewResponsePrompt = styled.div`
  border: 2px solid ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 12px;
  padding: 16px;
  width: 100%;
`;
