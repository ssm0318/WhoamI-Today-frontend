import styled from 'styled-components';
import { Font, Layout } from '@design-system';

export const LeftMessageItem = styled(Layout.FlexRow)``;

export const StyledTime = styled(Font.Body).attrs({
  type: '10_regular',
  color: 'GRAY_12',
})``;

const CommonMessageWrapper = styled(Layout.FlexRow).attrs({
  w: '100%',
  gap: 10,
  alignItems: 'flex-end',
})``;

export const LeftMessageWrapper = styled(CommonMessageWrapper).attrs({
  justifyContent: 'flex-start',
  pl: 17,
})``;

export const RightMessageWrapper = styled(CommonMessageWrapper).attrs({
  justifyContent: 'flex-end',
  pr: 10,
})``;

const CommonMessageContent = styled(Layout.LayoutBase).attrs({
  pv: 8,
  ph: 13,
  justifyContent: 'center',
  alignItems: 'center',
})`
  max-width: 208px;
`;

export const LeftMessageContent = styled(CommonMessageContent).attrs({
  rounded: 13,
  bgColor: 'GRAY_7',
})``;

export const RightMessageContent = styled(CommonMessageContent).attrs({
  bgColor: 'SECONDARY',
})`
  border-radius: 13px 13px 0px 13px;
`;
