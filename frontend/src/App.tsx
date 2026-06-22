import { useState } from "react";
import "./App.css";

function App() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const [logs, setLogs] = useState<
	{ title: string; content: string }[]
	>([]);
	return (
			<div style={{ maxWidth: "800px", margin: "40px auto" }}>
			<h1>Research Log</h1>

			<h2>新しい記録</h2>

			<input
			type="text"
			placeholder="タイトル"
			value={title}
			onChange={(e) => setTitle(e.target.value)}
			style={{
width: "100%",
padding: "8px",
marginBottom: "10px",
}}
/>
<textarea
placeholder="内容"
value={content}
  onChange={(e) => setContent(e.target.value)}
rows={8}
style={{
width: "100%",
	   padding: "8px",
	   marginBottom: "10px",
}}
/>

<br />

<button
  onClick={() => {
    if (!title || !content) return;

    setLogs([
      ...logs,
      {
        title,
        content,
      },
    ]);

    setTitle("");
    setContent("");
  }}
>
  保存
</button>

<h2>記録一覧</h2>

{logs.length === 0 ? (
  <p>まだ記録はありません。</p>
) : (
  logs.map((log, index) => (
    <div
      key={index}
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "12px",
        background: "white",
      }}
    >
      <h3>{log.title}</h3>
      <p>{log.content}</p>
	  <button
  onClick={() => {
    setLogs(logs.filter((_, i) => i !== index));
  }}
>
  削除
</button>
    </div>
  ))
)}
</div>
);
}

export default App;
