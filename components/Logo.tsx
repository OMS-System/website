'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
  className?: string;
}

export function LogoIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SOMS Logo"
    >
      <defs>
        {/* ClickUp-style vibrant modern gradients */}
        <linearGradient id="somsChevronGrad" x1="4" y1="4" x2="32" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="somsArcGrad" x1="6" y1="22" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Upward Chevron / Arrow (ClickUp Top Mark) */}
      <path
        d="M6 14.5L18 4.5L30 14.5L25.5 18L18 11.5L10.5 18L6 14.5Z"
        fill="url(#somsChevronGrad)"
      />

      {/* Observation Curve / Smile (ClickUp Bottom Smile Arc) */}
      <path
        d="M7 23.5C11 29 25 29 29 23.5"
        stroke="url(#somsArcGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  size = 'md',
  showText = true,
  href = '/',
  className = '',
}: LogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const titleSizes = {
    sm: 'text-sm font-bold tracking-tight',
    md: 'text-base font-extrabold tracking-tight',
    lg: 'text-xl font-black tracking-tight',
  }[size];

  const subSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* ClickUp-style Logo Mark Container */}
      <div className="flex-shrink-0 p-1.5 rounded-lg bg-[var(--bg)] border border-[var(--border)] shadow-xs transition-transform duration-200 group-hover:scale-105">
        <LogoIcon className={iconSizes} />
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${titleSizes} text-[var(--text)] font-sans`}>
              SOMS
            </span>
          </div>
          <span className={`${subSizes} text-[var(--dim)] font-medium tracking-normal mt-0.5 truncate`}>
            Site Observation Manage
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
