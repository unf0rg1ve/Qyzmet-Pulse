import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Database,
  FileCheck2,
  FileUp,
  Flame,
  GitBranch,
  LayoutDashboard,
  MapPin,
  Network,
  Pause,
  Play,
  Plus,
  Route,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Upload,
  RotateCcw,
  TestTube2,
  Download,
  Activity,
  Columns3,
  Map,
  Eye,
  Lightbulb,
  UserCheck,
  Bell,
  Filter,
  TrendingUp,
  WalletCards,
  ServerCog,
  Scale,
  SlidersHorizontal,
  Languages,
  Workflow,
  LockKeyhole,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FormRow } from './components/FormRow';
import { InfoBlock } from './components/InfoBlock';
import { MetricCard } from './components/MetricCard';
import { ResultList } from './components/ResultList';
import { IntegrationsView } from './views/IntegrationsView';
import { SecurityView } from './views/SecurityView';
import { QualityView } from './views/QualityView';
import { SimulatorView } from './views/SimulatorView';
import { DataHubView } from './views/DataHubView';
import { RegulationsView } from './views/RegulationsView';
import { CommandCenterView } from './views/CommandCenterView';
import { LifecycleView } from './views/LifecycleView';
import { PublicView } from './views/PublicView';
import { FlowView } from './views/FlowView';
import { ExecutorView } from './views/ExecutorView';
import { DistrictsView } from './views/DistrictsView';
import { StrategyView } from './views/StrategyView';
import { TestsView } from './views/TestsView';

type Category = 'ЖКХ' | 'Дороги' | 'Соцзащита' | 'Образование' | 'Земля' | 'Здравоохранение';
type Priority = 'low' | 'medium' | 'high' | 'critical';
type Source = 'e-Өтініш API' | 'Call-center' | 'Сайт акимата' | 'Telegram bot' | 'CSV импорт';
type AppealStatus = 'new' | 'routed' | 'in_progress' | 'overdue' | 'closed';
type Tab =
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
  | 'security'
  | 'quality'
  | 'tests'
  | 'integrations';

