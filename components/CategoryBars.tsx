'use client';

import React from 'react';
import Link from 'next/link';
import { CategoryCode } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import {
  ShieldAlert,
  CheckCircle2,
  Wrench,
  CalendarCheck,
  ClipboardList,
  ChevronRight,
} from 'lucide-react';

interface CategoryBarsProps {
  data: {
    code: CategoryCode;
    label: string;
    count: number;
    color: string;
  }[];
}

const categoryIcons: Record<CategoryCode, React.ElementType> = {
  SAF: ShieldAlert,
  QAL: CheckCircle2,
  EQP: Wrench,
  MNT: CalendarCheck,
  INS: ClipboardList,
};

export function CategoryBars({ data }: CategoryBarsProps) {
  const maxCount = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rounded-lg bg-[var(--panel)] border border-[var(--border)] overflow-hidden shadow-xs">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)]">
            Observation Breakdown By Category
          </h3>
        </div>
        <span className="text-xs font-mono text-[var(--dim)]">{total} Total Items</span>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {data.map((item) => {
          const cat = CATEGORIES[item.code];
          const Icon = categoryIcons[item.code] || ShieldAlert;
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const barFillPct = (item.count / maxCount) * 100;

          return (
            <Link
              key={item.code}
              href={`/observations?category=${item.code}`}
              className="flex items-center gap-3 p-3.5 hover:bg-[var(--hover)] transition-colors group"
            >
              <div className="w-40 sm:w-52 flex items-center gap-2 min-w-0 flex-shrink-0">
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: cat.color }} />
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                  {cat.code}
                </span>
                <span className="text-xs font-medium text-[var(--text)] truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.label}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barFillPct}%`,
                      backgroundColor: cat.color,
                      boxShadow: `0 0 6px ${cat.color}60`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[11px] font-mono text-[var(--dim)] w-8 text-right hidden sm:inline">
                  {percentage}%
                </span>
                <span className="font-mono text-xs font-bold text-[var(--text)] w-6 text-right">
                  {item.count}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--faint)] group-hover:text-[var(--text)] transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
