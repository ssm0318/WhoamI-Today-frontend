import { StyledToggleButton, ToggleSwitchSize } from './ToggleSwitch.styled';

interface Props {
  type: ToggleSwitchSize;
  checked: boolean;
  onChange: () => void;
  ariaLabel?: string;
  disabled?: boolean;
}

export function ToggleSwitch({ type, checked, onChange, ariaLabel, disabled = false }: Props) {
  return (
    <StyledToggleButton disabled={disabled} type={type}>
      <input
        aria-label={ariaLabel}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
      <span className="slider round" />
    </StyledToggleButton>
  );
}
