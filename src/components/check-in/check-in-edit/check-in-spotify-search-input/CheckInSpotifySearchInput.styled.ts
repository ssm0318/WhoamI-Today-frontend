import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export const StyledCheckInSpotifySearchInput = styled(TextareaAutosize)`
  width: 100%;
  padding: 8px 32px 8px 32px;
  font-size: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.SPOTIFY_GREEN};
  background-color: ${({ theme }) => theme.BASIC_WHITE};
  border-radius: 12px;
`;
