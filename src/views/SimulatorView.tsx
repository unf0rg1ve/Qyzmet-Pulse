import { SlidersHorizontal } from 'lucide-react';
import { InfoBlock } from '../components/InfoBlock';
import type { Cluster } from '../types/domain';
import { estimateResponseCost, getRiskScore } from '../services/riskService';

function simulatePolicy(clusters: Cluster[], mode: 'baseline' | 'extraTeam' | 'autoNotify') {
  const totalRisk = clusters.reduce((sum, cluster) => sum + getRiskScore(cluster), 0);
  const totalCost = clusters.reduce((sum, cluster) => sum + estimateResponseCost(cluster), 0);
  if (mode === 'extraTeam') {
    return {
      title: 'Добавить мобильную бригаду',
      riskDrop: Math.round(totalRisk * 0.28),
      cost: Math.round(totalCost * 1.18),
      slaGain: '−32% просрочек',
    };
  }
  if (mode === 'autoNotify') {
    return {
      title: 'Автоуведомления граждан',
      riskDrop: Math.round(totalRisk * 0.14),
      cost: Math.round(totalCost * 1.04),
      slaGain: '−18% повторных обращений',
    };
  }
  return {
    title: 'Базовый процесс',
    riskDrop: 0,
    cost: totalCost,
    slaGain: 'без изменений',
  };
}

export function SimulatorView({ clusters }: { clusters: Cluster[] }) {
  const variants = [
    simulatePolicy(clusters, 'baseline'),
    simulatePolicy(clusters, 'extraTeam'),
    simulatePolicy(clusters, 'autoNotify'),
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Policy simulator</span>
          <h2>Симулятор решений</h2>
        </div>
        <SlidersHorizontal size={20} />
      </div>
      <div className="simulation-grid">
        {variants.map((variant) => (
          <article className="simulation-card" key={variant.title}>
            <strong>{variant.title}</strong>
            <div className="simulation-metrics">
              <InfoBlock label="Снижение риска" value={`${variant.riskDrop} балл.`} />
              <InfoBlock label="Оценка затрат" value={`${variant.cost.toLocaleString('ru-RU')} ₸`} />
              <InfoBlock label="SLA эффект" value={variant.slaGain} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
