"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfileEdit() {
  const router = useRouter();

  // nameは表示専用にする
  const [name, setName] = useState(""); // ← 使うが更新しない
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([""]);
  const [hometown, setHometown] = useState("");
  const [languages, setLanguages] = useState<string[]>([""]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const axiosAuth = axios.create({ withCredentials: true });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosAuth.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`,
        );
        const data = res.data;

        setName(data.name);
        setGender(data.gender);
        setDepartment(data.department);
        setHobbies(data.hobbies);
        setHometown(data.hometown);
        setLanguages(data.languages);

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/image?cb=${Date.now()}`;
        setImageUrl(url);
      } catch (error) {
        console.error(error);
        alert("ユーザ情報の取得に失敗しました");
        router.push("/");
      }
    };
    fetchUserInfo();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const filteredLanguages = languages.filter((l) => l.trim() !== "");
      const filteredHobbies = hobbies.filter((h) => h.trim() !== "");

      if (
        gender.trim() === "" ||
        department.trim() === "" ||
        hometown.trim() === "" ||
        filteredLanguages.length === 0 ||
        filteredHobbies.length === 0
      ) {
        alert("すべて記入してください");
        return;
      }

      await axiosAuth.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update`,
        {
          gender,
          department,
          hobbies: filteredHobbies,
          hometown,
          languages: filteredLanguages,
        },
      );

      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/upload_image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );
        setImageUrl(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/image?cb=${Date.now()}`,
        );
      }

      alert("更新されました");
      router.push("/mypage");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error);
        alert(
          "更新に失敗しました: " +
            (error.response?.data?.detail || error.message),
        );
      } else {
        console.error(error);
        alert("更新に失敗しました");
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">プロフィール編集</h1>

      <p className="label">氏名</p>
      <p style={{ marginBottom: "10px" }}>{name}</p>

      <label className="label">顔写真</label>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: "12px" }}
      />
      {imageUrl && (
        <div style={{ marginBottom: "12px" }}>
          <img
            key={imageUrl}
            src={imageUrl}
            alt="プロフィール画像"
            style={{ maxWidth: "200px", height: "auto", borderRadius: "8px" }}
          />
        </div>
      )}

      <label className="label">学部・研究科</label>
      <input
        className="input"
        type="text"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      />

      <label className="label">性別</label>
      <select
        className="input"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">選択してください</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
        <option value="回答しない">回答しない</option>
      </select>

      <label className="label">出身</label>
      <input
        className="input"
        type="text"
        value={hometown}
        onChange={(e) => setHometown(e.target.value)}
      />

      <h2 className="label">言語</h2>
      {languages.map((lang, index) => (
        <input
          key={index}
          className="input"
          type="text"
          value={lang}
          onChange={(e) => {
            const newLanguage = [...languages];
            newLanguage[index] = e.target.value;
            setLanguages(newLanguage);
          }}
        />
      ))}

      <button
        type="button"
        className="addbutton"
        onClick={() => setLanguages([...languages, ""])}
        style={{ marginTop: "10px", backgroundColor: "#ddd", color: "#333" }}
      >
        +言語を追加する
      </button>

      <h2 className="label">趣味</h2>
      {hobbies.map((hobby, index) => (
        <input
          key={index}
          className="input"
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
        className="addbutton"
        onClick={() => setHobbies([...hobbies, ""])}
        style={{ marginTop: "10px", backgroundColor: "#ddd", color: "#333" }}
      >
        +趣味を追加する
      </button>
      <div>
        <button className="forwardButton" onClick={handleProfileUpdate}>
          更新
        </button>
      </div>
      <div>
        <button className="backButton" onClick={() => router.push("/mypage")}>
          戻る
        </button>
      </div>
    </div>
  );
}
