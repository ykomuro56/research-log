type Log = {
  title: string;
  content: string;
};

type LogItemProps = {
  log: Log;
  onDelete: () => void;
};

function LogItem({ log, onDelete }: LogItemProps) {
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
    </div>
  );
}

export default LogItem;
