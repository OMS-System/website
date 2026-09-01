'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { ToastProvider } from './ToastContext';
import { LayoutProvider, useLayout } from './LayoutContext';
import { ThemeProvider } from './ThemeContext';

function ShellInner({ children }: { children: React.ReactNode }) {
  const { mobileMenuOpen, closeMobileMenu } = useLayout();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-150">
      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">{children}</div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutProvider>
        <ToastProvider>
          <ShellInner>{children}</ShellInner>
        </ToastProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
}
