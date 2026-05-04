import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export interface CommonTextAreaProps {
  width?: number;
  underline?: boolean;
}

export const CommonTextArea = styled(TextareaAutosize).withConfig({
  shouldForwardProp: ((prop: string | number) =>
    String(prop) !== 'underline' && String(prop) !== 'width') as any,
})`
  -webkit-appearance: none;
  appearance: none;
  ${(props: CommonTextAreaProps) => `width: ${props.width ? `${props.width}px` : '100%'};`}
  padding: 14px 0;
  font-size: 18px;
  background-color: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  caret-color: ${({ theme }) => theme.BLACK};
  -webkit-tap-highlight-color: transparent;
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
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
export default CommonTextArea;
