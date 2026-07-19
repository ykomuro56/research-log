import { apiRequest } from "./api";
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

	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const formRef = useRef<HTMLDivElement>(null);

	const fetchLogs = async () => {
	  setIsLoading(true);
	  setErrorMessage("");

	  try {
		const data = await apiRequest<Log[]>("/api/logs");
		setLogs(data);
	  } catch (error) {
		console.error(error);
		setErrorMessage("ログの取得に失敗しました。");
	  } finally {
		setIsLoading(false);
	  }
	};

	const fetchTags = async () => {
	  try {
		const data = await apiRequest<Tag[]>("/api/tags");
		setTags(data);
	  } catch (error) {
		console.error(error);
		setErrorMessage("タグの取得に失敗しました。");
	  }
	};

	const searchLogs = async (
	  searchWord: string,
	  tagName: string | null,
	) => {
	  const params = new URLSearchParams();

	  if (searchWord.trim()) {
		params.append("keyword", searchWord.trim());
	  }

	  if (tagName) {
		params.append("tag", tagName);
	  }

	  setIsLoading(true);
	  setErrorMessage("");

	  try {
		const data = await apiRequest<Log[]>(
		  `/api/logs/search?${params.toString()}`,
		);

		setLogs(data);
	  } catch (error) {
		console.error(error);
		setErrorMessage("ログの検索に失敗しました。");
	  } finally {
		setIsLoading(false);
	  }
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

	const deleteLog = async (id: number) => {
	  setErrorMessage("");

	  try {
		await apiRequest<void>(`/api/logs/${id}`, {
		  method: "DELETE",
		});

		await searchLogs(keyword, selectedTag);
		await fetchTags();
	  } catch (error) {
		console.error(error);
		setErrorMessage("ログの削除に失敗しました。");
	  }
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

	const saveLog = async () => {

	  if (isSaving) {
		return;
	  }

	  if (!title.trim() || !content.trim()) {
		setErrorMessage("タイトルと本文を入力してください。");
		return;
	  }

	  const isEditing = editingId !== null;

	  const path = isEditing
		? `/api/logs/${editingId}`
		: "/api/logs";

	  const method = isEditing ? "PUT" : "POST";

	  setErrorMessage("");
	  setIsSaving(true);

	  try {
		await apiRequest<Log>(path, {
		  method,
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			title: title.trim(),
			content: content.trim(),
			tags: tagInput,
		  }),
		});

		await searchLogs(keyword, selectedTag);
		await fetchTags();

		setTitle("");
		setContent("");
		setTagInput("");
		setEditingId(null);
		setIsFormOpen(false);
	  } catch (error) {
		console.error("保存処理でエラー", error);

		setErrorMessage(
		  isEditing
			? "ログの更新に失敗しました。"
			: "ログの作成に失敗しました。",
		);
	  } finally {
		console.log("保存処理終了");
		setIsSaving(false);
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
				  isSaving={isSaving}
				/>
			  </div>
			)}

			{errorMessage && (
              <div className="error-banner" role="alert">
                <span>{errorMessage}</span>

                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  aria-label="エラーメッセージを閉じる"
                >
                  ×
                </button>
              </div>
            )}

            {isLoading && (
              <p className="loading-message">ログを読み込んでいます...</p>
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
						searchLogs("", selectedTag);
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
