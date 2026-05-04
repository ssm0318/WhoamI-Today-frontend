import styled from 'styled-components';

export interface CommonInputProps {
  width?: number;
  fontSize?: number;
}

export const CommonInput = styled.input<CommonInputProps>`
  -webkit-appearance: none;
  appearance: none;
  display: block;
  outline: none;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: 51px;
  padding: 14px 0 13px;
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '18px')};
  line-height: 22px;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.MEDIUM_GRAY};
  border-radius: 0;
  box-shadow: none;
  caret-color: ${({ theme }) => theme.BLACK};
  -webkit-tap-highlight-color: transparent;

  :disabled {
    color: ${({ theme }) => theme.MEDIUM_GRAY};
    border-radius: 8px;
    border: none;
    margin-top: 12px;
  }

  :focus {
    border-bottom: 2px solid ${({ theme }) => theme.PRIMARY};
  }
`;

export default CommonInput;
