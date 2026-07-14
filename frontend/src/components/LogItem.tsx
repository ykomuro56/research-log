import { useState } from "react";
import { FiEdit2, FiMoreVertical, FiTrash2 } from "react-icons/fi"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./LogItem.css";

type Tag = {
  id: number;
  name: string;
};

type Log = {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
};

type LogItemProps = {
  log: Log;
  onDelete: () => void;
  onEdit: () => void;

  isOpen: boolean;
  onToggle: () => void;
};

function LogItem({ 
  log,
  onDelete,
  onEdit,
  isOpen,
  onToggle,
}: LogItemProps) {
  const formattedCreatedAt = new Date(log.createdAt).toLocaleString("ja-JP", {
  	year:"numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
  });
  const formattedUpdatedAt = new Date(log.updatedAt).toLocaleString("ja-JP", {
  	year:"numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
  });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
	<div className="log-item" onClick={onToggle}>
	  <div className="log-header">
		<h3>{log.title}</h3>

		<div className="log-tools">
		  <button
			className="icon-button"
			title="編集"
			onClick={(e) => {
			  e.stopPropagation();
			  onEdit();
			}}
		  >
			<FiEdit2 size={18} />
		  </button>

		  <button
			className="icon-button"
			title="詳細"
			onClick={(e) => {
			  e.stopPropagation();
			  setMenuOpen(!menuOpen);
			}}
		  >
		    <FiMoreVertical size={18} />
		  </button>

		  {menuOpen && (
		  	<div className="menu">
			  <button
			    onClick={(e) => {
				  e.stopPropagation();
				  onDelete();
				}}
			  >
			  	<FiTrash2 size={16} />
				<span>削除</span>
			  </button>
		    </div>
		  )}
		</div>
	  </div>

	  <div className="log-tags">
		{log.tags.map((tag) => (
		  <span
			key={tag.id}
			className="log-tag"
		  >
			🏷️ {tag.name}
		  </span>
		))}
	  </div>

	  <p
		className={
		  isOpen
			? "log-content markdown-content"
			: "log-content collapsed markdown-content"
		}
	  >
	    <ReactMarkdown remarkPlagins={[remarkGfm]}>
		  {log.content}
		</ReactMarkdown>
	  </p>

	  <div className="log-dates">
	    <span className="log-date">
		  作成: {formattedCreatedAt}
	    </span>

	    <span className="log-date">
		  更新: {formattedUpdatedAt}
	    </span>
	  </div>
	</div>
  )};
export default LogItem;
