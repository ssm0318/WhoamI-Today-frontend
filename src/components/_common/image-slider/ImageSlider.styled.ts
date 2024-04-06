import styled from 'styled-components';
import { Layout } from '@design-system';

export const ImageSliderWrapper = styled(Layout.FlexCol)`
  touchaction: none;
`;

export const ImageWrapper = styled(Layout.FlexRow)`
  position: relative;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
`;

export const IndicatorItem = styled(Layout.LayoutBase)<{
  isActive: boolean;
}>`
  opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};
`;
