import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ResultList({
  title,
  items,
  positive = false,
}: {
  title: string;
  items: string[];
  positive?: boolean;
}) {
  return (
    <div className="result-list">
      <h3>{title}</h3>
      {items.length ? (
        items.map((item) => (
          <div className={`quality-item ${positive ? 'positive' : ''}`} key={item}>
            {positive ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{item}</span>
          </div>
        ))
      ) : (
        <p className="muted-copy">Нет замечаний</p>
      )}
    </div>
  );
}
