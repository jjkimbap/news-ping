// 서비스 워커는 정적 파일로 그대로 서빙되어 Next.js의 process.env를 읽을 수 없으므로,
// firebase 클라이언트 설정값(비밀값 아님, 어차피 브라우저 번들에도 노출됨)을 직접 하드코딩한다.
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDR_cu71B0fRKO7j3z1i3m7mm3MdagDdZA",
  authDomain: "news-ping-38eda.firebaseapp.com",
  projectId: "news-ping-38eda",
  storageBucket: "news-ping-38eda.firebasestorage.app",
  messagingSenderId: "717755756911",
  appId: "1:717755756911:web:81f272d8fd0657e15a789a",
});

// 새 버전 배포 시 기존에 등록된(오래된) 서비스 워커가 계속 쓰이지 않도록 즉시 교체한다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "키워드 뉴스 알림";
  const body = payload.notification?.body ?? "";
  const url = payload.data?.url ?? "/mypage/notifications";
  self.registration.showNotification(title, { body, data: { url } });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url ?? "/mypage/notifications", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.startsWith(self.location.origin));
      if (existing) {
        return existing.navigate(url).then((c) => c.focus());
      }
      return self.clients.openWindow(url);
    }),
  );
});
