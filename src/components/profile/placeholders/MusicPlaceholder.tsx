import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function MusicPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClickAddMusic = () => {
    return navigate('/check-in/edit');
  };

  return (
    <PlaceholderWrapper outline="SPOTIFY_GREEN" gap={4} ph={12} onClick={handleClickAddMusic}>
      <SvgIcon name="add_default" size={12} />
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.music')}
      </Typo>
      <SvgIcon name="spotify" size={12} />
    </PlaceholderWrapper>
  );
}

export default MusicPlaceholder;
