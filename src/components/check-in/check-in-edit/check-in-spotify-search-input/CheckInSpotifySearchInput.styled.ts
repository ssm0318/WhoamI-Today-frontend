import TextareaAutosize from 'react-textarea-autosize';
import styled from 'styled-components';

export const StyledCheckInSpotifySearchInput = styled(TextareaAutosize)`
  width: 100%;
  padding: 8px 32px 8px 32px;
  font-size: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.LIGHT_GRAY};
  background-color: ${({ theme }) => theme.WHITE};
  color: ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 12px;
`;
