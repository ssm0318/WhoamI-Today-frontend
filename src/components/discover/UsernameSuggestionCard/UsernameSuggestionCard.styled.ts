import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const UsernameSuggestionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.SECONDARY};
  border-radius: 16px;
  padding: 24px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const UsernameChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: ${Colors.WHITE};
  border: 1px solid ${Colors.LIGHT_GRAY};
  align-self: flex-start;
`;

export const EditButtonWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;

  button {
    width: 100%;
  }
`;
