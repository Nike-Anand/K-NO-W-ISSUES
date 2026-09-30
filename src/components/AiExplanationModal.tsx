/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, ShieldCheck, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export const AiExplanationModal: React.FC = () => {
  const { isAiExplanationOpen, setIsAiExplanationOpen, selectedIssue, issues } = useApp();

  if (!isAiExplanationOpen) return null;

  const currentIssue = selectedIssue || issues[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="themed-card rounded-2xl max-w-lg w-full border b-skin shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b b-skin flex items-center justify-between themed-muted">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--brand-600)]" />
            <h3 className="font-extrabold t-ink text-sm">
              AI Issue Intelligence Synthesis
            </h3>
          </div>

          <button
            onClick={() => setIsAiExplanationOpen(false)}
            className="p-1.5 t-faint hover:t-ink-2 rounded-lg hover:themed-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider t-faint block mb-1">
              Methodological Transparency
            </span>
            <h4 className="text-base font-extrabold t-ink">
              Why this issue was surfaced
            </h4>
            <p className="t-ink-2 mt-1 leading-relaxed">
              LokDrishti’s spatial telemetry engine evaluates density surges, cross-source confirmation ratios, and temporal anomalies before elevating a signal cluster.
            </p>
          </div>

          {/* Quantified factors */}
          <div className="p-4 bg-[var(--brand-600)]/5 rounded-xl border border-[var(--brand-600)]/20 space-y-2.5">
            <div className="flex items-center gap-2 font-bold t-ink-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-600)]" />
              <span>{currentIssue.reportCount.toLocaleString()} grouped reports</span>
            </div>
            <div className="flex items-center gap-2 font-bold t-ink-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-600)]" />
              <span>+{currentIssue.trendPercentage}% acceleration in past 24 hours</span>
            </div>
            <div className="flex items-center gap-2 font-bold t-ink-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-600)]" />
              <span>7 affected municipal distribution sectors ({currentIssue.affectedWards.join(', ')})</span>
            </div>
            <div className="flex items-center gap-2 font-bold t-ink-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-600)]" />
              <span>High citizen confirmation index ({currentIssue.confirmationsCount} affirmations)</span>
            </div>
          </div>

          {/* Under-reported need detection */}
          <div className="p-3.5 themed-muted rounded-xl border b-skin">
            <div className="font-bold t-ink-2 mb-1">
              Potential Under-Reported Need Detected
            </div>
            <p className="t-ink-2 leading-normal">
              Anomalous low-density gap detected in adjacent low-income settlement pocket. Algorithmic heuristic recommends active field inspection to avoid blind spots.
            </p>
          </div>

          {/* Causation Warning */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5 text-amber-900">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span className="leading-tight">
              <strong>Epistemological Guardrail:</strong> AI analysis is decision support and does not establish causation or replace official physical engineering audits.
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsAiExplanationOpen(false)}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg transition-colors"
            >
              Close Intelligence Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
