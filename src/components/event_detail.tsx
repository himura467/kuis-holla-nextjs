"use client";

import styles from "../app/event/[id]/event_detail.module.css";

type Participant = {
  id: string;
  name: string;
};

type Props = {
    name: string;
    description: string;
    participants: Participant[];
    onJoinAsInitiator: () => void;
    onJoinAsReceiver: () => void;
  };
  
  export default function EventDetail({
    name,
    description,
    participants,
    onJoinAsInitiator,
    onJoinAsReceiver,
  }: Props) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.description}>{description}</p>
  
        <h2 className={styles.subTitle}>参加者一覧</h2>
        <ul className={styles.participantList}>
          {participants.map((p) => (
            <li key={p.id} className={styles.participantItem}>
              {p.name}
            </li>
          ))}
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
  