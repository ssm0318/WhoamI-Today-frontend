import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';
import { SCREEN_WIDTH } from '@constants/layout';
import { Colors, Layout } from '@design-system';

export const HighlightSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.PRIMARY};
  border-radius: 16px;
  padding: 24px;
  gap: 20px;
  width: ${SCREEN_WIDTH - 20}px;
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
`;

export const TextInputWrapper = styled.div`
  width: 100%;
  background-color: ${Colors.WHITE};
  border-radius: 8px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  padding: 14px 16px;
  box-sizing: border-box;
`;

export const StyledTextArea = styled(TextareaAutosize)`
  width: 100%;
  min-height: 120px;
  font-size: 16px;
  font-family: Roboto, sans-serif;
  line-height: 24px;
  border: none;
  outline: none;
  resize: none;
  background-color: transparent;
  color: ${Colors.BLACK};

  ::placeholder {
    color: ${Colors.MEDIUM_GRAY};
  }

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ButtonContainer = styled(Layout.FlexCol)`
  gap: 12px;
  width: 100%;
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
