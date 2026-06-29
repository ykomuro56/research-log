import LogItem from "./LogItem";

type Log = {
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
      logs.map((log, index) => (
	  	<LogItem
		  key={index}
		  log={log}
		  onDelete={() => onDelete(index)}
		/>
	  ))
	  )}
    </>
  );
}

export default LogList;
