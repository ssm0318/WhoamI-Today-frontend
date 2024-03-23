import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export interface CommonTextAreaProps {
  width?: number;
  underline?: boolean;
}

export const CommonTextArea = styled(TextareaAutosize)`
  ${(props: CommonTextAreaProps) => `width: ${props.width ? `${props.width}px` : '100%'};`}
  padding: 14px 0;
  font-size: 18px;
  border: none;
  ${({ underline, theme }) =>
    underline &&
    `border-bottom-width: 1px;
      border-bottom-color: ${theme.MEDIUM_GRAY};
      border-bottom-style: solid;
      
      :focus {
        border-bottom-width: 2px;
        border-bottom-color: ${theme.PRIMARY};
        border-bottom-style: solid;
      }
  `}
`;
export default CommonTextArea;
