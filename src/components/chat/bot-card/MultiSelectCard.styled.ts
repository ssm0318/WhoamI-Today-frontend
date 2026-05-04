import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  margin-top: 6px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  max-width: 280px;
`;

export const OptionRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 0;
  font-size: 14px;
  font-family: inherit;
  color: #333;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 8px 12px;
  background: #8700ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }
`;
