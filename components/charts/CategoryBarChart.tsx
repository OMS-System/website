'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CategoryCode } from '@/lib/types';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface CategoryBarChartProps {
  data: {
    code: CategoryCode;
    label: string;
    count: number;
    color: string;
  }[];
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  const chartData = data.map((item) => ({
    ...item,
    shortName: item.label.split(' ')[0],
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
  }));

  return (
    <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)] flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>Findings by Functional Category</span>
          </h3>
          <p className="text-[11px] text-[var(--faint)] mt-0.5">
            Distribution across Safety, Quality, Equipment, Maintenance, and Inspection
          </p>
        </div>
        <Link
          href="/observations"
          className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline"
        >
          View all →
        </Link>
      </div>

      {/* Bar Chart */}
      <div className="h-48 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
              opacity={0.6}
            />
            <XAxis
              dataKey="code"
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
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[var(--panel)] border border-[var(--border)] px-3 py-2 rounded-lg shadow-lg text-xs font-sans space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-bold text-[var(--text)]">{item.label} ({item.code})</span>
                      </div>
                      <div className="font-mono text-[var(--dim)] flex items-center justify-between gap-3 pt-1 border-t border-[var(--border)]">
                        <span>Findings:</span>
                        <span className="font-bold text-[var(--text)]">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {chartData.map((entry) => (
                <Cell key={entry.code} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Clean Category Chips Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-[var(--border)]">
        {data.map((cat) => {
          const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
          return (
            <Link
              key={cat.code}
              href={`/observations?category=${cat.code}`}
              className="p-2 rounded bg-[var(--bg)] hover:bg-[var(--hover)] border border-[var(--border)] transition-colors text-center group"
            >
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[var(--text)]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span>{cat.code}</span>
              </div>
              <div className="text-[10px] text-[var(--dim)] font-mono mt-0.5">
                {cat.count} ({pct}%)
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
