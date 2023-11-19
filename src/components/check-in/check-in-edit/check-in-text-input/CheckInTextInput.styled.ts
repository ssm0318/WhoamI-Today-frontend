import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export const StyledCheckInTextInput = styled(TextareaAutosize)`
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.GRAY_4};
  background-color: ${({ theme }) => theme.BASIC_WHITE};
  border-radius: 12px;
`;
