import LogItem from "./LogItem";

type Log = {
  id: number;
  title: string;
  content: string;
};

type LogListProps = {
  logs: Log[];
  onDelete: (index: number) => void;
};

function LogList({ logs, onDelete }: LogListProps) {
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
		/>
	  ))
	  )}
    </>
  );
}

export default LogList;
