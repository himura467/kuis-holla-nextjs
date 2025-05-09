import styles from "./profile.module.css";

export default function Profile() {
  const a = "プロフィール";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{a}</h1>

      <h2 className={styles.label}>写真登録</h2>
        <p>※顔の分かる写真をアップロードてください</p>
        <input className={styles.input} type="file" name="photo" accept="image/*"/>

      <h2 className={styles.label}>学部・研究科</h2>
      <input className={styles.input} type="text" name="name" size={10} />

      <h2 className={styles.label}>性別</h2>
      <select name="gender" className={styles.input}>
        <option value="">選択してください</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
        <option value="回答しない">回答しない</option>
      </select>

      <h2 className={styles.label}>出身</h2>
      <input className={styles.input} type="text" name="name" size={10} />

      <h2 className={styles.label}>趣味</h2>
      <input className={styles.input} type="text" name="hobby" size={10} />


      <button className={styles.button}>登録</button>
    </div>
  );
}
