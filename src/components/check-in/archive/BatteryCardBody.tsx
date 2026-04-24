import { useTranslation } from 'react-i18next';
import EmojiItem from '@components/_common/emoji-item/EmojiItem';
import { SocialBatteryChipAssets } from '@components/profile/social-batter-chip/SocialBatteryChip.contants';
import { Layout, Typo } from '@design-system';
import { SocialBattery } from '@models/checkIn';
import { CheckInComponentEntry } from '@models/checkInEntry';

interface Props {
  entry: CheckInComponentEntry;
}

/**
 * Battery card body — big emoji + translated level label.
 *
 * Uses the same emoji map as the live SocialBatteryChip so the archive
 * cell matches the live check-in quadrant visually. The localized level
 * key (`social_battery.low`, etc.) is read from the same namespace.
 */
function BatteryCardBody({ entry }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'social_battery' });
  const data = entry.data as { social_battery?: SocialBattery };
  const level = data.social_battery;
  if (!level) return null;

  const emoji = SocialBatteryChipAssets[level]?.emoji;

  return (
    <Layout.FlexCol alignItems="center" gap={4} w="100%">
      {emoji && (
        <EmojiItem emojiString={emoji} size={40} bgColor="TRANSPARENT" outline="TRANSPARENT" />
      )}
      <Typo type="label-medium" color="DARK" textAlign="center">
        {t(level)}
      </Typo>
    </Layout.FlexCol>
  );
}

export default BatteryCardBody;
