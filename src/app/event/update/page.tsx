"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function EditEventPage() {
  const { id } = useParams(); // event_id を取得
  const [eventName, setEventName] = useState("");
  const [place, setPlace] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState<string[]>([]);

  // 既存のイベント情報を取得（初期表示）
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${id}`
        );
        const data = res.data;
        setEventName(data.event_name);
        setPlace(data.place);
        setStartTime(data.start_time);
        setEndTime(data.end_time);
        setRegisteredUsers(data.registered_users || []);
      } catch (error) {
        alert("イベント情報の取得に失敗しました");
      }
    };
    fetchEvent();
  }, [id]);

  // PUTで更新
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${id}`,
        {
          event_name: eventName,
          place,
          start_time: startTime,
          end_time: endTime,
          registered_users: registeredUsers,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("イベントを更新しました");
    } catch (error) {
      alert("更新に失敗：" + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <main className="container">
      <h1 className="title">イベント編集</h1>

      <label className="label">イベント名</label>
      <input className="input" value={eventName} onChange={(e) => setEventName(e.target.value)} />

      <label className="label">場所</label>
      <input className="input" value={place} onChange={(e) => setPlace(e.target.value)} />

      <label className="label">開始日時</label>
      <input
        className="input"
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      <label className="label">終了日時</label>
      <input
        className="input"
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      <button className="button" onClick={handleUpdate}>
        更新
      </button>
    </main>
  );
}
