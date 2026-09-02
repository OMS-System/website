'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/Topbar';
import { useToast } from '@/components/ToastContext';
import { CategoryCode, SeverityLevel, PhotoStage } from '@/lib/types';
import { CATEGORIES, SEVERITIES, ASSET_TYPES, METRO_STATIONS } from '@/lib/constants';
import {
  ShieldAlert,
  CheckCircle2,
  Wrench,
  CalendarCheck,
  ClipboardList,
  Trash2,
  UploadCloud,
  Check,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const categoryIcons: Record<CategoryCode, React.ElementType> = {
  SAF: ShieldAlert,
  QAL: CheckCircle2,
  EQP: Wrench,
  MNT: CalendarCheck,
  INS: ClipboardList,
};

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

export default function NewObservationPage({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu?: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [category, setCategory] = useState<CategoryCode>('SAF');
  const [severity, setSeverity] = useState<SeverityLevel>('Medium');
  const [site, setSite] = useState('');
  const [station, setStation] = useState('');
  const [asset, setAsset] = useState('');
  const [locationChainage, setLocationChainage] = useState('');
  const [description, setDescription] = useState('');
  const [observedBy, setObservedBy] = useState('');
  const [observerEmail, setObserverEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [photos, setPhotos] = useState<
    Array<{ dataUrl: string; stage: PhotoStage; caption: string }>
  >([]);
  const [submitting, setSubmitting] = useState(false);

  // Load last used observer name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('soms_last_observer');
    if (savedName) setObservedBy(savedName);
    const savedEmail = localStorage.getItem('soms_last_email');
    if (savedEmail) setObserverEmail(savedEmail);
  }, []);

  // Auto-calculate SLA Due Date when severity changes
  useEffect(() => {
    const slaHours = SEVERITIES[severity]?.slaHours || 168;
    const target = new Date(Date.now() + slaHours * 3600 * 1000);
    setDueDate(target.toISOString().split('T')[0]);
  }, [severity]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - photos.length);
    for (const file of files) {
      try {
        const compressed = await fileToCompressedDataUrl(file);
        setPhotos((prev) => [
          ...prev,
          {
            dataUrl: compressed,
            stage: 'initial',
            caption: file.name.replace(/\.[^/.]+$/, ''),
          },
        ]);
      } catch {
        showToast(`Could not process ${file.name}`, 'error');
      }
    }
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !severity || !site.trim() || !description.trim() || !observedBy.trim()) {
      showToast('Please fill out all required fields marked with *', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      // Save last observer
      localStorage.setItem('soms_last_observer', observedBy.trim());
      if (observerEmail) localStorage.setItem('soms_last_email', observerEmail.trim());

      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          severity,
          site: site.trim(),
          station: station || site.trim(),
          asset: asset || undefined,
          locationChainage: locationChainage.trim() || undefined,
          description: description.trim(),
          observedBy: observedBy.trim(),
          observerEmail: observerEmail.trim() || undefined,
          dueDate: dueDate || null,
          photos,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Observation ${data.data.id} logged successfully!`, 'success');
        router.push(`/observations/${data.data.id}`);
      } else {
        showToast(data.error || 'Failed to submit observation', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error while submitting', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Topbar
        title="Log New Site Observation"
        subtitle="Record safety hazards, equipment defects, and compliance findings"
        onOpenMobileMenu={onOpenMobileMenu}
        showNewButton={false}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/observations"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all observations</span>
          </Link>
          <span className="text-[11px] font-mono text-[var(--faint)]">Form SOMS-V2.1</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Category Selection */}
          <div className="p-4 sm:p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)] flex items-center gap-1.5">
                <span>1. Select Observation Category *</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(Object.keys(CATEGORIES) as CategoryCode[]).map((code) => {
                const cat = CATEGORIES[code];
                const Icon = categoryIcons[code];
                const selected = category === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCategory(code)}
                    className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                      selected
                        ? 'shadow-xs ring-1'
                        : 'bg-[var(--bg)] border-[var(--border)] hover:border-[var(--border-light)] hover:bg-[var(--hover)]'
                    }`}
                    style={
                      selected
                        ? {
                            borderColor: cat.color,
                            backgroundColor: `${cat.color}12`,
                            boxShadow: `0 0 0 1px ${cat.color}`,
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: cat.color }} />
                        <span
                          className="font-mono text-xs font-bold px-1.5 py-0.5 rounded border"
                          style={{
                            backgroundColor: `${cat.color}18`,
                            color: cat.color,
                            borderColor: `${cat.color}35`,
                          }}
                        >
                          {cat.code}
                        </span>
                      </div>
                      {selected && (
                        <span
                          className="w-4 h-4 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: cat.color }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <div
                        className="text-xs font-bold"
                        style={selected ? { color: cat.color } : { color: 'var(--text)' }}
                      >
                        {cat.label}
                      </div>
                      <div className="text-[10.5px] text-[var(--dim)] line-clamp-2 mt-0.5 font-normal">
                        {cat.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Severity & SLA */}
          <div className="p-4 sm:p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)]">
                2. Risk &amp; Severity Level *
              </label>
              <span className="text-[11px] font-mono text-[var(--dim)] flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Auto SLA Target Date Calculation</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(SEVERITIES) as SeverityLevel[]).map((level) => {
                const meta = SEVERITIES[level];
                const selected = severity === level;

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      selected
                        ? 'shadow-xs ring-1'
                        : 'bg-[var(--bg)] border-[var(--border)] hover:border-[var(--border-light)]'
                    }`}
                    style={
                      selected
                        ? {
                            borderColor: meta.color,
                            backgroundColor: `${meta.color}12`,
                            boxShadow: `0 0 0 1px ${meta.color}`,
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-2 h-2 rounded-full ${level === 'Critical' && selected ? 'animate-ping' : ''}`}
                        style={{ backgroundColor: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
                      />
                      <span className="text-[10px] font-mono text-[var(--dim)] font-medium">
                        {meta.slaHours < 48 ? `${meta.slaHours}h SLA` : `${meta.slaHours / 24}d SLA`}
                      </span>
                    </div>
                    <div className={`font-bold text-xs mt-2 ${selected ? meta.badgeText : 'text-[var(--text)]'}`}>
                      {meta.level}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Location, Asset & Details */}
          <div className="p-4 sm:p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)]">
              3. Finding Location &amp; Description
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Site / Location */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--dim)]">
                  Site / Station / Chainage *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Town Station, Platform 1 Track Area, Ch. 0+450"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] placeholder-[var(--faint)] focus:outline-hidden focus:border-amber-500"
                />

                {/* Quick Station Selector Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-mono text-[var(--faint)]">Quick fill:</span>
                  {METRO_STATIONS.slice(0, 5).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setStation(st);
                        setSite(st);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg)] hover:bg-[var(--hover)] text-[var(--dim)] hover:text-[var(--text)] border border-[var(--border)] transition-colors cursor-pointer"
                    >
                      {st.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset / Sub-system */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--dim)]">
                  Asset / Sub-system
                </label>
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
                >
                  <option value="">— Select Sub-system (Optional) —</option>
                  {ASSET_TYPES.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Closure Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--dim)]">
                  Target Closure Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--dim)]">
                  Detailed Finding Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the exact physical condition, component tag, risk impact, and any immediate containment actions taken on site..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] placeholder-[var(--faint)] focus:outline-hidden focus:border-amber-500 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Observer Info & Photos */}
          <div className="p-4 sm:p-5 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--dim)]">
              4. Observer Information &amp; Photographic Evidence
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--dim)]">
                  Observed By (Full Name &amp; Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Tariq Mehmood (Safety Inspector)"
                  value={observedBy}
                  onChange={(e) => setObservedBy(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] placeholder-[var(--faint)] focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--dim)]">
                  Observer Email / Employee ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. tariq.m@orl-metro.com"
                  value={observerEmail}
                  onChange={(e) => setObserverEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-md text-xs text-[var(--text)] placeholder-[var(--faint)] focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Photo Upload Box */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-[var(--dim)] flex items-center justify-between">
                  <span>Site Evidence Photos (Max 5 photos)</span>
                  <span className="text-[10px] text-[var(--faint)] font-mono">
                    Auto-compressed to ~300KB
                  </span>
                </label>

                <div className="border-2 border-dashed border-[var(--border)] hover:border-amber-500 rounded-lg p-6 text-center transition-colors bg-[var(--bg)] cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="photoFileInput"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="photoFileInput"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <UploadCloud className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                    <div className="text-xs text-[var(--text)] font-medium">
                      Click to browse or take site photo
                    </div>
                    <div className="text-[10.5px] text-[var(--dim)]">
                      Supports PNG, JPG, JPEG · Works on mobile and tablet cameras
                    </div>
                  </label>
                </div>

                {/* Thumbnails */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {photos.map((photo, i) => (
                      <div
                        key={i}
                        className="relative rounded-lg overflow-hidden border border-[var(--border)] group bg-[var(--panel)] shadow-xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.dataUrl}
                          alt={`Uploaded evidence ${i + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 backdrop-blur-xs text-white border border-white/25 hover:border-rose-500 shadow-sm transition-all active:scale-90 cursor-pointer group/btn"
                          title="Remove photo"
                          aria-label="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <div className="p-1.5 bg-[var(--panel-alt)] text-[10px] font-mono text-[var(--dim)] truncate">
                          {photo.caption || `Photo #${i + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submission Action Bar */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-[var(--panel)] border border-[var(--border)] shadow-xs">
            <Link
              href="/observations"
              className="px-4 py-2 rounded-md bg-[var(--bg)] border border-[var(--border)] text-xs font-semibold text-[var(--dim)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Logging Observation...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Observation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
