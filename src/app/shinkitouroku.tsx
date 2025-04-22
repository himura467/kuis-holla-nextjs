"use client";

import { useRouter } from "next/navigation"; // next.js　App Router用の書き方
import styles from "./shinkitouroku.module.css";

export default function Shinkitouroku() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/profile"); //profile.tsxがpagesにあればここへ遷移
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新規登録</h1>
      <h2 className={styles.label}>氏名</h2>
      <input className={styles.input} type="text" name="name" size={10} />
      <h2 className={styles.label}>パスワード</h2>
      <input className={styles.input} type="text" name="name" size={10} />
      <button onClick={handleNext} className={styles.button}>
        次へ
      </button>
    </div>
  );
}
