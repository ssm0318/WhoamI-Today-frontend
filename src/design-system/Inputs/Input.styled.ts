import styled from 'styled-components';

export interface InputProps {
  width?: number;
}

export const CommonInput = styled.input`
  ${(props: InputProps) =>
    `outline: none;
    width: ${props.width ? `${props.width}px` : '100%'};`}
  height: 24px;
  font-size: 18px;
  border-width: 0 0 1px;
  border-color: ${({ theme }) => theme.GRAY_1};
`;

export default CommonInput;
