import styled from 'styled-components';

export const ColorCard = styled.div<{ $bg: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 16px;
  background: ${({ $bg }) => $bg};
  text-align: left;
`;

export const ShareActionButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
  }
`;

export const QuestionsCard = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  background-color: #f8f4ff;
  border: 1px solid #e8d5ff;
`;

export const SectionCard = styled.div`
  width: 100%;
  padding: 16px;
  background-color: ${({ theme }) => theme.WHITE};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
`;
