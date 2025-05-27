"use client";

import { useRouter } from "next/navigation"; // App Router 用
import { useState } from "react";
import styles from "../app/register/shinkitouroku.module.css";
import { useUserStore } from "../store/userStore"; // Zustandのstoreをインポート

export default function Shinkitouroku() {
  const router = useRouter();
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUserStore((state) => state.setUser); // Zustandのアクション

  const handleNext = () => {
    if (!name || !password) {
      alert("氏名とパスワードを入力してください");
      return;
    }

    setUser("name", name);
    setUser("password", password); // Zustandに保存
    router.push("/profile"); // プロフィール入力画面へ遷移
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新規登録</h1>

      <h2 className={styles.label}>氏名</h2>
      <input
        className={styles.input}
        type="text"
        name="name"
        value={name}
        onChange={(e) => setUsername(e.target.value)}
        size={10}
      />

      <h2 className={styles.label}>パスワード</h2>
      <input
        className={styles.input}
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        size={10}
      />

      <button onClick={handleNext} className={styles.button}>
        次へ
      </button>
    </div>
  );
}
