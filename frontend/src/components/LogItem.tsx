type Log = {
  title: string;
  content: string;
};

type LogItemProps = {
  log: Log;
  onDelete: () => void;
  onEdit: () => void;
};

function LogItem({ log, onDelete, onEdit }: LogItemProps) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        marginBottom: "12px",
        background: "white",
      }}
    >
      <h3>{log.title}</h3>
      <p>{log.content}</p>

      <button onClick={onDelete}>
        削除
      </button>
	  <button onClick={onEdit}>
	 　 編集
	  </button>

    </div>
  );
}

export default LogItem;
