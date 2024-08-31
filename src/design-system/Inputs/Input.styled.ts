import styled from 'styled-components';

export interface CommonInputProps {
  width?: number;
  fontSize?: number;
}

export const CommonInput = styled.input<CommonInputProps>`
  outline: none;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  padding: 14px 0;
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '18px')};
  border-width: 0 0 1px;
  border-color: ${({ theme }) => theme.MEDIUM_GRAY};

  :disabled {
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
