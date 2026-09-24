import { TrendingUp, WalletCards } from 'lucide-react';
import type { Cluster } from '../types/domain';
import { estimateResponseCost, getRiskScore } from '../services/riskService';

function buildForecast(clusters: Cluster[]) {
  return clusters.slice(0, 6).map((cluster, index) => {
    const current = cluster.count;
    const growth = Math.max(12, getRiskScore(cluster) - 45 + index * 3);
    const predicted = Math.ceil(current * (1 + growth / 100));
    return {
      id: cluster.id,
      title: cluster.title,
      category: cluster.category,
      district: cluster.district,
      current,
      predicted,
      growth,
    };
  });
}

export function CommandCenterView({ clusters }: { clusters: Cluster[] }) {
  const forecast = buildForecast(clusters);
  const totalCost = clusters.reduce((sum, cluster) => sum + estimateResponseCost(cluster), 0);
  const escalation = clusters.filter((cluster) => getRiskScore(cluster) >= 75);

  return (
    <section className="command-grid">
      <section className="panel command-main">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Predictive command center</span>
            <h2>Прогноз нагрузки на 7 дней</h2>
          </div>
          <TrendingUp size={20} />
        </div>
        <div className="forecast-list">
          {forecast.map((item) => (
            <article className="forecast-row" key={item.id}>
              <div className="forecast-heading">
                <strong>{item.category} · {item.district}</strong>
                <span>+{item.growth}%</span>
              </div>
              <p>{item.title}</p>
              <div className="forecast-bars">
                <div>
                  <span>Сейчас: {item.current}</span>
                  <div className="load-bar">
                    <span style={{ width: `${Math.min(item.current * 14, 100)}%` }} />
                  </div>
                </div>
                <div>
                  <span>Прогноз: {item.predicted}</span>
                  <div className="load-bar forecast">
                    <span style={{ width: `${Math.min(item.predicted * 14, 100)}%` }} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Resource planning</span>
            <h2>Ресурсы и эскалации</h2>
          </div>
          <WalletCards size={20} />
        </div>
        <div className="resource-card dark">
          <span>Оценка реагирования</span>
          <strong>{totalCost.toLocaleString('ru-RU')} ₸</strong>
          <p>Черновая оценка затрат на первичную обработку и выездные работы по текущим кейсам.</p>
        </div>
        <div className="escalation-list">
          {escalation.map((cluster) => (
            <article className="escalation-card" key={cluster.id}>
              <span className={`priority-pill ${cluster.priority}`}>{getRiskScore(cluster)}/100</span>
              <strong>{cluster.title}</strong>
              <p>Эскалировать: зам. акима / руководитель {cluster.department}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
