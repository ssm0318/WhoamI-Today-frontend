import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Icon from '@components/_common/icon/Icon';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout, Typo } from '@design-system';
import { SocialBattery } from '@models/checkIn';
import * as S from './SocialBatterySelectBottomSheet.styled';

type SocialBatterySelectBottomSheetProps = {
  visible: boolean;
  closeBottomSheet: () => void;
  onSelect: (socialBattery: SocialBattery) => void;
  selectedSocialBattery: SocialBattery | null;
};

function SocialBatterySelectBottomSheet({
  visible,
  closeBottomSheet,
  onSelect,
  selectedSocialBattery = null,
}: SocialBatterySelectBottomSheetProps) {
  const [t] = useTranslation('translation', {
    keyPrefix: 'check_in_edit.social_battery.select_bottom_sheet',
  });
  const [selected, setSelected] = useState<SocialBattery | null>(selectedSocialBattery || null);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      closeBottomSheet();
    }
  };

  return (
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE">
        <Icon name="home_indicator" />
        <Typo type="title-large">{t('title')}</Typo>
        <Layout.FlexRow
          gap={6}
          pv={16}
          style={{
            flexWrap: 'wrap',
          }}
          ph={12}
        >
          {Object.values(SocialBattery).map((a) => (
            <SocialBatteryChip
              socialBattery={a}
              key={a}
              onSelect={setSelected}
              isSelected={selected === a}
            />
          ))}
        </Layout.FlexRow>
        <S.ConfirmButtonContainer w="100%" pt={16} pb={20} ph={12}>
          <BottomModalActionButton
            status={selected ? 'normal' : 'disabled'}
            text={t('confirm')}
            onClick={handleConfirm}
          />
        </S.ConfirmButtonContainer>
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default SocialBatterySelectBottomSheet;
