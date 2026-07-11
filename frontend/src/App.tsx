import LogForm from "./components/LogForm";
import LogList from "./components/LogList";
import TagList from "./components/TagList";
import logo from "./assets/research_log_logo_transparent.png"
import { useState, useEffect, useRef } from "react";
import "./App.css";
import "./common.css"

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
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [shouldRenderForm, setShouldRenderForm] = useState(false);

	const [logs, setLogs] = useState<Log[]>([]);
	const [tags, setTags] = useState<Tag[]>([]);

	const formRef = useRef<HTMLDivElement>(null);

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

	const searchLogs = (
	  searchWord: string,
	  selectedTag: string | null
	  ) => {
	    const params = new URLSearchParams();

		if(searchWord) {
		  params.append("keyword", searchWord);
		}

		if(selectedTag) {
		  params.append("tag", selectedTag);
		}

		fetch(`http://localhost:8080/api/logs/search?${params.toString()}`)
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
		const newTag = selectedTag === tagName ? null : tagName;

		setSelectedTag(newTag);
		searchLogs(keyword, newTag);
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

	  if (!log) return;
	  
	  setTitle(log.title);
	  setContent(log.content);
	  setTagInput(log.tags.map((tag) =>tag.name).join(", "));
	  setEditingId(log.id);
	  setShouldRenderForm(true);
	  
	  requestAnimationFrame(() => {
	    setIsFormOpen(true);
		formRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	  });
	};

	const cancelEdit = () => {
	  setEditingId(null);
	  setTitle("");
	  setContent("");
	  setTagInput("");
	  setIsFormOpen(false);
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
			setIsFormOpen(false);
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
			setIsFormOpen(false);
		})
		.catch((err) => {
		    console.error(err);
	  });
	  }
	};
	return (
			<div style={{ maxWidth: "800px", margin: "40px auto" }}>
				<div className="hero">
					<img
						src={logo}
						alt="Reseach Log Logo"
						className="hero-logo"
					/>

					<p className="hero-subtitle">
						Record. Organize. Discover.
					</p>
					<div className="hero-stats">
						<div className="stat-card">
							<strong>📃{logs.length}</strong>
							<span>Logs</span>
						</div>

						<div className="stat-card">
							<strong>🏷️{tags.length}</strong>
							<span>Tags</span>
						</div>
					</div>
				</div>

				<div className="page-header">

					<button
						className="new-log-button button"
						onClick={() => {
							setEditingId(null);
							setTitle("");
							setContent("");
							setTagInput("");
							setShouldRenderForm(true);
							requestAnimationFrame(() => {
								setIsFormOpen(true);
								formRef.current?.scrollIntoView({
									behavior:"smooth",
									block:"start",
								});
							});
						}}
					>
						+ 新規作成
					</button>

				</div>

				{shouldRenderForm && (
				  <div
				    ref={formRef}
				    className={`log-form-container ${
				      isFormOpen ? "open" : "closed"
				    }`}
					onTransitionEnd={() => {
						if (!isFormOpen) {
							setShouldRenderForm(false);
						}
					}}
				  >
					<LogForm
					  title={title}
					  content={content}
					  tags={tagInput}
					  setTitle={setTitle}
					  setContent={setContent}
					  onSave={saveLog}
					  setTags={setTagInput}
					  isEditing={editingId !== null}
					  onCancel={cancelEdit}
					/>
				  </div>
				)}

				<TagList
				  tags={tags}
				  selectedTag={selectedTag}
				  onTagClick={handleTagClick}
				/>

				<div className="search-area">
					<div className="search-box">
					  <input
						className="input"
						placeholder="タイトル・本文・タグを検索..."
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
					  />

					  {(keyword) && (
						<button
						  className="clear-button"
						  onClick={() => {
							setKeyword("");
							fetchLogs();
						  }}
						>
						  ×
						</button>
					  )}
					</div>
				  <button 
					className="search-button button"
				    onClick={() => searchLogs(keyword, selectedTag)}>
					検索
				  </button>
				</div>

				<LogList
				  logs={logs}
				  onDelete={deleteLog}
				  onEdit={editLog}
				/>


			</div>
		);
}

export default App;
