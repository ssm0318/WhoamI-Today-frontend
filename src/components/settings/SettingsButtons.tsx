import { useState } from 'react';
import { Font, SvgIcon } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
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

// TODO(Gina): 앱에서만 노출 확정 필요
export function SettingsToggleButton() {
  const postMessage = usePostAppMessage();
  const [on, setOn] = useState(false);

  const handleToggle = async () => {
    if (!window?.ReactNativeWebView) return;
    // 앱인 경우 설정창으로 보냄
    return postMessage('OPEN_SETTING', {});
  };

  useGetAppMessage({
    cb: ({ value }) => {
      setOn(value);
    },
    key: 'SET_NOTI_PERMISSION',
  });

  if (!window?.ReactNativeWebView) return null;
  return (
    <StyledToggleButton>
      <input type="checkbox" checked={on} onChange={handleToggle} />
      <span className="slider round" />
    </StyledToggleButton>
  );
}
