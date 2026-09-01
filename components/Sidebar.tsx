'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  ListFilter,
  BarChart3,
  Layers,
  Settings,
  ShieldAlert,
  CheckCircle2,
  Wrench,
  CalendarCheck,
  ClipboardList,
  Train,
  Database,
  Sun,
  Moon,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { CategoryCode } from '@/lib/types';
import { useTheme } from './ThemeContext';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const categoryIcons: Record<CategoryCode, React.ElementType> = {
  SAF: ShieldAlert,
  QAL: CheckCircle2,
  EQP: Wrench,
  MNT: CalendarCheck,
  INS: ClipboardList,
};

function CategoryLinks({ onClose, pathname }: { onClose?: () => void; pathname: string }) {
  const searchParams = useSearchParams();
  const currentCat = searchParams.get('category');

  return (
    <div className="space-y-1">
      {(Object.keys(CATEGORIES) as CategoryCode[]).map((code) => {
        const cat = CATEGORIES[code];
        const Icon = categoryIcons[code];
        const isCatActive = pathname === '/observations' && currentCat === code;

        return (
          <Link
            key={code}
            href={`/observations?category=${code}`}
            onClick={onClose}
            className={`flex items-center justify-between px-3 py-2 rounded-md text-xs transition-all ${
              isCatActive
                ? 'bg-[var(--hover)] text-[var(--text)] font-semibold border border-[var(--border-light)]'
                : 'text-[var(--dim)] hover:text-[var(--text)] hover:bg-[var(--hover)]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cat.color }} />
              <span className="truncate">{cat.label}</span>
            </div>
            <span
              className="font-mono text-[10.5px] px-1.5 py-0.5 rounded font-bold"
              style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
            >
              {code}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function CategoryLinksFallback({ onClose }: { onClose?: () => void }) {
  return (
    <div className="space-y-1">
      {(Object.keys(CATEGORIES) as CategoryCode[]).map((code) => {
        const cat = CATEGORIES[code];
        const Icon = categoryIcons[code];
        return (
          <Link
            key={code}
            href={`/observations?category=${code}`}
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-[var(--dim)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: cat.color }} />
              <span className="truncate">{cat.label}</span>
            </div>
            <span
              className="font-mono text-[10.5px] px-1.5 py-0.5 rounded font-bold"
              style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
            >
              {code}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/observations/new', label: 'New Observation', icon: PlusCircle, highlight: true },
    { href: '/observations', label: 'All Observations', icon: ListFilter },
    { href: '/analytics', label: 'Analytics & SLA', icon: BarChart3 },
    { href: '/matrix', label: 'Asset Matrix', icon: Layers },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[var(--panel)] border-r border-[var(--border)] flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <Logo size="md" href="/" />
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold border border-emerald-500/20">
            LIVE
          </span>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isLinkActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-xs font-semibold'
                      : item.highlight
                      ? 'text-[var(--text)] hover:bg-[var(--hover)] border border-amber-500/30 font-medium'
                      : 'text-[var(--dim)] hover:text-[var(--text)] hover:bg-[var(--hover)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                  <span>{item.label}</span>
                  {item.highlight && !active && (
                    <span className="ml-auto text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded">
                      +LOG
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Categories Quick Filter */}
          <div>
            <div className="px-3 pb-2 text-[10.5px] font-mono font-bold uppercase tracking-widest text-[var(--faint)]">
              Categories
            </div>
            <Suspense fallback={<CategoryLinksFallback onClose={onClose} />}>
              <CategoryLinks onClose={onClose} pathname={pathname} />
            </Suspense>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[var(--border)] space-y-2 bg-[var(--panel-alt)]/60">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/settings"
              onClick={onClose}
              className={`flex-1 flex items-center gap-2 px-2.5 py-2 rounded-md text-xs transition-colors ${
                pathname === '/settings'
                  ? 'bg-[var(--hover)] text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-[var(--dim)] hover:text-[var(--text)] hover:bg-[var(--hover)]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            {/* Quick Theme Toggle in Footer */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-[var(--hover)] text-[var(--dim)] hover:text-[var(--text)] border border-[var(--border)] transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>
          </div>

          <div className="p-2.5 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[11px] space-y-1">
            <div className="flex items-center justify-between text-[var(--dim)]">
              <span className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>SQLite DB</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <div className="text-[var(--faint)] text-[10px] leading-relaxed">
              Replacing legacy OneDrive &amp; PPT sheets.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
