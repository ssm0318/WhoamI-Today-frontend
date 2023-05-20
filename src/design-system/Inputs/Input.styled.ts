import styled from 'styled-components';

interface InputProps {
  width?: number;
}

export const CommonInput = styled.input`
  ${(props: InputProps) =>
    `outline: none;
    width: ${props.width ? `${props.width}px` : '100%'};`}
  padding: 0 20px;
  height: 48px;
  font-size: 18px;
`;

export default CommonInput;