type Appeal = {
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

type Cluster = {
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

type NewAppealForm = Omit<Appeal, 'id' | 'createdAt' | 'status'>;

type QualityResult = {
  score: number;
  verdict: string;
  passed: string[];
  missing: string[];
  improvedAnswer: string;
};

type Scenario = {
  id: string;
  title: string;
  description: string;
  appeals: Appeal[];
};

type EventLogItem = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

type Role = 'Аналитик' | 'Руководитель' | 'Исполнитель' | 'Гражданин';
type UiLanguage = 'ru' | 'kk';

const seedAppeals: Appeal[] = [
  {
    id: 'EO-2026-000184',
    source: 'e-Өтініш API',
    createdAt: '2026-09-21 09:15',
    district: 'Есиль',
    address: 'пр. Кабанбай Батыра 48',
    category: 'ЖКХ',
    priority: 'high',
    status: 'new',
    text: 'Во дворе ЖК уже две недели не работает уличное освещение. Дети возвращаются со школы в темноте, несколько раз обращались в КСК.',
  },
  {
    id: 'EO-2026-000201',
    source: 'Call-center',
    createdAt: '2026-09-21 09:42',
    district: 'Есиль',
    address: 'пр. Кабанбай Батыра 50',
    category: 'ЖКХ',
    priority: 'high',
    status: 'routed',
    text: 'Не горят фонари возле дома и детской площадки. Просим направить ответственную службу, опасно вечером.',
  },
  {
    id: 'TG-2026-000034',
    source: 'Telegram bot',
    createdAt: '2026-09-21 10:06',
    district: 'Есиль',
    address: 'пр. Кабанбай Батыра 46',
    category: 'ЖКХ',
    priority: 'critical',
    status: 'new',
    text: 'Темный двор возле школы, освещение отсутствует третий день подряд. Родители жалуются, дети идут по проезжей части.',
  },
  {
    id: 'AK-2026-000077',
    source: 'Сайт акимата',
    createdAt: '2026-09-21 10:20',
    district: 'Алматы',
    address: 'ул. Жумабаева 18',
    category: 'Дороги',
    priority: 'medium',
    status: 'in_progress',
    text: 'После ремонта остались глубокие ямы. Машины объезжают через двор, нужна проверка качества дорожных работ.',
  },
  {
    id: 'CSV-2026-001102',
    source: 'CSV импорт',
    createdAt: '2026-09-21 10:34',
    district: 'Алматы',
    address: 'ул. Жумабаева 22',
    category: 'Дороги',
    priority: 'medium',
    status: 'new',
    text: 'Разбитая дорога между домами, после дождя невозможно пройти. Нужен ямочный ремонт.',
  },
  {
    id: 'EO-2026-000244',
    source: 'e-Өтініш API',
    createdAt: '2026-09-21 10:47',
    district: 'Сарыарка',
    address: 'ЦОН Сарыарка',
    category: 'Соцзащита',
    priority: 'medium',
    status: 'overdue',
    text: 'Отказали в пособии из-за отсутствия справки, хотя справка была приложена. Прошу проверить документы и причину отказа.',
  },
  {
    id: 'EO-2026-000251',
    source: 'Call-center',
    createdAt: '2026-09-21 11:10',
    district: 'Сарыарка',
    address: 'ЦОН Сарыарка',
    category: 'Соцзащита',
    priority: 'medium',
    status: 'new',
    text: 'Несколько раз подаю на пособие, система требует одну и ту же справку. Нужна консультация и проверка статуса.',
  },
  {
    id: 'AK-2026-000089',
    source: 'Сайт акимата',
    createdAt: '2026-09-21 11:26',
    district: 'Байконур',
    address: 'школа №37',
    category: 'Образование',
    priority: 'high',
    status: 'routed',
    text: 'В школе переполнены классы, родители просят открыть дополнительный класс и проверить нагрузку учителей.',
  },
];

const incomingAppeals: Appeal[] = [
  {
    id: 'TG-2026-000041',
    source: 'Telegram bot',
    createdAt: '2026-09-21 11:38',
    district: 'Есиль',
    address: 'пр. Кабанбай Батыра 52',
    category: 'ЖКХ',
    priority: 'critical',
    status: 'new',
    text: 'Снова нет освещения возле пешеходного перехода. Просим срочно устранить, вечером опасно переходить дорогу.',
  },
  {
    id: 'EO-2026-000276',
    source: 'e-Өтініш API',
    createdAt: '2026-09-21 11:44',
    district: 'Алматы',
    address: 'ул. Жумабаева 20',
    category: 'Дороги',
    priority: 'high',
    status: 'new',
    text: 'На Жумабаева большая яма возле остановки, автобусы резко объезжают, есть риск аварии.',
  },
  {
    id: 'CSV-2026-001118',
    source: 'CSV импорт',
    createdAt: '2026-09-21 11:52',
    district: 'Сарыарка',
    address: 'ЦОН Сарыарка',
    category: 'Соцзащита',
    priority: 'medium',
    status: 'new',
    text: 'Граждане повторно жалуются на отказы по пособиям из-за справок, требуется сверка с внутренней базой.',
  },
];

const demoScenarios: Scenario[] = [
  {
    id: 'lighting-safety',
    title: 'Массовая проблема освещения',
    description: 'Показывает, как 4 обращения с разных каналов превращаются в один критичный кейс ЖКХ.',
    appeals: [
      {
        id: 'SC-LIGHT-001',
        source: 'Telegram bot',
        createdAt: '2026-09-21 12:21',
        district: 'Есиль',
        address: 'пр. Кабанбай Батыра 56',
        category: 'ЖКХ',
        priority: 'critical',
        status: 'new',
        text: 'Возле школы не работает освещение, дети переходят дорогу в темноте. Просим срочно направить службу.',
      },
      {
        id: 'SC-LIGHT-002',
        source: 'Call-center',
        createdAt: '2026-09-21 12:23',
        district: 'Есиль',
        address: 'пр. Кабанбай Батыра 58',
        category: 'ЖКХ',
        priority: 'high',
        status: 'new',
        text: 'Фонари не горят третий вечер подряд, рядом пешеходный переход и остановка.',
      },
    ],
  },
  {
    id: 'benefit-rejects',
    title: 'Повторные отказы по пособиям',
    description: 'Демонстрирует скрытую системную ошибку: граждане получают одинаковый отказ по справкам.',
    appeals: [
      {
        id: 'SC-BENEFIT-001',
        source: 'e-Өтініш API',
        createdAt: '2026-09-21 12:30',
        district: 'Сарыарка',
        address: 'ЦОН Сарыарка',
        category: 'Соцзащита',
        priority: 'medium',
        status: 'new',
        text: 'Снова отказали в пособии из-за справки, которая уже есть в базе. Прошу проверить интеграцию.',
      },
      {
        id: 'SC-BENEFIT-002',
        source: 'CSV импорт',
        createdAt: '2026-09-21 12:32',
        district: 'Сарыарка',
        address: 'ЦОН Сарыарка',
        category: 'Соцзащита',
        priority: 'medium',
        status: 'new',
        text: 'Одинаковые жалобы по отказам в пособиях. Требуется единое разъяснение для фронт-офиса.',
      },
    ],
  },
  {
    id: 'road-risk',
    title: 'Дорожный риск у остановки',
    description: 'Усиливает дорожный кластер и показывает рост приоритета из-за угрозы безопасности.',
    appeals: [
      {
        id: 'SC-ROAD-001',
        source: 'Сайт акимата',
        createdAt: '2026-09-21 12:40',
        district: 'Алматы',
        address: 'ул. Жумабаева 26',
        category: 'Дороги',
        priority: 'high',
        status: 'new',
        text: 'Большая яма возле остановки, машины резко перестраиваются. Нужен срочный акт обследования.',
      },
    ],
  },
];

const demoCsv = `Есиль;пр. Кабанбай Батыра 54;ЖКХ;critical;Не работает освещение у школы, вечером опасно детям
Алматы;ул. Жумабаева 24;Дороги;high;Яма на дороге возле остановки, автобусы выезжают на встречную полосу
Сарыарка;ЦОН Сарыарка;Соцзащита;medium;Повторный отказ в пособии из-за справки, которую заявитель уже приложил`;

const tabs: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
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
  { id: 'security', label: 'Безопасность', icon: LockKeyhole },
  { id: 'quality', label: 'Анти-отписка', icon: FileCheck2 },
  { id: 'tests', label: 'Тесты', icon: TestTube2 },
  { id: 'integrations', label: 'Архитектура', icon: Network },
];

const categories: Category[] = ['ЖКХ', 'Дороги', 'Соцзащита', 'Образование', 'Земля', 'Здравоохранение'];
const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];
const sources: Source[] = ['e-Өтініш API', 'Call-center', 'Сайт акимата', 'Telegram bot', 'CSV импорт'];

const departments: Record<Category, string> = {
  ЖКХ: 'Управление энергетики и ЖКХ',
  Дороги: 'Управление транспорта и дорожной инфраструктуры',
  Соцзащита: 'Управление занятости и социальной защиты',
  Образование: 'Управление образования',
  Земля: 'Управление земельных отношений',
  Здравоохранение: 'Управление общественного здравоохранения',
};

const priorityLabels: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критичный',
};

const statusLabels: Record<AppealStatus, string> = {
  new: 'Новое',
  routed: 'Назначено',
  in_progress: 'В работе',
  overdue: 'Просрочено',
  closed: 'Закрыто',
};

const priorityScore: Record<Priority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const storageKey = 'qyzmet-pulse-appeals-v1';

