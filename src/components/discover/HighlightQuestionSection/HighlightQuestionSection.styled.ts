import styled from 'styled-components';
import { SCREEN_WIDTH } from '@constants/layout';
import { Colors, Layout } from '@design-system';

export const HighlightSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.PRIMARY};
  border-radius: 16px;
  padding: 24px;
  width: ${SCREEN_WIDTH - 32}px;
  max-width: 100%;
  box-sizing: border-box;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${Colors.WHITE};
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 140%;
  margin-top: 6px;
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
