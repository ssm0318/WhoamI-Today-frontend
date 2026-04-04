import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const MissionPromptWrapper = styled(Layout.FlexCol)`
  background: linear-gradient(135deg, ${Colors.PRIMARY} 0%, #6200b3 100%);
  border-radius: 16px;
  padding: 24px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const DoItButton = styled.div<{ $isCompleted: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 8px;
  background-color: ${({ $isCompleted }) => ($isCompleted ? '#F5F5F5' : Colors.WHITE)};
  cursor: ${({ $isCompleted }) => ($isCompleted ? 'default' : 'pointer')};
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: ${({ $isCompleted }) => ($isCompleted ? 1 : 0.8)};
  }
`;
