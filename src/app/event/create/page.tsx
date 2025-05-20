"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function EventRegisterForm() {
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [place, setPlace] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/register`,
        {
          event_name: eventName,
          place: place,
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true, // ★ これを追加！
        },
      );
      alert("登録成功！イベントID: " + response.data.id);
      router.push("/mypage");
    } catch (error) {
      alert("登録失敗：" + error.response?.data?.detail || error.message);
    }
  };

  return (
    <main className="container">
      <h1 className="title">イベント登録</h1>

      <label className="label">イベント名</label>
      <input
        className="input"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />

      <label className="label">場所</label>
      <input
        className="input"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />

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

      <button className="button" onClick={handleSubmit}>
        登録
      </button>
    </main>
  );
}
