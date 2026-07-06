type LogFormProps = {
  title: string;
  content: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  onSave: () => void;
};

function LogForm({
  title,
  content,
  setTitle,
  setContent,
  onSave,
}: LogFormProps) {
  return (
    <>
      <h2>新しい記録</h2>

      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
        }}
      />

      <textarea
        placeholder="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
        }}
      />

      <br />

      <button
	    onClick={() => {
		  onSave();
		}}
	  >
        保存
      </button>
    </>
  );
}

export default LogForm;
