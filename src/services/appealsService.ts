import type { Appeal, AppealStatus } from '../types/domain';

export function createAppealId(prefix: string, currentCount: number) {
  return `${prefix}-2026-${String(currentCount + 311).padStart(6, '0')}`;
}

export function dedupeAppeals(existing: Appeal[], incoming: Appeal[]) {
  const existingIds = new Set(existing.map((appeal) => appeal.id));
  return incoming.filter((appeal) => !existingIds.has(appeal.id));
}

export function updateAppealsStatus(appeals: Appeal[], ids: Set<string>, status: AppealStatus) {
  return appeals.map((appeal) => (ids.has(appeal.id) ? { ...appeal, status } : appeal));
}

export function parseAppealsCsv(csvText: string, currentCount: number): Appeal[] {
  return csvText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [district, address, category, priority, text] = line.split(';');

      return {
        id: `CSV-2026-${1200 + currentCount + index}`,
        source: 'CSV импорт',
        createdAt: '2026-09-21 12:15',
        district: district || 'Не указан',
        address: address || 'Адрес требует уточнения',
        category: category === 'Дороги' || category === 'Соцзащита' || category === 'Образование' || category === 'Земля' || category === 'Здравоохранение' ? category : 'ЖКХ',
        priority: priority === 'low' || priority === 'high' || priority === 'critical' ? priority : 'medium',
        text: text || 'Текст обращения требует уточнения',
        status: 'new',
      } satisfies Appeal;
    });
}
