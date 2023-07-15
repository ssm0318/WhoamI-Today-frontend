import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { useCallback } from 'react';
import { useBoundStore } from '@stores/useBoundStore';
import {
  addForegroundMessageEventListener,
  firebaseConfig,
  getFCMRegistrationToken,
  requestPermission,
} from '../utils/firebaseHelpers';

const useFcm = () => {
  const { setFcmToken } = useBoundStore((state) => ({
    setFcmToken: state.setFcmToken,
  }));

  const requestNotiPermission = useCallback(() => {
    requestPermission();
  }, []);

  const initializeFcm = async () => {
    try {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      if (Notification.permission !== 'granted') return;
      addForegroundMessageEventListener(messaging);

      const token = await getFCMRegistrationToken(messaging);
      setFcmToken(token);

      console.log(`[useFcm] Fcm initialized with token: ${token}`);
    } catch (e) {
      console.log(e);
    }
  };

  return {
    initializeFcm,
    requestNotiPermission,
  };
};

export default useFcm;
