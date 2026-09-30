/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Building2,
  User,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Sparkles,
} from 'lucide-react';
import { AUTHORITIES_LIST } from '../data/mockData';

export const AssignIssueModal: React.FC = () => {
  const {
    isAssignModalOpen,
    setIsAssignModalOpen,
    activeAssignIssue,
    assignIssue,
    showToast,
  } = useApp();

  const [selectedAuthority, setSelectedAuthority] = useState(AUTHORITIES_LIST[0].name);
  const [officerName, setOfficerName] = useState('K. Rajendran, Executive Engineer');
  const [urgencyNote, setUrgencyNote] = useState('High velocity cluster (+37%). Priority dispatch requested.');
  const [copied, setCopied] = useState(false);

  if (!isAssignModalOpen || !activeAssignIssue) return null;

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    assignIssue(activeAssignIssue.id, selectedAuthority, officerName);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    showToast('Internal dossier token copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#6D4AFF]" />
            <h3 className="font-extrabold text-neutral-900 text-sm">Assign Issue Authority</h3>
          </div>

          <button
            onClick={() => setIsAssignModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAssign} className="p-6 space-y-4 text-xs">
          {/* Issue summary strip */}
          <div className="p-3 bg-[#6D4AFF]/5 rounded-xl border border-[#6D4AFF]/15">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D4AFF] block">
              Target Signal
            </span>
            <div className="font-bold text-neutral-900 text-sm mt-0.5">
              {activeAssignIssue.title}
            </div>
            <div className="text-neutral-500 text-[11px] mt-0.5">
              {activeAssignIssue.locationName} · {activeAssignIssue.reportCount} reports grouped
            </div>
          </div>

          {/* Suggested Authority */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6D4AFF]" />
              <span>Suggested Department / Authority:</span>
            </label>
            <select
              value={selectedAuthority}
              onChange={(e) => setSelectedAuthority(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]"
            >
              {AUTHORITIES_LIST.map((auth) => (
                <option key={auth.id} value={auth.name}>
                  {auth.name} ({auth.jurisdiction})
                </option>
              ))}
            </select>
          </div>

          {/* Officer in Charge */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1.5">
              Designated Officer / Dispatch Unit:
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]"
            />
          </div>

          {/* Dispatch Notice / Notes */}
          <div>
            <label className="block font-bold text-neutral-700 mb-1.5">
              Dispatch Instructions / Operational Note:
            </label>
            <textarea
              rows={3}
              value={urgencyNote}
              onChange={(e) => setUrgencyNote(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-lg border border-neutral-200 text-neutral-700 font-semibold hover:bg-neutral-50 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Internal Link'}</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#6D4AFF] hover:bg-[#5835ea] text-white font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Assign Issue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
