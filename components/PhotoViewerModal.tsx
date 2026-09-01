'use client';

import React from 'react';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { ObservationPhoto } from '@/lib/types';

interface PhotoViewerModalProps {
  photo: ObservationPhoto | null;
  onClose: () => void;
}

export function PhotoViewerModal({ photo, onClose }: PhotoViewerModalProps) {
  const [scale, setScale] = React.useState(1);

  if (!photo) return null;

  const stageBadge = {
    initial: { label: 'Initial Finding', color: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800' },
    rectification: { label: 'In Rectification', color: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-400 border-teal-300 dark:border-teal-800' },
    closure: { label: 'Closure Verification', color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' },
  }[photo.stage] || { label: photo.stage, color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] bg-[var(--panel)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--panel-alt)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${stageBadge.color}`}
            >
              {stageBadge.label}
            </span>
            {photo.caption && (
              <span className="text-xs text-[var(--dim)] truncate hidden sm:inline">
                {photo.caption}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.min(2.5, s + 0.25))}
              className="p-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--dim)] hover:text-[var(--text)] cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
              className="p-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--dim)] hover:text-[var(--text)] cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <a
              href={photo.dataUrl}
              download={`evidence-${photo.observationId}-${photo.id}.jpg`}
              className="p-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--dim)] hover:text-[var(--text)]"
              title="Download image"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] text-[var(--dim)] hover:text-[var(--text)] cursor-pointer"
              title="Close viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[300px] max-h-[70vh] bg-slate-950/90 dark:bg-[#0c1017]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.dataUrl}
            alt={photo.caption || 'Observation evidence photo'}
            className="max-h-full max-w-full object-contain rounded transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
          />
        </div>

        {/* Footer */}
        {photo.caption && (
          <div className="p-3 border-t border-[var(--border)] bg-[var(--panel-alt)] text-xs text-[var(--text)] font-mono">
            {photo.caption}
          </div>
        )}
      </div>
    </div>
  );
}
