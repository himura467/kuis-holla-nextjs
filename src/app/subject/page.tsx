"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  gender: string;
  department?: string;
  hometown?: string;
  hobbies?: string[];
  languages?: string[];
}

export default function ConversationTopic() {
  const [topics, setTopics] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const targetUserId = 1;
  const router = useRouter();

  const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${targetUserId}/image`;
  const profileUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${targetUserId}/profile`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 自分のID取得（認証チェック）
        await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
          withCredentials: true,
        });

        // 話題取得
        const topicRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/topic/openai/${targetUserId}`,
          {},
          { withCredentials: true },
        );
        const rawTopic: string = topicRes.data.suggested_topic;
        const topicList = rawTopic
          .split(/\n|・|- /)
          .map((t) => t.trim())
          .filter(Boolean);
        setTopics(topicList);

        // プロフィール取得
        const profileRes = await axios.get(profileUrl, {
          withCredentials: true,
        });
        setProfile(profileRes.data);
      } catch (error) {
        console.error("データ取得エラー:", error);
        setTopics(["話題またはプロフィールの取得に失敗しました。"]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>読み込み中...</p>;

  return (
    <main className="container">
      <p className="title">マッチした相手</p>

      {/* 画像 + プロフィール 横並び */}
      <div className="sub_container">
        {/* 画像 */}
        <div className="w-32 h-32 rounded overflow-hidden border">
          <img
            src={imageUrl}
            alt="ユーザー画像"
            className="w-full h-full object-cover"
            style={{ maxWidth: "200px", height: "auto", borderRadius: "8px" }}
          />
        </div>
        <div>
          {profile && (
            <div className="text-sm space-y-1">
              <p>
                <strong>名前:</strong> {profile.name}
              </p>
              <p>
                <strong>話せる言語:</strong>{" "}
                {(profile.languages || []).join(", ") || "未登録"}
              </p>
              <p>
                <strong>性別:</strong> {profile.gender}
              </p>
              <p>
                <strong>学部:</strong> {profile.department || "未登録"}
              </p>
              <p>
                <strong>出身地:</strong> {profile.hometown || "未登録"}
              </p>

              <p>
                <strong>趣味:</strong>
                {""}
                {(profile.hobbies || []).join(", ") || "未登録"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-container">
        <h2>仲良く話せそうな話題</h2>
        <ul>
          {topics.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
      <button onClick={() => router.push("/")} className="button">
        会話終了
      </button>
    </main>
  );
}
