import { getFirebaseApp } from "./firebase";

export type PushSetupResult =
  | { status: "unsupported" }
  | { status: "ios-requires-home-screen" }
  | { status: "denied" }
  | { status: "granted"; token: string };

// iOS Safari는 16.4부터 웹 푸시를 지원하지만, 홈 화면에 추가(PWA 설치)한 경우에만 동작한다.
// 일반 Safari 탭에서는 Notification/serviceWorker API 자체가 존재해도 실제로는 등록이 불가능하다.
function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export async function setupPushNotifications(): Promise<PushSetupResult> {
  if (typeof window === "undefined") {
    return { status: "unsupported" };
  }

  // iOS는 홈 화면에 추가되어 standalone으로 실행 중이 아니면 Notification/PushManager API 자체가
  // 존재하지 않는다. 이 케이스를 먼저 걸러내야 "지원 안 함"이 아니라 정확한 안내를 보여줄 수 있다.
  if (isIos() && !isStandalone()) {
    return { status: "ios-requires-home-screen" };
  }

  // firebase/messaging의 isSupported()는 iOS 16.4+ 홈 화면 PWA에서도 Safari라는 이유만으로
  // false를 반환하는 경우가 많다(SDK가 구형 Safari 기준으로 판별). 그래서 실제 필요한 브라우저 API
  // (Notification, serviceWorker, PushManager)가 있는지 직접 확인하고, isSupported()는 쓰지 않는다.
  if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { status: "unsupported" };
  }

  const { getMessaging, getToken } = await import("firebase/messaging");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { status: "denied" };
  }

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  const messaging = getMessaging(getFirebaseApp());
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    return { status: "denied" };
  }

  return { status: "granted", token };
}
