import LogItem from "./LogItem";

type Log = {
  id: number;
  title: string;
  content: string;
};

type LogListProps = {
  logs: Log[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

function LogList({ logs, onDelete, onEdit }: LogListProps) {
  return (
    <>
      <h2>記録一覧</h2>

      {logs.length === 0 ? (
        <p>まだ記録はありません。</p>
      ) : (
      logs.map((log) => (
	  	<LogItem
		  key={log.id}
		  log={log}
		  onDelete={() => onDelete(log.id)}
		  onEdit={() => onEdit(log.id)}
		/>
	  ))
	  )}
    </>
  );
}

export default LogList;
