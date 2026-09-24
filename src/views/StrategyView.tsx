import { ClipboardCheck, Lightbulb } from 'lucide-react';
import { getRiskScore } from '../services/riskService';
import type { Cluster } from '../types/domain';

export type HiddenService = {
  title: string;
  evidence: string;
  department: string;
  effect: string;
};

export function StrategyView({
  hiddenServices,
  clusters,
}: {
  hiddenServices: HiddenService[];
  clusters: Cluster[];
}) {
  return (
    <section className="two-column-grid">
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Hidden services</span>
            <h2>Скрытые госуслуги</h2>
          </div>
          <Lightbulb size={20} />
        </div>
        <div className="strategy-list">
          {hiddenServices.map((service) => (
            <article className="strategy-card" key={service.title}>
              <strong>{service.title}</strong>
              <p>{service.evidence}</p>
              <div className="row-meta">
                <span>{service.department}</span>
                <span>Эффект: {service.effect}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Management brief</span>
            <h2>Рекомендации руководству</h2>
          </div>
          <ClipboardCheck size={20} />
        </div>
        <div className="recommendations">
          {clusters.slice(0, 4).map((cluster, index) => (
            <div className="action-row" key={cluster.id}>
              <span>{index + 1}</span>
              <p>
                По теме "{cluster.category}" в районе {cluster.district} открыть межотдельственный
                контроль: risk score {getRiskScore(cluster)}/100.
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
