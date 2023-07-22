import { Font } from '@design-system';
import useNotiPermission from '@hooks/useNotiPermission';
import { requestPermission } from '@utils/firebaseHelpers';
import { isApp } from '@utils/getUserAgent';
import * as S from './NotiPermissionBanner.styled';

function NotiPermissionBanner() {
  const { getBannerDescription, notiPermission, setNotiPermission } = useNotiPermission();

  const descriptions = getBannerDescription(!isApp ? Notification.permission : undefined);

  const handleRequest = async () => {
    const permission = await requestPermission();
    setNotiPermission(permission);
  };

  if (notiPermission !== 'default' || descriptions.length === 0) return null;
  return (
    <S.Container
      justifyContent="center"
      bgColor="GRAY_10"
      h="50px"
      w="100%"
      onClick={handleRequest}
    >
      {descriptions.map((desc) => (
        <Font.Body type="14_regular" key={desc}>
          {desc}
        </Font.Body>
      ))}
    </S.Container>
  );
}

export default NotiPermissionBanner;
