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
    initial: {
      label: 'Initial Finding',
      bg: '#e5484d18',
      color: '#e5484d',
      border: '#e5484d35',
    },
    rectification: {
      label: 'In Rectification',
      bg: '#7c3aed18',
      color: '#7c3aed',
      border: '#7c3aed35',
    },
    closure: {
      label: 'Closure Verification',
      bg: '#16a34a18',
      color: '#16a34a',
      border: '#16a34a35',
    },
  }[photo.stage] || {
    label: photo.stage,
    bg: '#64748b18',
    color: '#64748b',
    border: '#64748b35',
  };

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
              className="text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider"
              style={{
                backgroundColor: stageBadge.bg,
                color: stageBadge.color,
                borderColor: stageBadge.border,
              }}
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
