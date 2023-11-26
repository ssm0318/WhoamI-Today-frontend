import { StyledToggleButton } from './ToggleSwitch.styled';

interface Props {
  checked: boolean;
  onChange: () => void;
}

export function ToggleSwitch({ checked, onChange }: Props) {
  return (
    <StyledToggleButton>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider round" />
    </StyledToggleButton>
  );
}
