import {
  BarChart3,
  ClipboardCheck,
  Columns3,
  Database,
  Eye,
  FileCheck2,
  GitBranch,
  LayoutDashboard,
  Lightbulb,
  Map,
  Network,
  Scale,
  ServerCog,
  SlidersHorizontal,
  TestTube2,
  TrendingUp,
  Upload,
  UserCheck,
  Workflow,
} from 'lucide-react';
import type { Category, Priority, Source, TabConfig } from '../types/domain';

export const categories: Category[] = ['ЖКХ', 'Дороги', 'Соцзащита', 'Образование', 'Земля', 'Здравоохранение'];
export const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
export const sources: Source[] = ['e-Өтініш API', 'Call-center', 'Сайт акимата', 'Telegram bot', 'CSV импорт'];

export const tabs: TabConfig[] = [
  { id: 'dashboard', label: 'Пульс', icon: LayoutDashboard },
  { id: 'ingest', label: 'Подключение', icon: Upload },
  { id: 'flow', label: 'Flow', icon: Columns3 },
  { id: 'lifecycle', label: 'Lifecycle', icon: Workflow },
  { id: 'executor', label: 'Исполнитель', icon: UserCheck },
  { id: 'cases', label: 'Кейсы', icon: GitBranch },
  { id: 'districts', label: 'Районы', icon: Map },
  { id: 'public', label: 'Гражданин', icon: Eye },
  { id: 'strategy', label: 'Strategy', icon: Lightbulb },
  { id: 'command', label: 'Штаб', icon: TrendingUp },
  { id: 'datahub', label: 'Data Hub', icon: ServerCog },
  { id: 'regulations', label: 'Регламенты', icon: Scale },
  { id: 'simulator', label: 'Симулятор', icon: SlidersHorizontal },
  { id: 'quality', label: 'Анти-отписка', icon: FileCheck2 },
  { id: 'tests', label: 'Тесты', icon: TestTube2 },
  { id: 'integrations', label: 'Архитектура', icon: Network },
];

export const departments: Record<Category, string> = {
  ЖКХ: 'Управление энергетики и ЖКХ',
  Дороги: 'Управление транспорта и дорожной инфраструктуры',
  Соцзащита: 'Управление занятости и социальной защиты',
  Образование: 'Управление образования',
  Земля: 'Управление земельных отношений',
  Здравоохранение: 'Управление общественного здравоохранения',
};

export const priorityLabels: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критичный',
};

export const priorityScore: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export const storageKey = 'qyzmet-pulse-appeals-v1';
