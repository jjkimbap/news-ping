"use client";

import { useEffect, useState } from "react";
import { userApi, type UserProfileDto } from "@/lib/api/user";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [nickname, setNickname] = useState("");

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

      <div className="flex flex-col gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm text-gray-500 dark:border-white/10">
        <span>🔒 {profile.readonly.provider === "kakao" ? "카카오" : "네이버"} 계정 정보는 해당 서비스에서 관리되어 여기서 수정할 수 없습니다.</span>
      </div>

      <button onClick={handleLogout} className="self-start text-sm text-gray-500 underline">
        로그아웃
      </button>
    </div>
  );
}
