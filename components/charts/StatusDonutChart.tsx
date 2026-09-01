'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ObservationStatus } from '@/lib/types';
import { STATUSES } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';

interface StatusDonutChartProps {
  data: {
    status: ObservationStatus;
    count: number;
    color: string;
  }[];
  total: number;
  closed: number;
}

export function StatusDonutChart({ data, total, closed }: StatusDonutChartProps) {
  const closureRate = total > 0 ? Math.round((closed / total) * 100) : 0;

  const getStatusColor = (st: ObservationStatus) => {
    return STATUSES[st]?.color || '#f59e0b';
  };

  const chartData = data.filter((d) => d.count > 0);

  return (
    <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Status &amp; SLA Compliance</span>
          </h3>
          <p className="text-[11px] text-[var(--faint)] mt-0.5">
            Audit resolution progress
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          {closureRate}% Closed
        </span>
      </div>

      {/* Donut Chart with Center KPI */}
      <div className="relative h-48 w-full flex items-center justify-center my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  return (
                    <div className="bg-[var(--panel)] border border-[var(--border)] px-3 py-2 rounded-lg shadow-lg text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: getStatusColor(item.status as ObservationStatus) }}
                        />
                        <span className="font-semibold text-[var(--text)]">{item.status}:</span>
                        <span className="font-mono font-bold text-[var(--text)]">
                          {item.count} ({pct}%)
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={chartData.length > 0 ? chartData : [{ status: 'Open', count: 1, color: '#f59e0b' }]}
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={74}
              paddingAngle={4}
              dataKey="count"
              nameKey="status"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={getStatusColor(entry.status)}
                  stroke="var(--panel)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-mono font-bold text-[var(--text)] leading-none">
            {total}
          </span>
          <span className="text-[10px] font-mono text-[var(--dim)] uppercase tracking-wider mt-0.5">
            Total Issues
          </span>
        </div>
      </div>

      {/* Legend & Count Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)]">
        {data.map((item) => {
          const color = getStatusColor(item.status);
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.status} className="p-2 rounded bg-[var(--bg)] text-center space-y-0.5">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--dim)]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span>{item.status}</span>
              </div>
              <div className="font-mono text-xs font-bold text-[var(--text)]">
                {item.count} <span className="text-[10px] text-[var(--faint)] font-normal">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
