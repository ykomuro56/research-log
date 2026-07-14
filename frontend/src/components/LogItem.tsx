import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiEdit2,
  FiMoreVertical,
  FiTrash2,
  FiX,
} from "react-icons/fi";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const formattedCreatedAt = new Date(log.createdAt).toLocaleString(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const formattedUpdatedAt = new Date(log.updatedAt).toLocaleString(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onToggle]);

  const handleCardClick = () => {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }

    onToggle();
  };

  const renderMarkdown = (className: string) => (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, href, title }) => (
            <a
              href={href}
			  title={title}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {children}
            </a>
          ),
        }}
      >
        {log.content}
      </ReactMarkdown>
    </div>
  );

  const renderTags = () => (
    <div className="log-tags">
      {log.tags.map((tag) => (
        <span key={tag.id} className="log-tag">
          🏷️ {tag.name}
        </span>
      ))}
    </div>
  );

  const renderDates = () => (
    <div className="log-dates">
      <span className="log-date">
        作成: {formattedCreatedAt}
      </span>

      <span className="log-date">
        更新: {formattedUpdatedAt}
      </span>
    </div>
  );

  return (
    <>
      <article
        className="log-item"
        onClick={handleCardClick}
      >
        <div className="log-header">
          <h3>{log.title}</h3>

          <div className="log-tools">
            <button
              type="button"
              className="icon-button"
              title="編集"
              aria-label="編集"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen(false);
                onEdit();
              }}
            >
              <FiEdit2 size={18} />
            </button>

            <button
              type="button"
              className="icon-button"
              title="メニュー"
              aria-label="メニュー"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((current) => !current);
              }}
            >
              <FiMoreVertical size={18} />
            </button>

            {menuOpen && (
              <div
                className="menu"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen(false);
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

        {renderTags()}

        {renderMarkdown(
          "log-content collapsed markdown-content"
        )}

        {renderDates()}
      </article>

      {isOpen &&
        createPortal(
          <div
            className="log-modal-overlay"
            onClick={onToggle}
          >
            <article
              className="log-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${log.title}の詳細`}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <button
                type="button"
                className="log-modal-close"
                title="閉じる"
                aria-label="閉じる"
                onClick={onToggle}
              >
                <FiX size={20} />
              </button>

              <div className="log-header log-modal-header">
                <h2>{log.title}</h2>
              </div>

              {renderTags()}

              {renderMarkdown(
                "log-content markdown-content"
              )}

              {renderDates()}
            </article>
          </div>,
          document.body
        )}
    </>
  );
}

export default LogItem;
