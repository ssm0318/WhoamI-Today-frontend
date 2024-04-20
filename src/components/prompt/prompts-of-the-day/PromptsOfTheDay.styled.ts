import styled from 'styled-components';
import { FlexCol, FlexRow } from 'src/design-system/layouts';

export const StyledPromptsOfTheDay = styled(FlexRow)`
  overflow-y: scroll;
`;

export const StyledRecentPromptsOfTheDay = styled(FlexCol)`
  overflow-y: scroll;
  padding: 10px 0px;
`;

export const StyledPromptMoreButton = styled.button`
  display: flex;
  align-items: center;

  .icon {
    padding-top: 4px;
  }
`;
