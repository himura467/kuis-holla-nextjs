"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "@/components/logout";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

export default function MyPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          {
            withCredentials: true,
          },
        );
        setUserName(res.data.name ?? "");
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
      <h1 className="title">
        {userName ? (
          <>
            {userName} さんの
            <br />
            マイページ
          </>
        ) : (
          "マイページ"
        )}
      </h1>
      <LogoutButton />
      <div>
        <button
          className="button"
          onClick={() => router.push("/profile/update")}
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

      <div style={{ marginTop: "20px" }}>
        <button className="button" onClick={() => router.push("/")}>
          ログインページへ戻る
        </button>
      </div>
    </main>
  );
}
