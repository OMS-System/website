'use client';

import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

export interface ItemDetail {
  label: string;
  value: string;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: React.ReactNode;
  itemDetails?: ItemDetail[];
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Observation',
  description,
  itemDetails = [],
  confirmText = 'Delete Permanently',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}: DeleteConfirmModalProps) {
  // Handle ESC key press to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
      onClick={() => !isLoading && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="relative w-full max-w-md bg-[var(--panel)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle glowing danger top accent stripe */}
        <div
          className={`h-1 w-full ${
            isDanger
              ? 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-600'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
          }`}
        />

        {/* Modal Header & Close Button */}
        <div className="p-5 sm:p-6 pb-2 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDanger
                  ? 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25'
                  : 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25'
              }`}
            >
              {isDanger ? (
                <Trash2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>

            <div>
              <h3
                id="confirm-dialog-title"
                className="text-base font-bold text-[var(--text)] tracking-tight"
              >
                {title}
              </h3>
              <div className="text-xs text-[var(--dim)] leading-relaxed mt-1">
                {description || 'Are you sure you want to proceed with this deletion?'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-md text-[var(--faint)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition-colors cursor-pointer disabled:opacity-40"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details & Warning Box */}
        <div className="px-5 sm:px-6 py-3 space-y-3">
          {itemDetails.length > 0 && (
            <div className="p-3 rounded-lg bg-[var(--panel-alt)] border border-[var(--border)] divide-y divide-[var(--border)] text-xs">
              {itemDetails.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-2 py-1.5 ${
                    idx === 0 ? 'pt-0' : ''
                  } ${idx === itemDetails.length - 1 ? 'pb-0' : ''}`}
                >
                  <span className="text-[var(--dim)] font-medium">{item.label}</span>
                  <span className="font-mono font-bold text-[var(--text)] truncate max-w-[200px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div
            className={`p-2.5 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2 ${
              isDanger
                ? 'bg-rose-500/8 dark:bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
                : 'bg-amber-500/8 dark:bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Warning:</strong> This action cannot be undone. All associated history logs and uploaded evidence photos will be permanently removed.
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-[var(--panel-alt)] border-t border-[var(--border)] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-[var(--panel)] border border-[var(--border)] hover:bg-[var(--hover)] hover:border-[var(--border-light)] text-xs font-semibold text-[var(--dim)] hover:text-[var(--text)] transition-all cursor-pointer disabled:opacity-40"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-rose-600/25 hover:shadow-rose-600/40'
                : 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 shadow-amber-600/25 hover:shadow-amber-600/40'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {isDanger ? (
                  <Trash2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
