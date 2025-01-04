import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [threads, setThreads] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // スレッド情報を取得
  const fetchThreads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://railway.bulletinboard.techtrain.dev/threads?offset=${offset}`
      );
      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }
      const data = await response.json();
      setThreads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [offset]);

  return (
    <div className="app">
      <header className="header">
        <h1>TechTrain 掲示板</h1>
      </header>
      <main>
        {loading && <p>読み込み中...</p>}
        {error && <p className="error">{error}</p>}
        <ul className="thread-list">
          {threads.map((thread) => (
            <li key={thread.id} className="thread-item">
              <h2>{thread.title}</h2>
              <p>スレッドID: {thread.id}</p>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button
            disabled={offset === 0}
            onClick={() => setOffset((prev) => Math.max(prev - 10, 0))}
          >
            前へ
          </button>
          <button onClick={() => setOffset((prev) => prev + 10)}>次へ</button>
        </div>
      </main>
    </div>
  );
}

export default App;
