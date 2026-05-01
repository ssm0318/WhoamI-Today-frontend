import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typo } from '@design-system';
import i18n from '@i18n/index';
import { ComponentVisibility } from '@models/checkIn';

interface Props {
  value: ComponentVisibility;
  onChange: (visibility: ComponentVisibility) => void;
}

export const VISIBILITY_OPTIONS: { value: ComponentVisibility; i18nKey: string }[] = [
  { value: ComponentVisibility.PUBLIC, i18nKey: 'visibility.public' },
  { value: ComponentVisibility.FRIENDS, i18nKey: 'visibility.friends' },
  { value: ComponentVisibility.CLOSE_FRIENDS, i18nKey: 'visibility.close_friends' },
  { value: ComponentVisibility.ONLY_ME, i18nKey: 'visibility.only_me' },
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
          <Typo
            type="label-large"
            color={value === opt.value ? 'PRIMARY' : 'MEDIUM_GRAY'}
            fontWeight={value === opt.value ? 600 : 400}
          >
            {t(opt.i18nKey)}
          </Typo>
        </ToggleOption>
      ))}
    </ToggleContainer>
  );
}

const ToggleContainer = styled.div`
  display: flex;
  gap: 4px;
  background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
  border-radius: 8px;
  padding: 2px;
`;

const ToggleOption = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.WHITE : 'transparent')};
  border: 1px solid ${({ $isSelected, theme }) => ($isSelected ? theme.PRIMARY : 'transparent')};
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;

export default VisibilityToggle;
