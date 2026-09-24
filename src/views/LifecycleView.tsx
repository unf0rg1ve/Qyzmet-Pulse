import { Workflow } from 'lucide-react';
import { InfoBlock } from '../components/InfoBlock';
import { getRiskScore, getSlaLabel } from '../services/riskService';
import type { Cluster, Role } from '../types/domain';

export function LifecycleView({ cluster, role }: { cluster: Cluster; role: Role }) {
  const steps = [
    ['Поступление', 'Источник принял обращение и присвоил externalId'],
    ['Обогащение', 'Система извлекла район, адрес, тему, риск и похожие обращения'],
    ['Кластер', 'Похожие обращения объединены в единый управленческий кейс'],
    ['Маршрут', `Назначен отдел: ${cluster.department}`],
    ['Исполнение', `Исполнитель: ${cluster.assignee}, SLA: ${getSlaLabel(cluster)}`],
    ['Публичный статус', 'Гражданин видит обезличенный статус и срок решения'],
  ];

  return (
    <section className="panel lifecycle-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Case lifecycle</span>
          <h2>Жизненный цикл кейса</h2>
        </div>
        <Workflow size={20} />
      </div>
      <div className="role-summary">
        <InfoBlock label="Текущая роль" value={role} />
        <InfoBlock label="Кейс" value={cluster.category} />
        <InfoBlock label="Risk score" value={`${getRiskScore(cluster)}/100`} />
        <InfoBlock label="SLA" value={getSlaLabel(cluster)} />
      </div>
      <div className="lifecycle-timeline">
        {steps.map(([title, copy], index) => (
          <article className="lifecycle-step" key={title}>
            <span>{index + 1}</span>
            <div>
              <strong>{title}</strong>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
