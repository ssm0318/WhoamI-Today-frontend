import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import i18n from '@i18n/index';
import { ComponentVisibility } from '@models/checkIn';

interface Props {
  value: ComponentVisibility;
  onChange: (visibility: ComponentVisibility) => void;
}

interface VisibilityOption {
  value: ComponentVisibility;
  i18nKey: string;
  fontSize: number;
  allowWrap?: boolean;
}

// Per-option font sizing tuned for 320px viewport with equal-width chips.
// "Public" and "Friends" fit at the original 14px. "Only Me" needs 12px to fit
// on one line. "Close Friends" wraps to two lines at 11px so the row stays
// compact instead of overflowing or growing chip height too much.
export const VISIBILITY_OPTIONS: VisibilityOption[] = [
  { value: ComponentVisibility.PUBLIC, i18nKey: 'visibility.public', fontSize: 14 },
  { value: ComponentVisibility.FRIENDS, i18nKey: 'visibility.friends', fontSize: 14 },
  {
    value: ComponentVisibility.CLOSE_FRIENDS,
    i18nKey: 'visibility.close_friends',
    fontSize: 11,
    allowWrap: true,
  },
  { value: ComponentVisibility.ONLY_ME, i18nKey: 'visibility.only_me', fontSize: 12 },
];

export function getVisibilityLabel(value: ComponentVisibility): string {
  const opt = VISIBILITY_OPTIONS.find((o) => o.value === value);
  return opt ? i18n.t(opt.i18nKey) : '';
}

function VisibilityToggle({ value, onChange }: Props) {
  const [t] = useTranslation('translation');
  return (
    <ToggleContainer>
      {VISIBILITY_OPTIONS.map((opt) => (
        <ToggleOption
          key={opt.value}
          $isSelected={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          <Label
            $isSelected={value === opt.value}
            $fontSize={opt.fontSize}
            $allowWrap={opt.allowWrap ?? false}
          >
            {t(opt.i18nKey)}
          </Label>
        </ToggleOption>
      ))}
    </ToggleContainer>
  );
}

const ToggleContainer = styled.div`
  display: flex;
  gap: 2px;
  background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
  border-radius: 8px;
  padding: 2px;
  width: 100%;
  align-items: stretch;
`;

const ToggleOption = styled.div<{ $isSelected: boolean }>`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 4px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.WHITE : 'transparent')};
  border: 1px solid ${({ $isSelected, theme }) => ($isSelected ? theme.PRIMARY : 'transparent')};
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;

const Label = styled.span<{ $isSelected: boolean; $fontSize: number; $allowWrap: boolean }>`
  font-size: ${({ $fontSize }) => $fontSize}px;
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  color: ${({ $isSelected, theme }) => ($isSelected ? theme.PRIMARY : theme.MEDIUM_GRAY)};
  white-space: ${({ $allowWrap }) => ($allowWrap ? 'normal' : 'nowrap')};
  text-align: center;
  line-height: 1.2;
`;

export default VisibilityToggle;
