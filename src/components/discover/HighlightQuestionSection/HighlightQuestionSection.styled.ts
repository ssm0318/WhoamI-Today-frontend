import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const HighlightSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.PRIMARY};
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
`;

export const SaveButton = styled.div`
  button {
    background-color: ${Colors.WHITE} !important;
    border: 1px solid ${Colors.PRIMARY} !important;

    .button_component {
      background-color: ${Colors.WHITE} !important;
      border: 1px solid ${Colors.PRIMARY} !important;
    }

    p,
    span {
      color: ${Colors.PRIMARY} !important;
    }
  }
`;

export const SavedMessage = styled(Layout.FlexRow)`
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;
