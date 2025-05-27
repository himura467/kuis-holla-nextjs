"use client";

import styles from "../app/event/[eventId]/event_detail.module.css";

type Participant = {
  id: string;
  name: string;
};

type Props = {
  name: string;
  description: string;
  place: string;
  startTime: string;
  endTime: string;
  participants: Participant[];
  onJoinAsInitiator: () => void;
  onJoinAsReceiver: () => void;
};

export default function EventDetail({
  name,
  description,
  place,
  startTime,
  endTime,
  participants,
  onJoinAsInitiator,
  onJoinAsReceiver,
}: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{name}</h1>

      <div className={styles.infoSection}>
        <div className={styles.infoRow}>
          <span className={styles.label}>イベント概要</span>
          <span className={styles.value}>{description}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>場所</span>
          <span className={styles.value}>{place}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>時間</span>
          <span className={styles.value}>
            {startTime} 〜 {endTime}
          </span>
        </div>
      </div>

      <h2 className={styles.subTitle}>参加者一覧</h2>
      <ul className={styles.participantList}>
        {participants.length === 0 ? (
          <li className={styles.participantItem}>名前なし</li>
        ) : (
          participants.map((p, i) => (
            <li key={p.id ?? i} className={styles.participantItem}>
              {p.name ?? "名前なし"}
            </li>
          ))
        )}
      </ul>

      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={onJoinAsInitiator}>
          話しかけたい人で参加
        </button>
        <button className={styles.button} onClick={onJoinAsReceiver}>
          話しかけられたい人で参加
        </button>
      </div>
    </div>
  );
}
