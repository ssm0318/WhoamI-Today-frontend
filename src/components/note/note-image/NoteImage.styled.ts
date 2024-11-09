import styled from 'styled-components';
import {
  NOTE_IMAGE_DISPLAY_HEIGHT,
  NOTE_IMAGE_DISPLAY_HEIGHT_EDIT_MODE,
  NOTE_IMAGE_DISPLAY_WIDTH,
  NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE,
} from '@constants/size';

interface StyledNoteImageProps {
  isEditMode?: boolean;
}

export const NoteImage = styled.img<StyledNoteImageProps>`
  width: ${({ isEditMode }) =>
    isEditMode ? NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE : NOTE_IMAGE_DISPLAY_WIDTH}px;
  height: ${({ isEditMode }) =>
    isEditMode ? NOTE_IMAGE_DISPLAY_HEIGHT_EDIT_MODE : NOTE_IMAGE_DISPLAY_HEIGHT}px;
  object-fit: cover;
  border-radius: 17px;
`;
