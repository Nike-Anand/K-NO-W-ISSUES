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
      <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6D4AFF]" />
            <h3 className="font-extrabold text-neutral-900 text-sm">
              AI Issue Intelligence Synthesis
            </h3>
          </div>

          <button
            onClick={() => setIsAiExplanationOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              Methodological Transparency
            </span>
            <h4 className="text-base font-extrabold text-neutral-900">
              Why this issue was surfaced
            </h4>
            <p className="text-neutral-600 mt-1 leading-relaxed">
              LokDrishti’s spatial telemetry engine evaluates density surges, cross-source confirmation ratios, and temporal anomalies before elevating a signal cluster.
            </p>
          </div>

          {/* Quantified factors */}
          <div className="p-4 bg-[#6D4AFF]/5 rounded-xl border border-[#6D4AFF]/20 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-[#6D4AFF]" />
              <span>{currentIssue.reportCount.toLocaleString()} grouped reports</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-[#6D4AFF]" />
              <span>+{currentIssue.trendPercentage}% acceleration in past 24 hours</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-[#6D4AFF]" />
              <span>7 affected municipal distribution sectors ({currentIssue.affectedWards.join(', ')})</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-[#6D4AFF]" />
              <span>High citizen confirmation index ({currentIssue.confirmationsCount} affirmations)</span>
            </div>
          </div>

          {/* Under-reported need detection */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className="font-bold text-neutral-800 mb-1">
              Potential Under-Reported Need Detected
            </div>
            <p className="text-neutral-600 leading-normal">
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
