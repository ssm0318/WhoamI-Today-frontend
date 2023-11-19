import { TextareaAutosizeProps } from 'react-textarea-autosize';
import { Layout, SvgIcon } from '@design-system';
import * as S from './SpotifyMusicSearchInput.styled';

interface SpotifyMusicSearchInputProps extends TextareaAutosizeProps {}

function SpotifyMusicSearchInput(props: SpotifyMusicSearchInputProps) {
  return (
    <Layout.FlexRow
      w="100%"
      alignItems="center"
      rounded={12}
      bgColor="BASIC_WHITE"
      style={{
        position: 'relative',
      }}
    >
      <Layout.Absolute l={8}>
        <SvgIcon name="search" size={24} />
      </Layout.Absolute>
      <S.StyledSpotifyMusicSearchInput {...props} placeholder="Search" />
      <Layout.Absolute r={8}>
        <SvgIcon name="spotify" size={24} />
      </Layout.Absolute>
    </Layout.FlexRow>
  );
}
export default SpotifyMusicSearchInput;
