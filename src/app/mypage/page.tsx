"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function MyPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
          withCredentials: true, // ← Cookie を含める
        });
        // 200 OK ならそのまま表示
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        console.error("認証確認エラー:", axiosError); // ← ここで使うことで Lint 回避
        alert("ログインが必要です");
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="container">
      <h1 className="title">マイページ</h1>

      <div>
        <button
          className="button"
          onClick={() => router.push("/profile?from=mypage")}
        >
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
