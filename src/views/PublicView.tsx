import { Bell } from 'lucide-react';
import { InfoBlock } from '../components/InfoBlock';
import { getSlaLabel } from '../services/riskService';
import type { Cluster, UiLanguage } from '../types/domain';

export function PublicView({ cluster, uiLanguage }: { cluster: Cluster; uiLanguage: UiLanguage }) {
  const isKk = uiLanguage === 'kk';
  const title = isKk ? 'Қоғамдық мәртебе картасы' : 'Публичная карточка без персональных данных';
  const copy = isKk
    ? 'Тұрғындардың өтініштері бір кейске біріктірілді. Жауапты бөлім анықталды, орындау мерзімі жүйеде бақыланады.'
    : 'Обращения жителей объединены в единый кейс. Ответственный отдел уже определен, срок исполнения контролируется системой.';
  const notice = isKk
    ? `Сіздің өтінішіңіз ${cluster.district} ауданындағы "${cluster.category}" тақырыбы бойынша ұқсас өтініштермен біріктірілді.`
    : cluster.citizenNotice;

  return (
    <section className="public-wrap">
      <article className="public-card">
        <span className="section-kicker">{title}</span>
        <h2>{cluster.title}</h2>
        <p>{copy}</p>
        <div className="public-notice">
          <Bell size={18} />
          <p>{notice}</p>
        </div>
        <div className="public-status-grid">
          <InfoBlock label="Статус" value="В работе" />
          <InfoBlock label="Ответственный орган" value={cluster.department} />
          <InfoBlock label="Плановый срок" value={getSlaLabel(cluster)} />
          <InfoBlock label="Обращений объединено" value={cluster.count.toString()} />
        </div>
        <div className="public-timeline">
          {['Обращения получены', 'Проблема объединена', 'Назначен отдел', 'Ожидается исполнение'].map(
            (item, index) => (
              <div className="timeline-step" key={item}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ),
          )}
        </div>
      </article>
    </section>
  );
}
