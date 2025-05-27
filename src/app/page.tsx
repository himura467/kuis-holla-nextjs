//top page
"use client";

import React, { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
// import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [token, setToken] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        new URLSearchParams({
          username,
          password,
        }),
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      //ここで認証確認してからマイページへ遷移
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
        withCredentials: true,
      });

      router.push("/mypage");
    } catch (error: unknown) {
      const err = error as AxiosError;
      const data = err.response?.data as { detail?: string };
      alert("ログイン失敗：" + (data?.detail || err.message));
    }
  };

  return (
    <main className="container">
      <h2 className="title">ログインフォーム</h2>

      <label className="label">ユーザー名</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      />

      <label className="label">パスワード</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />

      <button onClick={handleLogin} className="button">
        ログイン
      </button>

      <button onClick={() => router.push("/register")} className="button">
        新規登録
      </button>
    </main>
  );
}
