import styled from 'styled-components';
import { Layout } from '@design-system';

const CommonMessageWrapper = styled(Layout.FlexRow).attrs({
  w: '100%',
  gap: 6,
  alignItems: 'flex-end',
})``;

export const LeftMessageWrapper = styled(CommonMessageWrapper).attrs({
  justifyContent: 'flex-start',
  pl: 4,
})``;

export const RightMessageWrapper = styled(CommonMessageWrapper).attrs({
  justifyContent: 'flex-end',
  pr: 10,
})``;

export const SenderAvatarSlot = styled.div`
  width: 32px;
  flex-shrink: 0;
  align-self: flex-end;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const CommonBubble = styled(Layout.FlexCol).attrs({
  pv: 8,
  ph: 13,
})`
  max-width: 208px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
`;

export const LeftBubble = styled(CommonBubble).attrs({
  bgColor: 'LIGHT',
})`
  border-radius: 13px 13px 13px 0px;
`;

export const RightBubble = styled(CommonBubble).attrs({
  bgColor: 'SECONDARY',
})`
  border-radius: 13px 13px 0px 13px;
`;

export const ReactionBadge = styled(Layout.FlexRow).attrs({
  gap: 2,
  ph: 6,
  pv: 2,
  rounded: 10,
  alignItems: 'center',
})`
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
`;

export const ParentPreview = styled(Layout.FlexCol).attrs({
  ph: 10,
  pv: 4,
  rounded: 8,
})`
  opacity: 0.7;
  border-left: 2px solid #87dfff;
  background: white;
  max-width: 208px;
`;

export const SystemMessageRow = styled(Layout.FlexRow).attrs({
  w: '100%',
  justifyContent: 'center',
  ph: 17,
  pv: 4,
})``;
