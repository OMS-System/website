'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Topbar } from '@/components/Topbar';
import { StatCard } from '@/components/StatCard';
import { ActivityTrendChart } from '@/components/charts/ActivityTrendChart';
import { StatusDonutChart } from '@/components/charts/StatusDonutChart';
import { CategoryBarChart } from '@/components/charts/CategoryBarChart';
import { SeverityRiskChart } from '@/components/charts/SeverityRiskChart';
import { RecentActivityList } from '@/components/RecentActivityList';
import { DashboardStats } from '@/lib/types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

export default function DashboardPage({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu?: () => void;
}) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
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
      if (isRefresh) setRefreshing(false);
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
        title="Operations Dashboard"
        subtitle="Live oversight of Safety, Quality, Equipment and Compliance Observations"
        onOpenMobileMenu={onOpenMobileMenu}
        onRefresh={() => fetchStats(true)}
        isRefreshing={refreshing}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Cards Row */}
        {loading || !stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-[var(--panel)] border border-[var(--border)] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Observations"
              value={stats.total}
              color="#64748b"
              subLabel="All recorded"
              icon={Layers}
            />
            <StatCard
              label="Open Findings"
              value={stats.open + stats.inReview}
              color="#d97706"
              subLabel={`${stats.open} new · ${stats.inReview} in review`}
              icon={AlertTriangle}
            />
            <StatCard
              label="Resolved & Closed"
              value={`${closureRate}%`}
              color="#10b981"
              subLabel={`${stats.closed} of ${stats.total} closed`}
              icon={CheckCircle2}
            />
            <StatCard
              label="Critical & High"
              value={stats.criticalHighOpen}
              color="#ef4444"
              subLabel="Immediate priority"
              icon={ShieldAlert}
            />
          </div>
        )}

        {/* Overdue SLA Notice (only when overdue exists) */}
        {stats && stats.overdueCount > 0 && (
          <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center justify-between gap-3 text-xs text-red-800 dark:text-red-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>
                <strong className="font-semibold">{stats.overdueCount} observation(s)</strong> have exceeded SLA target closure dates.
              </span>
            </div>
            <Link
              href="/observations?status=Open"
              className="text-red-700 dark:text-red-400 font-semibold hover:underline font-mono"
            >
              Review Now →
            </Link>
          </div>
        )}

        {/* Primary Graphs & Charts Section */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Activity Trend Chart (7-8 cols) */}
            <div className="lg:col-span-8">
              <ActivityTrendChart data={stats.weeklyTrend} />
            </div>

            {/* Status & Compliance Donut Chart (4-5 cols) */}
            <div className="lg:col-span-4">
              <StatusDonutChart
                data={stats.byStatus}
                total={stats.total}
                closed={stats.closed}
              />
            </div>
          </div>
        )}

        {/* Secondary Graphs & Breakdown Section */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Category Bar Chart */}
            <div className="lg:col-span-6">
              <CategoryBarChart data={stats.byCategory} />
            </div>

            {/* Severity Risk & Hotspots */}
            <div className="lg:col-span-6">
              <SeverityRiskChart
                severityData={stats.bySeverity}
                assetData={stats.byAsset}
                total={stats.total}
              />
            </div>
          </div>
        )}

        {/* Bottom Row: Recent Feed & Quick Actions */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <RecentActivityList
                observations={stats.recentObservations}
                history={stats.recentHistory}
              />
            </div>

            {/* Quick Action Navigation Card */}
            <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)]">
                  Quick Operations Access
                </h3>
                <p className="text-xs text-[var(--dim)]">
                  Rapid shortcuts for inspectors and site supervisors
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/observations/new"
                  className="w-full py-2.5 px-3 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    <span>Log New Observation</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/observations"
                  className="w-full py-2.5 px-3 rounded-md bg-[var(--bg)] hover:bg-[var(--hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition-colors flex items-center justify-between"
                >
                  <span>Browse Observation Registry</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--faint)]" />
                </Link>

                <Link
                  href="/matrix"
                  className="w-full py-2.5 px-3 rounded-md bg-[var(--bg)] hover:bg-[var(--hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition-colors flex items-center justify-between"
                >
                  <span>Asset &amp; Station Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--faint)]" />
                </Link>

                <Link
                  href="/analytics"
                  className="w-full py-2.5 px-3 rounded-md bg-[var(--bg)] hover:bg-[var(--hover)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition-colors flex items-center justify-between"
                >
                  <span>SLA Performance Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--faint)]" />
                </Link>
              </div>

              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--faint)]">
                <span>Database: Local SQLite</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Live Synced</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
