import "./LogForm.css";
import "./../common.css";
import { FiLink, FiItalic } from "react-icons/fi";
import { useRef } from "react";

type LogFormProps = {
  title: string;
  content: string;
  tags: string;

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTags: (tags: string) => void;

  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
};

function LogForm({
  title,
  content,
  tags,
  setTitle,
  setContent,
  setTags,
  isEditing,
  onCancel,
  onSave,
//  isOpen,
}: LogFormProps) {
  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertLink = () => {
    const textarea = contentTextAreaRef.current;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const selectedText = content.slice(selectionStart, selectionEnd);

    const url = window.prompt("リンク先のURLを入力してください");

    if (url === null) {
      return;
    }

    const trimmedUrl = url.trim();

    if (trimmedUrl === "") {
      return;
    }

    const linkText = selectedText || "リンク名";
    const markdownLink = `[${linkText}](${trimmedUrl})`;

    const newContent =
      content.slice(0, selectionStart) +
      markdownLink +
      content.slice(selectionEnd);

    setContent(newContent);

    const newCursorPosition = selectionStart + markdownLink.length;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        newCursorPosition,
        newCursorPosition
      );
    });
  };
  const wrapSelectedText = (
    before: string,
    after: string,
    placeholder: string
  ) => {
    const textarea = contentTextAreaRef.current;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = content.slice(selectionStart, selectionEnd);

    const insertedText =
      before + (selectedText || placeholder) + after;

    const newContent =
      content.slice(0, selectionStart) +
      insertedText +
      content.slice(selectionEnd);

    setContent(newContent);

    requestAnimationFrame(() => {
      textarea.focus();

      if (selectedText) {
        const cursorPosition =
          selectionStart + insertedText.length;

        textarea.setSelectionRange(
          cursorPosition,
          cursorPosition
        );
      } else {
        const placeholderStart =
          selectionStart + before.length;

        const placeholderEnd =
          placeholderStart + placeholder.length;

        textarea.setSelectionRange(
          placeholderStart,
          placeholderEnd
        );
      }
    });
  };
  const handleInsertCodeBlock = () => {
    const textarea = contentTextAreaRef.current;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = content.slice(selectionStart, selectionEnd);

    const code = selectedText || "コードを入力";
    const codeBlock = `\n\`\`\`\n${code}\n\`\`\`\n`;

    const newContent =
      content.slice(0, selectionStart) +
      codeBlock +
      content.slice(selectionEnd);

    setContent(newContent);

    requestAnimationFrame(() => {
      textarea.focus();

      if (selectedText) {
        const cursorPosition = selectionStart + codeBlock.length;

        textarea.setSelectionRange(
          cursorPosition,
          cursorPosition
        );
      } else {
        const placeholderStart =
          selectionStart + "\n```\n".length;

        const placeholderEnd =
          placeholderStart + "コードを入力".length;

        textarea.setSelectionRange(
          placeholderStart,
          placeholderEnd
        );
      }
    });
  };
  const handleInsertList = () => {
    const textarea = contentTextAreaRef.current;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = content.slice(selectionStart, selectionEnd);

    const listText = selectedText
      ? selectedText
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n")
      : "- リスト項目";

    const newContent =
      content.slice(0, selectionStart) +
      listText +
      content.slice(selectionEnd);

    setContent(newContent);

    requestAnimationFrame(() => {
      textarea.focus();

      if (selectedText) {
        const cursorPosition = selectionStart + listText.length;

        textarea.setSelectionRange(
          cursorPosition,
          cursorPosition
        );
      } else {
        const placeholderStart = selectionStart + "- ".length;
        const placeholderEnd =
          placeholderStart + "リスト項目".length;

        textarea.setSelectionRange(
          placeholderStart,
          placeholderEnd
        );
      }
    });
  };
  return (
//    if(!isOpen) return null;
    <div className="editor-card">

      <div className="editor-header">
        <h2>
          {isEditing ? "✏ Editing Log" : "📝 New Research Log"}
        </h2>
      </div>

      <div className="editor-body">

        <div className="form-group">
          <label>タイトル</label>

          <input
            className="log-input"
            type="text"
            placeholder="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>コンテンツ</label>

          <div className="editor">

            <div className="editor-toolbar">

              <button
                type="button"
                className="toolbar-button"
                title="太字"
                onClick={() => wrapSelectedText("**", "**", "太字")}
              >
                <strong>B</strong>
              </button>

              <button
                type="button"
                className="toolbar-button"
                title="斜体"
                onClick={() => wrapSelectedText("*", "*", "斜体")}
              >
                <FiItalic />
              </button>

              <button
                type="button"
                className="toolbar-button"
                title="リンクを追加"
                onClick={handleInsertLink}
              >
                <FiLink />
              </button>

              <button
                type="button"
                className="toolbar-button"
                title="コードブロック"
                aria-label="コードブロック"
                onClick={handleInsertCodeBlock}
              >
                {"</>"}
              </button>

              <button
                type="button"
                className="toolbar-button"
                title="箇条書き"
                aria-label="箇条書き"
                onClick={handleInsertList}
              >
                •
              </button>

			  <button
                type="button"
                className="toolbar-button"
                title="インラインコード"
                aria-label="インラインコード"
                onClick={() => wrapSelectedText("`", "`", "コード")}
              >
                {"<>"}
              </button>

            </div>

            <textarea
			  ref={contentTextAreaRef}
              className="log-textarea"
              placeholder="研究内容を記録..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
            />

          </div>

        </div>

        <div className="form-group">
          <label>タグ</label>

          <input
            className="log-input"
            type="text"
            placeholder="解析、データ取得、エラー処理..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="form-actions">

          <button
            className="cancel-button button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="save-button button"
            onClick={onSave}
          >
            {isEditing ? "更新" : "保存"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default LogForm;
