"use client";

import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();

  return (
    <main className="container">
      <h1 className="title">マイページ</h1>

      <div>
        <button className="button" onClick={() => router.push("/profile?from=mypage")}>
          プロフィール変更
        </button>
        <button className="button" onClick={() => router.push("/event/select")}>
          イベントに参加
        </button>
        <button className="button" onClick={() => router.push("/event/create")}>
          イベントを開催
        </button>
      </div>
    </main>
  );
}