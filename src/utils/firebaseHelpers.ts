// import axios from '@utils/api';
import {
  MessagePayload,
  Messaging,
  getToken,
  onMessage,
} from "firebase/messaging";
// import i18n from '@i18n';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDiUPE56nKknZweFafU9AUAmu7OnLFXRvE",
  authDomain: "whoami-today.firebaseapp.com",
  projectId: "whoami-today",
  storageBucket: "whoami-today.appspot.com",
  messagingSenderId: "509287164539",
  appId: "1:509287164539:web:1a6812c6344366de93d0de",
  measurementId: "G-2BCGJJSFBT",
};

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  return permission;
};

export const getFCMRegistrationToken = async (messaging: Messaging) => {
  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  try {
    const registrationToken = await getToken(messaging, {
      vapidKey:
        "BGHLabCcTvSeMQOZNIGajRdfyPrMSjQppmI-yTpgOnB5apebk-2-MhCNwlcryC9byFLfgGrCjnT4KCSso9TkorI",
    });

    if (!registrationToken) return;

    activateDevice(registrationToken);
    return registrationToken;
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

const activateDevice = (token: string) => {
  if (!token) return;

  //TODO(Gina): axios 셋팅 후 주석 해제 및 수정 필요
  //   axios.post('/devices/', {
  //     type: 'web',
  //     registration_id: token,
  //     active: true
  //   });
};

export const deactivateFirebaseDevice = (token: string) => {
  if (!token) return;
  //TODO(Gina): axios 셋팅 후 주석 해제 및 수정 필요
  //   axios.post('/devices/', {
  //     type: 'web',
  //     registration_id: token,
  //     active: true
  //   });
};

export const addForegroundMessageEventListener = (messaging: Messaging) => {
  onMessage(messaging, (payload: MessagePayload) => {
    const { data } = payload;
    if (!data) return;
    const { message_ko, url, tag, type } = data;
    const title = "WhoAmI Today";
    const options = {
      //TODO(Gina): i18n 셋팅 후 적용 필요
      //   body: i18n.language === "ko" ? message_ko : message_en,
      body: message_ko,
      tag,
      //TODO(Gina): icon 설정 필요
      icon: "https://diivers.world/assets/logo/full-logo.svg",
      data: {
        url,
      },
    };

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      const registration = registrations.filter((item) =>
        item.scope.includes("firebase")
      )[0];

      if (type === "new") {
        registration.showNotification(title, options);
        return;
      }

      registration.getNotifications().then((notifications) => {
        const prev = notifications.filter(
          (notification) => notification.tag === tag
        );

        if (prev.length > 0) {
          registration.showNotification(title, options);
        }
      });
    });
  });
};
