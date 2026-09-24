import { CheckCircle2, ClipboardCheck, Clock, RotateCcw, TestTube2 } from 'lucide-react';
import { seedAppeals } from '../data/demoData';
import type { Appeal, Cluster, Scenario } from '../types/domain';

export function TestsView({
  scenarios,
  runScenario,
  resetDemo,
  appeals,
  clusters,
}: {
  scenarios: Scenario[];
  runScenario: (scenario: Scenario) => void;
  resetDemo: () => void;
  appeals: Appeal[];
  clusters: Cluster[];
}) {
  const checklist = [
    {
      title: 'Ingestion',
      done: appeals.length > seedAppeals.length,
      copy: 'Добавьте обращение вручную, CSV или сценарием. Счетчик обращений должен вырасти.',
    },
    {
      title: 'Кластеризация',
      done: clusters.some((cluster) => cluster.count >= 4),
      copy: 'Запустите сценарий освещения. Система должна усилить существующий кластер.',
    },
    {
      title: 'Маршрутизация',
      done: appeals.some((appeal) => appeal.status === 'closed'),
      copy: 'Откройте кейс и нажмите "Закрыть". KPI закрытых обращений должен обновиться.',
    },
    {
      title: 'Anti-Otpiska',
      done: false,
      copy: 'На вкладке "Анти-отписка" проверьте плохой и хороший ответ, сравните score.',
    },
  ];

  return (
    <section className="two-column-grid">
      <section className="panel tests-panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">Demo сценарии</span>
            <h2>Быстрые проверки</h2>
          </div>
          <TestTube2 size={19} />
        </div>
        <div className="scenario-list">
          {scenarios.map((scenario) => (
            <article className="scenario-card" key={scenario.id}>
              <div>
                <strong>{scenario.title}</strong>
                <p>{scenario.description}</p>
              </div>
              <button onClick={() => runScenario(scenario)}>Запустить</button>
            </article>
          ))}
        </div>
        <button className="secondary-control" onClick={resetDemo}>
          <RotateCcw size={17} />
          Вернуть чистое демо
        </button>
      </section>

      <section className="panel tests-panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">QA checklist</span>
            <h2>Что показать жюри</h2>
          </div>
          <ClipboardCheck size={19} />
        </div>
        <div className="qa-list">
          {checklist.map((item) => (
            <article className="qa-item" key={item.title}>
              {item.done ? <CheckCircle2 size={18} /> : <Clock size={18} />}
              <div>
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
