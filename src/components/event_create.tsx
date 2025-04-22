// src/app/components/event_create.tsx
"use client";

import styles from "../app/event/create/event_create.module.css"; // ← 1つ上→event_createへ

export default function EventCreate() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>イベント開催</h1>

      <h2 className={styles.label}>イベント名</h2>
      <input className={styles.input} type="text" name="name" size={20} />

      <h2 className={styles.label}>イベント概要</h2>
      <input className={styles.input} type="text" name="name" size={100} />

      <button className={styles.button}>作成</button>
    </div>
  );
}
