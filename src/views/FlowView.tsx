import { priorityLabels } from '../data/constants';
import { getRiskScore, getSlaLabel } from '../services/riskService';
import type { AppealStatus, Cluster } from '../types/domain';

export function FlowView({
  clusters,
  updateClusterStatus,
}: {
  clusters: Cluster[];
  updateClusterStatus: (cluster: Cluster, status: AppealStatus) => void;
}) {
  const columns: Array<{ status: AppealStatus; title: string }> = [
    { status: 'new', title: 'Новые' },
    { status: 'routed', title: 'Назначено' },
    { status: 'in_progress', title: 'В работе' },
    { status: 'overdue', title: 'Просрочено' },
    { status: 'closed', title: 'Закрыто' },
  ];

  return (
    <section className="kanban-grid">
      {columns.map((column) => (
        <div className="kanban-column" key={column.status}>
          <div className="kanban-header">
            <strong>{column.title}</strong>
            <span>
              {clusters.filter((cluster) => cluster.appeals.some((appeal) => appeal.status === column.status)).length}
            </span>
          </div>
          {clusters
            .filter((cluster) => cluster.appeals.some((appeal) => appeal.status === column.status))
            .map((cluster) => (
              <article className="kanban-card" key={`${column.status}-${cluster.id}`}>
                <span className={`priority-pill ${cluster.priority}`}>{priorityLabels[cluster.priority]}</span>
                <strong>{cluster.title}</strong>
                <p>{cluster.department}</p>
                <div className="risk-line">
                  <span>Risk {getRiskScore(cluster)}/100</span>
                  <span>{getSlaLabel(cluster)}</span>
                </div>
                <div className="mini-actions">
                  <button onClick={() => updateClusterStatus(cluster, 'routed')}>Назначить</button>
                  <button onClick={() => updateClusterStatus(cluster, 'in_progress')}>В работу</button>
                  <button onClick={() => updateClusterStatus(cluster, 'closed')}>Закрыть</button>
                </div>
              </article>
            ))}
        </div>
      ))}
    </section>
  );
}
