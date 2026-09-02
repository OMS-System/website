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
    color: '#e5484d',
    dim: 'rgba(229, 72, 77, 0.15)',
    description: 'Unsafe conditions, PPE compliance, track intrusion risks, electrical hazards',
    icon: 'ShieldAlert',
    badgeBg: 'bg-[#e5484d]/10 dark:bg-[#e5484d]/20',
    badgeBorder: 'border-[#e5484d]/35 dark:border-[#e5484d]/50',
    badgeText: 'text-[#e5484d]',
  },
  QAL: {
    code: 'QAL',
    label: 'Quality Observation',
    color: '#0891b2',
    dim: 'rgba(8, 145, 178, 0.15)',
    description: 'Workmanship defects, materials specifications, finish deviations, calibration',
    icon: 'CheckCircle2',
    badgeBg: 'bg-[#0891b2]/10 dark:bg-[#0891b2]/20',
    badgeBorder: 'border-[#0891b2]/35 dark:border-[#0891b2]/50',
    badgeText: 'text-[#0891b2]',
  },
  EQP: {
    code: 'EQP',
    label: 'Equipment / Asset Condition',
    color: '#d97706',
    dim: 'rgba(217, 119, 6, 0.15)',
    description: 'Abnormal wear, overheating, leaks, structural damage, vibration, degradation',
    icon: 'Wrench',
    badgeBg: 'bg-[#d97706]/10 dark:bg-[#d97706]/20',
    badgeBorder: 'border-[#d97706]/35 dark:border-[#d97706]/50',
    badgeText: 'text-[#d97706]',
  },
  MNT: {
    code: 'MNT',
    label: 'Maintenance Compliance',
    color: '#16a34a',
    dim: 'rgba(22, 163, 74, 0.15)',
    description: 'PM checklist misses, expired certifications, missing inspection tags, logbook gaps',
    icon: 'CalendarCheck',
    badgeBg: 'bg-[#16a34a]/10 dark:bg-[#16a34a]/20',
    badgeBorder: 'border-[#16a34a]/35 dark:border-[#16a34a]/50',
    badgeText: 'text-[#16a34a]',
  },
  INS: {
    code: 'INS',
    label: 'Site Inspection',
    color: '#7c3aed',
    dim: 'rgba(124, 58, 237, 0.15)',
    description: 'Routine site audits, housekeeping, perimeter security, access control, lighting',
    icon: 'ClipboardList',
    badgeBg: 'bg-[#7c3aed]/10 dark:bg-[#7c3aed]/20',
    badgeBorder: 'border-[#7c3aed]/35 dark:border-[#7c3aed]/50',
    badgeText: 'text-[#7c3aed]',
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
    dim: 'rgba(220, 38, 38, 0.2)',
    slaHours: 24,
    badgeBg: 'bg-[#dc2626]/10 dark:bg-[#dc2626]/20',
    badgeBorder: 'border-[#dc2626]/35 dark:border-[#dc2626]/50',
    badgeText: 'text-[#dc2626]',
  },
  High: {
    level: 'High',
    color: '#ea580c',
    dim: 'rgba(234, 88, 12, 0.2)',
    slaHours: 72,
    badgeBg: 'bg-[#ea580c]/10 dark:bg-[#ea580c]/20',
    badgeBorder: 'border-[#ea580c]/35 dark:border-[#ea580c]/50',
    badgeText: 'text-[#ea580c]',
  },
  Medium: {
    level: 'Medium',
    color: '#d97706',
    dim: 'rgba(217, 119, 6, 0.2)',
    slaHours: 168,
    badgeBg: 'bg-[#d97706]/10 dark:bg-[#d97706]/20',
    badgeBorder: 'border-[#d97706]/35 dark:border-[#d97706]/50',
    badgeText: 'text-[#d97706]',
  },
  Low: {
    level: 'Low',
    color: '#16a34a',
    dim: 'rgba(22, 163, 74, 0.2)',
    slaHours: 336,
    badgeBg: 'bg-[#16a34a]/10 dark:bg-[#16a34a]/20',
    badgeBorder: 'border-[#16a34a]/35 dark:border-[#16a34a]/50',
    badgeText: 'text-[#16a34a]',
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
    color: '#d97706',
    dim: 'rgba(217, 119, 6, 0.15)',
    badgeBg: 'bg-[#d97706]/10 dark:bg-[#d97706]/20',
    badgeBorder: 'border-[#d97706]/35 dark:border-[#d97706]/50',
    badgeText: 'text-[#d97706]',
  },
  'In Review': {
    status: 'In Review',
    color: '#0891b2',
    dim: 'rgba(8, 145, 178, 0.15)',
    badgeBg: 'bg-[#0891b2]/10 dark:bg-[#0891b2]/20',
    badgeBorder: 'border-[#0891b2]/35 dark:border-[#0891b2]/50',
    badgeText: 'text-[#0891b2]',
  },
  Closed: {
    status: 'Closed',
    color: '#16a34a',
    dim: 'rgba(22, 163, 74, 0.15)',
    badgeBg: 'bg-[#16a34a]/10 dark:bg-[#16a34a]/20',
    badgeBorder: 'border-[#16a34a]/35 dark:border-[#16a34a]/50',
    badgeText: 'text-[#16a34a]',
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
