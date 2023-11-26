import { StyledToggleButton, ToggleSwitchSize } from './ToggleSwitch.styled';

interface Props {
  type: ToggleSwitchSize;
  checked: boolean;
  onChange: () => void;
}

export function ToggleSwitch({ type, checked, onChange }: Props) {
  return (
    <StyledToggleButton type={type}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider round" />
    </StyledToggleButton>
  );
}
