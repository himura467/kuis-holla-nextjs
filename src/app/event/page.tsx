//ログイン後イベント一覧を表示して選択してもらう
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectEventPage() {
  // 後でちゃんと取得したものに直す
  const events = [
    { id: 1, name: "春の学園祭" },
    { id: 2, name: "夏のスポーツ大会" },
    { id: 3, name: "秋の文化展" },
    { id: 4, name: "冬の研究発表会" },
  ];

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const handleSelect = (eventId: number) => {
    setSelectedEventId(eventId);
    alert(`イベントID ${eventId} を選択しました`);
    // router.push(`/hogehoge`);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>参加するイベントを選択してください</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: "0.5rem" }}>
            <button
              onClick={() => handleSelect(event.id)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.25rem",
                border: "1px solid #ccc",
                backgroundColor:
                  selectedEventId === event.id ? "#0070f3" : "#f5f5f5",
                color: selectedEventId === event.id ? "white" : "black",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
              }}
            >
              {event.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
