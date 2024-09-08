import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import AvailabilityChip from '@components/profile/availability-chip/AvailabilityChip';
import { Layout, Typo } from '@design-system';
import { Availability } from '@models/checkIn';
import * as S from './AvailabilitySelectBottomSheet.styled';

type AvailabilitySelectBottomSheetProps = {
  visible: boolean;
  closeBottomSheet: () => void;
  onSelect: (availability: Availability) => void;
  selectedAvailability: Availability | null;
};

function AvailabilitySelectBottomSheet({
  visible,
  closeBottomSheet,
  onSelect,
  selectedAvailability = null,
}: AvailabilitySelectBottomSheetProps) {
  const [t] = useTranslation('translation', {
    keyPrefix: 'check_in_edit.availability.select_bottom_sheet',
  });
  const [selected, setSelected] = useState<Availability | null>(selectedAvailability || null);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      closeBottomSheet();
    }
  };

  return (
    <BottomModal visible={visible} onClose={closeBottomSheet}>
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE">
        <Typo type="title-large">{t('title')}</Typo>
        <Layout.FlexRow
          gap={6}
          pv={16}
          style={{
            flexWrap: 'wrap',
          }}
          ph={12}
        >
          {Object.values(Availability).map((a) => (
            <AvailabilityChip
              availability={a}
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

export default AvailabilitySelectBottomSheet;
