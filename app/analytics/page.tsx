'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Topbar } from '@/components/Topbar';
import { DashboardStats } from '@/lib/types';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Clock,
  Layers,
  AlertTriangle,
} from 'lucide-react';

export default function AnalyticsPage({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu?: () => void;
}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const closureRate =
    stats && stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar
        title="Analytics &amp; SLA Compliance"
        subtitle="Performance metrics, resolution time indicators, and hazard trends"
        onOpenMobileMenu={onOpenMobileMenu}
        onRefresh={fetchStats}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-2">
            <div className="text-[11px] font-mono uppercase text-[var(--dim)] flex items-center justify-between">
              <span>Resolution Rate</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="font-mono text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {closureRate}%
            </div>
            <div className="text-[11px] text-[var(--faint)]">
              {stats?.closed || 0} of {stats?.total || 0} observations closed
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-2">
            <div className="text-[11px] font-mono uppercase text-[var(--dim)] flex items-center justify-between">
              <span>Open Safety Hazards</span>
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="font-mono text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats?.open || 0}
            </div>
            <div className="text-[11px] text-[var(--faint)]">
              Requiring corrective engineering actions
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-2">
            <div className="text-[11px] font-mono uppercase text-[var(--dim)] flex items-center justify-between">
              <span>High / Critical Alerts</span>
              <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="font-mono text-3xl font-bold text-red-600 dark:text-red-400">
              {stats?.criticalHighOpen || 0}
            </div>
            <div className="text-[11px] text-[var(--faint)]">Immediate SLA monitoring required</div>
          </div>

          <div className="p-4 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-2">
            <div className="text-[11px] font-mono uppercase text-[var(--dim)] flex items-center justify-between">
              <span>SLA Target Breach</span>
              <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="font-mono text-3xl font-bold text-cyan-600 dark:text-cyan-400">
              {stats?.overdueCount || 0}
            </div>
            <div className="text-[11px] text-[var(--faint)]">Overdue past specified target date</div>
          </div>
        </div>

        {/* Breakdown Grids */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance */}
            <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-[var(--dim)] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <span>Category Volume &amp; Proportion</span>
                </h3>
              </div>

              <div className="space-y-3">
                {stats.byCategory.map((cat) => {
                  const pct = stats.total > 0 ? Math.round((cat.count / stats.total) * 100) : 0;
                  return (
                    <div key={cat.code} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text)] font-medium">{cat.label}</span>
                        <span className="font-mono font-bold text-[var(--dim)]">
                          {cat.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Asset Distribution */}
            <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase text-[var(--dim)] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Top Affected Sub-systems</span>
                </h3>
              </div>

              <div className="space-y-3">
                {stats.byAsset.map((asset) => {
                  const maxCount = Math.max(1, ...stats.byAsset.map((a) => a.count));
                  const barFill = (asset.count / maxCount) * 100;
                  return (
                    <div key={asset.asset} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text)] font-medium truncate max-w-[200px]">
                          {asset.asset}
                        </span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{asset.count}</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--bg)] rounded-full overflow-hidden border border-[var(--border)]">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${barFill}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SLA Standards Matrix Reference */}
        <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-[var(--dim)]">
            Standard Operating SLA Target Thresholds
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-[var(--bg)] border border-red-200 dark:border-red-900/60">
              <div className="text-red-700 dark:text-red-400 font-bold font-mono">Critical (24h)</div>
              <div className="text-[var(--dim)] text-[11px] mt-1">
                Direct safety risk to train movement or passengers. Immediate isolation.
              </div>
            </div>
            <div className="p-3 rounded bg-[var(--bg)] border border-orange-200 dark:border-orange-900/60">
              <div className="text-orange-700 dark:text-orange-400 font-bold font-mono">High (72h)</div>
              <div className="text-[var(--dim)] text-[11px] mt-1">
                Major equipment failure or safety barrier compromise. Rectify within 3 days.
              </div>
            </div>
            <div className="p-3 rounded bg-[var(--bg)] border border-amber-200 dark:border-amber-900/60">
              <div className="text-amber-700 dark:text-amber-400 font-bold font-mono">Medium (7 Days)</div>
              <div className="text-[var(--dim)] text-[11px] mt-1">
                Maintenance checklist omission, minor wear, routine repairs.
              </div>
            </div>
            <div className="p-3 rounded bg-[var(--bg)] border border-emerald-200 dark:border-emerald-900/60">
              <div className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">Low (14 Days)</div>
              <div className="text-[var(--dim)] text-[11px] mt-1">
                Cosmetic, finish defects, routine civil touch-ups.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
