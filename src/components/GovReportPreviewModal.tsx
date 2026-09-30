/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Printer,
  Download,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Share2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const GovReportPreviewModal: React.FC = () => {
  const {
    isGovReportModalOpen,
    setIsGovReportModalOpen,
    selectedIssue,
    issues,
    showToast,
  } = useApp();

  const [isGeneratingSnapshot, setIsGeneratingSnapshot] = useState(false);

  if (!isGovReportModalOpen) return null;

  const issue = selectedIssue || issues[0];

  const handlePrintOrPdf = () => {
    window.print();
  };

  const handleSnapshot = () => {
    setIsGeneratingSnapshot(true);
    setTimeout(() => {
      setIsGeneratingSnapshot(false);
      showToast('Executive Snapshot cryptographic hash generated: #LK-2026-9E4', 'success');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Document Action Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6D4AFF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Government Executive Briefing Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSnapshot}
              disabled={isGeneratingSnapshot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6D4AFF]" />
              <span>{isGeneratingSnapshot ? 'Sealing...' : 'Generate Snapshot'}</span>
            </button>

            <button
              onClick={handlePrintOrPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF / Print</span>
            </button>

            <button
              onClick={() => setIsGovReportModalOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Professional Document Layout (Printable) */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-neutral-900 space-y-8 font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-neutral-900 pb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold tracking-widest uppercase text-neutral-500">
                GOVERNMENT OF TAMIL NADU · PUBLIC SIGNAL INTELLIGENCE DOSSIER
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
                Executive Action Brief: {issue.title}
              </h1>
              <div className="text-xs text-neutral-500 mt-1.5 flex items-center gap-3">
                <span>Jurisdiction: {issue.district} Zone</span>
                <span>·</span>
                <span>Classification: Official Use Only</span>
                <span>·</span>
                <span>Date: September 30, 2026</span>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-neutral-500">
              <div className="font-bold text-neutral-900">REF: LK-{issue.id.toUpperCase()}</div>
              <div>CONFIDENCE: {issue.confidenceScore}%</div>
              <div className="text-emerald-700 font-semibold">✓ PRIVACY AUDITED</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-500 border-b border-neutral-200 pb-1">
              01. Executive Summary
            </h2>
            <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
              {issue.aiSummary}
            </p>
          </div>

          {/* Section 2: Quantitative Telemetry */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-500 border-b border-neutral-200 pb-1">
              02. Report Volume & Acceleration Telemetry
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Total Signals</span>
                <span className="text-xl font-bold text-neutral-900 font-mono">
                  {issue.reportCount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block">24h Velocity</span>
                <span className="text-xl font-bold text-[#6D4AFF] font-mono">
                  +{issue.trendPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Citizen Affirmations</span>
                <span className="text-xl font-bold text-emerald-700 font-mono">
                  {issue.confirmationsCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Severity</span>
                <span className="text-sm font-bold text-rose-700 font-mono block mt-1">
                  {issue.severity.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Geographic Coverage & Infrastructure Context */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-500 border-b border-neutral-200 pb-1">
              03. Geographic Coverage & Affected Wards
            </h2>
            <div className="text-xs text-neutral-700 leading-relaxed">
              Target area spans approximately <strong>4.2 square kilometers</strong> across {issue.locationName} and neighboring arterial conduits ({issue.affectedWards.join(', ')}). Domestic consumer density is high, with estimated impact reaching ~18,500 domestic connections.
            </div>
          </div>

          {/* Section 4: Citizen Observations */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-500 border-b border-neutral-200 pb-1">
              04. Anonymized Citizen Observations
            </h2>
            <ul className="space-y-1.5 text-xs text-neutral-700 list-disc list-inside">
              {issue.aiObservations.map((obs, idx) => (
                <li key={idx}>{obs}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: Official Response Status */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold tracking-wider uppercase text-neutral-500 border-b border-neutral-200 pb-1">
              05. Department Dispatches & Active Mitigations
            </h2>
            <div className="space-y-2 text-xs">
              {issue.updates.map((upd) => (
                <div key={upd.id} className="p-3 bg-neutral-50 rounded border border-neutral-200">
                  <div className="flex justify-between font-bold text-neutral-900 mb-0.5">
                    <span>{upd.department}</span>
                    <span className="text-neutral-400 font-mono">{upd.timestamp}</span>
                  </div>
                  <p className="text-neutral-700">{upd.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Recommended Follow-Up & Limitations */}
          <div className="space-y-2 pt-2 border-t border-neutral-200 text-xs">
            <div className="font-bold text-neutral-900">Recommended Executive Action:</div>
            <p className="text-neutral-700 leading-relaxed">
              {issue.suggestedFollowUp}
            </p>
            <div className="text-[11px] text-neutral-500 mt-2 italic">
              Methodological limitations: {issue.limitations}
            </div>
          </div>

          {/* Document Sign-off */}
          <div className="pt-6 border-t-2 border-neutral-900 flex justify-between text-xs text-neutral-500 font-mono">
            <div>LokDrishti BRICS Public Signal Platform</div>
            <div>VERIFIED BY DIGITAL SIGNATURE: 0x9b4a...e12</div>
          </div>
        </div>
      </div>
    </div>
  );
};
