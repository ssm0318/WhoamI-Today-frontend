import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { SvgIcon, Typo } from '@design-system';
import { PlaceholderWrapper } from './Placeholder';

function SocialBatteryPlaceholder() {
  const [t] = useTranslation('translation');
  const navigate = useNavigate();

  const handleClickAddSocialBattery = () => {
    return navigate('/check-in/edit');
  };

  return (
    <PlaceholderWrapper onClick={handleClickAddSocialBattery} gap={4}>
      <SvgIcon name="add_default" size={14} />
      <Typo type="label-large" color="BLACK">
        {t('settings.edit_profile.placeholders.social_battery')}
      </Typo>
      <EmojiItem emojiString="🔋" size={16} bgColor="TRANSPARENT" outline="TRANSPARENT" />
    </PlaceholderWrapper>
  );
}

export default SocialBatteryPlaceholder;
