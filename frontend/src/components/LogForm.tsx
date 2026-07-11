import "./LogForm.css";
import "./../common.css";
import { FiLink } from "react-icons/fi";

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
  isOpen,
}: LogFormProps) {
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
                disabled
                title="Bold（今後実装）"
              >
                B
              </button>

              <button
                type="button"
                className="toolbar-button"
                disabled
                title="Italic（今後実装）"
              >
                I
              </button>

              <button
                type="button"
                className="toolbar-button"
                title="リンク追加（今後実装）"
              >
                <FiLink />
              </button>

              <button
                type="button"
                className="toolbar-button"
                disabled
                title="Code Block（今後実装）"
              >
                {"</>"}
              </button>

              <button
                type="button"
                className="toolbar-button"
                disabled
                title="List（今後実装）"
              >
                •
              </button>

            </div>

            <textarea
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
