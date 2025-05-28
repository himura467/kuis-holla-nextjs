"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import styles from "./question.module.css";

export default function QuestionPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [q3, setQ3] = useState(0);
  const [q4, setQ4] = useState(0);

  const scaleLabels = ["そう思わない", "どちらでもない", "そう思う"];

  const handleSubmit = async () => {
    try {
      if (!q1 || !q2 || !q3 || !q4) {
        alert("すべての質問に答えてください");
        return;
      }

      setUser("q1", q1);
      setUser("q2", q2);
      setUser("q3", q3);
      setUser("q4", q4);

      const {
        name,
        password,
        gender,
        department,
        hometown,
        hobbies,
        languages,
        photo,
        q1: stateQ1,
        q2: stateQ2,
        q3: stateQ3,
        q4: stateQ4,
      } = useUserStore.getState();

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        {
          name,
          password,
          gender,
          department,
          hometown,
          hobbies,
          languages,
          q1: stateQ1,
          q2: stateQ2,
          q3: stateQ3,
          q4: stateQ4,
        },
      );

      const userId = res.data.id;

      if (photo && userId) {
        const formData = new FormData();
        formData.append("file", photo);

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/register_image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
      }

      alert("登録が完了しました！");
      router.push("/"); // ← ここを "/login" ではなく "/" に戻す
    } catch (error) {
      console.error(error);
      alert("登録に失敗しました。");
    }
  };

  // 質問をまとめて定義
  const questions = [
    { id: "q1", text: "1. 活発、外向的だと思う。", value: q1, setter: setQ1 },
    {
      id: "q2",
      text: "2. ひかえめで、おとなしいと思う。",
      value: q2,
      setter: setQ2,
    },
    {
      id: "q3",
      text: "3. 心配性で、うろたえやすいと思う。",
      value: q3,
      setter: setQ3,
    },
    {
      id: "q4",
      text: "4. 冷静で、気分が安定していると思う。",
      value: q4,
      setter: setQ4,
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>性格診断</h1>

      {questions.map(({ id, text, value, setter }) => (
        <div key={id} className={styles.questionBlock}>
          <p className={styles.questionText}>{text}</p>
          <div className={styles.scaleRow}>
            {scaleLabels.map((label, idx) => (
              <label key={idx} className={styles.scaleItem}>
                <input
                  type="radio"
                  name={id}
                  value={idx + 1}
                  checked={value === idx + 1}
                  onChange={() => setter(idx + 1)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button className={styles.button} onClick={handleSubmit}>
        登録する
      </button>
    </div>
  );
}
