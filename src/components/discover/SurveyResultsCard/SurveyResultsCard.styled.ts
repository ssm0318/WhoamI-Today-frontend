import styled from 'styled-components';

import { Colors, Layout } from '@design-system';

export const SurveyResultsWrapper = styled(Layout.FlexCol)`
  background: linear-gradient(135deg, #0072ec 0%, #003e99 100%);
  border-radius: 16px;
  padding: 24px;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const ViewResultsButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: 8px;
  background-color: ${Colors.WHITE};
  cursor: pointer;
  align-self: flex-start;
  -webkit-tap-highlight-color: transparent;

  &:active {
    opacity: 0.8;
  }
`;
