import { Database, ServerCog } from 'lucide-react';
import { sources } from '../data/constants';
import type { Appeal } from '../types/domain';

function buildIntegrationHealth(appeals: Appeal[]) {
  return sources.map((source, index) => {
    const count = appeals.filter((appeal) => appeal.source === source).length;
    const freshness = index === 0 ? '2 мин назад' : index === 1 ? '8 мин назад' : index === 2 ? 'онлайн' : '1 час назад';
    return {
      source,
      count,
      freshness,
      status: count > 0 ? 'online' : 'idle',
      quality: Math.min(94, 72 + count * 4),
    };
  });
}

export function DataHubView({ appeals }: { appeals: Appeal[] }) {
  const health = buildIntegrationHealth(appeals);
  const completeness = Math.round(
    (appeals.filter((appeal) => appeal.address && appeal.text.length > 30).length / Math.max(appeals.length, 1)) * 100,
  );

  return (
    <section className="two-column-grid">
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Data governance</span>
            <h2>Здоровье источников</h2>
          </div>
          <ServerCog size={20} />
        </div>
        <div className="integration-health-list">
          {health.map((item) => (
            <article className="integration-health-card" key={item.source}>
              <div className="cluster-title">
                <strong>{item.source}</strong>
                <span>{item.status}</span>
              </div>
              <p>{item.count} обращ. · последнее событие: {item.freshness}</p>
              <div className="load-bar">
                <span style={{ width: `${item.quality}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Data quality</span>
            <h2>Качество данных</h2>
          </div>
          <Database size={20} />
        </div>
        <div className="resource-card dark">
          <span>Completeness score</span>
          <strong>{completeness}%</strong>
          <p>Доля обращений, где достаточно текста и адреса для маршрутизации без ручной проверки.</p>
        </div>
        <div className="recommendations">
          {['Дедупликация externalId', 'Нормализация адресов', 'Удаление персональных данных', 'Проверка полноты вложений'].map(
            (item, index) => (
              <div className="action-row" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ),
          )}
        </div>
      </section>
    </section>
  );
}