function loadStoredAppeals() {
  if (typeof window === 'undefined') return seedAppeals;
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return seedAppeals;
    const parsed = JSON.parse(saved) as Appeal[];
    return Array.isArray(parsed) && parsed.length ? parsed : seedAppeals;
  } catch {
    return seedAppeals;
  }
}

function buildClusters(appeals: Appeal[]): Cluster[] {
  const grouped = appeals.reduce<Record<string, Appeal[]>>((acc, appeal) => {
    const localityKey = appeal.address.split(' ').slice(0, 3).join(' ').toLowerCase();
    const key = `${appeal.category}-${appeal.district}-${localityKey}`;
    acc[key] = [...(acc[key] ?? []), appeal];
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([id, items]) => {
      const first = items[0];
      const topPriority = items.reduce(
        (max, item) => (priorityScore[item.priority] > priorityScore[max] ? item.priority : max),
        first.priority,
      );
      const addresses = Array.from(new Set(items.map((item) => item.address)));

      return {
        id,
        title: getClusterTitle(first.category, addresses[0]),
        category: first.category,
        district: first.district,
        count: items.length,
        priority: topPriority,
        addresses,
        appeals: items,
        department: departments[first.category],
        deadlineHours: topPriority === 'critical' ? 24 : topPriority === 'high' ? 72 : 120,
        summary: getSummary(first.category, first.district, items.length),
        recommendedActions: getActions(first.category, topPriority),
        completeness: getCompleteness(items),
        assignee: getAssignee(first.category, first.district),
        citizenNotice: getCitizenNotice(first.category, first.district, items.length),
      };
    })
    .sort((a, b) => priorityScore[b.priority] - priorityScore[a.priority] || b.count - a.count);
}

function getClusterTitle(category: Category, address: string) {
  if (category === 'ЖКХ') return `Проблема освещения: ${address}`;
  if (category === 'Дороги') return `Повторные жалобы на дорожное покрытие: ${address}`;
  if (category === 'Соцзащита') return `Повторные отказы по пособиям: ${address}`;
  if (category === 'Образование') return `Перегрузка учебной инфраструктуры: ${address}`;
  return `Массовое обращение: ${address}`;
}

function getSummary(category: Category, district: string, count: number) {
  return `${count} обращ. в районе ${district}. Система обнаружила повторяемость по теме "${category}" и рекомендует открыть единый кейс вместо разрозненной обработки.`;
}

function getActions(category: Category, priority: Priority) {
  const urgent = priority === 'critical' || priority === 'high';
  if (category === 'ЖКХ') {
    return [
      'Назначить ответственную аварийную службу',
      'Проверить балансодержателя наружного освещения',
      urgent ? 'Поставить контроль исполнения до конца суток' : 'Запланировать выездную проверку',
    ];
  }
  if (category === 'Дороги') {
    return [
      'Сформировать акт обследования участка',
      'Проверить гарантийные обязательства подрядчика',
      'Передать кейс в дорожный отдел с фотофиксацией',
    ];
  }
  if (category === 'Соцзащита') {
    return [
      'Проверить причину повторных отказов',
      'Сверить наличие справок во внутренней системе',
      'Подготовить единое разъяснение для фронт-офиса ЦОН',
    ];
  }
  return ['Назначить исполнителя', 'Проверить полноту данных', 'Подготовить план ответа заявителям'];
}

function getAssignee(category: Category, district: string) {
  const initials: Record<Category, string> = {
    ЖКХ: 'Айдана С.',
    Дороги: 'Мурат К.',
    Соцзащита: 'Динара Т.',
    Образование: 'Ерлан Н.',
    Земля: 'Сауле М.',
    Здравоохранение: 'Арман Б.',
  };
  return `${initials[category]} · ${district}`;
}

function getCitizenNotice(category: Category, district: string, count: number) {
  return `Ваше обращение объединено с ${count} похожими обращениями по теме "${category}" в районе ${district}. По кейсу назначен ответственный отдел, статус будет обновляться публично без персональных данных.`;
}

function getCompleteness(items: Appeal[]) {
  const sample = items.map((item) => item.text.toLowerCase()).join(' ');
  const missing = [];
  if (!items.some((item) => item.address.length > 4)) missing.push('адрес');
  if (!sample.includes('фото')) missing.push('фотофиксация');
  if (!sample.includes('номер') && !sample.includes('кск') && !sample.includes('цон')) {
    missing.push('контактная организация');
  }
  return missing.length ? missing : ['данных достаточно для маршрутизации'];
}

function analyzeQuality(answer: string): QualityResult {
  const normalized = answer.toLowerCase();
  const checks = [
    { label: 'Есть конкретный срок', ok: /до|срок|дней|час|суток|[0-9]/.test(normalized) },
    { label: 'Названо ответственное действие', ok: /провер|направ|устран|назнач|выезд|акт/.test(normalized) },
    { label: 'Есть понятный следующий шаг', ok: /просим|необходимо|будет|следует|рекомендуем/.test(normalized) },
    { label: 'Ответ не выглядит как формальная отписка', ok: !/принято к сведению|будет рассмотрено в установленном порядке/.test(normalized) },
  ];
  const passed = checks.filter((check) => check.ok).map((check) => check.label);
  const missing = checks.filter((check) => !check.ok).map((check) => check.label);
  const score = Math.round((passed.length / checks.length) * 100);

  return {
    score,
    verdict:
      score >= 75
        ? 'Ответ можно отправлять после проверки фактов.'
        : 'Высокий риск повторной жалобы: ответу не хватает конкретики.',
    passed,
    missing,
    improvedAnswer:
      'По вашему обращению будет проведена проверка указанного адреса ответственным отделом. До 24 сентября будет назначен исполнитель, выполнена выездная проверка и направлен ответ с конкретным сроком устранения. При необходимости заявителю дополнительно запросят фото или номер предыдущего обращения.',
  };
}

function buildDepartmentLoad(clusters: Cluster[]) {
  const load = clusters.reduce<Record<string, { department: string; count: number; critical: number }>>(
    (acc, cluster) => {
      acc[cluster.department] ??= { department: cluster.department, count: 0, critical: 0 };
      acc[cluster.department].count += cluster.count;
      if (cluster.priority === 'critical' || cluster.priority === 'high') {
        acc[cluster.department].critical += 1;
      }
      return acc;
    },
    {},
  );

  return Object.values(load).sort((a, b) => b.count - a.count);
}

function getRiskScore(cluster: Cluster) {
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

function getSlaLabel(cluster: Cluster) {
  const score = getRiskScore(cluster);
  if (score >= 85) return 'Осталось 6 ч';
  if (score >= 70) return 'Осталось 18 ч';
  if (score >= 50) return 'Осталось 2 дня';
  return 'Осталось 5 дней';
}

function buildDistrictStats(appeals: Appeal[]) {
  const stats = appeals.reduce<Record<string, { district: string; total: number; critical: number; categories: Set<Category> }>>(
    (acc, appeal) => {
      acc[appeal.district] ??= {
        district: appeal.district,
        total: 0,
        critical: 0,
        categories: new Set<Category>(),
      };
      acc[appeal.district].total += 1;
      acc[appeal.district].categories.add(appeal.category);
      if (appeal.priority === 'critical' || appeal.priority === 'high') acc[appeal.district].critical += 1;
      return acc;
    },
    {},
  );

  return Object.values(stats)
    .map((item) => ({
      district: item.district,
      total: item.total,
      critical: item.critical,
      categories: Array.from(item.categories),
      risk: Math.min(item.critical * 22 + item.total * 6, 100),
    }))
    .sort((a, b) => b.risk - a.risk);
}

function buildHiddenServices(clusters: Cluster[]) {
  return clusters
    .filter((cluster) => cluster.count >= 2)
    .map((cluster) => ({
      title:
        cluster.category === 'Соцзащита'
          ? 'Цифровой сценарий проверки отказов по пособиям'
          : cluster.category === 'ЖКХ'
            ? 'Единый сервис массовых заявок по освещению'
            : `Цифровой сценарий: ${cluster.category}`,
      evidence: `${cluster.count} похожих обращ. в районе ${cluster.district}`,
      department: cluster.department,
      effect: cluster.count >= 4 ? 'Высокий' : 'Средний',
    }));
}

function buildForecast(clusters: Cluster[]) {
  return clusters.slice(0, 6).map((cluster, index) => {
    const current = cluster.count;
    const growth = Math.max(12, getRiskScore(cluster) - 45 + index * 3);
    const predicted = Math.ceil(current * (1 + growth / 100));
    return {
      id: cluster.id,
      title: cluster.title,
      category: cluster.category,
      district: cluster.district,
      current,
      predicted,
      growth,
      risk: getRiskScore(cluster),
    };
  });
}

function estimateResponseCost(cluster: Cluster) {
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

function buildIntegrationHealth(appeals: Appeal[]) {
  return sources.map((source, index) => {
    const count = appeals.filter((appeal) => appeal.source === source).length;
    const freshness = index === 0 ? '2 мин назад' : index === 1 ? '8 мин назад' : index === 2 ? 'онлайн' : '1 час назад';
    return {
      source,
      count,
      freshness,
      status: count > 0 ? 'online' : 'idle',
      quality: Math.min(94, 72 + count * 4),
    };
  });
}

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

function simulatePolicy(clusters: Cluster[], mode: 'baseline' | 'extraTeam' | 'autoNotify') {
  const totalRisk = clusters.reduce((sum, cluster) => sum + getRiskScore(cluster), 0);
  const totalCost = clusters.reduce((sum, cluster) => sum + estimateResponseCost(cluster), 0);
  if (mode === 'extraTeam') {
    return {
      title: 'Добавить мобильную бригаду',
      riskDrop: Math.round(totalRisk * 0.28),
      cost: Math.round(totalCost * 1.18),
      slaGain: '−32% просрочек',
    };
  }
  if (mode === 'autoNotify') {
    return {
      title: 'Автоуведомления граждан',
      riskDrop: Math.round(totalRisk * 0.14),
      cost: Math.round(totalCost * 1.04),
      slaGain: '−18% повторных обращений',
    };
  }
  return {
    title: 'Базовый процесс',
    riskDrop: 0,
    cost: totalCost,
    slaGain: 'без изменений',
  };
}

function buildReport(appeals: Appeal[], clusters: Cluster[]) {
  const critical = appeals.filter((appeal) => appeal.priority === 'critical').length;
  const overdue = appeals.filter((appeal) => appeal.status === 'overdue').length;
  const closed = appeals.filter((appeal) => appeal.status === 'closed').length;
  const topClusters = clusters.slice(0, 5);

  return [
    'Qyzmet Pulse: оперативная сводка',
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
        `${index + 1}. ${cluster.title} | ${cluster.count} обращ. | ${cluster.department} | SLA ${cluster.deadlineHours} ч`,
    ),
    '',
    'Рекомендация:',
    'Открыть единые кейсы по массовым проблемам, назначить ответственные отделы и контролировать SLA через Qyzmet Pulse.',
  ].join('\n');
}

function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function App() {
  const [appeals, setAppeals] = useState(loadStoredAppeals);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [role, setRole] = useState<Role>('Аналитик');
  const [uiLanguage, setUiLanguage] = useState<UiLanguage>('ru');
  const [query, setQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('Все районы');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'Все категории'>('Все категории');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [streamIndex, setStreamIndex] = useState(0);
  const [csvText, setCsvText] = useState(demoCsv);
  const [draftAnswer, setDraftAnswer] = useState(
    'Ваше обращение принято к сведению и будет рассмотрено в установленном порядке.',
  );
  const [qualityResult, setQualityResult] = useState<QualityResult | null>(null);
  const [eventLog, setEventLog] = useState<EventLogItem[]>([
    {
      id: 'event-001',
      time: '12:00',
      title: 'Система запущена',
      detail: 'Загружены демо-обращения и построены первичные кластеры.',
    },
  ]);
  const [newAppeal, setNewAppeal] = useState<NewAppealForm>({
    district: 'Есиль',
    address: 'пр. Кабанбай Батыра 48',
    category: 'ЖКХ',
    priority: 'high',
    source: 'Сайт акимата',
    text: 'Жители повторно сообщают о неработающем освещении во дворе. Просим объединить обращения и дать общий срок устранения.',
  });

  const clusters = useMemo(() => buildClusters(appeals), [appeals]);
  const selectedCluster = clusters.find((cluster) => cluster.id === selectedClusterId) ?? clusters[0];
  const filteredAppeals = appeals.filter((appeal) => {
    const normalized = `${appeal.text} ${appeal.address} ${appeal.category} ${appeal.district}`.toLowerCase();
    const matchesSearch = normalized.includes(query.toLowerCase());
    const matchesDistrict = districtFilter === 'Все районы' || appeal.district === districtFilter;
    const matchesCategory = categoryFilter === 'Все категории' || appeal.category === categoryFilter;
    return matchesSearch && matchesDistrict && matchesCategory;
  });
  const districts = useMemo(
    () => ['Все районы', ...Array.from(new Set(appeals.map((appeal) => appeal.district)))],
    [appeals],
  );
  const criticalCount = appeals.filter((appeal) => appeal.priority === 'critical').length;
  const overdueCount = appeals.filter((appeal) => appeal.status === 'overdue').length;
  const closedCount = appeals.filter((appeal) => appeal.status === 'closed').length;
  const departmentLoad = useMemo(() => buildDepartmentLoad(clusters), [clusters]);
  const districtStats = useMemo(() => buildDistrictStats(appeals), [appeals]);
  const hiddenServices = useMemo(() => buildHiddenServices(clusters), [clusters]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(appeals));
  }, [appeals]);

  function ingestAppeal(appeal: Appeal) {
    setAppeals((current) => {
      if (current.some((item) => item.id === appeal.id)) return current;
      return [appeal, ...current];
    });
    addEvent('Новое обращение', `${appeal.source}: ${appeal.category}, ${appeal.district}`);
  }

  function addEvent(title: string, detail: string) {
    setEventLog((current) => [
      {
        id: `event-${Date.now()}`,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        title,
        detail,
      },
      ...current.slice(0, 7),
    ]);
  }

  function addNextAppeal() {
    const next = incomingAppeals[streamIndex % incomingAppeals.length];
    ingestAppeal(next);
    setStreamIndex((current) => current + 1);
  }

  function submitManualAppeal(event: FormEvent) {
    event.preventDefault();
    if (!newAppeal.text.trim() || !newAppeal.address.trim()) return;

    ingestAppeal({
      ...newAppeal,
      id: `API-2026-${appeals.length + 311}`,
      createdAt: '2026-09-21 12:15',
      status: 'new',
    });
    setActiveTab('dashboard');
  }

  function importCsv() {
    const parsed = csvText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [district, address, category, priority, text] = line.split(';');
        return {
          id: `CSV-2026-${1200 + appeals.length + index}`,
          source: 'CSV импорт' as Source,
          createdAt: '2026-09-21 12:15',
          district: district || 'Не указан',
          address: address || 'Адрес требует уточнения',
          category: categories.includes(category as Category) ? (category as Category) : 'ЖКХ',
          priority: priorities.includes(priority as Priority) ? (priority as Priority) : 'medium',
          text: text || 'Текст обращения требует уточнения',
          status: 'new' as AppealStatus,
        };
      });

    setAppeals((current) => [...parsed, ...current]);
    addEvent('CSV импорт', `Добавлено обращений: ${parsed.length}`);
    setActiveTab('dashboard');
  }

  function updateClusterStatus(cluster: Cluster, status: AppealStatus) {
    const ids = new Set(cluster.appeals.map((appeal) => appeal.id));
    setAppeals((current) =>
      current.map((appeal) => (ids.has(appeal.id) ? { ...appeal, status } : appeal)),
    );
    addEvent('Статус кейса изменен', `${cluster.title}: ${statusLabels[status]}`);
  }

  function runScenario(scenario: Scenario) {
    setAppeals((current) => {
      const existingIds = new Set(current.map((appeal) => appeal.id));
      const fresh = scenario.appeals.filter((appeal) => !existingIds.has(appeal.id));
      return [...fresh, ...current];
    });
    addEvent('Демо-сценарий', scenario.title);
    setActiveTab('dashboard');
  }

  function resetDemo() {
    setAppeals(seedAppeals);
    setStreamIndex(0);
    setSelectedClusterId(null);
    setQualityResult(null);
    setEventLog([
      {
        id: 'event-reset',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        title: 'Демо сброшено',
        detail: 'Данные возвращены к стартовому набору.',
      },
    ]);
    setActiveTab('dashboard');
  }

  function exportReport() {
    downloadTextFile('qyzmet-pulse-report.txt', buildReport(appeals, clusters));
    addEvent('Отчет экспортирован', 'Сформирована оперативная сводка TXT.');
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <div className="eyebrow">
            <Sparkles size={16} />
            GovTech analytics MVP
          </div>
          <h1>Qyzmet Pulse</h1>
          <p>
            Система агрегирует обращения граждан, выявляет массовые проблемы и превращает поток
            жалоб в управляемые кейсы для акимата.
          </p>
        </div>
        <div className="hero-actions">
          <button className="secondary-button" onClick={resetDemo}>
            <RotateCcw size={18} />
            Сбросить демо
          </button>
          <button className="secondary-button" onClick={exportReport}>
            <Download size={18} />
            Экспорт
          </button>
          <button className="secondary-button" onClick={() => setActiveTab('ingest')}>
            <Plus size={18} />
            Добавить данные
          </button>
          <button className="primary-button" onClick={addNextAppeal}>
            {streamIndex >= incomingAppeals.length ? <Pause size={18} /> : <Play size={18} />}
            Запустить поток
          </button>
        </div>
      </header>

      <nav className="module-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button className={activeTab === id ? 'active' : ''} key={id} onClick={() => setActiveTab(id)}>
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <section className="role-switcher">
        <div>
          <UserCheck size={18} />
          <strong>Роль</strong>
        </div>
        {(['Аналитик', 'Руководитель', 'Исполнитель', 'Гражданин'] as Role[]).map((item) => (
          <button className={role === item ? 'active' : ''} key={item} onClick={() => setRole(item)}>
            {item}
          </button>
        ))}
        <div className="language-toggle">
          <Languages size={17} />
          <button className={uiLanguage === 'ru' ? 'active' : ''} onClick={() => setUiLanguage('ru')}>
            RU
          </button>
          <button className={uiLanguage === 'kk' ? 'active' : ''} onClick={() => setUiLanguage('kk')}>
            KK
          </button>
        </div>
      </section>

      <section className="source-strip">
        {[
          ['e-Өтініш API', Database],
          ['Call-center CRM', ShieldAlert],
          ['Telegram bot', Route],
          ['CSV / Excel', FileUp],
        ].map(([label, Icon]) => (
          <div className="source-item" key={label as string}>
            <Icon size={18} />
            <span>{label as string}</span>
          </div>
        ))}
      </section>

      <section className="metrics-grid extended">
        <MetricCard icon={Database} label="Всего обращений" value={appeals.length.toString()} />
        <MetricCard icon={Flame} label="Массовых проблем" value={clusters.length.toString()} />
        <MetricCard icon={AlertTriangle} label="Критичных" value={criticalCount.toString()} />
        <MetricCard icon={Clock} label="Просрочено" value={overdueCount.toString()} />
        <MetricCard icon={CheckCircle2} label="Закрыто" value={closedCount.toString()} />
      </section>

      {activeTab === 'dashboard' && (
        <DashboardView
          appeals={filteredAppeals}
          clusters={clusters}
          query={query}
          selectedCluster={selectedCluster}
          setQuery={setQuery}
          setSelectedClusterId={setSelectedClusterId}
          updateClusterStatus={updateClusterStatus}
          departmentLoad={departmentLoad}
          eventLog={eventLog}
          districts={districts}
          districtFilter={districtFilter}
          categoryFilter={categoryFilter}
          setDistrictFilter={setDistrictFilter}
          setCategoryFilter={setCategoryFilter}
        />
      )}

      {activeTab === 'ingest' && (
        <IngestView
          csvText={csvText}
          newAppeal={newAppeal}
          setCsvText={setCsvText}
          setNewAppeal={setNewAppeal}
          submitManualAppeal={submitManualAppeal}
          importCsv={importCsv}
        />
      )}

      {activeTab === 'flow' && (
        <FlowView clusters={clusters} updateClusterStatus={updateClusterStatus} />
      )}

      {activeTab === 'lifecycle' && <LifecycleView cluster={selectedCluster} role={role} />}

      {activeTab === 'executor' && (
        <ExecutorView clusters={clusters} updateClusterStatus={updateClusterStatus} />
      )}

      {activeTab === 'cases' && (
        <CasesView
          clusters={clusters}
          selectedCluster={selectedCluster}
          setSelectedClusterId={setSelectedClusterId}
          updateClusterStatus={updateClusterStatus}
        />
      )}

      {activeTab === 'districts' && <DistrictsView stats={districtStats} clusters={clusters} />}

      {activeTab === 'public' && <PublicView cluster={selectedCluster} uiLanguage={uiLanguage} />}

      {activeTab === 'strategy' && (
        <StrategyView hiddenServices={hiddenServices} clusters={clusters} />
      )}

      {activeTab === 'command' && <CommandCenterView clusters={clusters} />}

      {activeTab === 'datahub' && <DataHubView appeals={appeals} />}

      {activeTab === 'regulations' && <RegulationsView clusters={clusters} />}

      {activeTab === 'simulator' && <SimulatorView clusters={clusters} />}

      {activeTab === 'security' && <SecurityView />}

      {activeTab === 'quality' && (
        <QualityView
          draftAnswer={draftAnswer}
          qualityResult={qualityResult}
          setDraftAnswer={setDraftAnswer}
          runCheck={() => setQualityResult(analyzeQuality(draftAnswer))}
        />
      )}

      {activeTab === 'tests' && (
        <TestsView
          scenarios={demoScenarios}
          runScenario={runScenario}
          resetDemo={resetDemo}
          appeals={appeals}
          clusters={clusters}
        />
      )}

      {activeTab === 'integrations' && <IntegrationsView />}
    </main>
  );
}

