import { getToken, MessagePayload, Messaging, onMessage } from 'firebase/messaging';
import i18n from '@i18n/index';
import { activateFirebaseNotification } from './apis/notification';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyDiUPE56nKknZweFafU9AUAmu7OnLFXRvE',
  authDomain: 'whoami-today.firebaseapp.com',
  projectId: 'whoami-today',
  storageBucket: 'whoami-today.appspot.com',
  messagingSenderId: '509287164539',
  appId: '1:509287164539:web:1a6812c6344366de93d0de',
  measurementId: 'G-2BCGJJSFBT',
};

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  return permission;
};

export const activateDevice = (token: string | null) => {
  if (!token) return;
  activateFirebaseNotification({ token, active: true });
};

export const deactivateDevice = (token: string | null) => {
  if (!token) return;
  activateFirebaseNotification({ token, active: false });
};

export const getFCMRegistrationToken = async (messaging: Messaging) => {
  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  const registrationToken = await getToken(messaging, {
    vapidKey:
      'BGHLabCcTvSeMQOZNIGajRdfyPrMSjQppmI-yTpgOnB5apebk-2-MhCNwlcryC9byFLfgGrCjnT4KCSso9TkorI',
  });

  activateDevice(registrationToken);
  return registrationToken;
};

export const addForegroundMessageEventListener = (messaging: Messaging) => {
  onMessage(messaging, (payload: MessagePayload) => {
    const { data } = payload;
    if (!data) return;
    const { message_ko, url, tag, type, message_en } = data;
    const title = 'WhoAmI Today';
    const options = {
      body: i18n.language === 'ko' ? message_ko : message_en,
      tag,
      // TODO(Gina): icon 설정 필요
      icon: 'https://diivers.world/assets/logo/full-logo.svg',
      data: {
        url,
      },
    };

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      const registration = registrations.filter((item) => item.scope.includes('firebase'))[0];

      if (type === 'new') {
        registration.showNotification(title, options);
        return;
      }

      registration.getNotifications().then((notifications) => {
        const prev = notifications.filter((notification) => notification.tag === tag);

        if (prev.length > 0) {
          registration.showNotification(title, options);
        }
      });
    });
  });
};
