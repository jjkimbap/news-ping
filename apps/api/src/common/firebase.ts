import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function initFirebase() {
  if (getApps().length > 0) return;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_JSON이 설정되지 않아 푸시 발송이 비활성화됩니다.");
    return;
  }

  initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
}

initFirebase();

export function isPushEnabled() {
  return getApps().length > 0;
}

export function getMessagingClient() {
  return getMessaging();
}
