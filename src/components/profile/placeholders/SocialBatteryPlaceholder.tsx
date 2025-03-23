import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function SocialBatteryPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClickAddSocialBattery = () => {
    return navigate('/check-in/edit');
  };

  return (
    <PlaceholderWrapper onClick={handleClickAddSocialBattery} ph={12} gap={4}>
      <SvgIcon name="add_default" size={12} />
      <Typo type="label-medium" color="BLACK">
        {t('settings.edit_profile.placeholders.social_battery')} 🔋
      </Typo>
    </PlaceholderWrapper>
  );
}

export default SocialBatteryPlaceholder;
