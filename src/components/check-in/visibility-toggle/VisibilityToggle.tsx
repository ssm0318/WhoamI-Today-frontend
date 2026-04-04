import styled from 'styled-components';
import { Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';

interface Props {
  value: ComponentVisibility;
  onChange: (visibility: ComponentVisibility) => void;
}

const OPTIONS: { value: ComponentVisibility; label: string }[] = [
  { value: ComponentVisibility.PUBLIC, label: 'Public' },
  { value: ComponentVisibility.FRIENDS, label: 'Friends' },
  { value: ComponentVisibility.CLOSE_FRIENDS, label: 'Close Friends' },
  { value: ComponentVisibility.ONLY_ME, label: 'Only Me' },
];

function VisibilityToggle({ value, onChange }: Props) {
  return (
    <ToggleContainer>
      {OPTIONS.map((opt) => (
        <ToggleOption
          key={opt.value}
          $isSelected={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          <Typo
            type="label-small"
            color={value === opt.value ? 'PRIMARY' : 'MEDIUM_GRAY'}
            fontWeight={value === opt.value ? 600 : 400}
          >
            {opt.label}
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
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.WHITE : 'transparent')};
  border: 1px solid ${({ $isSelected, theme }) => ($isSelected ? theme.PRIMARY : 'transparent')};
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;

export default VisibilityToggle;
