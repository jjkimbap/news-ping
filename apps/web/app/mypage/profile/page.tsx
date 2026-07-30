"use client";

import { useEffect, useState } from "react";
import { userApi, type UserProfileDto } from "@/lib/api/user";
import { authApi } from "@/lib/api/auth";
import { setupPushNotifications } from "@/lib/push";
import { useRouter } from "next/navigation";

type PushUiStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported" | "ios-requires-home-screen" | "error";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [nickname, setNickname] = useState("");
  const [pushStatus, setPushStatus] = useState<PushUiStatus>("idle");
  const [pushErrorDetail, setPushErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    userApi.getMe().then((p) => {
      setProfile(p);
      setNickname(p.nickname);
    });
  }, []);

  if (!profile) return <p className="text-sm text-gray-500">불러오는 중...</p>;

  async function handleSave() {
    const updated = await userApi.updateMe({ nickname });
    setProfile(updated);
  }

  async function handleToggleNotification() {
    const updated = await userApi.updateMe({ notificationEnabled: !profile!.notificationEnabled });
    setProfile(updated);
  }

  async function handleLogout() {
    await authApi.logout();
    router.replace("/login");
  }

  async function handleEnablePush() {
    setPushStatus("requesting");
    setPushErrorDetail(null);
    try {
      const result = await setupPushNotifications();
      if (result.status === "granted") {
        await userApi.registerPushToken(result.token);
      }
      setPushStatus(result.status);
    } catch (e) {
      setPushErrorDetail(e instanceof Error ? e.message : String(e));
      setPushStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">개인정보 수정</h1>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-500">닉네임 (수정 가능)</label>
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
          />
          <button
            onClick={handleSave}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            저장
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-black/10 px-3 py-2 dark:border-white/10">
        <span className="text-sm">알림 수신</span>
        <button
          onClick={handleToggleNotification}
          className={`rounded-full px-3 py-1 text-xs ${
            profile.notificationEnabled ? "bg-black text-white dark:bg-white dark:text-black" : "bg-black/10 dark:bg-white/10"
          }`}
        >
          {profile.notificationEnabled ? "켜짐" : "꺼짐"}
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-black/10 px-3 py-2 dark:border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm">기기 푸시 알림</span>
          <button
            onClick={handleEnablePush}
            disabled={pushStatus === "requesting" || pushStatus === "granted"}
            className="rounded-full bg-black px-3 py-1 text-xs text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {pushStatus === "granted" ? "등록됨" : pushStatus === "requesting" ? "등록 중..." : "이 기기에서 받기"}
          </button>
        </div>
        {pushStatus === "ios-requires-home-screen" && (
          <p className="text-xs text-gray-500">
            iOS Safari는 홈 화면에 추가한 뒤에만 푸시를 받을 수 있어요. 공유 버튼 → &quot;홈 화면에 추가&quot;를 눌러주세요.
          </p>
        )}
        {pushStatus === "unsupported" && (
          <p className="text-xs text-gray-500">이 브라우저는 푸시 알림을 지원하지 않아요.</p>
        )}
        {pushStatus === "denied" && (
          <p className="text-xs text-gray-500">알림 권한이 거부됐어요. 브라우저/기기 설정에서 알림을 허용해주세요.</p>
        )}
        {pushStatus === "error" && (
          <p className="text-xs text-gray-500">
            등록 중 오류가 발생했어요{pushErrorDetail ? `: ${pushErrorDetail}` : ""}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm text-gray-500 dark:border-white/10">
        <span>🔒 {profile.readonly.provider === "kakao" ? "카카오" : "네이버"} 계정 정보는 해당 서비스에서 관리되어 여기서 수정할 수 없습니다.</span>
      </div>

      <button onClick={handleLogout} className="self-start text-sm text-gray-500 underline">
        로그아웃
      </button>
    </div>
  );
}
