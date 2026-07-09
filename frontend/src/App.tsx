import LogForm from "./components/LogForm";
import LogList from "./components/LogList";
import TagList from "./components/TagList";
import { useState, useEffect } from "react";
import "./App.css";

type Tag = {
  id: number;
  name: string;
};

type Log = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
};

function App() {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tagInput, setTagInput] = useState("");
	const [editingId, setEditingId] = useState<number | null>(null);
	const [keyword, setKeyword] = useState("");

	const [logs, setLogs] = useState<Log[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);

	const fetchLogs = () => {
	  fetch("http://localhost:8080/api/logs")
	    .then((response) => response.json())
	    .then((data) => {
	      setLogs(data);
	    });
	};

	const fetchTags = () => {
	  fetch("http://localhost:8080/api/tags")
	    .then((response) => response.json())
	    .then((data) => {
	      setTags(data);
	    });
	};

	const searchLogs = (searchWord: string) => {
	  fetch(`http://localhost:8080/api/logs/search?keyword=${searchWord}`)
		.then((response) => response.json())
		.then((data) => {
		setLogs(data);
		});
	};

	useEffect(() => {
		fetchLogs();
		fetchTags();
	}, []);

	const handleTagClick = (tagName: string) => {
	  setKeyword(tagName);
	  searchLogs(tagName);
	};

	const deleteLog = (id: number) => {
	  fetch(
		`http://localhost:8080/api/logs/${id}`,
	    {
		  method: "DELETE",
		}
	  ).then(() => {
	    fetchLogs();
		fetchTags();
	  });
	};

	const editLog = (id: number) => {
	  const log = logs.find((log) => log.id === id);

	  if (log) {
		setTitle(log.title);
		setContent(log.content);
		setTagInput(log.tags.map((tag) =>tag.name).join(", "));
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
		  tags: tagInput,
	    }),
	  })
		.then((response) => {
		    console.log("status =", response.status);
		    return response.text();
		  })
			
		.then(() => {
			fetchLogs();
			fetchTags();
			setTitle("");
	    	setContent("");
			setTagInput("");
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
		  tags: tagInput,
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
			setTagInput("");
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

			<TagList
			  tags={tags}
			  selectedTag={keyword}
			  onTagClick={handleTagClick}
			/>

			<input
			  value={keyword}
			  onChange={(e) => setKeyword(e.target.value)}
			/>

			<button onClick={() => searchLogs(keyword)}>
			  検索
			</button>

			<LogForm
			  title={title}
			  content={content}
			  tags={tagInput}
			  setTitle={setTitle}
			  setContent={setContent}
			  onSave={saveLog}
			  setTags={setTagInput}
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
