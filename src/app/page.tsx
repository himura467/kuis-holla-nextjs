//top page
"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
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
      router.push("/event");
    } catch (error) {
      alert("ログイン失敗：" + error.response?.data?.detail || error.message);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Holla! ログインフォーム</h2>
      <input
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "1rem" }}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          marginBottom: "1rem",
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          display: "block",
          marginTop: "0.5rem",
          fontSize: "0.8rem",
          padding: "0.3rem 0.6rem",
          borderRadius: "0",
          backgroundColor: "#f8f8f8",
        }}
      >
        ログイン
      </button>

      <button
        onClick={() => router.push("/register")}
        style={{
          display: "block",
          marginTop: "0.5rem",
          fontSize: "0.8rem",
          padding: "0.3rem 0.6rem",
          borderRadius: "0",
          backgroundColor: "#f8f8f8",
        }}
      >
        新規登録
      </button>
      {/*
      {token && (
        <div style={{ marginTop: "1rem" }}>
          <p>取得したトークン：</p>
          <code style={{ wordWrap: "break-word" }}>{token}</code>
        </div>
      )}
      */}
    </div>
  );
}
