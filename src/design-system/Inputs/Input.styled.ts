import styled from 'styled-components';

export interface CommonInputProps {
  width?: number;
}

export const CommonInput = styled.input`
  ${(props: CommonInputProps) =>
    `outline: none;
    width: ${props.width ? `${props.width}px` : '100%'};`}
  padding: 14px 0;
  font-size: 16px;
  border-width: 0 0 1px;
  border-color: ${({ theme }) => theme.GRAY_1};

  :disabled {
    background-color: ${({ theme }) => theme.GRAY_2};
    color: ${({ theme }) => theme.GRAY_9};
    border-radius: 8px;
    border: none;
    margin-top: 12px;
  }
`;

export default CommonInput;
