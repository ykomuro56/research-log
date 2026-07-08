type Log = {
  title: string;
  content: string;
  createdAt: string;
};

type LogItemProps = {
  log: Log;
  onDelete: () => void;
  onEdit: () => void;
};

function LogItem({ log, onDelete, onEdit }: LogItemProps) {
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
      
	  <p
	    style={{
		  whiteSpace: "pre-wrap",
		  lineHeight: "1.6",
		}}
	  >
	    {log.content}
	  </p>

	  <p
	    style={{
		  color: "#666",
		  fontSize: "0.85rem",
		  margin: "4px 0",
		}}
	  >
	    📅 作成: {formattedCreatedAt}
	  </p>
	  <p
	    style={{
		  color: "#666",
		  fontSize: "0.85rem",
		  margin: "12px",
		}}
	  >
	    ✏️ 更新: {formattedUpdatedAt}
	  </p>


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
