import Link from "next/link";

export function NavBar() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          NewKey
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/mypage/notifications">알림</Link>
          <Link href="/mypage/keywords">키워드</Link>
          <Link href="/mypage/profile">마이페이지</Link>
        </div>
      </nav>
    </header>
  );
}
