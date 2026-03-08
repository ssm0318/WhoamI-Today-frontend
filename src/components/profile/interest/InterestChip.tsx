import { Layout, Typo } from '@design-system';
import { Interest } from '@models/interest';

const INTEREST_COLOR = '#0047FF'; // TERTIARY_BLUE

interface InterestChipProps {
  interest: string;
  onSelect?: (interest: string) => void;
  isSelected?: boolean;
}

function InterestChip({ interest, onSelect, isSelected }: InterestChipProps) {
  const handleOnClick = () => {
    onSelect?.(interest);
  };

  if (!interest || !Object.values(Interest).includes(interest as Interest)) {
    return null;
  }
  return (
    <Layout.FlexRow
      bgColor={isSelected ? 'LIGHT_GRAY' : 'WHITE'}
      gap={4}
      pv={2}
      ph={5}
      alignItems="center"
      rounded={20}
      style={{
        flexShrink: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        border: `1px solid ${INTEREST_COLOR}`,
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        cursor: 'pointer',
        WebkitAppearance: 'none',
        WebkitTouchCallout: 'none',
      }}
      onClick={handleOnClick}
    >
      <div
        style={{
          width: 14,
          height: 14,
          backgroundColor: INTEREST_COLOR,
          borderRadius: 12,
          flexShrink: 0,
        }}
      />
      <Typo type="label-large" numberOfLines={1} ellipsis={{ enabled: true }}>
        {interest}
      </Typo>
    </Layout.FlexRow>
  );
}

export default InterestChip;
