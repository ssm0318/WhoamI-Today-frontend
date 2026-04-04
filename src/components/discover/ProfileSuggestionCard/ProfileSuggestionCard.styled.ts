import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const ProfileSuggestionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.INPUT_GRAY};
  border-radius: 16px;
  padding: 24px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const MissingFieldChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 8px;
  background-color: ${Colors.WHITE};
  border: 1px solid ${Colors.LIGHT_GRAY};
`;

export const EditButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 8px;
  background-color: ${Colors.PRIMARY};
  cursor: pointer;
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
  }
`;
