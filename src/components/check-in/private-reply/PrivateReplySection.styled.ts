import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  padding-top: 8px;
  margin-top: 6px;
  border-top: 1px dashed #c4b5f4;
  background: transparent;
`;

export const PrivacyHint = styled.div`
  font-size: 11px;
  color: #6b6b6b;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const AckButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? '#9C7BFF' : '#c4b5f4')};
  background: ${({ $active }) => ($active ? '#ede8ff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#6b3fbf' : '#9C7BFF')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
`;

export const CommentButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? '#9C7BFF' : '#c4b5f4')};
  background: ${({ $active }) => ($active ? '#ede8ff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#6b3fbf' : '#9c7bff')};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;
