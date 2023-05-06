import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { useEffect } from 'react';
import { addForegroundMessageEventListener, firebaseConfig } from '../utils/firebaseHelpers';
import { getMobileDeviceInfo } from '../utils/getUserAgent';

// TODO(Gina): 추후 로직 보완 필요
const useFcm = () => {
  const { isMobile } = getMobileDeviceInfo();

  const notiPermissionStatus = !isMobile ? Notification.permission : null;

  useEffect(() => {
    // if (!currentUser || isMobile) return;
    if (isMobile) return;

    // FCM 초기화
    const initializeFcm = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);

        if (notiPermissionStatus !== 'granted') return;

        // const token = await getFCMRegistrationToken(messaging);
        addForegroundMessageEventListener(messaging);

        // dispatch(setFcmToken(token));
      } catch (e) {
        console.log(e);
      }
    };

    initializeFcm();
  }, [notiPermissionStatus, isMobile]);

  return { notiPermissionStatus };
};

export default useFcm;
