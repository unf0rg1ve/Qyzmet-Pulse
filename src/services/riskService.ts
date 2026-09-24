import type { Category, Cluster } from '../types/domain';
import { priorityScore } from '../data/constants';

export function getRiskScore(cluster: Cluster) {
  const priorityBase = priorityScore[cluster.priority] * 18;
  const volume = Math.min(cluster.count * 8, 28);
  const socialRisk = /дет|школ|опас|авар|переход|пособ|отказ/i.test(
    cluster.appeals.map((appeal) => appeal.text).join(' '),
  )
    ? 18
    : 6;
  const slaRisk = cluster.deadlineHours <= 24 ? 12 : cluster.deadlineHours <= 72 ? 8 : 4;
  return Math.min(priorityBase + volume + socialRisk + slaRisk, 100);
}

export function getSlaLabel(cluster: Cluster) {
  const score = getRiskScore(cluster);
  if (score >= 85) return 'Осталось 6 ч';
  if (score >= 70) return 'Осталось 18 ч';
  if (score >= 50) return 'Осталось 2 дня';
  return 'Осталось 5 дней';
}

export function estimateResponseCost(cluster: Cluster) {
  const base: Record<Category, number> = {
    ЖКХ: 180000,
    Дороги: 420000,
    Соцзащита: 60000,
    Образование: 250000,
    Земля: 90000,
    Здравоохранение: 300000,
  };
  return base[cluster.category] + cluster.count * 35000 + getRiskScore(cluster) * 1200;
}
