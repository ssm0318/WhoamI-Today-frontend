import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function MoodPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClickAddMood = () => {
    return navigate('/check-in/edit');
  };

  return (
    <PlaceholderWrapper onClick={handleClickAddMood}>
      <SvgIcon name="add_reaction_default" size={12} />
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.mood')}
      </Typo>
    </PlaceholderWrapper>
  );
}

export default MoodPlaceholder;
