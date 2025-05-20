"use client";

import { useUserStore } from "../store/userStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../app/profile/profile.module.css";

export default function Profile() {
  const router = useRouter();
  const { name, password } = useUserStore();

  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [hobby, setHobby] = useState("");
  const [hometown, setHometown] = useState("");
  const [language, setLanguage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  // userId を Cookie 経由で取得して保持
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          {
            withCredentials: true,
          },
        );
        setUserId(res.data.id);
      } catch (err) {
        console.error(err);
        alert("ユーザー情報の取得に失敗しました");
      }
    };
    fetchUserId();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleProfileSubmit = async () => {
    try {
      // ① プロフィール登録（name, password を含む）
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
        name,
        password,
        gender,
        department,
        hobbies: hobby.split(","),
        hometown,
        languages: language.split(","),
      });

      // ② 写真アップロード（userId を使う）
      if (photo && userId !== null) {
        const formData = new FormData();
        formData.append("file", photo);

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/upload_image`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
      }

      alert("プロフィール登録完了！");
      router.push("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert("登録失敗: " + (error.response?.data?.detail || error.message));
      } else {
        alert("登録失敗");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プロフィール登録</h1>

      <h2 className={styles.label}>顔写真登録</h2>
      <p>※顔の分かる写真をアップロードてください</p>
      <input
        className={styles.input}
        type="file"
        name="photo"
        accept="image/*"
        onChange={handleFileChange} // 写真選択イベント追加
      />

      <h2 className={styles.label}>学部・研究科</h2>
      <input
        className={styles.input}
        type="text"
        name="name"
        size={10}
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />

      <h2 className={styles.label}>性別</h2>
      <select
        name="gender"
        className={styles.input}
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">選択してください</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
        <option value="回答しない">回答しない</option>
      </select>

      <h2 className={styles.label}>出身</h2>
      <input
        className={styles.input}
        type="text"
        name="name"
        size={10}
        value={hometown}
        onChange={(e) => setHometown(e.target.value)}
      />

      <h2 className={styles.label}>言語</h2>
      <input
        className={styles.input}
        type="text"
        name="name"
        size={10}
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />

      <h2 className={styles.label}>趣味</h2>
      <input
        className={styles.input}
        type="text"
        name="hobby"
        size={10}
        value={hobby}
        onChange={(e) => setHobby(e.target.value)}
      />

      <button className={styles.button} onClick={handleProfileSubmit}>
        登録
      </button>
    </div>
  );
}
