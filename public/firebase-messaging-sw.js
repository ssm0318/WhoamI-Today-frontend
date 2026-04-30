/**
 * 서비스 워커 설정 파일
 * 웹앱에서 백그라운드 노티를 수신할 때 동작합니다
 */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
// 참고: 왜 importScripts를 사용하나요? - https://web.dev/es-modules-in-sw/
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDiUPE56nKknZweFafU9AUAmu7OnLFXRvE',
  authDomain: 'whoami-today.firebaseapp.com',
  projectId: 'whoami-today',
  storageBucket: 'whoami-today.appspot.com',
  messagingSenderId: '509287164539',
  appId: '1:509287164539:web:1a6812c6344366de93d0de',
  measurementId: 'G-2BCGJJSFBT',
});

// NOTE: Most importantly, in your service worker add a 'notificationclick' event listener before calling firebase.messaging()
self.addEventListener('notificationclick', (e) => {
  e.stopImmediatePropagation();

  // data-only: tag와 url이 notification.data에 직접 있음
  // FCM auto-display (레거시): FCM_MSG wrapper 안에 있음
  const hasFcmMsg = !!e.notification.data?.FCM_MSG;
  const notificationTag = hasFcmMsg ? e.notification.data.FCM_MSG.data.tag : e.notification.tag;
  const notificationUrl = hasFcmMsg
    ? e.notification.data.FCM_MSG.data.url
    : e.notification.data?.url;

  if (notificationUrl) {
    e.waitUntil(clients.openWindow(`${self.origin}${notificationUrl}`));
  }

  // 알림 읽음 처리
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      clientList.map((client) => {
        return client.postMessage({
          type: 'READ_NOTIFICATION',
          notificationId: notificationTag,
        });
      });
    }),
  );

  e.notification.close();
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { data } = payload;
  if (!data) return;

  const { message_ko, message_en, url, tag, type } = data;

  // cancel 타입: 기존 notification 닫기
  if (type === 'cancel') {
    self.registration.getNotifications({ tag }).then((notifications) => {
      notifications.forEach((n) => n.close());
    });
    return;
  }

  // data-only 메시지를 직접 표시 (tag로 이전 notification 대체)
  const isKorean =
    (self.navigator && self.navigator.language && self.navigator.language.startsWith('ko')) ||
    (self.registration && self.registration.scope && self.registration.scope.includes('ko'));
  const title = 'WhoAmI Today';
  const options = {
    body: isKorean ? message_ko || message_en : message_en || message_ko,
    tag,
    renotify: true,
    icon: '/whoami192.png',
    data: { url },
  };

  return self.registration.showNotification(title, options);
});
