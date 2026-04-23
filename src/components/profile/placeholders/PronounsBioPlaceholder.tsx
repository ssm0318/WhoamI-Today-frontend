import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function PronounsBioPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClick = () => {
    return navigate('/settings/edit-profile?tab=pronouns_bio');
  };

  return (
    <PlaceholderWrapper onClick={handleClick}>
      <SvgIcon name="add_default" size={14} />
      <Typo type="label-large" color="BLACK">
        {t('settings.edit_profile.placeholders.pronouns_bio')}
      </Typo>
    </PlaceholderWrapper>
  );
}

export default PronounsBioPlaceholder;
