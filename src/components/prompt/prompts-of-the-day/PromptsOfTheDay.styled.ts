import styled from 'styled-components';
import { Layout } from '@design-system';

export const StyledPromptsOfTheDayContainer = styled(Layout.FlexRow)`
  overflow-x: scroll;
  overflow-y: visible;
  position: relative;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledPromptsOfTheDay = styled(Layout.FlexRow)`
  padding-right: 16px;
`;

export const StyledRecentPromptsOfTheDay = styled(Layout.FlexCol)`
  padding: 10px 16px;
`;

export const StyledPromptMoreButton = styled.button`
  display: flex;
  align-items: center;

  .icon {
    padding-top: 4px;
  }
`;
