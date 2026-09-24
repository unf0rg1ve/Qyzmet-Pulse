import type { LucideIcon } from 'lucide-react';

export type Category = 'ЖКХ' | 'Дороги' | 'Соцзащита' | 'Образование' | 'Земля' | 'Здравоохранение';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Source = 'e-Өтініш API' | 'Call-center' | 'Сайт акимата' | 'Telegram bot' | 'CSV импорт';
export type AppealStatus = 'new' | 'routed' | 'in_progress' | 'overdue' | 'closed';
export type Tab =
  | 'dashboard'
  | 'ingest'
  | 'flow'
  | 'lifecycle'
  | 'executor'
  | 'cases'
  | 'districts'
  | 'public'
  | 'strategy'
  | 'command'
  | 'datahub'
  | 'regulations'
  | 'simulator'
  | 'quality'
  | 'tests'
  | 'integrations';

export type Role = 'Аналитик' | 'Руководитель' | 'Исполнитель' | 'Гражданин';
export type UiLanguage = 'ru' | 'kk';

export type Appeal = {
  id: string;
  source: Source;
  createdAt: string;
  district: string;
  address: string;
  text: string;
  category: Category;
  priority: Priority;
  status: AppealStatus;
};

export type Cluster = {
  id: string;
  title: string;
  category: Category;
  district: string;
  count: number;
  priority: Priority;
  addresses: string[];
  appeals: Appeal[];
  department: string;
  deadlineHours: number;
  summary: string;
  recommendedActions: string[];
  completeness: string[];
  assignee: string;
  citizenNotice: string;
};

export type NewAppealForm = Omit<Appeal, 'id' | 'createdAt' | 'status'>;

export type QualityResult = {
  score: number;
  verdict: string;
  passed: string[];
  missing: string[];
  improvedAnswer: string;
};

export type Scenario = {
  id: string;
  title: string;
  description: string;
  appeals: Appeal[];
};

export type EventLogItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

export type TabConfig = {
  id: Tab;
  label: string;
  icon: LucideIcon;
};
