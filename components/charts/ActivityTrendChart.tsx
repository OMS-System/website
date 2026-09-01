'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

interface ActivityTrendChartProps {
  data: {
    date: string;
    label: string;
    logged: number;
    resolved: number;
  }[];
}

export function ActivityTrendChart({ data }: ActivityTrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<'both' | 'logged' | 'resolved'>('both');

  const totalLogged = data.reduce((acc, curr) => acc + curr.logged, 0);
  const totalResolved = data.reduce((acc, curr) => acc + curr.resolved, 0);

  return (
    <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)]">
              Observation Activity &amp; Resolution Velocity
            </h3>
          </div>
          <p className="text-[11px] text-[var(--faint)] mt-0.5">
            Daily comparison of new findings logged vs corrective actions resolved
          </p>
        </div>

        {/* Filter / Toggle Pills */}
        <div className="flex items-center bg-[var(--bg)] p-0.5 rounded-md border border-[var(--border)] text-[11px] font-mono">
          <button
            onClick={() => setActiveMetric('both')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeMetric === 'both'
                ? 'bg-[var(--panel)] text-[var(--text)] font-bold shadow-xs'
                : 'text-[var(--dim)] hover:text-[var(--text)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveMetric('logged')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeMetric === 'logged'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                : 'text-[var(--dim)] hover:text-[var(--text)]'
            }`}
          >
            Logged ({totalLogged})
          </button>
          <button
            onClick={() => setActiveMetric('resolved')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeMetric === 'resolved'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                : 'text-[var(--dim)] hover:text-[var(--text)]'
            }`}
          >
            Resolved ({totalResolved})
          </button>
        </div>
      </div>

      {/* Recharts Area */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLogged" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
              opacity={0.6}
            />
            <XAxis
              dataKey="label"
              stroke="var(--faint)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--faint)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[var(--panel)] border border-[var(--border)] p-2.5 rounded-lg shadow-lg text-xs font-sans space-y-1.5 z-50">
                      <div className="font-mono font-bold text-[var(--text)] border-b border-[var(--border)] pb-1">
                        {label}
                      </div>
                      {payload.map((entry: any) => (
                        <div
                          key={entry.dataKey}
                          className="flex items-center justify-between gap-4"
                        >
                          <span
                            className="flex items-center gap-1.5 text-xs font-medium"
                            style={{ color: entry.color }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            {entry.name}:
                          </span>
                          <span className="font-mono font-bold text-[var(--text)]">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {(activeMetric === 'both' || activeMetric === 'logged') && (
              <Area
                type="monotone"
                dataKey="logged"
                name="Logged Findings"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorLogged)"
              />
            )}
            {(activeMetric === 'both' || activeMetric === 'resolved') && (
              <Area
                type="monotone"
                dataKey="resolved"
                name="Resolved / Closed"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorResolved)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics */}
      <div className="pt-3 mt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--dim)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span>New Observations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span>Rectified &amp; Closed</span>
          </div>
        </div>
        <div className="font-mono text-[var(--faint)] flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>Net Resolution: +{totalResolved - totalLogged >= 0 ? totalResolved - totalLogged : totalResolved}</span>
        </div>
      </div>
    </div>
  );
}
