import { useTranslation } from 'react-i18next';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { Layout, Typo } from '@design-system';
import { SocialBattery } from '@models/checkIn';
import { SocialBatteryChipAssets } from './SocialBatteryChip.contants';

interface SocialBatteryChipProps {
  socialBattery: SocialBattery;
  onSelect?: (socialBattery: SocialBattery) => void;
  isSelected?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

function SocialBatteryChip({
  socialBattery,
  onSelect,
  isSelected,
  compact = false,
  onClick,
}: SocialBatteryChipProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'social_battery' });
  const handleOnClick = () => {
    onClick?.();
    onSelect?.(socialBattery);
  };

  if (!socialBattery || !Object.keys(SocialBattery).includes(socialBattery)) {
    return null;
  }
  const { emoji } = SocialBatteryChipAssets[socialBattery];
  return (
    <Layout.FlexRow
      bgColor="WHITE"
      gap={4}
      pv={4}
      ph={8}
      outline={isSelected ? 'PRIMARY' : 'LIGHT_GRAY'}
      alignItems="center"
      rounded={8}
      style={{ flexShrink: 0 }}
      onClick={handleOnClick}
    >
      {emoji && (
        <EmojiItem emojiString={emoji} size={16} bgColor="TRANSPARENT" outline="TRANSPARENT" />
      )}
      {!compact && <Typo type="label-large">{t(socialBattery)}</Typo>}
    </Layout.FlexRow>
  );
}

export default SocialBatteryChip;
