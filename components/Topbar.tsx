'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Plus, Download, RefreshCw, Sun, Moon } from 'lucide-react';
import { useLayout } from './LayoutContext';
import { useTheme } from './ThemeContext';
import { LogoIcon } from './Logo';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
  showNewButton?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Topbar({
  title,
  subtitle,
  onOpenMobileMenu,
  showNewButton = true,
  onRefresh,
  isRefreshing = false,
}: TopbarProps) {
  const { openMobileMenu } = useLayout();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu || openMobileMenu}
          className="lg:hidden p-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--dim)] hover:text-[var(--text)]"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex-shrink-0">
          <Link href="/" className="block">
            <div className="p-1 rounded-md bg-[var(--panel)] border border-[var(--border)]">
              <LogoIcon className="w-5 h-5" />
            </div>
          </Link>
        </div>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[var(--text)] tracking-tight truncate flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[var(--dim)] truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--dim)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--dim)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        )}

        <a
          href="/api/export?format=csv"
          download
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] hover:bg-[var(--hover)] text-xs font-semibold text-[var(--dim)] hover:text-[var(--text)] transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Export CSV</span>
        </a>

        {showNewButton && (
          <Link
            href="/observations/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Observation</span>
          </Link>
        )}
      </div>
    </header>
  );
}
