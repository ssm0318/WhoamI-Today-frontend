import { TextareaAutosizeProps } from 'react-textarea-autosize';
import { Layout, SvgIcon } from '@design-system';
import * as S from './CheckInSpotifySearchInput.styled';

interface CheckInSpotifySearchInputProps extends TextareaAutosizeProps {}

function CheckInSpotifySearchInput(props: CheckInSpotifySearchInputProps) {
  return (
    <Layout.FlexRow
      w="100%"
      alignItems="center"
      rounded={12}
      bgColor="WHITE"
      style={{
        position: 'relative',
      }}
    >
      <Layout.Absolute l={8}>
        <Layout.LayoutBase p={7}>
          <SvgIcon name="search" size={12} fill="MEDIUM_GRAY" />
        </Layout.LayoutBase>
      </Layout.Absolute>
      <S.StyledCheckInSpotifySearchInput {...props} placeholder="Search" />
      <Layout.Absolute r={8}>
        <SvgIcon name="spotify" size={24} />
      </Layout.Absolute>
    </Layout.FlexRow>
  );
}
export default CheckInSpotifySearchInput;
