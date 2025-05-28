"use client";

import { useUserStore } from "../store/userStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../app/profile/profile.module.css";

export default function Profile() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [hometown, setHometown] = useState("");
  const [language, setLanguage] = useState<string[]>([""]);
  const [photo, setPhoto] = useState<File | null>(null);

  const [hobbies, setHobbies] = useState<string[]>([""]); // ← 複数入力対応

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleProfileSubmit = () => {
    // 空欄を除いた趣味だけ保存
    const filteredHobbies = hobbies.filter((h) => h.trim() !== "");

    // Zustand に保存（送信はしない）
    setUser("gender", gender);
    setUser("department", department);
    setUser("hometown", hometown);
    setUser("languages", language.split(","));
    setUser("photo", photo);
    setUser("hobbies", filteredHobbies);

    router.push("/question"); // 次のステップへ
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
        onChange={handleFileChange}
      />

      <h2 className={styles.label}>学部・研究科</h2>
      <input
        className={styles.input}
        type="text"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />

      <h2 className={styles.label}>性別</h2>
      <select
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
        value={hometown}
        onChange={(e) => setHometown(e.target.value)}
      />

      <h2 className={styles.label}>言語</h2>
      {language.map((lang, index) => (
        <input
          key={index}
          className={styles.input}
          type="text"
          value={lang}
          onChange={(e) => {
            const newLanguage = [...language];
            newLanguage[index] = e.target.value;
            setLanguage(newLanguage);
          }}
        />
      ))}

      <button
        type="button"
        className={styles.addbutton}
        onClick={() => setLanguage([...language, ""])}
        style={{ marginTop: "10px", backgroundColor: "#ddd", color: "#333" }}
      >
        +言語を追加する
      </button>

      <h2 className={styles.label}>趣味</h2>
      {hobbies.map((hobby, index) => (
        <input
          key={index}
          className={styles.input}
          type="text"
          value={hobby}
          onChange={(e) => {
            const newHobbies = [...hobbies];
            newHobbies[index] = e.target.value;
            setHobbies(newHobbies);
          }}
        />
      ))}

      <button
        type="button"
        className={styles.addbutton}
        onClick={() => setHobbies([...hobbies, ""])}
        style={{ marginTop: "10px", backgroundColor: "#ddd", color: "#333" }}
      >
        +趣味を追加する
      </button>

      <button className={styles.button} onClick={handleProfileSubmit}>
        次へ
      </button>
    </div>
  );
}
