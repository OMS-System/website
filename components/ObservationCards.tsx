'use client';

import React from 'react';
import Link from 'next/link';
import { ObservationSummary } from '@/lib/types';
import { CategoryBadge, SeverityBadge, StatusBadge } from './Badges';
import { formatDateShort } from '@/lib/constants';
import { Camera, MapPin, User } from 'lucide-react';

interface ObservationCardsProps {
  observations: ObservationSummary[];
}

export function ObservationCards({ observations }: ObservationCardsProps) {
  if (observations.length === 0) {
    return (
      <div className="p-12 text-center text-[var(--dim)] bg-[var(--panel)] rounded-lg border border-[var(--border)]">
        <div className="text-sm font-semibold text-[var(--text)] mb-1">No observations found</div>
        <p className="text-xs text-[var(--faint)]">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {observations.map((obs) => {
        return (
          <Link
            key={obs.id}
            href={`/observations/${obs.id}`}
            className="flex flex-col p-4 rounded-lg bg-[var(--panel)] border border-[var(--border)] hover:border-amber-500 hover:bg-[var(--hover)] transition-all group shadow-xs"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{obs.id}</span>
              <StatusBadge status={obs.status} size="sm" />
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <CategoryBadge category={obs.category} size="sm" />
              <SeverityBadge severity={obs.severity} size="sm" />
            </div>

            {/* Site / Location */}
            <div className="flex items-start gap-2 mb-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-[var(--dim)] flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-[var(--text)] line-clamp-1">{obs.site}</span>
                {obs.asset && (
                  <span className="text-[11px] text-[var(--dim)] block truncate">{obs.asset}</span>
                )}
              </div>
            </div>

            {/* Latest Remarks */}
            {obs.latestRemarks && (
              <p className="text-xs text-[var(--dim)] line-clamp-2 mb-3 bg-[var(--panel-alt)] p-2 rounded border border-[var(--border)] italic">
                &ldquo;{obs.latestRemarks}&rdquo;
              </p>
            )}

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--dim)]">
              <div className="flex items-center gap-1.5 truncate">
                <User className="w-3 h-3 text-[var(--faint)]" />
                <span className="truncate">{obs.observedBy}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {obs.photoCount && obs.photoCount > 0 ? (
                  <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-mono font-semibold">
                    <Camera className="w-3 h-3" />
                    {obs.photoCount}
                  </span>
                ) : null}
                <span className="font-mono">{formatDateShort(obs.createdAt)}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
