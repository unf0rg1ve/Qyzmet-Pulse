import type { Appeal, Cluster } from '../types/domain';
import { getRiskScore } from './riskService';

export function buildOperationalReport(appeals: Appeal[], clusters: Cluster[]) {
  const critical = appeals.filter((appeal) => appeal.priority === 'critical').length;
  const overdue = appeals.filter((appeal) => appeal.status === 'overdue').length;
  const closed = appeals.filter((appeal) => appeal.status === 'closed').length;
  const topClusters = clusters.slice(0, 5);

  return [
    'Qyzmet OS: оперативная сводка',
    'Дата: 2026-09-21',
    '',
    `Всего обращений: ${appeals.length}`,
    `Массовых проблем: ${clusters.length}`,
    `Критичных обращений: ${critical}`,
    `Просрочено: ${overdue}`,
    `Закрыто: ${closed}`,
    '',
    'Топ проблем:',
    ...topClusters.map(
      (cluster, index) =>
        `${index + 1}. ${cluster.title} | ${cluster.count} обращ. | risk ${getRiskScore(cluster)}/100 | ${cluster.department}`,
    ),
    '',
    'Рекомендация:',
    'Открыть единые кейсы по массовым проблемам, назначить ответственные отделы и контролировать SLA через Qyzmet OS.',
  ].join('\n');
}

export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
