import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1 className="header-title">掲示板</h1>
          <Link to="/threads/new" className="header-link">★新しいスレッドをたてる★</Link>
        </header>
        <Routes>
          <Route path="/" element={<ThreadList />} />
          <Route path="/threads/new" element={<NewThread />} />
        </Routes>
      </div>
    </Router>
  );
}

function ThreadList() {
  const [threads, setThreads] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchThreads();
  }, [offset]);

  return (
    <main className="main-container">
      <h2 className="main-title">新着スレッド</h2>
      {loading && <p>読み込み中...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="thread-list">
        {threads.map((thread) => (
          <li key={thread.id} className="thread-item">
            {thread.title}
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button
          disabled={offset === 0}
          onClick={() => setOffset((prev) => Math.max(prev - 10, 0))}
          className="button"
        >
          前へ
        </button>
        <button
          onClick={() => setOffset((prev) => prev + 10)}
          className="button"
        >
          次へ
        </button>
      </div>
    </main>
  );
}

function NewThread() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://railway.bulletinboard.techtrain.dev/threads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        }
      );
      if (!response.ok) {
        throw new Error("スレッドの作成に失敗しました");
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-container">
      <h2 className="main-title">新しいスレッドを作成</h2>
      <form onSubmit={handleSubmit} className="new-thread-form">
        <label>
          スレッドタイトル:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
        </label>
        <button type="submit" className="button" disabled={loading}>
          {loading ? "作成中..." : "作成"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  );
}

export default App;
