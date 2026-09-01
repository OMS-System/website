'use client';

import React from 'react';
import { CategoryCode, SeverityLevel, ObservationStatus } from '@/lib/types';
import { CATEGORIES, SEVERITIES, STATUSES } from '@/lib/constants';

export function CategoryBadge({
  category,
  size = 'md',
}: {
  category: CategoryCode;
  size?: 'sm' | 'md' | 'lg';
}) {
  const meta = CATEGORIES[category] || CATEGORIES.SAF;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded ${meta.badgeBg} ${meta.badgeText} border border-current/20 ${sizeClasses}`}
    >
      <span>{meta.code}</span>
      <span className="opacity-75 font-sans ml-1 hidden sm:inline">· {meta.label.split(' ')[0]}</span>
    </span>
  );
}

export function SeverityBadge({
  severity,
  size = 'md',
}: {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
}) {
  const meta = SEVERITIES[severity] || SEVERITIES.Medium;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${meta.badgeBg} ${meta.badgeText} border border-current/20 ${sizeClasses}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.level}
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

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${meta.badgeBg} ${meta.badgeText} border border-current/20 ${sizeClasses}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      <span>{status}</span>
    </span>
  );
}
