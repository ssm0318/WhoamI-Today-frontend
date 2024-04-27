import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledPromptsOfTheDay = styled(Layout.FlexRow)`
  overflow-y: scroll;
`;

export const StyledRecentPromptsOfTheDay = styled(Layout.FlexCol)`
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
