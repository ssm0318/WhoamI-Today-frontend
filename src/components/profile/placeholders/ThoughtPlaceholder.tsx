import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function ThoughtPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClickAddThought = () => {
    return navigate('/update');
  };

  return (
    <PlaceholderWrapper onClick={handleClickAddThought}>
      <SvgIcon name="add_default" size={14} />
      <Typo type="label-large" color="BLACK">
        {t('settings.edit_profile.placeholders.thought')}
      </Typo>
    </PlaceholderWrapper>
  );
}

export default ThoughtPlaceholder;
