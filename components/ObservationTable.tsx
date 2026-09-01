'use client';

import React from 'react';
import Link from 'next/link';
import { ObservationSummary } from '@/lib/types';
import { CategoryBadge, SeverityBadge, StatusBadge } from './Badges';
import { formatDateShort } from '@/lib/constants';
import { Camera, ChevronRight, ArrowUpDown, Clock } from 'lucide-react';

interface ObservationTableProps {
  observations: ObservationSummary[];
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ObservationTable({
  observations,
  sortBy,
  onSortChange,
}: ObservationTableProps) {
  if (observations.length === 0) {
    return (
      <div className="p-12 text-center text-[var(--dim)] bg-[var(--panel)] rounded-lg border border-[var(--border)]">
        <div className="text-sm font-semibold text-[var(--text)] mb-1">No observations found</div>
        <p className="text-xs text-[var(--faint)]">
          Try adjusting your search criteria or filters, or log a new observation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[var(--panel)] border border-[var(--border)] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--panel-alt)] text-[var(--dim)] font-mono uppercase tracking-wider text-[11px]">
              <th
                className="py-3 px-4 cursor-pointer hover:text-[var(--text)] transition-colors"
                onClick={() => onSortChange(sortBy === 'date_desc' ? 'date_asc' : 'date_desc')}
              >
                <div className="flex items-center gap-1.5">
                  <span>ID &amp; Date</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--faint)]" />
                </div>
              </th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location / Station</th>
              <th className="py-3 px-4">Asset / Sub-system</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-[var(--text)] transition-colors"
                onClick={() => onSortChange('severity')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Severity</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--faint)]" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-[var(--text)] transition-colors"
                onClick={() => onSortChange('status')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-[var(--faint)]" />
                </div>
              </th>
              <th className="py-3 px-4">Observer</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {observations.map((obs) => {
              return (
                <tr
                  key={obs.id}
                  className="hover:bg-[var(--hover)] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Link href={`/observations/${obs.id}`} className="block">
                      <div className="font-mono font-bold text-amber-600 dark:text-amber-400 group-hover:underline">
                        {obs.id}
                      </div>
                      <div className="text-[10.5px] text-[var(--faint)] font-mono mt-0.5">
                        {formatDateShort(obs.createdAt)}
                      </div>
                    </Link>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <CategoryBadge category={obs.category} size="sm" />
                  </td>

                  <td className="py-3 px-4 max-w-[220px]">
                    <div className="font-medium text-[var(--text)] truncate">{obs.site}</div>
                    {obs.station && obs.station !== obs.site && (
                      <div className="text-[10.5px] text-[var(--dim)] truncate">{obs.station}</div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[var(--dim)] whitespace-nowrap max-w-[160px] truncate">
                    {obs.asset || '—'}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <SeverityBadge severity={obs.severity} size="sm" />
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={obs.status} size="sm" />
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-[var(--dim)]">
                    <div className="truncate max-w-[130px] font-medium">{obs.observedBy}</div>
                    {obs.dueDate && (
                      <div className="text-[10px] text-[var(--faint)] flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Due: {obs.dueDate}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/observations/${obs.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--panel-alt)] border border-[var(--border)] text-xs text-[var(--dim)] group-hover:text-[var(--text)] group-hover:border-[var(--border-light)] transition-colors"
                    >
                      {obs.photoCount && obs.photoCount > 0 ? (
                        <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-mono text-[11px] mr-1 font-semibold">
                          <Camera className="w-3 h-3" />
                          {obs.photoCount}
                        </span>
                      ) : null}
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
