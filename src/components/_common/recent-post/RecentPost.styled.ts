import styled from 'styled-components';
import {
  NOTE_IMAGE_DISPLAY_HEIGHT,
  NOTE_IMAGE_DISPLAY_HEIGHT_EDIT_MODE,
  NOTE_IMAGE_DISPLAY_WIDTH,
  NOTE_IMAGE_DISPLAY_WIDTH_EDIT_MODE,
} from '@constants/size';
import { Layout } from '@design-system';

export const Container = styled(Layout.FlexCol)`
  padding: 12px;
  border-radius: 12px;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  background-color: ${({ theme }) => theme.WHITE};
  cursor: pointer;
`;

interface ContentWrapperProps {
  hideContent: boolean;
}

export const ContentWrapper = styled.div<ContentWrapperProps>`
  position: relative;
  ${({ hideContent }) =>
    hideContent
      ? `
    max-height: 3em;
    overflow: hidden;
  `
      : ''}
  line-height: 1.5em;
  word-break: break-word;
`;

export const FadeOutOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.5em;
  background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.WHITE});
  pointer-events: none;
`;

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

export const NoteImageWrapper = styled(Layout.FlexRow)`
  position: relative;
`;
