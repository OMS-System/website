'use client';

import React, { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/Topbar';
import { CategoryBadge, SeverityBadge, StatusBadge } from '@/components/Badges';
import { PhotoViewerModal } from '@/components/PhotoViewerModal';
import { PrintReportView } from '@/components/PrintReportView';
import { useToast } from '@/components/ToastContext';
import { Observation, ObservationPhoto, ObservationStatus, PhotoStage } from '@/lib/types';
import { CATEGORIES, SEVERITIES, STATUSES, formatDate } from '@/lib/constants';
import {
  ArrowLeft,
  Printer,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  MapPin,
  Wrench,
  User,
  Calendar,
  Camera,
  MessageSquare,
  Send,
} from 'lucide-react';

// Client-side image compressor targeting ~300KB
function fileToCompressedDataUrl(file: File, maxW = 1000, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, maxW / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context not available');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

export default function ObservationDetailPage({
  params,
  onOpenMobileMenu,
}: {
  params: Promise<{ id: string }>;
  onOpenMobileMenu?: () => void;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [observation, setObservation] = useState<Observation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<ObservationPhoto | null>(null);

  // Update Status Form
  const [newStatus, setNewStatus] = useState<ObservationStatus>('In Review');
  const [updateBy, setUpdateBy] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updatePhotos, setUpdatePhotos] = useState<
    Array<{ dataUrl: string; stage: PhotoStage; caption: string }>
  >([]);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchObservation = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/observations/${resolvedParams.id}`);
      const data = await res.json();
      if (data.success) {
        setObservation(data.data);
        setNewStatus(data.data.status);
      } else {
        showToast(data.error || 'Observation not found', 'error');
      }
    } catch (err) {
      console.error('Failed to load observation:', err);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, showToast]);

  useEffect(() => {
    fetchObservation();
    const savedName = localStorage.getItem('soms_last_observer');
    if (savedName) setUpdateBy(savedName);
  }, [fetchObservation]);

  const copyIdToClipboard = () => {
    if (!observation) return;
    navigator.clipboard.writeText(observation.id);
    showToast(`Copied ID ${observation.id} to clipboard`, 'success');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - updatePhotos.length);
    for (const file of files) {
      try {
        const compressed = await fileToCompressedDataUrl(file);
        setUpdatePhotos((prev) => [
          ...prev,
          {
            dataUrl: compressed,
            stage: newStatus === 'Closed' ? 'closure' : 'rectification',
            caption: file.name.replace(/\.[^/.]+$/, ''),
          },
        ]);
      } catch {
        showToast(`Could not process ${file.name}`, 'error');
      }
    }
    e.target.value = '';
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observation) return;
    if (!updateBy.trim() || !remarks.trim()) {
      showToast('Please enter your name and update remarks', 'warning');
      return;
    }

    setUpdating(true);
    try {
      localStorage.setItem('soms_last_observer', updateBy.trim());

      const res = await fetch(`/api/observations/${observation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          byName: updateBy.trim(),
          remarks: remarks.trim(),
          photos: updatePhotos,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Status updated to ${newStatus}`, 'success');
        setObservation(data.data);
        setRemarks('');
        setUpdatePhotos([]);
      } else {
        showToast(data.error || 'Failed to update observation', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!observation) return;
    if (!confirm(`Are you sure you want to permanently delete observation ${observation.id}?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/observations/${observation.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Observation ${observation.id} deleted`, 'info');
        router.push('/observations');
      } else {
        showToast(data.error || 'Failed to delete observation', 'error');
      }
    } catch {
      showToast('Failed to delete observation', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Observation Detail" onOpenMobileMenu={onOpenMobileMenu} />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!observation) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Observation Detail" onOpenMobileMenu={onOpenMobileMenu} />
        <div className="p-8 max-w-xl mx-auto text-center space-y-4">
          <div className="text-base font-bold text-[var(--text)]">Observation Not Found</div>
          <p className="text-xs text-[var(--dim)]">
            The requested finding record could not be located in the database.
          </p>
          <Link
            href="/observations"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[var(--panel)] border border-[var(--border)] text-xs text-amber-600 dark:text-amber-400 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Observations</span>
          </Link>
        </div>
      </div>
    );
  }

  const sevMeta = SEVERITIES[observation.severity] || SEVERITIES.Medium;
  const isOverdue =
    observation.status !== 'Closed' &&
    observation.dueDate &&
    new Date(observation.dueDate) < new Date();

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Official Print Sheet for Audits */}
      <PrintReportView observation={observation} />

      {/* Normal UI Screen */}
      <div className="no-print flex-1 flex flex-col min-w-0">
        <Topbar
          title={observation.id}
          subtitle={`Logged on ${formatDate(observation.createdAt)}`}
          onOpenMobileMenu={onOpenMobileMenu}
          onRefresh={fetchObservation}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
          {/* Navigation and Top Actions */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Link
              href="/observations"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all observations</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={copyIdToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] hover:bg-[var(--hover)] text-xs font-semibold text-[var(--dim)] hover:text-[var(--text)] transition-colors cursor-pointer"
                title="Copy Observation ID"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="font-mono">{observation.id}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--panel)] border border-[var(--border)] hover:bg-[var(--hover)] text-xs font-semibold text-[var(--dim)] hover:text-[var(--text)] transition-colors cursor-pointer"
                title="Print Official Report Sheet"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Print Report</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800/60 hover:bg-red-200 dark:hover:bg-red-900/40 text-xs font-semibold text-red-700 dark:text-red-400 transition-colors cursor-pointer"
                title="Delete Observation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Main Card */}
          <div className="rounded-lg bg-[var(--panel)] border border-[var(--border)] overflow-hidden shadow-xs">
            {/* Header / Badges Row */}
            <div className="p-4 sm:p-6 border-b border-[var(--border)] bg-[var(--panel-alt)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <CategoryBadge category={observation.category} size="lg" />
                  <SeverityBadge severity={observation.severity} size="lg" />
                  <StatusBadge status={observation.status} size="lg" />
                  {isOverdue && (
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 led-pulse" />
                      SLA OVERDUE
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">
                  {observation.site}
                </h2>
              </div>

              {observation.status === 'Closed' && observation.closedAt && (
                <div className="p-2.5 rounded bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="font-bold">Verified &amp; Closed</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400/80">
                      by {observation.closedBy || 'QA Inspector'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] border-b border-[var(--border)] bg-[var(--panel)]">
              <div className="p-4 space-y-1">
                <div className="text-[10.5px] font-mono uppercase text-[var(--faint)] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[var(--dim)]" />
                  <span>Station / Location</span>
                </div>
                <div className="text-xs font-semibold text-[var(--text)]">
                  {observation.station || observation.site}
                </div>
                {observation.locationChainage && (
                  <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                    {observation.locationChainage}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1">
                <div className="text-[10.5px] font-mono uppercase text-[var(--faint)] flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-[var(--dim)]" />
                  <span>Asset / Subsystem</span>
                </div>
                <div className="text-xs font-semibold text-[var(--text)]">
                  {observation.asset || 'General Facility'}
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="text-[10.5px] font-mono uppercase text-[var(--faint)] flex items-center gap-1">
                  <User className="w-3 h-3 text-[var(--dim)]" />
                  <span>Inspecting Officer</span>
                </div>
                <div className="text-xs font-semibold text-[var(--text)]">
                  {observation.observedBy}
                </div>
                {observation.observerEmail && (
                  <div className="text-[10.5px] text-[var(--dim)] truncate">
                    {observation.observerEmail}
                  </div>
                )}
              </div>

              <div className="p-4 space-y-1">
                <div className="text-[10.5px] font-mono uppercase text-[var(--faint)] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[var(--dim)]" />
                  <span>Target Closure SLA</span>
                </div>
                <div className="text-xs font-semibold text-[var(--text)]">
                  {observation.dueDate || 'Standard SLA'}
                </div>
                <div className="text-[10px] font-mono text-[var(--dim)]">
                  SLA: {sevMeta.slaHours} hours
                </div>
              </div>
            </div>

            {/* Description Block */}
            <div className="p-5 border-b border-[var(--border)] space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)]">
                Observation Finding Description
              </div>
              <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap bg-[var(--bg)] p-4 rounded-md border border-[var(--border)]">
                {observation.description}
              </p>
            </div>

            {/* Photographic Evidence Gallery */}
            {observation.photos && observation.photos.length > 0 && (
              <div className="p-5 border-b border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)] flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Photographic Evidence ({observation.photos.length})</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-[var(--faint)]">
                    Click any photo to inspect / zoom
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {observation.photos.map((photo) => {
                    const stageBadge = {
                      initial: { label: 'Initial', color: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800' },
                      rectification: {
                        label: 'Rectification',
                        color: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-400 border-teal-300 dark:border-teal-800',
                      },
                      closure: {
                        label: 'Closure',
                        color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
                      },
                    }[photo.stage] || { label: photo.stage, color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700' };

                    return (
                      <div
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo)}
                        className="group relative rounded-lg overflow-hidden border border-[var(--border)] hover:border-cyan-500 bg-[var(--bg)] cursor-pointer transition-all shadow-xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.dataUrl}
                          alt={photo.caption || 'Site photo'}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          className={`absolute top-2 left-2 text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${stageBadge.color}`}
                        >
                          {stageBadge.label}
                        </span>
                        {photo.caption && (
                          <div className="p-2 bg-[var(--panel-alt)] text-[10px] font-mono text-[var(--dim)] truncate">
                            {photo.caption}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status History & Audit Trail */}
            <div className="p-5 border-b border-[var(--border)] space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)] flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Status &amp; Rectification Audit History</span>
              </div>

              <div className="space-y-2 divide-y divide-[var(--border)]">
                {observation.history?.map((hist, i) => {
                  const statColor = STATUSES[hist.status]?.color || '#f0a202';
                  return (
                    <div key={hist.id || i} className="pt-3 first:pt-0 space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: statColor }}
                          />
                          <span className="font-semibold text-[var(--text)]">{hist.byName}</span>
                          <span className="text-[10px] text-[var(--faint)] font-mono">
                            · {formatDate(hist.createdAt)}
                          </span>
                        </div>
                        <span
                          className="font-mono text-[10.5px] font-bold px-2 py-0.2 rounded"
                          style={{ backgroundColor: `${statColor}18`, color: statColor }}
                        >
                          {hist.status}
                        </span>
                      </div>
                      <p className="text-[var(--dim)] pl-4">{hist.remarks}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action / Rectification Box */}
            <div className="p-5 bg-[var(--panel-alt)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Update Observation Status / Add Rectification Note</span>
                </div>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--dim)]">
                      New Status Target *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ObservationStatus)}
                      className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
                    >
                      {Object.keys(STATUSES).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--dim)]">
                      Your Name / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Imran Shah (Maintenance Lead)"
                      value={updateBy}
                      onChange={(e) => setUpdateBy(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--dim)]">
                      Rectification Remarks / Audit Note *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe what was repaired, replaced, verified, or reason for status progression..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] placeholder-[var(--faint)] focus:outline-hidden focus:border-amber-500 resize-y"
                    />
                  </div>

                  {/* Optional Rectification / Closure Photos */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-[var(--dim)] flex items-center justify-between">
                      <span>
                        Attach Rectification / Closure Evidence Photos (Optional)
                      </span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="updatePhotoInput"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="updatePhotoInput"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--bg)] border border-[var(--border)] hover:bg-[var(--hover)] text-xs font-semibold text-[var(--dim)] hover:text-[var(--text)] cursor-pointer transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>Add Photo</span>
                      </label>
                      <span className="text-[11px] text-[var(--faint)] font-mono">
                        {updatePhotos.length} photo(s) selected
                      </span>
                    </div>

                    {updatePhotos.length > 0 && (
                      <div className="flex gap-2 pt-1 flex-wrap">
                        {updatePhotos.map((p, i) => (
                          <div
                            key={i}
                            className="relative w-16 h-16 rounded overflow-hidden border border-[var(--border)]"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.dataUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setUpdatePhotos((prev) => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-0 right-0 bg-black/80 text-white text-[10px] w-4 h-4 flex items-center justify-center cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {updating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Save Status Update</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Lightbox Photo Viewer Modal */}
      <PhotoViewerModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
