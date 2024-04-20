import styled from 'styled-components';
import { FlexCol } from 'src/design-system/layouts';

export const StyledRecentPromptCard = styled(FlexCol)`
  width: 100%;
  height: 100px;
  padding: 16px;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.LIGHT_GRAY};
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const StyledRecentPromptCardButtons = styled(FlexCol)`
  bottom: 16px;
  margin-left: auto;
`;
