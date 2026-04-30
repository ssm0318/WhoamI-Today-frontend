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
  // FCM auto-display: FCM_MSG wrapper 안에 있음
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

// push 이벤트를 직접 가로채서 tag 포함한 notification을 표시
// FCM SDK의 자동 표시(tag 없음)를 방지
self.addEventListener('push', (e) => {
  let payload;
  try {
    payload = e.data?.json();
  } catch (err) {
    return; // 파싱 실패하면 기본 동작에 맡김
  }

  // FCM 메시지 구조: { data: { ... }, notification: { ... } }
  const data = payload?.data;
  if (!data || !data.tag) return; // 우리 메시지가 아니면 기본 동작

  // 기본 FCM 자동 표시 방지: waitUntil로 우리가 직접 표시
  e.stopImmediatePropagation();

  const { message_ko, message_en, url, tag, type } = data;

  if (type === 'cancel') {
    e.waitUntil(
      self.registration.getNotifications({ tag }).then((notifications) => {
        notifications.forEach((n) => n.close());
      }),
    );
    return;
  }

  const isKorean = self.navigator?.language?.startsWith('ko');
  const title = payload?.notification?.title || 'WhoAmI Today';
  const options = {
    body: isKorean ? message_ko || message_en : message_en || message_ko,
    tag,
    renotify: true,
    icon: '/whoami192.png',
    data: { url },
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
// Retrieve firebase messaging
const messaging = firebase.messaging();

// onBackgroundMessage는 push 이벤트에서 이미 처리하므로 빈 콜백
messaging.onBackgroundMessage(() => {});
