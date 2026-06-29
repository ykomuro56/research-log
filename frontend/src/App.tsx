import LogForm from "./components/LogForm";
import LogList from "./components/LogList";
import { useState } from "react";
import "./App.css";

function App() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	
	const [logs, setLogs] = useState<
	{ title: string; content: string }[]
	>([]);

	const deleteLog = (index: number) => {
	  setLogs(logs.filter((_, i) => i !== index));
	};

	const saveLog = () => {
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
	};

	return (
			<div style={{ maxWidth: "800px", margin: "40px auto" }}>
			<h1>Research Log</h1>
<LogForm
  title={title}
  content={content}
  setTitle={setTitle}
  setContent={setContent}
  onSave={saveLog}
/>

<LogList
  logs={logs}
  onDelete={deleteLog}
/>


</div>
);
}

export default App;
