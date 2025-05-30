"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type EventType = {
  id: number;
  event_name: string;
};

export default function SelectEventPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const router = useRouter();

  // APIからイベント取得
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/active`,
        );
        setEvents(response.data);
      } catch (error) {
        console.error("イベント取得失敗:", error);
        alert("イベント情報の取得に失敗しました。");
      }
    };
    fetchEvents();
  }, []);

  const handleSelect = (eventId: number) => {
    //alert(`イベントID ${eventId} を選択しました`);
    router.push(`/event/${eventId}`);
  };

  return (
    <main className="container">
      <h1 className="title">開催中のイベント</h1>
      {events.length === 0 ? (
        <p>現在アクティブなイベントはありません。</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {events.map((event) => (
            <li key={event.id}>
              <button onClick={() => handleSelect(event.id)} className="button">
                {event.event_name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => router.push("/mypage")} className="backButton">
        戻る
      </button>
    </main>
  );
}
