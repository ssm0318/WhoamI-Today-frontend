import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { SocialBattery } from '@models/checkIn';
import { SocialBatteryChipAssets } from './SocialBatteryChip.contants';

interface SocialBatteryChipProps {
  socialBattery: SocialBattery;
  onSelect?: (socialBattery: SocialBattery) => void;
  isSelected?: boolean;
}

function SocialBatteryChip({ socialBattery, onSelect, isSelected }: SocialBatteryChipProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'social_battery' });
  const handleOnClick = () => {
    onSelect?.(socialBattery);
  };

  if (!socialBattery || !Object.keys(SocialBattery).includes(socialBattery)) {
    return null;
  }
  return (
    <Layout.FlexRow
      bgColor="WHITE"
      gap={4}
      pv={4}
      ph={8}
      outline={isSelected ? 'PRIMARY' : 'LIGHT_GRAY'}
      alignItems="center"
      rounded={12}
      style={{
        flexShrink: 0,
      }}
      onClick={handleOnClick}
    >
      {SocialBatteryChipAssets[socialBattery].emoji && (
        <Typo type="label-large">{SocialBatteryChipAssets[socialBattery].emoji}</Typo>
      )}
      <Typo type="label-large">{t(socialBattery)}</Typo>
    </Layout.FlexRow>
  );
}

export default SocialBatteryChip;
