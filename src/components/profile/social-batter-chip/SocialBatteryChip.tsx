import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { SocialBattery } from '@models/checkIn';
import { SocialBatteryChipAssets } from './SocialBatteryChip.contants';

interface SocialBatteryChipProps {
  socialBattery: SocialBattery;
  onSelect?: (socialBattery: SocialBattery) => void;
  isSelected?: boolean;
  compact?: boolean;
  borderless?: boolean;
  onClick?: () => void;
}

function SocialBatteryChip({
  socialBattery,
  onSelect,
  isSelected,
  compact = false,
  borderless = false,
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

  if (borderless) {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <span
        role="button"
        tabIndex={0}
        style={{ cursor: onClick ? 'pointer' : undefined, fontSize: 18, lineHeight: 1 }}
        onClick={handleOnClick}
      >
        {emoji}
      </span>
    );
  }

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
      {emoji && <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>}
      {!compact && <Typo type="label-large">{t(socialBattery)}</Typo>}
    </Layout.FlexRow>
  );
}

export default SocialBatteryChip;
