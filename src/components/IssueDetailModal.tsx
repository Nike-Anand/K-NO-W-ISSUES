/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Share2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Volume2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Send,
} from 'lucide-react';
import { IssueStatus } from '../types';

export const IssueDetailModal: React.FC = () => {
  const {
    selectedIssue,
    setSelectedIssueId,
    confirmIssue,
    userConfirmations,
    openAssignModal,
    publishOfficialUpdate,
    setIsAiExplanationOpen,
    setIsGovReportModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'evidence' | 'updates' | 'reports'>('overview');
  const [quickUpdateText, setQuickUpdateText] = useState('');
  const [quickUpdateDept, setQuickUpdateDept] = useState('TANGEDCO Energy Department');
  const [showQuickPublish, setShowQuickPublish] = useState(false);

  if (!selectedIssue) return null;

  const isConfirmed = userConfirmations[selectedIssue.id] === 'experienced';
  const isNotAffected = userConfirmations[selectedIssue.id] === 'not_affected';

  const handlePostOfficialUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUpdateText.trim()) return;
    publishOfficialUpdate(
      selectedIssue.id,
      quickUpdateText,
      quickUpdateDept,
      'Field Response Officer'
    );
    setQuickUpdateText('');
    setShowQuickPublish(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="themed-card rounded-2xl max-w-4xl w-full border b-skin shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b b-skin flex items-center justify-between themed-muted">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand-600)]">
              Signal Dossier
            </span>
            <span className="t-faint">·</span>
            <span className="text-xs t-muted font-mono">ID: {selectedIssue.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAssignModal(selectedIssue)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold t-ink-2 themed-card border b-skin rounded-lg hover:themed-muted transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 t-muted" />
              <span>Assign Authority</span>
            </button>

            <button
              onClick={() => setIsGovReportModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--brand-600)] bg-[var(--brand-600)]/10 rounded-lg hover:bg-[var(--brand-600)]/20 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive Brief</span>
            </button>

            <button
              onClick={() => setSelectedIssueId(null)}
              className="p-2 t-faint hover:t-ink-2 rounded-lg hover:themed-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Issue Hero Section */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b b-skin">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="capitalize text-[var(--brand-600)] bg-[var(--brand-600)]/10 px-2 py-0.5 rounded">
                ⚡ {selectedIssue.category}
              </span>
              <span className="t-muted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 t-faint" />
                {selectedIssue.locationName} · {selectedIssue.district}
              </span>
            </div>

            <span
              className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                selectedIssue.status === 'Action in Progress'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : selectedIssue.status === 'Resolved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {selectedIssue.status}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold t-ink">
            {selectedIssue.title}
          </h2>

          <p className="mt-2 text-sm t-ink-2 max-w-3xl leading-relaxed">
            {selectedIssue.description}
          </p>

          {/* Quantitative Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl themed-muted border b-skin-strong">
            <div>
              <span className="text-[11px] font-medium t-muted block">Reports Grouped</span>
              <span className="text-xl sm:text-2xl font-extrabold t-ink tabular-nums">
                {selectedIssue.reportCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium t-muted block">Confirmations</span>
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 tabular-nums">
                {selectedIssue.confirmationsCount}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium t-muted block">Not Affected</span>
              <span className="text-xl sm:text-2xl font-extrabold t-muted tabular-nums">
                {selectedIssue.notAffectedCount}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium t-muted block">24h Velocity</span>
              <span className="text-xl sm:text-2xl font-extrabold text-[var(--brand-600)] tabular-nums flex items-center">
                +{selectedIssue.trendPercentage}%
                <TrendingUp className="w-4 h-4 ml-1 inline" />
              </span>
            </div>
          </div>

          {/* Citizen Interaction Bar: Immediate Vote Feedback */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold t-ink-2">Citizen Feedback:</span>
              <button
                onClick={() => confirmIssue(selectedIssue.id, 'experienced')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  isConfirmed
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'themed-card t-ink-2 b-skin hover:themed-muted'
                }`}
              >
                ✓ I'm experiencing this too ({selectedIssue.confirmationsCount})
              </button>
              <button
                onClick={() => confirmIssue(selectedIssue.id, 'not_affected')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  isNotAffected
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'themed-card t-ink-2 b-skin hover:themed-muted'
                }`}
              >
                Not affected ({selectedIssue.notAffectedCount})
              </button>
            </div>

            <button
              onClick={() => setIsAiExplanationOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[var(--brand-600)] hover:underline font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why this issue is surfaced</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b b-skin themed-card">
          <nav className="flex space-x-6 text-xs sm:text-sm font-semibold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'timeline', label: 'Timeline & Status' },
              { id: 'evidence', label: `Evidence (${selectedIssue.evidence.length})` },
              { id: 'updates', label: `Official Updates (${selectedIssue.updates.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 relative transition-colors ${
                  activeTab === tab.id
                    ? 'text-[var(--brand-600)] font-bold'
                    : 't-muted hover:t-ink-2'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-600)] rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Verified official banner */}
              {selectedIssue.updates.length > 0 && (
                <div className="p-4 rounded-xl themed-muted border b-skin/90 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold t-ink">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>VERIFIED OFFICIAL UPDATE</span>
                    </div>
                    <span className="text-[11px] t-faint">
                      {selectedIssue.updates[0].timestamp}
                    </span>
                  </div>
                  <p className="text-sm t-ink-2 leading-relaxed font-medium">
                    “{selectedIssue.updates[0].content}”
                  </p>
                  <div className="mt-2 text-xs t-muted font-semibold">
                    {selectedIssue.updates[0].department}
                  </div>
                </div>
              )}

              {/* AI Cluster Summary Card */}
              <div className="p-5 rounded-xl border border-[var(--brand-600)]/20 bg-[var(--brand-600)]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--brand-600)]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-600)]">
                      AI Cluster Synthesis
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono t-muted">
                    Confidence: {selectedIssue.confidenceScore}%
                  </span>
                </div>
                <p className="text-xs sm:text-sm t-ink-2 leading-relaxed">
                  {selectedIssue.aiSummary}
                </p>

                <div className="space-y-1.5 pt-2">
                  {selectedIssue.aiObservations.map((obs, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs t-ink-2">
                      <span className="text-[var(--brand-600)] font-bold">•</span>
                      <span>{obs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affected Wards & Jurisdiction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border b-skin themed-card">
                  <h4 className="text-xs font-bold uppercase tracking-wider t-muted mb-2">
                    Affected Wards & Zones
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedIssue.affectedWards.map((ward) => (
                      <span
                        key={ward}
                        className="px-2.5 py-1 rounded themed-muted text-xs font-medium t-ink-2"
                      >
                        {ward}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border b-skin themed-card">
                  <h4 className="text-xs font-bold uppercase tracking-wider t-muted mb-2">
                    Assigned Authority
                  </h4>
                  <div className="text-sm font-semibold t-ink">
                    {selectedIssue.assignedAuthority || 'Pending Municipal Assignment'}
                  </div>
                  {selectedIssue.assignedOfficer && (
                    <div className="text-xs t-muted mt-1">
                      Lead: {selectedIssue.assignedOfficer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANIMATED VERTICAL TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold t-ink">Issue Lifecycle Progress</h4>
                <p className="text-xs t-muted">
                  Real-time progression from citizen submission to public verification.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {selectedIssue.timeline.map((event) => (
                  <div key={event.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                        event.current
                          ? 'bg-[var(--brand-600)] text-white shadow-xs'
                          : event.completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-neutral-200 t-faint'
                      }`}
                    >
                      {event.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full themed-card" />
                      )}
                    </div>

                    <div className="themed-muted p-4 rounded-xl border b-skin-strong">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold t-ink flex items-center gap-1.5">
                          <span>{event.title}</span>
                          {event.current && (
                            <span className="text-[10px] bg-[var(--brand-600)] text-white px-1.5 py-0.2 rounded font-mono">
                              CURRENT
                            </span>
                          )}
                        </span>
                        <span className="t-faint font-mono text-[11px]">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-xs t-ink-2 leading-normal">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE GALLERY */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold t-ink">Sanitized Evidence Items</h4>
                  <p className="text-xs t-muted">
                    Uploaded by community reporters. PII, vehicle numbers, and facial vectors stripped.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Privacy Verified
                </span>
              </div>

              {selectedIssue.evidence.length === 0 ? (
                <div className="text-center py-8 t-faint text-xs">
                  No public evidence items attached yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedIssue.evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="border b-skin rounded-xl overflow-hidden themed-card shadow-xs"
                    >
                      {/* Evidence visual header */}
                      <div className="h-32 bg-slate-100 flex items-center justify-center relative p-3 border-b b-skin">
                        {ev.type === 'voice' ? (
                          <div className="text-center space-y-2">
                            <Volume2 className="w-8 h-8 text-[var(--brand-600)] mx-auto animate-pulse" />
                            <span className="text-xs font-mono font-semibold t-ink-2 block">
                              Voice Note ({ev.audioDuration})
                            </span>
                            <span className="text-[10px] t-muted">
                              Pitch shifted for anonymity
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                {ev.sanitizedTag}
                              </span>
                              <span className="text-[10px] t-muted font-mono">
                                {ev.timestamp}
                              </span>
                            </div>
                            <div className="text-center text-xs font-semibold t-ink-2">
                              [Sanitized Civic Media Asset]
                            </div>
                            <div className="text-[10px] t-faint text-right">
                              Hash: 4a2b9f
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="font-bold text-xs sm:text-sm t-ink">
                          {ev.title}
                        </div>
                        <p className="text-xs t-ink-2 line-clamp-2">{ev.description}</p>
                        <div className="pt-2 border-t b-skin flex flex-wrap gap-1">
                          {ev.attributesRedacted.map((attr, i) => (
                            <span
                              key={i}
                              className="text-[10px] themed-muted t-ink-2 px-1.5 py-0.5 rounded"
                            >
                              ✓ {attr}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: OFFICIAL UPDATES FEED */}
          {activeTab === 'updates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold t-ink">Government Action Stream</h4>
                  <p className="text-xs t-muted">
                    Official bulletins and status milestones verified by responding department.
                  </p>
                </div>

                <button
                  onClick={() => setShowQuickPublish(!showQuickPublish)}
                  className="px-3 py-1.5 text-xs font-semibold t-ink-2 themed-muted hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  {showQuickPublish ? 'Cancel' : '+ Post Authority Bulletin'}
                </button>
              </div>

              {/* Quick Publish Drawer for Officials */}
              {showQuickPublish && (
                <form
                  onSubmit={handlePostOfficialUpdate}
                  className="p-4 themed-muted rounded-xl border b-skin space-y-3 animate-in slide-in-from-top-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold t-ink-2">
                    <span>Publish Verified Official Dispatch</span>
                    <span className="text-[11px] text-emerald-600">Authority Signature Active</span>
                  </div>

                  <div>
                    <label className="block text-[11px] t-muted font-semibold mb-1">
                      Department Authority
                    </label>
                    <input
                      type="text"
                      value={quickUpdateDept}
                      onChange={(e) => setQuickUpdateDept(e.target.value)}
                      className="w-full px-3 py-1.5 themed-card border b-skin rounded-md text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] t-muted font-semibold mb-1">
                      Official Dispatch Text
                    </label>
                    <textarea
                      rows={3}
                      value={quickUpdateText}
                      onChange={(e) => setQuickUpdateText(e.target.value)}
                      placeholder="e.g. Auxiliary feeder circuit 3B has been energized. Load testing in progress..."
                      className="w-full px-3 py-2 themed-card border b-skin rounded-md text-xs t-ink focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowQuickPublish(false)}
                      className="px-3 py-1 text-xs t-ink-2 themed-card border b-skin rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] rounded-md shadow-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Update</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {selectedIssue.updates.map((upd) => (
                  <div
                    key={upd.id}
                    className="p-4 rounded-xl border b-skin themed-card shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold t-ink">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{upd.department}</span>
                      </div>
                      <span className="text-[11px] t-faint font-mono">
                        {upd.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm t-ink-2 leading-relaxed font-medium">
                      “{upd.content}”
                    </p>

                    {upd.designation && (
                      <div className="text-[11px] t-faint font-medium">
                        Signed: {upd.designation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
