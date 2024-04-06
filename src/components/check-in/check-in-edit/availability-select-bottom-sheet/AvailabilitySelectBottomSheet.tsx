import { useState } from 'react';
import { createPortal } from 'react-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import BottomModalActionButton from '@components/_common/bottom-modal/BottomModalActionButton';
import Icon from '@components/_common/icon/Icon';
import AvailabilityChip from '@components/profile/availability-chip/AvailabilityChip';
import { Layout, Typo } from '@design-system';
import { Availability } from '@models/checkIn';
import * as S from './AvailabilitySelectBottomSheet.styled';

type AvailabilitySelectBottomSheetProps = {
  visible: boolean;
  closeBottomSheet: () => void;
  onSelect: (availability: Availability) => void;
};

function AvailabilitySelectBottomSheet({
  visible,
  closeBottomSheet,
  onSelect,
}: AvailabilitySelectBottomSheetProps) {
  const [selected, setSelected] = useState<Availability | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      closeBottomSheet();
    }
  };

  return createPortal(
    <BottomModal visible={visible} onClose={closeBottomSheet} maxHeight={700}>
      <Layout.FlexCol alignItems="center" w="100%" bgColor="WHITE">
        <Icon name="home_indicator" />
        <Typo type="title-large">Select Availability</Typo>
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
            text="Confirm"
            onClick={handleConfirm}
          />
        </S.ConfirmButtonContainer>
      </Layout.FlexCol>
    </BottomModal>,
    document.getElementById('root-container') || document.body,
  );
}

export default AvailabilitySelectBottomSheet;
