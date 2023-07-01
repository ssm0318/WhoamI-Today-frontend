import { useEffect, useState } from 'react';
import { Font, SvgIcon } from '@design-system';
import { useGetAppMessage, usePostAppMessage } from '@hooks/useAppMessage';
import useFcm from '@hooks/useFcm';
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
  const { notiPermissionStatus } = useFcm();
  const postMessage = usePostAppMessage();

  const handleToggle = () => {
    // 앱인 경우 설정창으로 보냄
    if (window?.ReactNativeWebView) {
      return postMessage('OPEN_SETTING', {});
    }

    setOn((prev) => !prev);

    if (on) {
      onToggleOff();
      return;
    }
    onToggleOn();
  };

  // 앱인 경우
  useGetAppMessage({ key: 'SET_NOTI_PERMISSION', cb: ({ value }) => setOn(value) });

  useEffect(() => {
    // 앱이 아닌 경우
    if (!window?.ReactNativeWebView) {
      // TODO(Gina): notiPermissionStatus 정의 다시 확인
      setOn(notiPermissionStatus === 'default');
    }
  }, [notiPermissionStatus]);

  return (
    <StyledToggleButton>
      <input type="checkbox" checked={on} onChange={handleToggle} />
      <span className="slider round" />
    </StyledToggleButton>
  );
}
