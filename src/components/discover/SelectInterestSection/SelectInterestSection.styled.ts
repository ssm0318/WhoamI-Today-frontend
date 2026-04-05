import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const SelectInterestSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.TERTIARY_BLUE};
  border-radius: 16px;
  padding: 24px 0px;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${Colors.WHITE};
  margin: 0;
  width: 100%;
  margin-left: 16px;
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const InterestGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px;
`;

export const ExpandToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4px 0;
  cursor: pointer;
`;

export const SaveButtonWrapper = styled.div`
  width: 100%;
  padding: 0 16px;
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
