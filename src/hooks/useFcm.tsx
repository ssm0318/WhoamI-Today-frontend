import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import { useBoundStore } from '@stores/useBoundStore';
import {
  activateDevice,
  addForegroundMessageEventListener,
  deactivateDevice,
  firebaseConfig,
  getFCMRegistrationToken,
  requestPermission,
} from '../utils/firebaseHelpers';
import { getMobileDeviceInfo } from '../utils/getUserAgent';

const useFcm = () => {
  const { isMobile } = getMobileDeviceInfo();
  const { myProfile, fcmToken, setFcmToken } = useBoundStore((state) => ({
    myProfile: state.myProfile,
    fcmToken: state.fcmToken,
    setFcmToken: state.setFcmToken,
  }));

  const [notiPermissionStatus, setNotiPermissionStatus] = useState(
    !isMobile ? Notification.permission : null,
  );

  const togglePermission = async (on: boolean): Promise<boolean> => {
    // permission ON
    await requestPermission();

    if (!on) {
      const permission = await requestPermission();
      // 유저가 이전에 일부러 permission deny한 경우
      if (permission === 'denied') {
        alert('TODO: SHOULD RESET PERMISSION');
        return false;
      }
      setNotiPermissionStatus(permission);
      if (permission === 'granted') {
        activateDevice(fcmToken);
        return true;
      }
      return false;
    }
    // permission OFF
    deactivateDevice(fcmToken);
    return false;
  };

  useEffect(() => {
    if (!myProfile || isMobile) return;

    // FCM 초기화
    const initializeFcm = async () => {
      try {
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);
        if (notiPermissionStatus !== 'granted') return;
        const token = await getFCMRegistrationToken(messaging);
        addForegroundMessageEventListener(messaging);
        setFcmToken(token);
        console.log(`[useFcm] fcm initialized with token: ${token}`);
      } catch (e) {
        console.log(e);
      }
    };

    initializeFcm();
  }, [myProfile, notiPermissionStatus, isMobile, setFcmToken]);

  return { notiPermissionStatus, togglePermission };
};

export default useFcm;
