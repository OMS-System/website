'use client';

import React, { useState } from 'react';
import { Topbar } from '@/components/Topbar';
import { useToast } from '@/components/ToastContext';
import { useTheme } from '@/components/ThemeContext';
import {
  Database,
  RefreshCw,
  Download,
  Server,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

export default function SettingsPage({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu?: () => void;
}) {
  const { showToast } = useToast();
  const { theme, setTheme } = useTheme();
  const [seeding, setSeeding] = useState(false);

  const handleReseed = async () => {
    if (
      !confirm(
        'Warning: This will reset the database and restore default realistic sample observations. Continue?'
      )
    ) {
      return;
    }

    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('Database successfully re-seeded with demo records!', 'success');
      } else {
        showToast(data.error || 'Failed to re-seed', 'error');
      }
    } catch {
      showToast('Error re-seeding database', 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar
        title="Settings &amp; Database Diagnostics"
        subtitle="Repository management, backup exports, theme preferences, and system configuration"
        onOpenMobileMenu={onOpenMobileMenu}
        showNewButton={false}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6">
        {/* Appearance / Theme Selector */}
        <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase text-[var(--text)]">
                Appearance &amp; Display Theme
              </h2>
              <p className="text-[11px] text-[var(--dim)]">
                Choose default Light theme or dark high-contrast mode for field &amp; control room work.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 uppercase">
              Current: {theme}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-[var(--bg)] border-[var(--border)] hover:bg-[var(--hover)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Light Theme (Default)</div>
                  <div className="text-[10.5px] text-[var(--dim)]">Bright, clean daytime contrast</div>
                </div>
              </div>
              {theme === 'light' && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-[var(--bg)] border-[var(--border)] hover:bg-[var(--hover)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-amber-400">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Dark Theme</div>
                  <div className="text-[10.5px] text-[var(--dim)]">Low-light nighttime &amp; OCC operations</div>
                </div>
              </div>
              {theme === 'dark' && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Database Status Card */}
        <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-mono font-bold uppercase text-[var(--text)]">
                  SQLite Embedded Database Engine
                </h2>
                <p className="text-[11px] text-[var(--dim)]">
                  File-backed persistent storage at <code className="text-cyan-600 dark:text-cyan-400 font-mono">/data/soms.db</code>
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 led-pulse" />
              OPERATIONAL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--faint)] uppercase">Journal Mode</div>
              <div className="text-[var(--text)] font-bold mt-0.5">WAL (Write-Ahead)</div>
            </div>
            <div className="p-3 rounded bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--faint)] uppercase">Foreign Keys</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">CASCADE Enabled</div>
            </div>
            <div className="p-3 rounded bg-[var(--bg)] border border-[var(--border)]">
              <div className="text-[10px] text-[var(--faint)] uppercase">Sync Status</div>
              <div className="text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">Synchronous / Local</div>
            </div>
          </div>
        </div>

        {/* Actions: Re-seed & Backups */}
        <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="text-xs font-mono font-bold uppercase text-[var(--dim)]">
            Data Management Actions
          </div>

          <div className="space-y-3">
            {/* Re-seed */}
            <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--text)]">
                  Restore Realistic Demo Observations
                </div>
                <div className="text-[11px] text-[var(--dim)]">
                  Populates the database with 7+ rich sample findings across Safety, PSD, Track, OHE, and Telecom.
                </div>
              </div>

              <button
                onClick={handleReseed}
                disabled={seeding}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                <span>{seeding ? 'Seeding...' : 'Reset & Re-seed'}</span>
              </button>
            </div>

            {/* Export JSON Backup */}
            <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--text)]">
                  Export Complete JSON Repository
                </div>
                <div className="text-[11px] text-[var(--dim)]">
                  Download complete raw observation records for backup, data warehousing or external analytics.
                </div>
              </div>

              <a
                href="/api/export?format=json"
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] hover:bg-[var(--hover)] text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 transition-colors whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </a>
            </div>
          </div>
        </div>

        {/* System Architecture Info */}
        <div className="p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-[var(--dim)] flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-500" />
            <span>Architecture &amp; Framework Details</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--faint)] block">Framework</span>
              <span className="font-bold text-[var(--text)]">Next.js 16 (App Router)</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--faint)] block">Language</span>
              <span className="font-bold text-[var(--text)]">TypeScript (Strict)</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--faint)] block">Styling</span>
              <span className="font-bold text-[var(--text)]">Tailwind CSS</span>
            </div>
            <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)]">
              <span className="text-[10px] text-[var(--faint)] block">Compliance</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Audit-ready V2.1</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
