import "./LogList.css"
import LogItem from "./LogItem";
import { useState } from "react";

type Log = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

type LogListProps = {
  logs: Log[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

function LogList({ logs, onDelete, onEdit }: LogListProps) {
  
  const [openedLogId, setOpenedLogId] = useState<number | null>(null);

  return (
    <>
      <h2>記録一覧</h2>
		<div className="log-list">
		  {logs.length === 0 ? (
			<p>まだ記録はありません。</p>
		  ) : (
		  logs.map((log) => (
			<LogItem
			  key={log.id}
			  log={log}
			  onDelete={() => onDelete(log.id)}
			  onEdit={() => onEdit(log.id)}
			  isOpen={openedLogId ===log.id}
			  onToggle={() =>
			  	setOpenedLogId(
					openedLogId === log.id ? null : log.id
				)
			  }
			/>
		  ))
	  	  )}
		</div>
    </>
  );
}

export default LogList;
