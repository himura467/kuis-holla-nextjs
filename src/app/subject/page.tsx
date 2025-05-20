"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Profile {
  name: string;
  department?: string;
  hometown?: string;
  hobby?: string;
  languages?: string[];
}

export default function ConversationTopic() {
  const [topics, setTopics] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const targetUserId = 1;

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
      <div className="flex">
        {/* 画像 */}
        <div className="w-32 h-32 rounded overflow-hidden border">
          <img
            src={imageUrl}
            alt="ユーザー画像"
            className="w-full h-full object-cover"
            style={{ maxWidth: "200px", height: "auto", borderRadius: "8px" }}
          />
        </div>

        {/* プロフィール情報 */}
        {profile && (
          <div className="text-sm space-y-1">
            <p>
              <strong>名前:</strong> {profile.name}
            </p>
            <p>
              <strong>学部:</strong> {profile.department || "未登録"}
            </p>
            <p>
              <strong>出身地:</strong> {profile.hometown || "未登録"}
            </p>
            <p>
              <strong>趣味:</strong> {profile.hobby || "未登録"}
            </p>
            <p>
              <strong>話せる言語:</strong>{" "}
              {(profile.languages || []).join(", ") || "未登録"}
            </p>
          </div>
        )}
      </div>

      {/* 話題リスト */}
      <div>
        <h2 className="text-xl font-semibold mb-2">話題</h2>
        <ul className="list-disc pl-5 space-y-1">
          {topics.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
