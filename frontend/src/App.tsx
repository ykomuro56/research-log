import LogForm from "./components/LogForm";
import LogList from "./components/LogList";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	
	const [logs, setLogs] = useState<
	{ title: string; content: string }[]
	>([]);

	const fetchLogs = () => {
	  fetch("http://localhost:8080/api/logs")
	    .then((response) => response.json())
	    .then((data) => {
	      setLogs(data);
	    });
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	const deleteLog = (index: number) => {
	  setLogs(logs.filter((_, i) => i !== index));
	};

	const saveLog = () => {
	  if (!title || !content) return;

	  fetch("http://localhost:8080/api/logs", {
	    method: "POST",
	    headers: {
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({
	      title,
	      content,
	    }),
	  }).then(() => {
	    fetchLogs();

	   	setTitle("");
	    setContent("");
	  });
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
