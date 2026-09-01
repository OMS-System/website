'use client';

import React from 'react';
import { SeverityLevel } from '@/lib/types';
import { ShieldAlert, Layers } from 'lucide-react';
import Link from 'next/link';

interface SeverityRiskChartProps {
  severityData: {
    level: SeverityLevel;
    count: number;
    color: string;
  }[];
  assetData: {
    asset: string;
    count: number;
  }[];
  total: number;
}

export function SeverityRiskChart({
  severityData,
  assetData,
  total,
}: SeverityRiskChartProps) {
  const maxAssetCount = Math.max(1, ...assetData.map((a) => a.count));

  return (
    <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)] flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>Risk Severity &amp; Asset Hotspots</span>
          </h3>
          <p className="text-[11px] text-[var(--faint)] mt-0.5">
            Prioritized risk distribution &amp; key affected sub-systems
          </p>
        </div>
        <Link
          href="/matrix"
          className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline"
        >
          Matrix →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-1">
        {/* Left: Severity Risk Bars */}
        <div className="space-y-2.5">
          <div className="text-[10.5px] font-mono uppercase text-[var(--dim)] font-bold">
            Risk Classification
          </div>
          <div className="space-y-2">
            {severityData.map((s) => {
              const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
              return (
                <div key={s.level} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.level}
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--dim)]">
                      {s.count} <span className="text-[10px] text-[var(--faint)] font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(pct, s.count > 0 ? 5 : 0)}%`,
                        backgroundColor: s.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Key Sub-systems */}
        <div className="space-y-2.5 border-t sm:border-t-0 sm:border-l border-[var(--border)] sm:pl-4 pt-3 sm:pt-0">
          <div className="text-[10.5px] font-mono uppercase text-[var(--dim)] font-bold flex items-center justify-between">
            <span>Affected Sub-systems</span>
            <Layers className="w-3.5 h-3.5 text-[var(--faint)]" />
          </div>
          <div className="space-y-2">
            {assetData.slice(0, 4).map((a) => {
              const barFill = Math.round((a.count / maxAssetCount) * 100);
              return (
                <div key={a.asset} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text)] truncate max-w-[130px] font-medium text-[11.5px]">
                      {a.asset}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {a.count}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${barFill}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--dim)]">
        <span>SLA Tracking Active</span>
        <span className="font-mono text-[var(--faint)]">
          {severityData.find((s) => s.level === 'Critical')?.count || 0} Critical Priority
        </span>
      </div>
    </div>
  );
}
