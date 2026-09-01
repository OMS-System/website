'use client';

import React from 'react';
import Link from 'next/link';
import { Topbar } from '@/components/Topbar';
import { ASSET_TYPES, METRO_STATIONS } from '@/lib/constants';
import { Layers, MapPin, ArrowRight } from 'lucide-react';

export default function MatrixPage({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu?: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar
        title="Asset &amp; Station Matrix"
        subtitle="Operational directory of all Metro Rail infrastructure sub-systems and station locations"
        onOpenMobileMenu={onOpenMobileMenu}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sub-systems Directory */}
          <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase text-[var(--dim)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>Tracked Sub-systems ({ASSET_TYPES.length})</span>
              </h2>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {ASSET_TYPES.map((asset, i) => (
                <div
                  key={asset}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-[var(--faint)] w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-medium text-[var(--text)] truncate">{asset}</span>
                  </div>
                  <Link
                    href={`/observations?asset=${encodeURIComponent(asset)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline transition-colors"
                  >
                    <span>Filter Findings</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Stations & Depots Directory */}
          <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase text-[var(--dim)] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Line Stations &amp; Depots ({METRO_STATIONS.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-1">
              {METRO_STATIONS.map((station, i) => (
                <Link
                  key={station}
                  href={`/observations?station=${encodeURIComponent(station)}`}
                  className="p-2.5 rounded bg-[var(--bg)] hover:bg-[var(--hover)] border border-[var(--border)] flex items-center justify-between gap-2 text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-[var(--faint)]">
                      ST-{String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[var(--text)] truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      {station}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-[var(--faint)] group-hover:text-amber-600 dark:group-hover:text-amber-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
