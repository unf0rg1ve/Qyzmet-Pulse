import { Bell, UserCheck } from 'lucide-react';
import { priorityLabels } from '../data/constants';
import { getSlaLabel } from '../services/riskService';
import type { AppealStatus, Cluster } from '../types/domain';

export function ExecutorView({
  clusters,
  updateClusterStatus,
}: {
  clusters: Cluster[];
  updateClusterStatus: (cluster: Cluster, status: AppealStatus) => void;
}) {
  const activeTasks = clusters.filter((cluster) => cluster.priority === 'critical' || cluster.priority === 'high');

  return (
    <section className="two-column-grid executor-layout">
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Executor desk</span>
            <h2>Кабинет исполнителя</h2>
          </div>
          <UserCheck size={20} />
        </div>
        <div className="executor-list">
          {activeTasks.map((cluster) => (
            <article className="executor-card" key={cluster.id}>
              <div className="cluster-title">
                <span className={`priority-pill ${cluster.priority}`}>{priorityLabels[cluster.priority]}</span>
                <span>{getSlaLabel(cluster)}</span>
              </div>
              <strong>{cluster.title}</strong>
              <p>{cluster.assignee}</p>
              <div className="checklist">
                {cluster.recommendedActions.map((action) => (
                  <label key={action}>
                    <input type="checkbox" />
                    <span>{action}</span>
                  </label>
                ))}
              </div>
              <div className="mini-actions">
                <button onClick={() => updateClusterStatus(cluster, 'in_progress')}>Начать</button>
                <button onClick={() => updateClusterStatus(cluster, 'closed')}>Исполнено</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Citizen notifications</span>
            <h2>Уведомления гражданам</h2>
          </div>
          <Bell size={20} />
        </div>
        <div className="notification-list">
          {activeTasks.slice(0, 5).map((cluster) => (
            <article className="notification-card" key={cluster.id}>
              <strong>{cluster.category} · {cluster.district}</strong>
              <p>{cluster.citizenNotice}</p>
              <button>Отправить статус</button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
