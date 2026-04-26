import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const SelectInterestSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.TERTIARY_BLUE};
  border-radius: 16px;
  padding: 24px 16px;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

export const TextBlock = styled(Layout.FlexCol)`
  width: 100%;
  gap: 8px;
`;

export const SaveButtonWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;

  button {
    width: 100%;
  }
`;

export const SavedMessage = styled(Layout.FlexRow)`
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  margin-top: 8px;
`;
