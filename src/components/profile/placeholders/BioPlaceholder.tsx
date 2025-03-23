import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function BioPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClickAddBio = () => {
    return navigate('/settings/edit-profile');
  };

  return (
    <PlaceholderWrapper onClick={handleClickAddBio}>
      <SvgIcon name="add_default" size={12} />
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.bio')}
      </Typo>
    </PlaceholderWrapper>
  );
}

export default BioPlaceholder;
