import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { Persona } from '@models/persona';
import { generateRandomColor } from '@utils/colorHelpers';

// NOTE: Persona 타입 대신 string 타입을 사용 (추후 필요시 수정 필요)
interface PersonaChipProps {
  persona: string;
  onSelect?: (persona: string) => void;
  isSelected?: boolean;
  color?: string;
}

function PersonaChip({ persona, onSelect, isSelected, color: providedColor }: PersonaChipProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'persona' });

  const handleOnClick = () => {
    onSelect?.(persona);
  };

  const color = useMemo(() => providedColor || generateRandomColor(), [providedColor]);

  if (!persona || !Object.keys(Persona).includes(persona)) {
    return null;
  }
  return (
    <Layout.FlexRow
      bgColor={isSelected ? 'LIGHT_GRAY' : 'WHITE'}
      gap={4}
      pv={2}
      ph={5}
      outline={isSelected ? 'PRIMARY' : 'LIGHT_GRAY'}
      alignItems="center"
      rounded={20}
      style={{
        flexShrink: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        border: `1px solid ${color}`,
        // touch 효과 제거
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
          backgroundColor: color,
          borderRadius: 12,
          flexShrink: 0,
        }}
      />
      <Typo type="label-large" numberOfLines={1} ellipsis={{ enabled: true }}>
        {t(persona)}
      </Typo>
    </Layout.FlexRow>
  );
}

export default PersonaChip;
