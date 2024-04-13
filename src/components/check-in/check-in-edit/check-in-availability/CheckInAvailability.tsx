import { useState } from 'react';
import DeleteButton from '@components/_common/delete-button/DeleteButton';
import AvailabilityChip from '@components/profile/availability-chip/AvailabilityChip';
import { Layout, Typo } from '@design-system';
import { Availability } from '@models/checkIn';
import AvailabilitySelectBottomSheet from '../availability-select-bottom-sheet/AvailabilitySelectBottomSheet';

interface CheckInAvailabilityProps {
  availability: Availability | null;
  onDelete: () => void;
  onSelectAvailability: (availability: Availability) => void;
}

function CheckInAvailability({
  availability,
  onDelete,
  onSelectAvailability,
}: CheckInAvailabilityProps) {
  const [showAvailabilitySelect, setShowAvailabilitySelect] = useState(false);
  const onClickSelectAvailability = () => {
    setShowAvailabilitySelect(true);
  };

  return (
    <Layout.FlexRow mt={8} w="100%" alignItems="center" gap={8}>
      {availability ? (
        <>
          <AvailabilityChip availability={availability} />
          <DeleteButton onClick={onDelete} size={32} />
        </>
      ) : (
        <Layout.FlexRow
          p={8}
          outline="LIGHT_GRAY"
          rounded={12}
          gap={4}
          onClick={onClickSelectAvailability}
          alignItems="center"
        >
          <Layout.LayoutBase bgColor="MEDIUM_GRAY" w={10} h={10} rounded={5} />
          <Typo type="body-medium" color="MEDIUM_GRAY">
            Select Availability
          </Typo>
        </Layout.FlexRow>
      )}
      {showAvailabilitySelect && (
        <AvailabilitySelectBottomSheet
          visible={showAvailabilitySelect}
          closeBottomSheet={() => setShowAvailabilitySelect(false)}
          onSelect={onSelectAvailability}
        />
      )}
    </Layout.FlexRow>
  );
}

export default CheckInAvailability;