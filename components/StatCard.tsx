'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
  subLabel?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  active?: boolean;
}

export function StatCard({
  label,
  value,
  color,
  subLabel,
  icon: Icon,
  onClick,
  active,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg bg-[var(--panel)] border shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:bg-[var(--hover)] hover:border-[var(--border-light)]' : ''
      } ${active ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-[var(--border)]'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--dim)] font-semibold truncate">
          {label}
        </span>
        {Icon && (
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
          {value}
        </div>
        {subLabel && (
          <span className="text-[11px] text-[var(--dim)] font-mono">{subLabel}</span>
        )}
      </div>
    </div>
  );
}
