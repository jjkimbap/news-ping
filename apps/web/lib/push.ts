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

function pushEnvironmentStatus(): "ok" | "unsupported" | "ios-requires-home-screen" {
  if (typeof window === "undefined") return "unsupported";

  // iOS는 홈 화면에 추가되어 standalone으로 실행 중이 아니면 Notification/PushManager API 자체가
  // 존재하지 않는다. 이 케이스를 먼저 걸러내야 "지원 안 함"이 아니라 정확한 안내를 보여줄 수 있다.
  if (isIos() && !isStandalone()) return "ios-requires-home-screen";

  // firebase/messaging의 isSupported()는 iOS 16.4+ 홈 화면 PWA에서도 Safari라는 이유만으로
  // false를 반환하는 경우가 많다(SDK가 구형 Safari 기준으로 판별). 그래서 실제 필요한 브라우저 API
  // (Notification, serviceWorker, PushManager)가 있는지 직접 확인하고, isSupported()는 쓰지 않는다.
  if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return "unsupported";
  }

  return "ok";
}

// 알림 권한은 브라우저가 영구적으로 기억한다 (React state와 달리 새로고침해도 남아있음).
// 페이지 로드 시 이 함수로 실제 상태를 조회해서 버튼 상태를 정확히 반영해야 한다.
export function hasGrantedPushPermission(): boolean {
  return pushEnvironmentStatus() === "ok" && Notification.permission === "granted";
}

export async function setupPushNotifications(): Promise<PushSetupResult> {
  const envStatus = pushEnvironmentStatus();
  if (envStatus !== "ok") {
    return { status: envStatus };
  }

  const { getMessaging, getToken } = await import("firebase/messaging");

  // 이미 허용된 상태면 UI 프롬프트 없이 즉시 "granted"로 resolve된다 (스펙 동작) — 매 방문마다
  // 조용히 재호출해서 토큰을 최신 상태로 재등록하는 데 안전하게 쓸 수 있다.
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { status: "denied" };
  }

  // navigator.serviceWorker.register()도 raw 브라우저 API라 basePath가 자동으로 안 붙는다.
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const registration = await navigator.serviceWorker.register(`${basePath}/firebase-messaging-sw.js`);
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
