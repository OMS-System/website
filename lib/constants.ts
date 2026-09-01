import { CategoryCode, SeverityLevel, ObservationStatus } from './types';

export const CATEGORIES: Record<
  CategoryCode,
  {
    code: CategoryCode;
    label: string;
    color: string;
    dim: string;
    description: string;
    icon: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
  }
> = {
  SAF: {
    code: 'SAF',
    label: 'Safety Observation',
    color: '#e11d48',
    dim: 'rgba(225, 29, 72, 0.12)',
    description: 'Unsafe conditions, PPE compliance, track intrusion risks, electrical hazards',
    icon: 'ShieldAlert',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/15',
    badgeBorder: 'border-rose-500/30 dark:border-rose-500/35',
    badgeText: 'text-rose-700 dark:text-rose-300',
  },
  QAL: {
    code: 'QAL',
    label: 'Quality Observation',
    color: '#0284c7',
    dim: 'rgba(2, 132, 199, 0.12)',
    description: 'Workmanship defects, materials specifications, finish deviations, calibration',
    icon: 'CheckCircle2',
    badgeBg: 'bg-sky-500/10 dark:bg-sky-500/15',
    badgeBorder: 'border-sky-500/30 dark:border-sky-500/35',
    badgeText: 'text-sky-700 dark:text-sky-300',
  },
  EQP: {
    code: 'EQP',
    label: 'Equipment / Asset Condition',
    color: '#7c3aed',
    dim: 'rgba(124, 58, 237, 0.12)',
    description: 'Abnormal wear, overheating, leaks, structural damage, vibration, degradation',
    icon: 'Wrench',
    badgeBg: 'bg-violet-500/10 dark:bg-violet-500/15',
    badgeBorder: 'border-violet-500/30 dark:border-violet-500/35',
    badgeText: 'text-violet-700 dark:text-violet-300',
  },
  MNT: {
    code: 'MNT',
    label: 'Maintenance Compliance',
    color: '#0d9488',
    dim: 'rgba(13, 148, 136, 0.12)',
    description: 'PM checklist misses, expired certifications, missing inspection tags, logbook gaps',
    icon: 'CalendarCheck',
    badgeBg: 'bg-teal-500/10 dark:bg-teal-500/15',
    badgeBorder: 'border-teal-500/30 dark:border-teal-500/35',
    badgeText: 'text-teal-700 dark:text-teal-300',
  },
  INS: {
    code: 'INS',
    label: 'Site Inspection',
    color: '#4f46e5',
    dim: 'rgba(79, 70, 229, 0.12)',
    description: 'Routine site audits, housekeeping, perimeter security, access control, lighting',
    icon: 'ClipboardList',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    badgeBorder: 'border-indigo-500/30 dark:border-indigo-500/35',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
  },
};

export const SEVERITIES: Record<
  SeverityLevel,
  {
    level: SeverityLevel;
    color: string;
    dim: string;
    slaHours: number;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  }
> = {
  Critical: {
    level: 'Critical',
    color: '#dc2626',
    dim: 'rgba(220, 38, 38, 0.15)',
    slaHours: 24,
    badgeBg: 'bg-red-500/10 dark:bg-red-500/20',
    badgeBorder: 'border-red-500/35 dark:border-red-500/40',
    badgeText: 'text-red-700 dark:text-red-300',
  },
  High: {
    level: 'High',
    color: '#ea580c',
    dim: 'rgba(234, 88, 12, 0.15)',
    slaHours: 72,
    badgeBg: 'bg-orange-500/10 dark:bg-orange-500/20',
    badgeBorder: 'border-orange-500/35 dark:border-orange-500/40',
    badgeText: 'text-orange-700 dark:text-orange-300',
  },
  Medium: {
    level: 'Medium',
    color: '#d97706',
    dim: 'rgba(217, 119, 6, 0.15)',
    slaHours: 168,
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeBorder: 'border-amber-500/35 dark:border-amber-500/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  Low: {
    level: 'Low',
    color: '#64748b',
    dim: 'rgba(100, 116, 139, 0.15)',
    slaHours: 336,
    badgeBg: 'bg-slate-500/10 dark:bg-slate-500/20',
    badgeBorder: 'border-slate-500/30 dark:border-slate-500/40',
    badgeText: 'text-slate-700 dark:text-slate-300',
  },
};

export const STATUSES: Record<
  ObservationStatus,
  {
    status: ObservationStatus;
    color: string;
    dim: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
  }
> = {
  Open: {
    status: 'Open',
    color: '#f59e0b',
    dim: 'rgba(245, 158, 11, 0.15)',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeBorder: 'border-amber-500/35 dark:border-amber-500/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  'In Review': {
    status: 'In Review',
    color: '#8b5cf6',
    dim: 'rgba(139, 92, 246, 0.15)',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeBorder: 'border-purple-500/35 dark:border-purple-500/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
  },
  Closed: {
    status: 'Closed',
    color: '#10b981',
    dim: 'rgba(16, 185, 129, 0.15)',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/35 dark:border-emerald-500/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
};

export const ASSET_TYPES = [
  'Platform Screen Door (PSD)',
  'Escalator / Elevator',
  'Track & Trackbed',
  'Signalling System',
  'Rolling Stock',
  'Traction Power / OHE',
  'Civil Structure',
  'Station Building & Finishes',
  'Fire & Safety Systems',
  'CCTV / Communication',
  'Drainage & MEP',
  'Other',
] as const;

export const METRO_STATIONS = [
  'Bahria Town Station',
  'Ali Town Station',
  'Thokar Niaz Baig',
  'Canal View',
  'Hanjarwal',
  'Wahdat Road',
  'Awan Town',
  'Sabzazar',
  'Shahnoor',
  'Salahuddin Road',
  'Bund Road',
  'Samanabad',
  'Chauburji',
  'Lake Road',
  'GPO Station',
  'Lakshmi Chowk',
  'Railway Station',
  'Sultanpura',
  'UET Station',
  'Baghbanpura',
  'Shalamar Gardens',
  'Manawan',
  'Dera Gujran Depot',
];

export function generateObservationId(category: CategoryCode): string {
  const chars = '0123456789ABCDEF';
  let hex = '';
  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ORL-${category}-${hex}`;
}

export function formatDate(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return (
      d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) +
      ' · ' +
      d.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  } catch {
    return isoString;
  }
}

export function formatDateShort(isoString: string): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
