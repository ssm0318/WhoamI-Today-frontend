import styled from 'styled-components';
import { Layout } from '@design-system';

export const CardContainer = styled(Layout.FlexCol)`
  flex-shrink: 0;
  width: 160px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  background-color: ${({ theme }) => theme.WHITE};
  overflow: hidden;
  cursor: pointer;
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
`;

export const ContentText = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: ${({ theme }) => theme.BLACK};
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
