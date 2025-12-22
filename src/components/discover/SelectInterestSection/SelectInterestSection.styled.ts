import styled from 'styled-components';
import { SCREEN_WIDTH } from '@constants/layout';
import { Colors, Layout } from '@design-system';

export const SelectInterestSectionWrapper = styled(Layout.FlexCol)`
  background-color: ${Colors.TERTIARY_PINK};
  border-radius: 16px;
  padding: 24px 0px;
  gap: 20px;
  width: ${SCREEN_WIDTH - 32}px;
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

export const InterestGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  box-sizing: border-box;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const InterestRow = styled.div`
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
  padding: 0 16px;

  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  /* 터치 스크롤 활성화 */
  -webkit-overflow-scrolling: touch;
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
