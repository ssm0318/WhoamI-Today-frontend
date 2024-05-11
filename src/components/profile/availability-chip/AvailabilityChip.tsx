import { IconNames, Layout, SvgIcon, Typo } from '@design-system';
import { Availability } from '@models/checkIn';
import { AvailabilityChipAssets, AvailabilityLabels } from './AvailabilityChip.contants';

interface AvailabilityChipProps {
  availability: Availability;
  onSelect?: (availability: Availability) => void;
  isSelected?: boolean;
}

function AvailabilityChip({ availability, onSelect, isSelected }: AvailabilityChipProps) {
  const handleOnClick = () => {
    onSelect?.(availability);
  };

  // NOTE: availability가 없거나, availability가 정의되지 않은 경우 null을 반환
  if (!availability || !Object.keys(Availability).includes(availability)) {
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
      {/* FIXME as 안쓰는 방향 */}
      {AvailabilityChipAssets[availability].icon && (
        <SvgIcon name={AvailabilityChipAssets[availability].icon as IconNames} size={10} />
      )}
      {AvailabilityChipAssets[availability].emoji && (
        <Typo type="label-large">{AvailabilityChipAssets[availability].emoji}</Typo>
      )}
      <Typo type="label-large">{AvailabilityLabels[availability]}</Typo>
    </Layout.FlexRow>
  );
}

export default AvailabilityChip;
