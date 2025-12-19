import styled from 'styled-components';
import { SCREEN_WIDTH } from '@constants/layout';
import { Colors, Layout } from '@design-system';

export const SelectPersonaSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.TERTIARY_BLUE};
  border-radius: 16px;
  padding: 24px 0px;
  gap: 20px;
  width: ${SCREEN_WIDTH - 20}px;
  max-width: 100%;
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

export const PersonaGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  height: calc(24px * 3 + 8px * 2); /* 3줄 높이: (pill height * 3) + (gap * 2) */
  overflow-y: hidden;
  box-sizing: border-box;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const PersonaRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  height: 24px;
  flex-shrink: 0;
  box-sizing: border-box;
  margin-left: 16px;
  margin-right: 16px;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  /* 터치 스크롤 활성화 */
  -webkit-overflow-scrolling: touch;
`;

export const FriendsSection = styled(Layout.FlexRow)`
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
`;

export const FriendsProfileList = styled(Layout.FlexRow)`
  align-items: center;
`;

export const SavedMessage = styled(Layout.FlexRow)`
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;
