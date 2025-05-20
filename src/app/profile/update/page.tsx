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
  const [hobby, setHobby] = useState("");
  const [hometown, setHometown] = useState("");
  const [language, setLanguage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null); // 最初に取得した画像URL

  const axiosAuth = axios.create({ withCredentials: true });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosAuth.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`,
        );
        const data = res.data;

        setName(data.name ?? "");
        setGender(data.gender ?? "");
        setDepartment(data.department ?? "");
        setHobby(data.hobbies?.join(",") ?? "");
        setHometown(data.hometown ?? "");
        setLanguage(data.languages?.join(",") ?? "");

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/image?cb=${Date.now()}`;
        setImageUrl(url);
        setInitialImageUrl(url);
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
      await axiosAuth.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/update`,
        {
          gender,
          department,
          hobbies: hobby
            .split(",")
            .map((h) => h.trim())
            .filter(Boolean),
          hometown,
          languages: language
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean),
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

      alert("プロフィール更新完了！");
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

  const handleImageDelete = async () => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
      setPhoto(null);
    }
  };

  return (
    <div className="container">
      <h1 className="title">プロフィール編集</h1>

      <p className="label">ユーザー名</p>
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
          <div>
            <button
              type="button"
              onClick={handleImageDelete}
              style={{ marginTop: "8px" }}
            >
              画像を元に戻す
            </button>
          </div>
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

      <label className="label">言語（カンマ区切り）</label>
      <input
        className="input"
        type="text"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />

      <label className="label">趣味（カンマ区切り）</label>
      <input
        className="input"
        type="text"
        value={hobby}
        onChange={(e) => setHobby(e.target.value)}
      />

      <button className="button" onClick={handleProfileUpdate}>
        更新
      </button>
    </div>
  );
}
