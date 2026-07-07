import LogForm from "./components/LogForm";
import LogList from "./components/LogList";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [keyword, setKeyword] = useState("");

	const [logs, setLogs] = useState<
	{ id: number; title: string; content: string }[]
	>([]);

	const fetchLogs = () => {
	  fetch("http://localhost:8080/api/logs")
	    .then((response) => response.json())
	    .then((data) => {
	      setLogs(data);
	    });
	};

	const searchLogs = () => {
		 fetch(`http://localhost:8080/api/logs/search?keyword=${keyword}`)
		 .then((response) => response.json())
		 .then((data) => {
		 setLogs(data);
		 });
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	const deleteLog = (id: number) => {
	  fetch(
		`http://localhost:8080/api/logs/${id}`,
	    {
		  method: "DELETE",
		}
	  ).then(() => {
	    fetchLogs();
	  });
	};

	const editLog = (id: number) => {
	  console.log("edit", id);

	  const log = logs.find((log) => log.id === id);

	  if (log) {
		setTitle(log.title);
		setContent(log.content);
		setEditingId(log.id);
	  }
	};

	const saveLog = () => {
	  if (!title || !content) {
	  return;
	  }
	  if (editingId === null) {
		fetch("http://localhost:8080/api/logs", {
	    method: "POST",
	    headers: {
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({
	      title,
	      content,
	    }),
	  })
		.then((response) => {
		    console.log("status =", response.status);
		    return response.text();
		  })
			
		.then(() => {
			fetchLogs();
			setTitle("");
	    	setContent("");
			setEditingId(null);
		})
		.catch((err) => {
		    console.error(err);
	  });
	  } else {
		fetch(`http://localhost:8080/api/logs/${editingId}`, {
	    method: "PUT",
	    headers: {
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify({
	      title,
	      content,
	    }),
	  })
		.then((response) => {
		    console.log("status =", response.status);
		    return response.text();
		  })
			
		.then(() => {
			fetchLogs();
			setTitle("");
	    	setContent("");
			setEditingId(null);
		})
		.catch((err) => {
		    console.error(err);
	  });
	  }
	};
	return (
			<div style={{ maxWidth: "800px", margin: "40px auto" }}>
			<h1>Research Log</h1>
<input
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
/>

<button onClick={searchLogs}>
  Search
</button>

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
  onEdit={editLog}
/>


</div>
);
}

export default App;
