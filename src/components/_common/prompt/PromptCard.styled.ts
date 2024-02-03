import styled from 'styled-components';
import { FlexCol, FlexRow } from 'src/design-system/layouts';

export const StyledPromptCard = styled(FlexCol)`
  width: 250px;
  height: 154.5px;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.WHITE};
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const StyledPromptCardButtons = styled(FlexRow)`
  position: absolute;
  bottom: 16px;
`;
