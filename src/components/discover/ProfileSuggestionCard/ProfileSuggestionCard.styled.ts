import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const ProfileSuggestionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.PRIMARY};
  border-radius: 16px;
  padding: 24px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const MissingFieldChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  background-color: ${Colors.WHITE};
  border: 1px solid ${Colors.LIGHT_GRAY};
`;

export const EditButtonWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;

  button {
    width: 100%;
  }
`;
