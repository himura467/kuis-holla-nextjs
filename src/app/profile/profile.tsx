import styles from './profile.module.css';

export default function Profile() {
    const a = "プロフィール"; 
  
    return (
      <div className = {styles.container}>
        <h1 className = {styles.title}>{a}</h1>

        <h2 className = {styles.label}>学部・研究科</h2>
        <input className = {styles.input}
            type = "text"
            name = "name"
            size = {10}/>

        <h2 className = {styles.label}>性別</h2>
        <select name = "gender" className={styles.input}>

            <option value="">選択してください</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="回答しない">回答しない</option>

        </select>
            
        <h2 className = {styles.label}>出身</h2>
        <input className = {styles.input}
            type = "text"
            name = "name"
            size = {10}/>

        <h2 className = {styles.label}>趣味</h2>
        <input className = {styles.input}
            type = "text"
            name = "hobby"
            size = {10}/>

        <h2 className = {styles.label}>意思表示ステータス</h2>
        <select name = "status" className = {styles.input}>

            <option value = "選択してください">選択してください</option>
            <option value = "話しかけたい">話しかけたい</option>
            <option value = "話しかけてください">話しかけてください</option>
        
        </select>
        <button className = {styles.button}>登録</button>
      </div>
    );
  }
  
