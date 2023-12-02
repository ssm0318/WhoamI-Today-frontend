import { ToggleSwitch } from '@components/_common/toggle-switch/ToggleSwitch';
import { Font, SvgIcon } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { isApp } from '@utils/getUserAgent';
import { StyledAccountSettingsButton, StyledSettingsButton } from './SettingsButtons.styled';

interface SettingButtonProps {
  text: string;
  onClick: () => void;
}

export function AccountSettingButton({ text, onClick }: SettingButtonProps) {
  return (
    <StyledAccountSettingsButton onClick={onClick}>
      <Font.Body type="18_regular">{text}</Font.Body>
      <SvgIcon name="arrow_right" color="BLACK" size={24} />
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

export function SettingsToggleButton({ permissionAllowed }: { permissionAllowed: boolean }) {
  const postMessage = usePostAppMessage();

  const handleToggle = async () => {
    if (isApp) {
      return postMessage('OPEN_SETTING', {});
    }
  };

  return <ToggleSwitch type="large" checked={permissionAllowed} onChange={handleToggle} />;
}
