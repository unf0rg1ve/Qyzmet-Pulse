import { Network } from 'lucide-react';
import { apiContract } from '../lib/apiContract';

export function IntegrationsView() {
  const steps = [
    ['Источники', 'e-Өтініш, CRM call-center, сайт акимата, Telegram bot, CSV/Excel'],
    ['Адаптеры', 'Webhook, REST API, пакетный импорт, дедупликация externalId'],
    ['Ядро', 'Классификация, кластеризация, риск-скоринг, SLA, маршрутизация'],
    ['Выход', 'Кейсы, поручения, дашборд, уведомления, контроль качества ответа'],
  ];

  return (
    <section className="panel architecture-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Integration architecture</span>
          <h2>Как подключаются реальные обращения</h2>
        </div>
        <Network size={21} />
      </div>
      <div className="architecture-flow">
        {steps.map(([title, copy], index) => (
          <article className="architecture-step" key={title}>
            <span>{index + 1}</span>
            <strong>{title}</strong>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <pre className="api-snippet">{`${apiContract.ingestAppeal.method} ${apiContract.ingestAppeal.path}
{
  "source": "eotinish",
  "externalId": "EO-2026-000184",
  "district": "Есиль",
  "address": "пр. Кабанбай Батыра 48",
  "text": "Во дворе не работает освещение...",
  "attachments": []
}`}</pre>
    </section>
  );
}
