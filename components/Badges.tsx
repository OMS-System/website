'use client';

import React from 'react';
import { CategoryCode, SeverityLevel, ObservationStatus } from '@/lib/types';
import { CATEGORIES, SEVERITIES, STATUSES } from '@/lib/constants';
import {
  ShieldAlert,
  CheckCircle2,
  Wrench,
  CalendarCheck,
  ClipboardList,
  Check,
  RotateCw,
  Sparkles,
} from 'lucide-react';

const categoryIcons: Record<CategoryCode, React.ElementType> = {
  SAF: ShieldAlert,
  QAL: CheckCircle2,
  EQP: Wrench,
  MNT: CalendarCheck,
  INS: ClipboardList,
};

export function CategoryBadge({
  category,
  size = 'md',
  showLabel = true,
}: {
  category: CategoryCode;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  const meta = CATEGORIES[category] || CATEGORIES.SAF;
  const Icon = categoryIcons[category] || ShieldAlert;

  const sizeConfig = {
    sm: {
      container: 'text-[10px] px-2 py-0.5 gap-1 font-medium',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-medium',
      icon: 'w-3.5 h-3.5',
    },
    lg: {
      container: 'text-xs px-3 py-1 gap-2 font-semibold',
      icon: 'w-4 h-4',
    },
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border ${meta.badgeBg} ${meta.badgeBorder} ${meta.badgeText} ${sizeConfig.container} transition-colors tracking-tight`}
    >
      <Icon className={`${sizeConfig.icon} flex-shrink-0`} />
      <span className="font-mono font-bold">{meta.code}</span>
      {showLabel && (
        <span className="opacity-80 font-sans hidden sm:inline truncate">
          · {meta.label.split(' ')[0]}
        </span>
      )}
    </span>
  );
}

export function SeverityBadge({
  severity,
  size = 'md',
  showSla = false,
}: {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showSla?: boolean;
}) {
  const meta = SEVERITIES[severity] || SEVERITIES.Medium;

  const sizeConfig = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2',
  }[size];

  const isCritical = severity === 'Critical';
  const isHigh = severity === 'High';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${meta.badgeBg} ${meta.badgeBorder} ${meta.badgeText} ${sizeConfig} tracking-tight transition-colors`}
    >
      <span className="relative flex items-center justify-center flex-shrink-0">
        {isCritical && (
          <span
            className="absolute w-2.5 h-2.5 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: meta.color }}
          />
        )}
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isCritical ? 'bg-red-500 ring-2 ring-red-400/40' : ''
          }`}
          style={{ backgroundColor: meta.color }}
        />
      </span>

      <span className={isCritical ? 'font-bold' : 'font-medium'}>{meta.level}</span>

      {showSla && (
        <span className="text-[10px] opacity-75 font-mono">
          ({meta.slaHours < 48 ? `${meta.slaHours}h` : `${meta.slaHours / 24}d`})
        </span>
      )}
    </span>
  );
}

export function StatusBadge({
  status,
  size = 'md',
}: {
  status: ObservationStatus;
  size?: 'sm' | 'md' | 'lg';
}) {
  const meta = STATUSES[status] || STATUSES.Open;

  const sizeConfig = {
    sm: {
      container: 'text-[10px] px-2 py-0.5 gap-1.5',
      icon: 'w-2.5 h-2.5',
    },
    md: {
      container: 'text-[11px] px-2.5 py-0.5 gap-1.5',
      icon: 'w-3 h-3',
    },
    lg: {
      container: 'text-xs px-3 py-1 gap-2',
      icon: 'w-3.5 h-3.5',
    },
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${meta.badgeBg} ${meta.badgeBorder} ${meta.badgeText} ${sizeConfig.container} tracking-tight transition-colors`}
    >
      {status === 'Open' && (
        <span className="relative flex items-center justify-center flex-shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: meta.color }}
          />
        </span>
      )}

      {status === 'In Review' && (
        <RotateCw className={`${sizeConfig.icon} animate-spin-slow flex-shrink-0 opacity-80`} />
      )}

      {status === 'Closed' && (
        <Check className={`${sizeConfig.icon} stroke-[3] flex-shrink-0`} />
      )}

      <span>{status}</span>
    </span>
  );
}
