/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Eye,
  Sliders,
  X,
  Volume2,
  FileCheck,
  Maximize2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { EvidenceMedia } from '../types';

export const EvidenceGalleryView: React.FC = () => {
  const { issues, setSelectedIssueId } = useApp();

  // Aggregate all evidence items across all issues
  const allEvidence = issues.flatMap((issue) =>
    issue.evidence.map((ev) => ({
      ...ev,
      issueTitle: issue.title,
      issueCategory: issue.category,
      issueId: issue.id,
    }))
  );

  const [activeLightbox, setActiveLightbox] = useState<any | null>(null);
  const [lightboxSplit, setLightboxSplit] = useState(50);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEvidence = allEvidence.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="min-h-screen themed-page pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cryptographic Anonymization Feed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight t-ink">
              Sanitized Evidence Gallery
            </h1>
            <p className="mt-2 text-sm t-ink-2 max-w-2xl">
              Public proof assets submitted by citizens. Facial biometric vectors, vehicular registrations, and residential PII are stripped prior to public availability.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 themed-card p-1 rounded-xl border b-skin-strong shadow-2xs text-xs">
            {(['all', 'image', 'voice'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                  filterType === type
                    ? 'bg-[#6D4AFF] text-white shadow-xs'
                    : 't-ink-2 hover:t-ink'
                }`}
              >
                {type === 'all' ? 'All Evidence' : type === 'image' ? 'Photos' : 'Voice Notes'}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvidence.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightbox(item)}
              className="themed-card rounded-2xl border b-skin-strong overflow-hidden shadow-xs hover:shadow-md hover:border-[#6D4AFF]/50 transition-all cursor-pointer flex flex-col justify-between group card-lift"
            >
              {/* Asset Visual Container */}
              <div className="relative h-48 bg-slate-100 flex items-center justify-center p-4 border-b b-skin overflow-hidden">
                {/* Visual Asset Simulation */}
                {item.type === 'voice' ? (
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-[#6D4AFF]/10 text-[#6D4AFF] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold t-ink-2 block">
                      AUDIO STATEMENT ({item.audioDuration})
                    </span>
                    <span className="text-[11px] t-faint">
                      Acoustic formant shifted +4 semitones
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-200 rounded-lg p-3 flex flex-col justify-between border border-slate-300 relative group-hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        ✓ {item.sanitizedTag}
                      </span>
                      <span className="font-mono t-muted">EXIF_CLEARED</span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-10 bg-neutral-300/80 backdrop-blur-md rounded border border-neutral-400/40 flex items-center justify-center text-[9px] t-ink-2 font-mono">
                        BLUR_1
                      </div>
                      <div className="w-16 h-10 bg-neutral-300/80 backdrop-blur-md rounded border border-neutral-400/40 flex items-center justify-center text-[9px] t-ink-2 font-mono">
                        BLUR_2
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] t-muted">
                      <span>Click to compare with raw</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#6D4AFF]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-[#6D4AFF] themed-card/95 px-3 py-1.5 rounded-lg shadow-sm">
                    Inspect Redaction Layer
                  </span>
                </div>
              </div>

              {/* Information body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs t-muted">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 t-faint" />
                    {item.location}
                  </span>
                  <span className="font-mono text-[11px]">{item.timestamp}</span>
                </div>

                <h3 className="font-extrabold text-base t-ink group-hover:text-[#6D4AFF] transition-colors line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs t-ink-2 line-clamp-2">
                  {item.description}
                </p>

                {/* Redaction Tags */}
                <div className="pt-2 border-t b-skin flex flex-wrap gap-1">
                  {item.attributesRedacted.map((attr, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] themed-muted t-ink-2 px-2 py-0.5 rounded font-medium"
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LIGHTBOX MODAL WITH BEFORE/AFTER REDACTION SLIDER */}
        {activeLightbox && (
          <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="themed-card rounded-2xl max-w-3xl w-full overflow-hidden border b-skin shadow-2xl flex flex-col">
              {/* Lightbox Header */}
              <div className="px-6 py-4 border-b b-skin flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {activeLightbox.sanitizedTag}
                    </span>
                    <span className="text-xs t-muted font-medium">
                      Location: {activeLightbox.location}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold t-ink mt-1">
                    {activeLightbox.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveLightbox(null)}
                  className="p-2 t-faint hover:t-ink-2 rounded-lg hover:themed-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Before / After Slider Canvas */}
              <div className="p-6 bg-neutral-900 flex flex-col items-center">
                <div className="relative w-full h-72 rounded-xl overflow-hidden select-none border border-neutral-700 bg-neutral-800">
                  {/* Background: Sanitized Preview */}
                  <div className="absolute inset-0 bg-slate-900 flex items-center justify-center p-6 text-white">
                    <div className="w-full h-full border border-neutral-700 rounded-lg p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-bold bg-emerald-950/70 px-2.5 py-1 rounded border border-emerald-800">
                          SANITIZED PUBLIC VERSION
                        </span>
                        <span className="t-faint font-mono text-[11px]">
                          Identity Neutralized
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 my-auto">
                        <div className="h-20 bg-neutral-800/90 rounded border border-neutral-600 flex items-center justify-center text-xs font-mono t-faint">
                          [FACE_MASKED]
                        </div>
                        <div className="h-20 bg-neutral-800/90 rounded border border-neutral-600 flex items-center justify-center text-xs font-mono t-faint">
                          [PLATE_BLURRED]
                        </div>
                        <div className="h-20 bg-neutral-800/90 rounded border border-neutral-600 flex items-center justify-center text-xs font-mono t-faint">
                          [EXIF_STRIPPED]
                        </div>
                      </div>

                      <div className="text-xs t-faint text-center">
                        Published to public civic feed without vulnerability.
                      </div>
                    </div>
                  </div>

                  {/* Foreground: Raw Data (Clipped) */}
                  <div
                    className="absolute inset-0 bg-rose-950 text-white p-6 overflow-hidden border-r-2 border-white"
                    style={{ width: `${lightboxSplit}%` }}
                  >
                    <div className="w-[600px] h-full flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-rose-900 text-rose-200 px-2.5 py-1 rounded font-bold border border-rose-700">
                          RAW CITIZEN CAPTURE (PRE-SANITIZATION)
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 my-auto opacity-70">
                        <div className="h-20 bg-rose-900/50 rounded border border-rose-500 flex items-center justify-center text-xs font-mono text-rose-200">
                          Citizen Face Exposed
                        </div>
                        <div className="h-20 bg-rose-900/50 rounded border border-rose-500 flex items-center justify-center text-xs font-mono text-rose-200">
                          Plate TN-02-X-4910
                        </div>
                        <div className="h-20 bg-rose-900/50 rounded border border-rose-500 flex items-center justify-center text-xs font-mono text-rose-200">
                          Exact GPS Coordinate
                        </div>
                      </div>

                      <div className="text-xs text-rose-300">
                        Kept encrypted in isolated sandbox. Never published publicly.
                      </div>
                    </div>
                  </div>

                  {/* Range input slider */}
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={lightboxSplit}
                    onChange={(e) => setLightboxSplit(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />
                  <div
                    className="absolute top-0 bottom-0 pointer-events-none z-10 flex items-center -ml-3"
                    style={{ left: `${lightboxSplit}%` }}
                  >
                    <div className="w-6 h-6 rounded-full themed-card shadow-xl flex items-center justify-center t-ink text-[10px] font-bold">
                      ↔
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between text-xs t-faint mt-3">
                  <span>← Drag slider left to expose raw redaction area</span>
                  <span>Drag right for sanitized public asset →</span>
                </div>
              </div>

              {/* Lightbox Footer */}
              <div className="px-6 py-4 themed-muted flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-2">
                  {activeLightbox.attributesRedacted.map((r: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                    >
                      ✓ {r}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const id = activeLightbox.issueId;
                    setActiveLightbox(null);
                    setSelectedIssueId(id);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#6D4AFF] text-white font-semibold hover:bg-[#5835ea] transition-colors"
                >
                  View Related Issue Dossier →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
