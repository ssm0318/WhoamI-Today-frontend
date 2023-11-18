import { Font, Layout, SvgIcon } from '@design-system';
import { Availability } from '@models/status';
import { AvailabilityChipColors, AvailabilityLabels } from './StatusChip.constants';

interface StatusChipProps {
  availability: Availability;
  isSelected?: boolean;
  onSelect?: (a: Availability) => void;
}

function StatusChip({ availability, isSelected, onSelect }: StatusChipProps) {
  const handleSelect = () => {
    onSelect?.(availability);
  };

  return (
    <Layout.FlexRow
      bgColor="BASIC_WHITE"
      gap={4}
      pv={4}
      ph={8}
      outline={AvailabilityChipColors[availability]}
      alignItems="center"
      rounded={12}
      onClick={handleSelect}
    >
      <Layout.LayoutBase bgColor={AvailabilityChipColors[availability]} w={10} h={10} rounded={5} />
      <Font.Body type="12_regular">{AvailabilityLabels[availability]}</Font.Body>
      {!!isSelected && <SvgIcon name="heart" size={16} />}
    </Layout.FlexRow>
  );
}

export default StatusChip;
