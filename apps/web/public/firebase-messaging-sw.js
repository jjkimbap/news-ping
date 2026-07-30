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

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "키워드 뉴스 알림";
  const body = payload.notification?.body ?? "";
  self.registration.showNotification(title, { body });
});
