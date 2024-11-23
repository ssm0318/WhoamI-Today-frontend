import styled from 'styled-components';
import {
  NOTE_IMAGE_DISPLAY_HEIGHT,
  NOTE_IMAGE_DISPLAY_HEIGHT_EDIT_MODE,
  NOTE_IMAGE_DISPLAY_WIDTH,
  NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE,
} from '@constants/size';
import { LayoutBase } from 'src/design-system/layouts';

interface StyledNoteImageProps {
  isEditMode?: boolean;
}

export const NoteImage = styled.img<StyledNoteImageProps>`
  max-width: ${({ isEditMode }) =>
    isEditMode ? NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE : NOTE_IMAGE_DISPLAY_WIDTH}px;
  max-height: ${({ isEditMode }) =>
    isEditMode ? NOTE_IMAGE_DISPLAY_HEIGHT_EDIT_MODE : NOTE_IMAGE_DISPLAY_HEIGHT}px;
  object-fit: contain;
  border-radius: 17px;
`;

export const NoteImageWrapper = styled(LayoutBase)`
  position: relative;
`;
