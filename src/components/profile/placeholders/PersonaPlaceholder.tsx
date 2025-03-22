import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function PersonaPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClickAddPersona = () => {
    return navigate('/settings/edit-profile');
  };

  return (
    <PlaceholderWrapper onClick={handleClickAddPersona}>
      <SvgIcon name="add_default" size={12} />
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.persona.my')}
      </Typo>
      <Typo type="label-medium" color="PRIMARY">
        {t('settings.edit_profile.placeholders.persona.WIT')}
      </Typo>
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.persona.persona')} 🤔
      </Typo>
    </PlaceholderWrapper>
  );
}

export default PersonaPlaceholder;
