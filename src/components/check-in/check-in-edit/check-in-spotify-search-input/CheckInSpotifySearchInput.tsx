import { useTranslation } from 'react-i18next';
import { TextareaAutosizeProps } from 'react-textarea-autosize';
import { Layout, SvgIcon } from '@design-system';
import * as S from './CheckInSpotifySearchInput.styled';

interface CheckInSpotifySearchInputProps extends TextareaAutosizeProps {}

function CheckInSpotifySearchInput(props: CheckInSpotifySearchInputProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_edit.song' });
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
        <SvgIcon name="search" size={24} fill="MEDIUM_GRAY" />
      </Layout.Absolute>
      <S.StyledCheckInSpotifySearchInput {...props} placeholder={t('search_placeholder') || ''} />
      <Layout.Absolute r={8}>
        <SvgIcon name="spotify" size={24} />
      </Layout.Absolute>
    </Layout.FlexRow>
  );
}
export default CheckInSpotifySearchInput;
