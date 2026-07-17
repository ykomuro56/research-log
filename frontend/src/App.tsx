import { API_BASE_URL } from "./config";
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

type SortOption =
  | "created-desc"
  | "created-asc"
  | "updated-desc"
  | "updated-asc"
  | "title-asc"
  | "title-desc";

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

	const [sortOption, setSortOption] = useState<SortOption>("created-desc");

	const formRef = useRef<HTMLDivElement>(null);

	const fetchLogs = () => {
	  fetch("/api/logs")
	    .then((response) => response.json())
	    .then((data) => {
	      setLogs(data);
	    });
	};

	const fetchTags = () => {
	  fetch("api/tags")
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

		fetch(`/api/logs/search?${params.toString()}`)
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
		`/api/logs/${id}`,
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
		fetch("/api/logs", {
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
		fetch(`${API_BASE_URL}/api/logs/${editingId}`, {
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
	const sortedLogs = [...logs].sort((a, b) => {
	  switch (sortOption) {
		case "created-desc":
		  return (
			new Date(b.createdAt).getTime() -
			new Date(a.createdAt).getTime()
		  );

		case "created-asc":
		  return (
			new Date(a.createdAt).getTime() -
			new Date(b.createdAt).getTime()
		  );

		case "updated-desc":
		  return (
			new Date(b.updatedAt).getTime() -
			new Date(a.updatedAt).getTime()
		  );

		case "updated-asc":
		  return (
			new Date(a.updatedAt).getTime() -
			new Date(b.updatedAt).getTime()
		  );

		case "title-asc":
		  return a.title.localeCompare(b.title, "ja");

		case "title-desc":
		  return b.title.localeCompare(a.title, "ja");

		default:
		  return 0;
	  }
	});
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
				<div className="sort-control">
				  <label htmlFor="log-sort">
					並べ替え
				  </label>

				  <select
					id="log-sort"
					value={sortOption}
					onChange={(event) =>
					  setSortOption(event.target.value as SortOption)
					}
				  >
					<option value="created-desc">
					  作成日が新しい順
					</option>

					<option value="created-asc">
					  作成日が古い順
					</option>

					<option value="updated-desc">
					  更新日が新しい順
					</option>

					<option value="updated-asc">
					  更新日が古い順
					</option>

					<option value="title-asc">
					  タイトル昇順
					</option>

					<option value="title-desc">
					  タイトル降順
					</option>
				  </select>
				</div>
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
				  logs={sortedLogs}
				  onDelete={deleteLog}
				  onEdit={editLog}
				/>


			</div>
		);
}

export default App;