function DashboardView({
  appeals,
  clusters,
  query,
  selectedCluster,
  setQuery,
  setSelectedClusterId,
  updateClusterStatus,
  departmentLoad,
  eventLog,
  districts,
  districtFilter,
  categoryFilter,
  setDistrictFilter,
  setCategoryFilter,
}: {
  appeals: Appeal[];
  clusters: Cluster[];
  query: string;
  selectedCluster: Cluster;
  setQuery: (query: string) => void;
  setSelectedClusterId: (id: string) => void;
  updateClusterStatus: (cluster: Cluster, status: AppealStatus) => void;
  departmentLoad: Array<{ department: string; count: number; critical: number }>;
  eventLog: EventLogItem[];
  districts: string[];
  districtFilter: string;
  categoryFilter: Category | 'Все категории';
  setDistrictFilter: (district: string) => void;
  setCategoryFilter: (category: Category | 'Все категории') => void;
}) {
  return (
    <>
      <FilterPanel
        districts={districts}
        districtFilter={districtFilter}
        categoryFilter={categoryFilter}
        setDistrictFilter={setDistrictFilter}
        setCategoryFilter={setCategoryFilter}
      />
      <section className="insight-grid">
        <TrendPanel clusters={clusters} />
        <DepartmentLoadPanel load={departmentLoad} />
      </section>
      <section className="insight-grid secondary-insights">
        <ImpactPanel appeals={appeals} clusters={clusters} />
        <EventLogPanel events={eventLog} />
      </section>
      <section className="workspace-grid">
        <AppealsPanel appeals={appeals} query={query} setQuery={setQuery} />
        <ClustersPanel clusters={clusters} selectedCluster={selectedCluster} setSelectedClusterId={setSelectedClusterId} />
        <DetailPanel cluster={selectedCluster} updateClusterStatus={updateClusterStatus} />
      </section>
    </>
  );
}

