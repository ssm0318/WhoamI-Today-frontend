import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const HighlightSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.PRIMARY};
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
`;

export const AskFriendsButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 6px 12px;
  border: 1px solid ${Colors.WHITE};
  border-radius: 8px;
  background: ${Colors.WHITE};
  white-space: nowrap;
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
