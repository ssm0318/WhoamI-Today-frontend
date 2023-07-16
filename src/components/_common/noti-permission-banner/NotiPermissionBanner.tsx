import { Font } from '@design-system';
import useNotiPermission from '@hooks/useNotiPermission';
import { isApp } from '@utils/getUserAgent';
import * as S from './NotiPermissionBanner.styled';

interface NotiPermissionBannerProps {
  onClick: () => void;
}

function NotiPermissionBanner({ onClick }: NotiPermissionBannerProps) {
  const { getBannerDescription } = useNotiPermission();

  const descriptions = getBannerDescription(!isApp ? Notification.permission : undefined);

  if (Notification.permission !== 'default' || descriptions.length === 0) return null;
  return (
    <S.Container justifyContent="center" bgColor="GRAY_10" h="50px" w="100%" onClick={onClick}>
      {descriptions.map((desc) => (
        <Font.Body type="14_regular" key={desc}>
          {desc}
        </Font.Body>
      ))}
    </S.Container>
  );
}

export default NotiPermissionBanner;
