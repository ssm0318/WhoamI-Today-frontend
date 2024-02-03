import styled from 'styled-components';
import { FlexRow } from 'src/design-system/layouts';

export const StyledPromptsOfTheDay = styled(FlexRow)`
  overflow-y: scroll;
`;

export const StyledPromptMoreButton = styled.button`
  display: flex;
  align-items: center;

  .icon {
    padding-top: 4px;
  }
`;
