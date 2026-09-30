/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe2,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Info,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BRICSSignal } from '../types';

export const CrossBricsView: React.FC = () => {
  const { bricsSignals, setSelectedIssueId } = useApp();
  const [selectedSignal, setSelectedSignal] = useState<BRICSSignal>(bricsSignals[0]);
  const [activeCountry, setActiveCountry] = useState<'all' | 'India' | 'Brazil' | 'South Africa'>('all');

  const filtered = bricsSignals.filter((sig) => {
    if (activeCountry === 'all') return true;
    return sig.country === activeCountry;
  });

  return (
    <div className="min-h-screen themed-page pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6D4AFF] uppercase tracking-wider mb-1">
              <Globe2 className="w-4 h-4 text-[#6D4AFF]" />
              <span>International Development Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight t-ink">
              Cross-BRICS Public Signal Observatories
            </h1>
            <p className="mt-2 text-sm t-ink-2 max-w-2xl leading-relaxed">
              Comparative signal indicators across India, Brazil, and South Africa identifying parallel utility bottlenecks, transit fleet stresses, and seasonal urban infrastructure patterns.
            </p>
          </div>

          <div className="flex items-center gap-1 themed-card p-1 rounded-xl border b-skin-strong shadow-2xs text-xs">
            {(['all', 'India', 'Brazil', 'South Africa'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActiveCountry(c)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeCountry === c
                    ? 'bg-[#6D4AFF] text-white shadow-xs'
                    : 't-ink-2 hover:t-ink'
                }`}
              >
                {c === 'all'
                  ? 'All BRICS'
                  : c === 'India'
                  ? '🇮🇳 India'
                  : c === 'Brazil'
                  ? '🇧🇷 Brazil'
                  : '🇿🇦 South Africa'}
              </button>
            ))}
          </div>
        </div>

        {/* Global Signal Corridors Visual Surface */}
        <div className="mb-8 p-6 themed-card rounded-2xl border b-skin-strong shadow-xs relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b b-skin mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider t-faint">
                Shared Urban Infrastructure Signals
              </span>
              <h3 className="text-lg font-extrabold t-ink mt-0.5">
                Potentially Related Energy & Distribution Signals
              </h3>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 font-semibold t-ink-2">
                🇮🇳 India <span className="text-[#6D4AFF]">+34% ↑</span>
              </span>
              <span className="flex items-center gap-1 font-semibold t-ink-2">
                🇧🇷 Brazil <span className="text-[#6D4AFF]">+22% ↑</span>
              </span>
              <span className="flex items-center gap-1 font-semibold t-ink-2">
                🇿🇦 South Africa <span className="text-[#6D4AFF]">+28% ↑</span>
              </span>
            </div>
          </div>

          {/* International Visual Vector Canvas */}
          <div className="relative h-44 sm:h-52 w-full bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 flex items-center justify-around overflow-hidden">
            {/* World Grid Mesh lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 800 200">
              <ellipse cx="400" cy="100" rx="360" ry="85" fill="none" stroke="#6D4AFF" strokeDasharray="4 4" />
              <line x1="40" y1="100" x2="760" y2="100" stroke="#CBD5E1" strokeWidth="1" />
              {/* Connecting arch lines between nodes */}
              <path
                d="M 220,120 Q 380,40 540,110"
                fill="none"
                stroke="#6D4AFF"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
              <path
                d="M 540,110 Q 640,60 700,90"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
            </svg>

            {/* Node 1: Brazil */}
            <div className="relative z-10 text-center themed-card/95 p-3 rounded-xl border b-skin shadow-sm w-36 sm:w-44">
              <div className="text-xl">🇧🇷</div>
              <div className="text-xs font-bold t-ink mt-1">São Paulo</div>
              <div className="text-[11px] t-muted font-mono">2,450 Signals</div>
              <div className="text-[10px] text-[#6D4AFF] font-bold mt-0.5">+22% Velocity</div>
            </div>

            {/* Node 2: South Africa */}
            <div className="relative z-10 text-center themed-card/95 p-3 rounded-xl border b-skin shadow-sm w-36 sm:w-44">
              <div className="text-xl">🇿🇦</div>
              <div className="text-xs font-bold t-ink mt-1">Durban / eThekwini</div>
              <div className="text-[11px] t-muted font-mono">1,890 Signals</div>
              <div className="text-[10px] text-[#6D4AFF] font-bold mt-0.5">+28% Velocity</div>
            </div>

            {/* Node 3: India */}
            <div className="relative z-10 text-center themed-card/95 p-3 rounded-xl border border-[#6D4AFF]/50 ring-2 ring-[#6D4AFF]/20 shadow-md w-36 sm:w-44">
              <div className="text-xl">🇮🇳</div>
              <div className="text-xs font-bold t-ink mt-1">Chennai / Peninsular</div>
              <div className="text-[11px] t-muted font-mono">4,210 Signals</div>
              <div className="text-[10px] text-[#6D4AFF] font-bold mt-0.5">+34% Velocity</div>
            </div>
          </div>

          {/* Academic / Policy Rigor Disclaimer Banner */}
          <div className="mt-4 p-3 themed-muted rounded-xl border b-skin-strong flex items-start gap-2.5 text-xs t-ink-2">
            <Info className="w-4 h-4 t-faint shrink-0 mt-0.5" />
            <span>
              <strong>Methodological Rigor Note:</strong> Cross-national correlations indicate parallel structural operational stresses (e.g. port offloading schedules, seasonal monsoonal load). Signal comparison is meant for municipal knowledge exchange and <em>never implies automatic causation</em>.
            </span>
          </div>
        </div>

        {/* Signals List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((sig) => (
            <div
              key={sig.id}
              className="themed-card rounded-2xl border b-skin-strong p-6 shadow-xs hover:border-[#6D4AFF]/40 transition-all flex flex-col justify-between group card-lift"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sig.flag}</span>
                    <span className="font-bold t-ink">{sig.country}</span>
                    <span className="capitalize text-[#6D4AFF] bg-[#6D4AFF]/10 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {sig.category}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] t-faint">{sig.lastUpdated}</span>
                </div>

                <h4 className="text-base sm:text-lg font-extrabold t-ink leading-snug">
                  {sig.topic}
                </h4>

                <p className="mt-2 text-xs sm:text-sm t-ink-2 leading-relaxed">
                  {sig.comparativeContext}
                </p>

                <div className="mt-4 p-3 themed-muted rounded-xl border b-skin text-xs">
                  <span className="font-bold t-ink-2 block mb-0.5">
                    Structural Parallel
                  </span>
                  <p className="t-ink-2 text-[11px] leading-relaxed">
                    {sig.potentialCorrelations}
                  </p>
                </div>
              </div>

              {/* Quantitative Footer */}
              <div className="mt-6 pt-4 border-t b-skin flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] t-faint block">Signal Volume</span>
                    <span className="font-bold t-ink tabular-nums">
                      {sig.signalVolume.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] t-faint block">Velocity</span>
                    <span className="font-bold text-[#6D4AFF] tabular-nums">+{sig.trend}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] t-faint block">Confidence</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {sig.confidence}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedIssueId('issue-energy-01')}
                  className="flex items-center gap-1 font-semibold text-[#6D4AFF] hover:underline"
                >
                  <span>Correlated Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
