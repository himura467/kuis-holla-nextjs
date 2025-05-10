//top page
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [token, setToken] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        new URLSearchParams({
          username,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      //setToken(token);
      //alert("ログインしました。");
      router.push("/mypage");
    } catch (error) {
      alert("ログイン失敗：" + error.response?.data?.detail || error.message);
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
