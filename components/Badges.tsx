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
      container: 'text-[10px] px-1.5 py-0.5 gap-1.5',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'text-[11px] px-2 py-0.5 gap-1.5',
      icon: 'w-3.5 h-3.5',
    },
    lg: {
      container: 'text-xs px-2.5 py-1 gap-2',
      icon: 'w-4 h-4',
    },
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded font-mono font-bold ${sizeConfig.container} border select-none transition-colors`}
      style={{
        backgroundColor: `${meta.color}18`,
        color: meta.color,
        borderColor: `${meta.color}35`,
      }}
    >
      <Icon className={`${sizeConfig.icon} flex-shrink-0`} style={{ color: meta.color }} />
      <span>{meta.code}</span>
      {showLabel && (
        <span
          className="font-sans font-semibold text-[90%] normal-case truncate border-l pl-1.5 ml-0.5 hidden sm:inline"
          style={{ borderColor: `${meta.color}35` }}
        >
          {meta.label.split(' ')[0]}
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
    sm: {
      container: 'text-[10px] px-1.5 py-0.5 gap-1.5',
    },
    md: {
      container: 'text-[11px] px-2 py-0.5 gap-1.5',
    },
    lg: {
      container: 'text-xs px-2.5 py-1 gap-2',
    },
  }[size];

  const isCritical = severity === 'Critical';

  return (
    <span
      className={`inline-flex items-center rounded font-mono font-bold uppercase ${sizeConfig.container} border select-none transition-colors`}
      style={{
        backgroundColor: `${meta.color}18`,
        color: meta.color,
        borderColor: `${meta.color}35`,
      }}
    >
      <span className="relative flex items-center justify-center flex-shrink-0">
        {isCritical && (
          <span
            className="absolute w-2 h-2 rounded-full animate-ping opacity-60"
            style={{ backgroundColor: meta.color }}
          />
        )}
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: meta.color }}
        />
      </span>

      <span>{meta.level}</span>

      {showSla && (
        <span
          className="text-[9px] font-mono font-bold border-l pl-1.5 ml-0.5"
          style={{ borderColor: `${meta.color}35` }}
        >
          {meta.slaHours < 48 ? `${meta.slaHours}H` : `${meta.slaHours / 24}D`}
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
      container: 'text-[10px] px-1.5 py-0.5 gap-1.5',
      icon: 'w-2.5 h-2.5',
    },
    md: {
      container: 'text-[11px] px-2 py-0.5 gap-1.5',
      icon: 'w-3 h-3',
    },
    lg: {
      container: 'text-xs px-2.5 py-1 gap-2',
      icon: 'w-3.5 h-3.5',
    },
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded font-mono font-bold uppercase ${sizeConfig.container} border select-none transition-colors`}
      style={{
        backgroundColor: `${meta.color}18`,
        color: meta.color,
        borderColor: `${meta.color}35`,
      }}
    >
      {status === 'Open' && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: meta.color }}
        />
      )}

      {status === 'In Review' && (
        <RotateCw
          className={`${sizeConfig.icon} animate-spin-slow flex-shrink-0`}
          style={{ color: meta.color }}
        />
      )}

      {status === 'Closed' && (
        <Check
          className={`${sizeConfig.icon} stroke-[3] flex-shrink-0`}
          style={{ color: meta.color }}
        />
      )}

      <span>{status}</span>
    </span>
  );
}
