// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import NewThread from "./NewThread";

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
          <Route path="/threads/:thread_id" element={<PostList />} />
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
            <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
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

function PostList() {
  const { thread_id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts?offset=0`
        );
        if (!response.ok) {
          throw new Error("投稿の取得に失敗しました");
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [thread_id]);

  return (
    <main className="main-container">
      <h2 className="main-title">投稿一覧</h2>
      {loading && <p>読み込み中...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            {post.post}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
