import { Scale } from 'lucide-react';
import { InfoBlock } from '../components/InfoBlock';
import { priorityScore } from '../data/constants';
import type { Category, Cluster } from '../types/domain';

function buildRegulationMatches(clusters: Cluster[]) {
  const rules: Record<Category, { rule: string; sla: string; evidence: string }> = {
    ЖКХ: {
      rule: 'Регламент реагирования на коммунальные аварии и наружное освещение',
      sla: '24-72 ч',
      evidence: 'безопасность жителей, двор, школа, переход',
    },
    Дороги: {
      rule: 'Регламент обследования дорожной инфраструктуры',
      sla: '72 ч',
      evidence: 'риск ДТП, остановка, дорожное покрытие',
    },
    Соцзащита: {
      rule: 'Регламент рассмотрения мер социальной поддержки',
      sla: '5 раб. дней',
      evidence: 'повторный отказ, справка, пособие',
    },
    Образование: {
      rule: 'Регламент обращений по организациям образования',
      sla: '5 раб. дней',
      evidence: 'перегрузка классов, школьная инфраструктура',
    },
    Земля: {
      rule: 'Регламент земельных отношений',
      sla: '10 раб. дней',
      evidence: 'участок, право, кадастр',
    },
    Здравоохранение: {
      rule: 'Регламент обращений по медицинской доступности',
      sla: '3 раб. дня',
      evidence: 'очередь, поликлиника, медпомощь',
    },
  };

  return clusters.slice(0, 7).map((cluster) => ({
    cluster,
    ...rules[cluster.category],
    confidence: Math.min(98, 70 + cluster.count * 6 + priorityScore[cluster.priority] * 4),
  }));
}

export function RegulationsView({ clusters }: { clusters: Cluster[] }) {
  const matches = buildRegulationMatches(clusters);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Regulation engine</span>
          <h2>Сопоставление с регламентами</h2>
        </div>
        <Scale size={20} />
      </div>
      <div className="regulation-grid">
        {matches.map((match) => (
          <article className="regulation-card" key={match.cluster.id}>
            <span className={`priority-pill ${match.cluster.priority}`}>{match.confidence}% match</span>
            <strong>{match.rule}</strong>
            <p>{match.cluster.title}</p>
            <div className="detail-grid">
              <InfoBlock label="SLA по регламенту" value={match.sla} />
              <InfoBlock label="Основания" value={match.evidence} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
