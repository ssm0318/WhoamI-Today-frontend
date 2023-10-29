import { Font, Layout } from '@design-system';
import { Availability } from '@models/status';
import {
  AvailabilityBgColors,
  AvailabilityChipColors,
  AvailabilityLabels,
} from './StatusChip.constants';

interface StatusChipProps {
  availability: Availability;
}

function StatusChip({ availability }: StatusChipProps) {
  return (
    <Layout.FlexRow
      bgColor={AvailabilityBgColors[availability]}
      gap={4}
      pv={4}
      ph={8}
      outline={AvailabilityChipColors[availability]}
      alignItems="center"
      rounded={12}
    >
      <Layout.LayoutBase bgColor={AvailabilityChipColors[availability]} w={10} h={10} rounded={5} />
      <Font.Body type="12_regular">{AvailabilityLabels[availability]}</Font.Body>
    </Layout.FlexRow>
  );
}

export default StatusChip;
