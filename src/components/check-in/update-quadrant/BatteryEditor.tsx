import VisibilityToggle from '@components/check-in/visibility-toggle/VisibilityToggle';
import SocialBatteryChip from '@components/profile/social-batter-chip/SocialBatteryChip';
import { Layout } from '@design-system';
import { ComponentVisibility, SocialBattery } from '@models/checkIn';
import EditorPopup from './EditorPopup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  value: SocialBattery | null;
  onChange: (value: SocialBattery | null) => void;
  visibility: ComponentVisibility;
  onVisibilityChange: (v: ComponentVisibility) => void;
}

const BATTERY_OPTIONS = Object.values(SocialBattery);

export default function BatteryEditor({
  isOpen,
  onClose,
  value,
  onChange,
  visibility,
  onVisibilityChange,
}: Props) {
  return (
    <EditorPopup isOpen={isOpen} onClose={onClose} title="Social Battery">
      <Layout.FlexRow w="100%" gap={8} mb={16} style={{ flexWrap: 'wrap' }}>
        {BATTERY_OPTIONS.map((battery) => (
          <SocialBatteryChip
            key={battery}
            socialBattery={battery}
            isSelected={value === battery}
            onSelect={(b) => onChange(value === b ? null : b)}
          />
        ))}
      </Layout.FlexRow>
      <VisibilityToggle value={visibility} onChange={onVisibilityChange} />
    </EditorPopup>
  );
}
