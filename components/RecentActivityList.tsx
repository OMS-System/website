'use client';

import React from 'react';
import Link from 'next/link';
import { ObservationSummary, ObservationHistory, CategoryCode } from '@/lib/types';
import { formatDate } from '@/lib/constants';
import { CategoryBadge, StatusBadge } from '@/components/Badges';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

interface RecentActivityProps {
  observations: ObservationSummary[];
  history: (ObservationHistory & { site: string; category: CategoryCode })[];
}

export function RecentActivityList({ observations }: RecentActivityProps) {
  return (
    <div className="rounded-lg bg-[var(--panel)] border border-[var(--border)] overflow-hidden shadow-xs flex flex-col">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)]">
          Recent Findings Log
        </h3>
        <Link
          href="/observations"
          className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
        >
          <span>All Observations</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-[var(--border)] overflow-y-auto max-h-[380px]">
        {observations.length > 0 ? (
          observations.map((obs) => {
            return (
              <Link
                key={obs.id}
                href={`/observations/${obs.id}`}
                className="flex items-center gap-3 p-3.5 hover:bg-[var(--hover)] transition-colors group"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[var(--text)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {obs.id}
                    </span>
                    <CategoryBadge category={obs.category} size="sm" showLabel={false} />
                  </div>
                  <span className="text-xs text-[var(--dim)] truncate mt-1">
                    {obs.site}
                  </span>
                </div>

                <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                  <StatusBadge status={obs.status} size="sm" />
                  <span className="text-[10px] text-[var(--faint)] font-mono">
                    {formatDate(obs.createdAt).split('·')[0]}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-[var(--faint)] group-hover:text-[var(--text)] flex-shrink-0" />
              </Link>
            );
          })
        ) : (
          <div className="p-8 text-center text-[var(--dim)] text-xs font-mono">
            No recent observations recorded.
          </div>
        )}
      </div>
    </div>
  );
}
