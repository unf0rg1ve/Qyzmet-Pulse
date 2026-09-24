export const apiContract = {
  ingestAppeal: {
    method: 'POST',
    path: '/api/appeals/ingest',
    description: 'Принимает обращение из e-Өтініш, CRM, сайта, Telegram или пакетного импорта.',
    bodyExample: {
      source: 'eotinish',
      externalId: 'EO-2026-000184',
      district: 'Есиль',
      address: 'пр. Кабанбай Батыра 48',
      text: 'Во дворе не работает освещение...',
      attachments: [],
    },
  },
  clusters: {
    method: 'GET',
    path: '/api/clusters',
    description: 'Возвращает обнаруженные массовые проблемы, risk score, SLA и ответственный отдел.',
  },
  caseStatus: {
    method: 'PATCH',
    path: '/api/cases/:id/status',
    description: 'Меняет статус кейса и пишет действие в audit trail.',
  },
  publicCase: {
    method: 'GET',
    path: '/api/public/cases/:id',
    description: 'Возвращает обезличенную публичную карточку проблемы для граждан.',
  },
};
