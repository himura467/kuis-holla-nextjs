"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import EventDetail from "@/components/event_detail";

type Participant = {
  id: string;
  name: string;
};

type EventData = {
  id: string;
  event_name: string;
  place: string;
  start_time: string;
  end_time: string;
  registered_users: Participant[];
  creater_id: string;
  event_abstract: string;
};

export default function EventDetailPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);

  useEffect(() => {
    if (!eventId) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/details`,
        { withCredentials: true },
      )
      .then((res) => setEventData(res.data))
      .catch((err) => alert("読み込み失敗：" + err.message));
  }, [eventId]);

  const handleJoin = async (status: "initiator" | "receiver") => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/join`,
        { status },
        { withCredentials: true },
      );
      alert(
        `${status === "initiator" ? "話しかけたい人" : "話しかけられたい人"}で参加しました！`,
      );
      if (status === "initiator") {
        router.push("/central");
      } else {
        router.push("/peripheral");
      }
    } catch (err) {
      alert("参加に失敗：" + err.message);
    }
  };

  if (!eventData) return <p>読み込み中...</p>;

  return (
    <EventDetail
      name={eventData.event_name}
      description={eventData.event_abstract}
      place={eventData.place}
      startTime={formatDateTime(eventData.start_time)}
      endTime={formatDateTime(eventData.end_time)}
      participants={eventData.registered_users}
      onJoinAsInitiator={() => handleJoin("initiator")}
      onJoinAsReceiver={() => handleJoin("receiver")}
    />
  );
}

function formatDateTime(dt: string): string {
  const d = new Date(dt);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
