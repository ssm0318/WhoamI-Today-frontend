import styled from 'styled-components';

export interface CommonInputProps {
  width?: number;
}

export const CommonInput = styled.input`
  ${(props: CommonInputProps) =>
    `outline: none;
    width: ${props.width ? `${props.width}px` : '100%'};`}
  padding: 14px 0;
  font-size: 18px;
  border-width: 0 0 1px;
  border-color: ${({ theme }) => theme.MEDIUM_GRAY};

  :disabled {
    background-color: ${({ theme }) => theme.MEDIUM_GRAY};
    color: ${({ theme }) => theme.MEDIUM_GRAY};
    border-radius: 8px;
    border: none;
    margin-top: 12px;
  }

  :focus {
    border-bottom-width: 2px;
    border-bottom-color: ${({ theme }) => theme.PRIMARY};
  }
`;

export default CommonInput;
