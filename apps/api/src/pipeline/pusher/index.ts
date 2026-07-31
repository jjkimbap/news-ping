import { getMessagingClient, isPushEnabled } from "../../common/firebase.js";
import { pushTokenRepository } from "../../db/repositories/push-token.repository.js";

export interface UserNotificationBatch {
  userId: string;
  notificationCount: number;
  sampleArticleTitle: string;
  sampleKeyword: string;
}

function buildNotificationBody(batch: UserNotificationBatch) {
  if (batch.notificationCount <= 1) {
    return `[${batch.sampleKeyword}] ${batch.sampleArticleTitle}`;
  }
  return `${batch.sampleKeyword} 외 ${batch.notificationCount - 1}건의 키워드 뉴스가 도착했습니다`;
}

export async function sendGroupedPush(batches: UserNotificationBatch[]) {
  if (batches.length === 0 || !isPushEnabled()) return;

  const tokens = await pushTokenRepository.listTokensForUsers(batches.map((b) => b.userId));
  const tokensByUser = new Map<string, string[]>();
  for (const t of tokens) {
    const list = tokensByUser.get(t.userId) ?? [];
    list.push(t.token);
    tokensByUser.set(t.userId, list);
  }

  const messaging = getMessagingClient();

  const results = await Promise.allSettled(
    batches.map((batch) => {
      const userTokens = tokensByUser.get(batch.userId) ?? [];
      if (userTokens.length === 0) return Promise.resolve(null);

      return messaging.sendEachForMulticast({
        tokens: userTokens,
        notification: {
          title: "키워드 뉴스 알림",
          body: buildNotificationBody(batch),
        },
        // 서비스 워커의 notificationclick 핸들러가 이 값으로 이동한다 (apps/web/public/firebase-messaging-sw.js).
        data: { url: "/mypage/notifications" },
      });
    }),
  );

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("푸시 발송 실패:", result.reason);
    } else if (result.value && result.value.failureCount > 0) {
      console.error(
        "푸시 발송 일부 실패:",
        result.value.responses.filter((r) => !r.success).map((r) => r.error?.message),
      );
    }
  }
}
