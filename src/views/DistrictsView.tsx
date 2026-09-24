import { Flame, Map } from 'lucide-react';
import { priorityLabels } from '../data/constants';
import type { Category, Cluster } from '../types/domain';

export type DistrictStat = {
  district: string;
  total: number;
  critical: number;
  categories: Category[];
  risk: number;
};

export function DistrictsView({ stats, clusters }: { stats: DistrictStat[]; clusters: Cluster[] }) {
  return (
    <section className="two-column-grid districts-layout">
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">District heatmap</span>
            <h2>Карта районных рисков</h2>
          </div>
          <Map size={20} />
        </div>
        <div className="district-list">
          {stats.map((item) => (
            <article className="district-row" key={item.district}>
              <div className="district-top">
                <strong>{item.district}</strong>
                <span>{item.risk}/100</span>
              </div>
              <div className="load-bar district-bar">
                <span style={{ width: `${Math.max(item.risk, 8)}%` }} />
              </div>
              <p>
                {item.total} обращ., {item.critical} риск., темы: {item.categories.join(', ')}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Local priorities</span>
            <h2>Топ районных кейсов</h2>
          </div>
          <Flame size={20} />
        </div>
        <div className="cluster-list">
          {clusters.slice(0, 6).map((cluster) => (
            <article className="appeal-row" key={cluster.id}>
              <div className="cluster-title">
                <span className={`priority-pill ${cluster.priority}`}>{priorityLabels[cluster.priority]}</span>
                <span>{cluster.district}</span>
              </div>
              <p>{cluster.title}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
