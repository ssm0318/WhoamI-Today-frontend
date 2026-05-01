import styled, { css } from 'styled-components';

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
  max-width: 240px;
`;

const baseChip = css`
  background: #ffffff;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
  line-height: 1.3;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s ease;
  &:active {
    background: #f3e8ff;
  }
  &:disabled {
    cursor: default;
    opacity: 0.5;
    &:active {
      background: #ffffff;
    }
  }
`;

export const PrimaryChip = styled.button.attrs({ type: 'button' })`
  ${baseChip}
  border: 1px solid #8700ff;
  color: #8700ff;
  font-weight: 500;
`;

export const SecondaryChip = styled.button.attrs({ type: 'button' })`
  ${baseChip}
  border: 1px dashed #d9d9d9;
  color: #555555;
`;
