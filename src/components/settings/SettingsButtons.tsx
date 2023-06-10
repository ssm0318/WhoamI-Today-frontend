import { useState } from 'react';
import { Font, SvgIcon } from '@design-system';
import {
  StyledAccountSettingsButton,
  StyledSettingsButton,
  StyledToggleButton,
} from './SettingsButtons.styled';

interface SettingButtonProps {
  text: string;
  onClick: () => void;
}

export function AccountSettingButton({ text, onClick }: SettingButtonProps) {
  return (
    <StyledAccountSettingsButton onClick={onClick}>
      <Font.Body type="18_regular">{text}</Font.Body>
      <SvgIcon name="arrow_right" color="BASIC_BLACK" size={24} />
    </StyledAccountSettingsButton>
  );
}

export function SettingsButton({ text, onClick }: SettingButtonProps) {
  return (
    <StyledSettingsButton onClick={onClick}>
      <Font.Display type="20_bold">{text}</Font.Display>
    </StyledSettingsButton>
  );
}

interface SettingsToggleButtonProps {
  onToggleOn: () => void;
  onToggleOff: () => void;
}

export function SettingsToggleButton({ onToggleOn, onToggleOff }: SettingsToggleButtonProps) {
  const [on, setOn] = useState(false);

  const handleToggle = () => {
    setOn((prev) => !prev);

    if (on) {
      onToggleOff();
      return;
    }
    onToggleOn();
  };

  return (
    <StyledToggleButton>
      <input type="checkbox" checked={on} onChange={handleToggle} />
      <span className="slider round" />
    </StyledToggleButton>
  );
}