function AppealsPanel({
  appeals,
  query,
  setQuery,
}: {
  appeals: Appeal[];
  query: string;
  setQuery: (query: string) => void;
}) {
  return (
    <aside className="panel appeals-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Входящий поток</span>
          <h2>Обращения</h2>
        </div>
        <Search size={18} />
      </div>
      <input
        className="search-input"
        placeholder="Поиск по району, теме, адресу"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="appeals-list">
        {appeals.map((appeal) => (
          <article className="appeal-row" key={appeal.id}>
            <div className="row-top">
              <span className={`priority-dot ${appeal.priority}`} />
              <strong>{appeal.id}</strong>
              <span>{appeal.source}</span>
            </div>
            <p>{appeal.text}</p>
            <div className="row-meta">
              <span>{appeal.category}</span>
              <span>{appeal.district}</span>
              <span>{statusLabels[appeal.status]}</span>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

function FilterPanel({
  districts,
  districtFilter,
  categoryFilter,
  setDistrictFilter,
  setCategoryFilter,
}: {
  districts: string[];
  districtFilter: string;
  categoryFilter: Category | 'Все категории';
  setDistrictFilter: (district: string) => void;
  setCategoryFilter: (category: Category | 'Все категории') => void;
}) {
  return (
    <section className="filter-panel">
      <div>
        <Filter size={18} />
        <strong>Фильтры оперативного штаба</strong>
      </div>
      <select value={districtFilter} onChange={(event) => setDistrictFilter(event.target.value)}>
        {districts.map((district) => (
          <option key={district}>{district}</option>
        ))}
      </select>
      <select
        value={categoryFilter}
        onChange={(event) => setCategoryFilter(event.target.value as Category | 'Все категории')}
      >
        <option>Все категории</option>
        {categories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
    </section>
  );
}

function ClustersPanel({
  clusters,
  selectedCluster,
  setSelectedClusterId,
}: {
  clusters: Cluster[];
  selectedCluster: Cluster;
  setSelectedClusterId: (id: string) => void;
}) {
  return (
    <section className="panel clusters-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">AI Case Builder</span>
          <h2>Обнаруженные проблемы</h2>
        </div>
        <BarChart3 size={19} />
      </div>
      <div className="cluster-list">
        {clusters.map((cluster) => (
          <button
            className={`cluster-card ${cluster.id === selectedCluster.id ? 'active' : ''}`}
            key={cluster.id}
            onClick={() => setSelectedClusterId(cluster.id)}
          >
            <div className="cluster-title">
              <span className={`priority-pill ${cluster.priority}`}>{priorityLabels[cluster.priority]}</span>
              <span>{cluster.count} обращ.</span>
            </div>
            <strong>{cluster.title}</strong>
            <p>{cluster.summary}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

function DetailPanel({
  cluster,
  updateClusterStatus,
}: {
  cluster: Cluster;
  updateClusterStatus: (cluster: Cluster, status: AppealStatus) => void;
}) {
  return (
    <section className="panel detail-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Управленческая карточка</span>
          <h2>{cluster.title}</h2>
        </div>
        <CheckCircle2 size={20} />
      </div>

      <div className="detail-grid">
        <InfoBlock label="Категория" value={cluster.category} />
        <InfoBlock label="Район" value={cluster.district} />
        <InfoBlock label="SLA" value={`${cluster.deadlineHours} ч`} />
        <InfoBlock label="Ответственный отдел" value={cluster.department} />
        <InfoBlock label="Risk score" value={`${getRiskScore(cluster)}/100`} />
        <InfoBlock label="Таймер" value={getSlaLabel(cluster)} />
      </div>

      <div className="case-actions">
        <button onClick={() => updateClusterStatus(cluster, 'routed')}>Назначить</button>
        <button onClick={() => updateClusterStatus(cluster, 'in_progress')}>В работу</button>
        <button onClick={() => updateClusterStatus(cluster, 'closed')}>Закрыть</button>
      </div>

      <div className="map-placeholder">
        <MapPin size={22} />
        <div>
          <strong>Горячая точка</strong>
          <span>{cluster.addresses.join(', ')}</span>
        </div>
      </div>

      <div className="recommendations">
        <h3>Рекомендуемый маршрут</h3>
        {cluster.recommendedActions.map((action, index) => (
          <div className="action-row" key={action}>
            <span>{index + 1}</span>
            <p>{action}</p>
          </div>
        ))}
      </div>

      <div className="automation-note">
        <Sparkles size={18} />
        <p>
          Недостающие данные: {cluster.completeness.join(', ')}. Система может запросить их до передачи
          кейса исполнителю.
        </p>
      </div>

      <div className="assignment-card">
        <span>Проект поручения</span>
        <p>
          {cluster.department}: открыть единый кейс по теме "{cluster.category}" в районе {cluster.district},
          назначить исполнителя, проверить адреса {cluster.addresses.join(', ')} и предоставить статус
          исполнения в течение {cluster.deadlineHours} часов.
        </p>
      </div>
    </section>
  );
}

function IngestView({
  csvText,
  newAppeal,
  setCsvText,
  setNewAppeal,
  submitManualAppeal,
  importCsv,
}: {
  csvText: string;
  newAppeal: NewAppealForm;
  setCsvText: (text: string) => void;
  setNewAppeal: (form: NewAppealForm) => void;
  submitManualAppeal: (event: FormEvent) => void;
  importCsv: () => void;
}) {
  return (
    <section className="two-column-grid">
      <form className="panel form-panel" onSubmit={submitManualAppeal}>
        <div className="panel-header">
          <div>
            <span className="section-kicker">Webhook / API</span>
            <h2>Новое обращение</h2>
          </div>
          <Send size={19} />
        </div>
        <FormRow label="Источник">
          <select value={newAppeal.source} onChange={(event) => setNewAppeal({ ...newAppeal, source: event.target.value as Source })}>
            {sources.map((source) => (
              <option key={source}>{source}</option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Район">
          <input value={newAppeal.district} onChange={(event) => setNewAppeal({ ...newAppeal, district: event.target.value })} />
        </FormRow>
        <FormRow label="Адрес">
          <input value={newAppeal.address} onChange={(event) => setNewAppeal({ ...newAppeal, address: event.target.value })} />
        </FormRow>
        <div className="form-grid">
          <FormRow label="Категория">
            <select value={newAppeal.category} onChange={(event) => setNewAppeal({ ...newAppeal, category: event.target.value as Category })}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Приоритет">
            <select value={newAppeal.priority} onChange={(event) => setNewAppeal({ ...newAppeal, priority: event.target.value as Priority })}>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priorityLabels[priority]}
                </option>
              ))}
            </select>
          </FormRow>
        </div>
        <FormRow label="Текст обращения">
          <textarea value={newAppeal.text} onChange={(event) => setNewAppeal({ ...newAppeal, text: event.target.value })} />
        </FormRow>
        <button className="primary-button wide-button" type="submit">
          <Plus size={18} />
          Отправить в поток
        </button>
      </form>

      <section className="panel form-panel">
        <div className="panel-header">
          <div>
            <span className="section-kicker">CSV / Excel mock</span>
            <h2>Пакетная загрузка</h2>
          </div>
          <FileUp size={19} />
        </div>
        <p className="muted-copy">Формат: район;адрес;категория;приоритет;текст обращения</p>
        <textarea className="csv-box" value={csvText} onChange={(event) => setCsvText(event.target.value)} />
        <button className="primary-button wide-button" onClick={importCsv}>
          <Upload size={18} />
          Импортировать обращения
        </button>
      </section>
    </section>
  );
}

function CasesView({
  clusters,
  selectedCluster,
  setSelectedClusterId,
  updateClusterStatus,
}: {
  clusters: Cluster[];
  selectedCluster: Cluster;
  setSelectedClusterId: (id: string) => void;
  updateClusterStatus: (cluster: Cluster, status: AppealStatus) => void;
}) {
  return (
    <section className="two-column-grid cases-layout">
      <ClustersPanel clusters={clusters} selectedCluster={selectedCluster} setSelectedClusterId={setSelectedClusterId} />
      <DetailPanel cluster={selectedCluster} updateClusterStatus={updateClusterStatus} />
    </section>
  );
}

function TrendPanel({ clusters }: { clusters: Cluster[] }) {
  const topClusters = clusters.slice(0, 3);

  return (
    <section className="panel compact-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Risk radar</span>
          <h2>Горячие тренды</h2>
        </div>
        <Flame size={19} />
      </div>
      <div className="trend-list">
        {topClusters.map((cluster) => (
          <div className="trend-row" key={cluster.id}>
            <span className={`priority-pill ${cluster.priority}`}>{priorityLabels[cluster.priority]}</span>
            <div>
              <strong>{cluster.category}</strong>
              <p>
                {cluster.district}, {cluster.count} обращ., SLA {cluster.deadlineHours} ч
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DepartmentLoadPanel({
  load,
}: {
  load: Array<{ department: string; count: number; critical: number }>;
}) {
  const max = Math.max(...load.map((item) => item.count), 1);

  return (
    <section className="panel compact-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Workload</span>
          <h2>Нагрузка отделов</h2>
        </div>
        <BarChart3 size={19} />
      </div>
      <div className="load-list">
        {load.map((item) => (
          <div className="load-row" key={item.department}>
            <div className="load-label">
              <strong>{item.department}</strong>
              <span>
                {item.count} обращ., {item.critical} риск.
              </span>
            </div>
            <div className="load-bar">
              <span style={{ width: `${Math.max((item.count / max) * 100, 8)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ImpactPanel({ appeals, clusters }: { appeals: Appeal[]; clusters: Cluster[] }) {
  const groupedAppeals = clusters.reduce((sum, cluster) => sum + Math.max(cluster.count - 1, 0), 0);
  const estimatedHoursSaved = groupedAppeals * 18;
  const affectedCitizens = appeals.length * 3;

  return (
    <section className="panel compact-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Citizen impact</span>
          <h2>Эффект автоматизации</h2>
        </div>
        <Activity size={19} />
      </div>
      <div className="impact-grid">
        <InfoBlock label="Объединено дублей" value={groupedAppeals.toString()} />
        <InfoBlock label="Оценка затронутых жителей" value={affectedCitizens.toString()} />
        <InfoBlock label="Экономия обработки" value={`${estimatedHoursSaved} мин`} />
        <InfoBlock label="Единых кейсов" value={clusters.length.toString()} />
      </div>
    </section>
  );
}

function EventLogPanel({ events }: { events: EventLogItem[] }) {
  return (
    <section className="panel compact-panel">
      <div className="panel-header">
        <div>
          <span className="section-kicker">Audit trail</span>
          <h2>Журнал системы</h2>
        </div>
        <Clock size={19} />
      </div>
      <div className="event-list">
        {events.map((event) => (
          <article className="event-row" key={event.id}>
            <span>{event.time}</span>
            <div>
              <strong>{event.title}</strong>
              <p>{event.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
