import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewThread.css"; // スタイルを別のファイルに分ける場合

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
      navigate("/"); // スレッド作成後に一覧ページへリダイレクト
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

export default NewThread;
