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
  }
> = {
  SAF: {
    code: 'SAF',
    label: 'Safety Observation',
    color: '#e5484d',
    dim: 'rgba(229, 72, 77, 0.15)',
    description: 'Unsafe conditions, PPE compliance, track intrusion risks, electrical hazards',
    icon: 'ShieldAlert',
    badgeBg: 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800/60',
    badgeText: 'text-red-700 dark:text-red-400',
  },
  QAL: {
    code: 'QAL',
    label: 'Quality Observation',
    color: '#0891b2',
    dim: 'rgba(8, 145, 178, 0.15)',
    description: 'Workmanship defects, materials specifications, finish deviations, calibration',
    icon: 'CheckCircle2',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800/60',
    badgeText: 'text-teal-700 dark:text-teal-400',
  },
  EQP: {
    code: 'EQP',
    label: 'Equipment / Asset Condition',
    color: '#d97706',
    dim: 'rgba(217, 119, 6, 0.15)',
    description: 'Abnormal wear, overheating, leaks, structural damage, vibration, degradation',
    icon: 'Wrench',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60',
    badgeText: 'text-amber-800 dark:text-amber-400',
  },
  MNT: {
    code: 'MNT',
    label: 'Maintenance Compliance',
    color: '#16a34a',
    dim: 'rgba(22, 163, 74, 0.15)',
    description: 'PM checklist misses, expired certifications, missing inspection tags, logbook gaps',
    icon: 'CalendarCheck',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
  },
  INS: {
    code: 'INS',
    label: 'Site Inspection',
    color: '#7c3aed',
    dim: 'rgba(124, 58, 237, 0.15)',
    description: 'Routine site audits, housekeeping, perimeter security, access control, lighting',
    icon: 'ClipboardList',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60',
    badgeText: 'text-purple-700 dark:text-purple-400',
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
    badgeText: string;
  }
> = {
  Critical: {
    level: 'Critical',
    color: '#dc2626',
    dim: 'rgba(220, 38, 38, 0.2)',
    slaHours: 24,
    badgeBg: 'bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700/80',
    badgeText: 'text-red-700 dark:text-red-400',
  },
  High: {
    level: 'High',
    color: '#ea580c',
    dim: 'rgba(234, 88, 12, 0.2)',
    slaHours: 72,
    badgeBg: 'bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-700/80',
    badgeText: 'text-orange-800 dark:text-orange-400',
  },
  Medium: {
    level: 'Medium',
    color: '#d97706',
    dim: 'rgba(217, 119, 6, 0.2)',
    slaHours: 168,
    badgeBg: 'bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-700/80',
    badgeText: 'text-amber-800 dark:text-amber-400',
  },
  Low: {
    level: 'Low',
    color: '#16a34a',
    dim: 'rgba(22, 163, 74, 0.2)',
    slaHours: 336,
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700/80',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
  },
};

export const STATUSES: Record<
  ObservationStatus,
  {
    status: ObservationStatus;
    color: string;
    dim: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  Open: {
    status: 'Open',
    color: '#d97706',
    dim: 'rgba(217, 119, 6, 0.15)',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/70',
    badgeText: 'text-amber-800 dark:text-amber-300',
  },
  'In Review': {
    status: 'In Review',
    color: '#0891b2',
    dim: 'rgba(8, 145, 178, 0.15)',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/70 border-teal-300 dark:border-teal-700/70',
    badgeText: 'text-teal-800 dark:text-teal-300',
  },
  Closed: {
    status: 'Closed',
    color: '#16a34a',
    dim: 'rgba(22, 163, 74, 0.15)',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700/70',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
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
