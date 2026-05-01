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

  // FCM auto-display: FCM_MSG wrapper 안에 있음
  // 우리 직접 표시: notification.data에 직접 있음
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
const messaging = firebase.messaging();

// FCM SDK가 background에서 notification 필드로 자동 표시한 뒤 이 콜백이 호출됨.
// FCM 자동 표시 알림은 tag가 없어서 쌓이므로, 여기서:
// 1. FCM이 표시한 tag-없는 알림을 모두 닫고
// 2. 우리 tag 포함 알림으로 교체
messaging.onBackgroundMessage((payload) => {
  const data = payload?.data;
  if (!data) return;

  const { message_ko, message_en, url, tag, type } = data;

  if (type === 'cancel') {
    self.registration.getNotifications({ tag }).then((notifications) => {
      notifications.forEach((n) => n.close());
    });
    return;
  }

  // FCM이 자동 표시한 tag-없는 알림 닫기
  self.registration.getNotifications().then((notifications) => {
    notifications.forEach((n) => {
      // FCM 자동 표시 알림: tag가 없거나 빈 문자열
      if (!n.tag) {
        n.close();
      }
    });

    // tag 포함 알림으로 표시 (같은 tag면 이전 것 대체)
    const isKorean = self.navigator?.language?.startsWith('ko');
    const title = 'WhoAmI Today';
    const options = {
      body: isKorean ? message_ko || message_en : message_en || message_ko,
      tag,
      renotify: true,
      icon: '/whoami192.png',
      data: { url },
    };

    self.registration.showNotification(title, options);
  });
});
