import styled from 'styled-components';
import { Colors, Layout } from '@design-system';

export const SelectPersonaSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.PRIMARY};
  border-radius: 16px;
  padding: 24px 0px;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

export const PersonaGrid = styled.div`
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

export const FriendsSection = styled(Layout.FlexRow)`
  align-items: center;
  gap: 4px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  padding-left: 16px;
`;

export const FriendsProfileList = styled(Layout.FlexRow)`
  align-items: center;
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
