import { Font, SvgIcon } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import useNotiPermission from '@hooks/useNotiPermission';
import { useBoundStore } from '@stores/useBoundStore';
import { isApp } from '@utils/getUserAgent';
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

export function SettingsToggleButton() {
  const postMessage = usePostAppMessage();
  const { notiPermission } = useNotiPermission();

  const { appNotiPermission, myProfile, updateMyProfile } = useBoundStore((state) => ({
    appNotiPermission: state.appNotiPermission,
    myProfile: state.myProfile,
    updateMyProfile: state.updateMyProfile,
  }));

  const permissionAllowed = isApp ? appNotiPermission : myProfile?.noti_on || false;

  const handleToggle = async () => {
    if (isApp) {
      return postMessage('OPEN_SETTING', {});
    }
    updateMyProfile({ noti_on: !permissionAllowed });
  };

  if (!isApp && notiPermission !== 'granted') return null;
  return (
    <StyledToggleButton>
      <input type="checkbox" checked={permissionAllowed} onChange={handleToggle} />
      <span className="slider round" />
    </StyledToggleButton>
  );
}
