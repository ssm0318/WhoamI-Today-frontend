import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function PronounPlaceholder() {
  const [t] = useTranslation('translation');

  const navigate = useNavigate();

  const handleClickAddPronoun = () => {
    return navigate('/settings/edit-profile');
  };

  return (
    <PlaceholderWrapper onClick={handleClickAddPronoun}>
      <SvgIcon name="add_default" size={12} />
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.pronoun')}
      </Typo>
    </PlaceholderWrapper>
  );
}

export default PronounPlaceholder;
