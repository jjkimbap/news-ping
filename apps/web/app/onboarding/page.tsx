"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/api/user";

const STEPS = [
  {
    title: "키워드 뉴스 알림이란?",
    body: "관심 있는 키워드가 포함된 뉴스가 올라오면 즉시 알려드려요.",
  },
  {
    title: "키워드 등록하기",
    body: "마이페이지 > 키워드 설정에서 최대 10개까지 등록할 수 있어요.",
  },
  {
    title: "알림 리스트 확인하기",
    body: "받은 알림은 마이페이지 > 알림 리스트에서 언제든 다시 볼 수 있어요.",
  },
  {
    title: "홈 화면에 추가해보세요",
    body: "iOS는 홈 화면에 추가해야 알림을 받을 수 있어요 (공유 > 홈 화면에 추가).",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  async function finish() {
    await userApi.completeOnboarding();
    router.replace("/");
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-xl font-semibold">{STEPS[step].title}</h1>
      <p className="text-sm text-gray-500">{STEPS[step].body}</p>

      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === step ? "bg-black dark:bg-white" : "bg-black/20 dark:bg-white/20"}`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={finish} className="text-sm text-gray-500 underline">
          건너뛰기
        </button>
        <button
          onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          {isLast ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}
