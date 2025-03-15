import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, Typo } from '@design-system';
import { SocialBattery } from '@models/checkIn';
import SocialBatterySelectBottomSheet from '../social-battery-select-bottom-sheet/SocialBatterySelectBottomSheet';

interface CheckInSocialBatteryProps {
  socialBattery: SocialBattery | null;
  onDelete: () => void;
  onSelectSocialBattery: (socialBattery: SocialBattery) => void;
}

function CheckInSocialBattery({
  socialBattery,
  onDelete,
  onSelectSocialBattery,
}: CheckInSocialBatteryProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_edit.social_battery' });
  const [showSocialBatterySelect, setShowSocialBatterySelect] = useState(false);
  const onClickSelectSocialBattery = () => {
    setShowSocialBatterySelect(true);
  };

  return (
    <Layout.FlexRow mt={8} w="100%" alignItems="center" gap={8}>
      {socialBattery ? (
        <>
          <SocialBatteryChip socialBattery={socialBattery} onSelect={onClickSelectSocialBattery} />
          <DeleteButton onClick={onDelete} size={32} />
        </>
      ) : (
        <Layout.FlexRow
          p={8}
          outline="LIGHT_GRAY"
          rounded={12}
          gap={4}
          onClick={onClickSelectSocialBattery}
          alignItems="center"
        >
          <Layout.LayoutBase bgColor="MEDIUM_GRAY" w={10} h={10} rounded={5} />
          <Typo type="body-medium" color="MEDIUM_GRAY">
            {t('select_placeholder')}
          </Typo>
        </Layout.FlexRow>
      )}
      {showSocialBatterySelect && (
        <SocialBatterySelectBottomSheet
          visible={showSocialBatterySelect}
          closeBottomSheet={() => setShowSocialBatterySelect(false)}
          onSelect={onSelectSocialBattery}
          selectedSocialBattery={socialBattery}
        />
      )}
    </Layout.FlexRow>
  );
}

export default CheckInSocialBattery;
