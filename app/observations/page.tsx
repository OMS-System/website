'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Topbar } from '@/components/Topbar';
import { ObservationTable } from '@/components/ObservationTable';
import { ObservationCards } from '@/components/ObservationCards';
import { ObservationSummary } from '@/lib/types';
import { CATEGORIES, SEVERITIES, STATUSES, ASSET_TYPES, METRO_STATIONS } from '@/lib/constants';
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
} from 'lucide-react';

function ObservationsContent({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu?: () => void;
}) {
  const searchParams = useSearchParams();

  const [observations, setObservations] = useState<ObservationSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'all');
  const [status, setStatus] = useState<string>(searchParams.get('status') || 'all');
  const [severity, setSeverity] = useState<string>(searchParams.get('severity') || 'all');
  const [asset, setAsset] = useState<string>(searchParams.get('asset') || 'all');
  const [station, setStation] = useState<string>(searchParams.get('station') || 'all');
  const [sortBy, setSortBy] = useState<string>('date_desc');

  const fetchObservations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (status !== 'all') params.set('status', status);
      if (severity !== 'all') params.set('severity', severity);
      if (asset !== 'all') params.set('asset', asset);
      if (station !== 'all') params.set('station', station);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (sortBy) params.set('sort', sortBy);

      const res = await fetch(`/api/observations?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setObservations(data.data);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Error loading observations:', err);
    } finally {
      setLoading(false);
    }
  }, [category, status, severity, asset, station, searchQuery, sortBy]);

  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);

  // Sync category param from sidebar link clicks
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setCategory(catParam);
    }
  }, [searchParams]);

  const resetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setStatus('all');
    setSeverity('all');
    setAsset('all');
    setStation('all');
    setSortBy('date_desc');
  };

  const hasActiveFilters =
    category !== 'all' ||
    status !== 'all' ||
    severity !== 'all' ||
    asset !== 'all' ||
    station !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar
        title="All Site Observations"
        subtitle={`${total} observation record(s) in repository`}
        onOpenMobileMenu={onOpenMobileMenu}
        onRefresh={fetchObservations}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-4">
        {/* Filter Bar */}
        <div className="p-4 rounded-lg bg-[var(--panel)] border border-[var(--border)] space-y-3 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dim)]" />
              <input
                type="text"
                placeholder="Search observation ID, location, description, observer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] placeholder-[var(--faint)] focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--dim)] hover:text-[var(--text)] cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick View Switcher & CSV export */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex bg-[var(--bg)] p-0.5 rounded border border-[var(--border)]">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-[var(--panel)] text-amber-600 dark:text-amber-400 font-bold shadow-xs' : 'text-[var(--dim)]'
                  }`}
                  title="Table View"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === 'cards' ? 'bg-[var(--panel)] text-amber-600 dark:text-amber-400 font-bold shadow-xs' : 'text-[var(--dim)]'
                  }`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--hover)] text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Facet Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-[var(--border)]">
            {/* Category */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--faint)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORIES).map(([code, meta]) => (
                  <option key={code} value={code}>
                    {meta.code} - {meta.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--faint)] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
              >
                <option value="all">All Statuses</option>
                {Object.keys(STATUSES).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--faint)] mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
              >
                <option value="all">All Severities</option>
                {Object.keys(SEVERITIES).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Asset Subsystem */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--faint)] mb-1">
                Sub-system
              </label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
              >
                <option value="all">All Sub-systems</option>
                {ASSET_TYPES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Station / Location */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-[var(--faint)] mb-1">
                Station
              </label>
              <select
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
              >
                <option value="all">All Stations</option>
                {METRO_STATIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info & Sort */}
        <div className="flex items-center justify-between text-xs text-[var(--dim)] px-1 font-mono">
          <div>
            Showing <strong className="text-[var(--text)]">{observations.length}</strong> of{' '}
            <strong className="text-[var(--text)]">{total}</strong> findings
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 bg-[var(--panel)] border border-[var(--border)] rounded text-xs text-[var(--text)] focus:outline-hidden"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="severity">Severity (Critical first)</option>
              <option value="status">Status (Open first)</option>
            </select>
          </div>
        </div>

        {/* Observations List */}
        {loading ? (
          <div className="p-16 text-center text-[var(--dim)] bg-[var(--panel)] rounded-lg border border-[var(--border)]">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs font-mono">Loading observation data...</span>
          </div>
        ) : viewMode === 'table' ? (
          <ObservationTable
            observations={observations}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        ) : (
          <ObservationCards observations={observations} />
        )}
      </main>
    </div>
  );
}

export default function ObservationsPage(props: any) {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-[var(--dim)] font-mono text-xs">
          Loading observations module...
        </div>
      }
    >
      <ObservationsContent {...props} />
    </Suspense>
  );
}
