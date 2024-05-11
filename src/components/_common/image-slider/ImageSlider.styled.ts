import styled from 'styled-components';
import {
  NOTE_IMAGE_DISPLAY_HEIGHT,
  NOTE_IMAGE_DISPLAY_HEIGHT_EDIT_MODE,
  NOTE_IMAGE_DISPLAY_WIDTH,
  NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE,
} from '@constants/size';
import { Layout } from '@design-system';

export const ImageSliderWrapper = styled(Layout.FlexCol)`
  touchaction: none;
`;

export const ImageWrapper = styled(Layout.FlexRow)`
  position: relative;
`;

interface ImageProps {
  isEditMode?: boolean;
}

export const Image = styled.img<ImageProps>`
  width: ${({ isEditMode }) =>
    isEditMode ? NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE : NOTE_IMAGE_DISPLAY_WIDTH}px;
  height: ${({ isEditMode }) =>
    isEditMode ? NOTE_IMAGE_DISPLAY_HEIGHT_EDIT_MODE : NOTE_IMAGE_DISPLAY_HEIGHT}px;
  object-fit: cover;
`;

export const IndicatorItem = styled(Layout.LayoutBase)<{
  isActive: boolean;
}>`
  opacity: ${({ isActive }) => (isActive ? 1 : 0.5)};
`;
