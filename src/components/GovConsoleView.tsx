/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Map,
  Layers,
  FileText,
  Globe2,
  Send,
  BarChart3,
  Building,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Building2,
  Share2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Printer,
  Download,
  Users,
} from 'lucide-react';
import { Issue, IssueStatus } from '../types';

export const GovConsoleView: React.FC = () => {
  const {
    issues,
    govConsoleSubTab,
    setGovConsoleSubTab,
    setSelectedIssueId,
    openAssignModal,
    publishOfficialUpdate,
    changeIssueStatus,
    setIsGovReportModalOpen,
    setIsAiExplanationOpen,
    briefs,
    responses,
    departments,
    appConfig,
    addBrief,
    addResponse,
  } = useApp();

  const [broadcastRegion, setBroadcastRegion] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const handleSendBroadcast = () => {
    if (!broadcastRegion || !broadcastMessage) return;
    addResponse(broadcastRegion, broadcastMessage);
    setBroadcastRegion('');
    setBroadcastMessage('');
  };

  const handleGenerateBrief = () => {
    addBrief(`On-Demand Brief - ${new Date().toLocaleTimeString()}`, 'Special');
  };

  const [selectedIssueInConsole, setSelectedIssueInConsole] = useState<Issue>(issues[0]);
  const [consoleTab, setConsoleTab] = useState<'summary' | 'evidence' | 'timeline' | 'actions'>('summary');

  // Tree navigation state
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({
    'Tamil Nadu': true,
    'Karnataka': false,
  });
  const [expandedDistricts, setExpandedDistricts] = useState<Record<string, boolean>>({
    'Chennai': true,
    'Coimbatore': false,
    'Bengaluru': false,
  });

  // Action form state
  const [officialUpdateText, setOfficialUpdateText] = useState('');
  const [departmentSignature, setDepartmentSignature] = useState('TANGEDCO Energy Department');
  const [designationSignature, setDesignationSignature] = useState('Superintending Engineer (Distribution)');

  // Overall metrics calculation
  const totalReports = issues.reduce((acc, i) => acc + i.reportCount, 0);
  const activeIssues = issues.length;
  const underReviewCount = issues.filter((i) => i.status === 'Under Review').length;
  const inProgressCount = issues.filter((i) => i.status === 'Action in Progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  const toggleState = (st: string) => {
    setExpandedStates((prev) => ({ ...prev, [st]: !prev[st] }));
  };

  const toggleDistrict = (dist: string) => {
    setExpandedDistricts((prev) => ({ ...prev, [dist]: !prev[dist] }));
  };

  const handlePublishUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialUpdateText.trim()) return;
    publishOfficialUpdate(
      selectedIssueInConsole.id,
      officialUpdateText,
      departmentSignature,
      designationSignature
    );
    setOfficialUpdateText('');
  };

  const sidebarLinks = [
    { id: 'overview', label: 'Operations Center', icon: LayoutDashboard },
    { id: 'clusters', label: 'Hierarchical Explorer', icon: Layers },
    { id: 'briefs', label: 'Executive Briefs', icon: FileText },
    { id: 'responses', label: 'Response Center', icon: Send },
    { id: 'analytics', label: 'Signal Analytics', icon: BarChart3 },
    { id: 'departments', label: 'Authorities & SLAS', icon: Building },
  ] as const;

  return (
    <div className="min-h-screen themed-page flex flex-col">
      {/* Gov Console Sub-Navbar */}
      <div className="bg-neutral-900 text-white px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wide uppercase t-faint">
            Tamil Nadu State Governance Node
          </span>
          <span className="t-ink-2">|</span>
          <span className="t-faint font-mono text-[11px]">
            ACTIVE OPERATIONAL SESSION · CHENNAI ZONE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGovReportModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate Brief PDF</span>
          </button>
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RBAC SECURED</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Gov Operations Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="themed-card rounded-2xl border b-skin-strong p-3 shadow-xs">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider t-faint">
              Navigation
            </div>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = govConsoleSubTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setGovConsoleSubTab(link.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[var(--brand-600)] text-white shadow-xs'
                        : 't-ink-2 hover:themed-muted hover:t-ink'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Municipal SLAs summary card */}
          <div className="themed-card rounded-2xl border b-skin-strong p-4 shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b b-skin">
              <span className="font-bold t-ink-2">Response SLA Status</span>
              <span className="text-[10px] text-emerald-600 font-mono">NOMINAL</span>
            </div>
            <div className="space-y-1.5 t-ink-2">
              <div className="flex justify-between">
                <span>Avg Acknowledgment:</span>
                <span className="font-bold t-ink font-mono">{appConfig?.analytics?.avgAck || '42 min'}</span>
              </div>
              <div className="flex justify-between">
                <span>Dispatch Resolution:</span>
                <span className="font-bold t-ink font-mono">{appConfig?.analytics?.dispatchRes || '5.2 hrs'}</span>
              </div>
              <div className="flex justify-between">
                <span>Citizen Verification:</span>
                <span className="font-bold text-emerald-600 font-mono">{appConfig?.analytics?.verificationRate || '91.4%'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Console Viewport */}
        <div className="flex-1 space-y-6 overflow-hidden">
          {/* TOP METRIC MODULES (Crisp Editorial Tabular Metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="themed-card p-4 rounded-xl border b-skin-strong shadow-xs">
              <span className="text-[11px] font-semibold t-muted block">Total Reports</span>
              <span className="text-2xl font-extrabold t-ink tabular-nums">
                {totalReports.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                Across 5 Zones
              </span>
            </div>

            <div className="themed-card p-4 rounded-xl border b-skin-strong shadow-xs">
              <span className="text-[11px] font-semibold t-muted block">Active Clusters</span>
              <span className="text-2xl font-extrabold text-[var(--brand-600)] tabular-nums">
                {activeIssues}
              </span>
              <span className="text-[10px] t-faint block mt-0.5">Deduplicated</span>
            </div>

            <div className="themed-card p-4 rounded-xl border b-skin-strong shadow-xs">
              <span className="text-[11px] font-semibold t-muted block">Under Review</span>
              <span className="text-2xl font-extrabold text-amber-600 tabular-nums">
                {underReviewCount}
              </span>
              <span className="text-[10px] text-amber-700 block mt-0.5">Awaiting Audit</span>
            </div>

            <div className="themed-card p-4 rounded-xl border b-skin-strong shadow-xs">
              <span className="text-[11px] font-semibold t-muted block">In Progress</span>
              <span className="text-2xl font-extrabold text-blue-600 tabular-nums">
                {inProgressCount}
              </span>
              <span className="text-[10px] text-blue-700 block mt-0.5">Field Crew Active</span>
            </div>

            <div className="themed-card p-4 rounded-xl border b-skin-strong shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold t-muted block">Resolved Today</span>
              <span className="text-2xl font-extrabold text-emerald-600 tabular-nums">
                {resolvedCount + 2}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Audit Verified</span>
            </div>
          </div>

          {/* HIERARCHICAL STATE -> DISTRICT -> ISSUE EXPLORER + DETAIL WORKSPACE */}
          {['overview', 'clusters'].includes(govConsoleSubTab) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT PANE: Hierarchical Tree Navigation (4 cols) */}
            <div className="lg:col-span-5 themed-card rounded-2xl border b-skin-strong shadow-xs p-5 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b b-skin mb-3">
                <span className="text-xs font-bold uppercase tracking-wider t-ink-2">
                  Regional Signal Hierarchy
                </span>
                <span className="text-[11px] t-faint font-mono">INDIA</span>
              </div>

              {/* State -> District -> Issue Rows */}
              <div className="space-y-2 text-xs overflow-y-auto max-h-[550px] pr-1">
                {/* State: Tamil Nadu */}
                <div className="border b-skin rounded-xl overflow-hidden">
                  <div
                    onClick={() => toggleState('Tamil Nadu')}
                    className="p-2.5 themed-muted hover:themed-muted flex items-center justify-between cursor-pointer font-bold t-ink"
                  >
                    <div className="flex items-center gap-2">
                      {expandedStates['Tamil Nadu'] ? (
                        <ChevronDown className="w-4 h-4 t-muted" />
                      ) : (
                        <ChevronRight className="w-4 h-4 t-muted" />
                      )}
                      <span>Tamil Nadu</span>
                    </div>
                    <span className="font-mono t-muted">2,804 signals</span>
                  </div>

                  {expandedStates['Tamil Nadu'] && (
                    <div className="p-2 space-y-2 themed-card">
                      {/* District: Chennai */}
                      <div className="border b-skin rounded-lg overflow-hidden">
                        <div
                          onClick={() => toggleDistrict('Chennai')}
                          className="p-2 themed-muted/70 hover:themed-muted flex items-center justify-between cursor-pointer font-semibold t-ink-2"
                        >
                          <div className="flex items-center gap-1.5">
                            {expandedDistricts['Chennai'] ? (
                              <ChevronDown className="w-3.5 h-3.5 t-faint" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 t-faint" />
                            )}
                            <span>Chennai Metropolitan</span>
                          </div>
                          <span className="text-[11px] t-muted font-mono">5 clusters</span>
                        </div>

                        {expandedDistricts['Chennai'] && (
                          <div className="p-1 space-y-1">
                            {issues.map((iss) => {
                              const isSelected = selectedIssueInConsole.id === iss.id;
                              return (
                                <div
                                  key={iss.id}
                                  onClick={() => setSelectedIssueInConsole(iss)}
                                  className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                    isSelected
                                      ? 'bg-[var(--brand-600)]/10 border-[var(--brand-600)] t-ink'
                                      : 'themed-card b-skin hover:b-skin'
                                  }`}
                                >
                                  <div className="overflow-hidden flex-1">
                                    <div className="font-bold truncate text-xs">
                                      {iss.category === 'energy'
                                        ? '⚡'
                                        : iss.category === 'water'
                                        ? '💧'
                                        : iss.category === 'transport'
                                        ? '🚌'
                                        : '🏥'}{' '}
                                      {iss.title}
                                    </div>
                                    <div className="text-[10px] t-muted flex items-center gap-1.5 mt-0.5">
                                      <span>{iss.locationName}</span>
                                      <span>·</span>
                                      <span className="font-mono font-semibold">
                                        {iss.reportCount} reports
                                      </span>
                                      <span>·</span>
                                      <span className="text-[var(--brand-600)] font-bold">
                                        +{iss.trendPercentage}%
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openAssignModal(iss);
                                      }}
                                      className="p-1 t-faint hover:text-[var(--brand-600)] rounded"
                                      title="Assign Authority"
                                    >
                                      <Share2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* District: Coimbatore */}
                      <div className="border b-skin rounded-lg p-2 flex items-center justify-between t-ink-2 themed-muted">
                        <span>Coimbatore Industrial Area</span>
                        <span className="text-[11px] font-mono">140 signals</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* State: Karnataka */}
                <div className="border b-skin rounded-xl overflow-hidden">
                  <div
                    onClick={() => toggleState('Karnataka')}
                    className="p-2.5 themed-muted hover:themed-muted flex items-center justify-between cursor-pointer font-bold t-ink"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 t-muted" />
                      <span>Karnataka (Bengaluru Urban)</span>
                    </div>
                    <span className="font-mono t-muted">1,420 signals</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Government Issue Workspace & Operational Actions (7 cols) */}
            <div className="lg:col-span-7 themed-card rounded-2xl border b-skin-strong shadow-xs p-6 flex flex-col justify-between">
              <div>
                {/* Header of selected issue */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b b-skin">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[var(--brand-600)] uppercase">
                        {selectedIssueInConsole.category}
                      </span>
                      <span className="t-faint">·</span>
                      <span className="t-muted font-medium">
                        {selectedIssueInConsole.locationName}
                      </span>
                      <span className="t-faint">·</span>
                      <span className="font-mono t-faint">
                        ID: {selectedIssueInConsole.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold t-ink mt-1">
                      {selectedIssueInConsole.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAssignModal(selectedIssueInConsole)}
                      className="px-3 py-1.5 text-xs font-semibold t-ink-2 themed-muted hover:bg-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Assign</span>
                    </button>

                    <button
                      onClick={() => setIsGovReportModalOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Export Brief</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tabs for Govt Workspace */}
                <div className="flex border-b b-skin mt-4 mb-4 text-xs font-semibold">
                  {(['summary', 'timeline', 'actions'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setConsoleTab(tab)}
                      className={`pb-2.5 mr-6 capitalize transition-colors relative ${
                        consoleTab === tab
                          ? 'text-[var(--brand-600)] font-bold'
                          : 't-muted hover:t-ink-2'
                      }`}
                    >
                      {tab === 'actions' ? 'Official Actions & Dispatches' : tab}
                      {consoleTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-600)] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* TAB: SUMMARY */}
                {consoleTab === 'summary' && (
                  <div className="space-y-4 text-xs">
                    {/* Executive AI Brief */}
                    <div className="p-4 rounded-xl bg-[var(--brand-600)]/5 border border-[var(--brand-600)]/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-[var(--brand-600)]">
                          <Sparkles className="w-4 h-4" />
                          <span>AI-Generated Executive Summary</span>
                        </div>
                        <span className="font-mono text-[11px] t-muted">
                          Confidence: {selectedIssueInConsole.confidenceScore}%
                        </span>
                      </div>
                      <p className="t-ink-2 leading-relaxed font-medium">
                        {selectedIssueInConsole.aiSummary}
                      </p>
                    </div>

                    {/* Operational Details Grid */}
                    <div className="grid grid-cols-2 gap-3 t-ink-2">
                      <div className="p-3 themed-muted rounded-xl border b-skin">
                        <span className="text-[10px] t-faint font-bold uppercase block">
                          Affected Population
                        </span>
                        <span className="font-semibold t-ink block mt-0.5">
                          ~18,500 domestic households
                        </span>
                      </div>

                      <div className="p-3 themed-muted rounded-xl border b-skin">
                        <span className="text-[10px] t-faint font-bold uppercase block">
                          Assigned Lead
                        </span>
                        <span className="font-semibold t-ink block mt-0.5 truncate">
                          {selectedIssueInConsole.assignedOfficer || 'K. Rajendran, EE'}
                        </span>
                      </div>
                    </div>

                    {/* Key Observations */}
                    <div className="p-3 themed-muted rounded-xl border b-skin space-y-1.5">
                      <span className="text-[11px] font-bold t-ink-2 block">
                        Field Observations & Anomalies
                      </span>
                      {selectedIssueInConsole.aiObservations.map((obs, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 t-ink-2">
                          <span className="text-[var(--brand-600)] font-bold">•</span>
                          <span>{obs}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: TIMELINE */}
                {consoleTab === 'timeline' && (
                  <div className="space-y-3 text-xs max-h-[360px] overflow-y-auto">
                    {selectedIssueInConsole.timeline.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 themed-muted rounded-xl border b-skin-strong flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold t-ink flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {item.current && (
                              <span className="text-[10px] bg-[var(--brand-600)] text-white px-1.5 py-0.2 rounded font-mono">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="t-ink-2 mt-1">{item.description}</p>
                        </div>
                        <span className="font-mono t-faint text-[11px] shrink-0">
                          {item.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB: ACTIONS & DISPATCHES */}
                {consoleTab === 'actions' && (
                  <div className="space-y-4">
                    {/* Status Changer */}
                    <div className="p-4 themed-muted rounded-xl border b-skin text-xs space-y-2">
                      <label className="font-bold t-ink-2 block">
                        Update Cluster Lifecycle Status:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(['Under Review', 'Action in Progress', 'Resolved'] as IssueStatus[]).map(
                          (st) => (
                            <button
                              key={st}
                              onClick={() => changeIssueStatus(selectedIssueInConsole.id, st)}
                              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                                selectedIssueInConsole.status === st
                                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                                  : 'themed-card t-ink-2 b-skin hover:themed-muted'
                              }`}
                            >
                              {st}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Official Broadcast Dispatch Form */}
                    <form
                      onSubmit={handlePublishUpdate}
                      className="p-4 themed-muted rounded-xl border b-skin space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold t-ink">
                          Publish Public Verified Dispatch
                        </span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                          ✓ Real-time Citizen Sync Active
                        </span>
                      </div>

                      <div>
                        <label className="block t-muted font-semibold mb-1">
                          Responding Authority Name:
                        </label>
                        <input
                          type="text"
                          value={departmentSignature}
                          onChange={(e) => setDepartmentSignature(e.target.value)}
                          className="w-full px-3 py-2 themed-card border b-skin rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block t-muted font-semibold mb-1">
                          Official Update Text (will appear with Verified Badge on Citizen View):
                        </label>
                        <textarea
                          rows={3}
                          value={officialUpdateText}
                          onChange={(e) => setOfficialUpdateText(e.target.value)}
                          placeholder="e.g. Field teams have replaced auxiliary contact breaker. Line energization scheduled..."
                          className="w-full px-3 py-2 themed-card border b-skin rounded-lg text-xs t-ink focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-[var(--brand-600)] hover:bg-[var(--brand-700)] text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Verified Update to Citizen Signal Feed</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Footer info strip */}
              <div className="mt-6 pt-4 border-t b-skin flex items-center justify-between text-[11px] t-faint">
                <span>Decision Support Protocol v3.8</span>
                <span className="t-muted">
                  Last telemetry refresh: 2 minutes ago
                </span>
              </div>
            </div>
          </div>
          )}

          {govConsoleSubTab === 'briefs' && (
            <div className="themed-card rounded-2xl border b-skin-strong p-6 shadow-xs flex flex-col gap-6">
              <div className="flex justify-between items-center border-b b-skin pb-4">
                <div>
                  <h2 className="text-lg font-bold t-ink flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--brand-600)]" />
                    Executive Briefs Engine
                  </h2>
                  <p className="t-muted text-xs mt-1">AI-compiled daily operational briefings and state-level policy impact reports.</p>
                </div>
                <button onClick={handleGenerateBrief} className="px-4 py-2 bg-[var(--brand-600)] text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:opacity-90">
                  <Printer className="w-4 h-4" /> Generate New Brief
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {briefs.map((brief, i) => (
                  <div key={i} className="border b-skin rounded-xl p-4 hover:b-skin-strong transition cursor-pointer flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[var(--brand-600)] uppercase bg-[var(--brand-600)]/10 px-2 py-0.5 rounded">{brief.type}</span>
                      <h3 className="t-ink font-bold text-sm mt-2">{brief.title}</h3>
                      <p className="text-xs t-muted mt-1">Generated by LokDrishti AI. Covers 14 active clusters and 3 resolved major incidents.</p>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t b-skin text-xs t-faint font-mono">
                      <span>{brief.date}</span>
                      <span className="flex items-center gap-1 hover:text-[var(--brand-600)]"><Download className="w-3.5 h-3.5" /> PDF</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {govConsoleSubTab === 'responses' && (
            <div className="themed-card rounded-2xl border b-skin-strong p-6 shadow-xs flex flex-col gap-6">
              <div className="border-b b-skin pb-4">
                <h2 className="text-lg font-bold t-ink flex items-center gap-2">
                  <Send className="w-5 h-5 text-[var(--brand-600)]" />
                  Central Response Center
                </h2>
                <p className="t-muted text-xs mt-1">Unified messaging interface to dispatch broadcasts across all districts.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="font-bold text-sm t-ink">New Broadcast Message</div>
                  <input type="text" value={broadcastRegion} onChange={(e) => setBroadcastRegion(e.target.value)} placeholder="Target Region (e.g. Chennai Metropolitan)" className="w-full text-xs p-2.5 rounded-lg border b-skin bg-transparent t-ink focus:outline-none focus:border-[var(--brand-600)]" />
                  <textarea rows={4} value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} placeholder="Enter broadcast alert message..." className="w-full text-xs p-2.5 rounded-lg border b-skin bg-transparent t-ink focus:outline-none focus:border-[var(--brand-600)]"></textarea>
                  <div className="flex gap-2">
                    <button onClick={handleSendBroadcast} className="flex-1 py-2 bg-[var(--brand-600)] text-white rounded-lg text-xs font-bold hover:opacity-90">Send Broadcast Alert</button>
                    <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:opacity-90">Emergency Overide</button>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-sm t-ink mb-3">Recent Dispatches</div>
                  <div className="space-y-2">
                    {responses.map((msg, i) => (
                      <div key={i} className="p-3 border b-skin rounded-lg bg-[var(--surface-muted)]">
                        <div className="flex justify-between text-[10px] font-mono t-muted mb-1">
                          <span className="font-bold text-[var(--brand-600)]">{msg.region}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="text-xs t-ink-2">{msg.msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {govConsoleSubTab === 'analytics' && (
            <div className="themed-card rounded-2xl border b-skin-strong p-6 shadow-xs flex flex-col gap-6">
              <div className="border-b b-skin pb-4">
                <h2 className="text-lg font-bold t-ink flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--brand-600)]" />
                  Advanced Signal Analytics
                </h2>
                <p className="t-muted text-xs mt-1">Predictive civic infrastructure models and historical resolution times.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border b-skin rounded-xl p-4 bg-[var(--surface-muted)]">
                  <div className="text-[10px] font-bold t-muted uppercase tracking-wider">Average Resolution Time</div>
                  <div className="text-2xl font-black t-ink mt-2">{appConfig?.analytics?.averageResolutionTime || '14.2 hrs'}</div>
                  <div className="text-xs text-emerald-600 font-bold mt-1">{appConfig?.analytics?.resolutionDelta || '↓ 2.1 hrs from last week'}</div>
                </div>
                <div className="border b-skin rounded-xl p-4 bg-[var(--surface-muted)]">
                  <div className="text-[10px] font-bold t-muted uppercase tracking-wider">Most Reported Category</div>
                  <div className="text-2xl font-black t-ink mt-2">{appConfig?.analytics?.mostReportedCategory || 'Energy (⚡)'}</div>
                  <div className="text-xs text-rose-600 font-bold mt-1">{appConfig?.analytics?.categoryDelta || '↑ 14% spike today'}</div>
                </div>
                <div className="border b-skin rounded-xl p-4 bg-[var(--surface-muted)]">
                  <div className="text-[10px] font-bold t-muted uppercase tracking-wider">Citizen Trust Score</div>
                  <div className="text-2xl font-black t-ink mt-2">{appConfig?.analytics?.citizenTrustScore || '94.8%'}</div>
                  <div className="text-xs text-emerald-600 font-bold mt-1">{appConfig?.analytics?.trustDelta || 'High verification rate'}</div>
                </div>
              </div>
              <div className="border b-skin rounded-xl p-4 h-[200px] flex items-end gap-2 items-stretch pt-8 relative">
                <span className="absolute top-3 left-4 text-xs font-bold t-ink">Issue Influx (Last 7 Days)</span>
                {(appConfig?.analytics?.issueInflux || [40, 60, 45, 80, 50, 90, 70]).map((val: number, i: number) => (
                  <div key={i} className="flex-1 bg-[var(--brand-600)]/20 hover:bg-[var(--brand-600)]/40 rounded-t flex flex-col justify-end transition cursor-crosshair">
                    <div className="w-full bg-[var(--brand-600)] rounded-t transition-all" style={{ height: `${val}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {govConsoleSubTab === 'departments' && (
            <div className="themed-card rounded-2xl border b-skin-strong p-6 shadow-xs flex flex-col gap-6">
              <div className="border-b b-skin pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold t-ink flex items-center gap-2">
                    <Building className="w-5 h-5 text-[var(--brand-600)]" />
                    Authorities & SLAs
                  </h2>
                  <p className="t-muted text-xs mt-1">Track department-level performance metrics and compliance.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded text-xs font-bold border border-emerald-200">
                  Overall Compliance: 92%
                </div>
              </div>
              
              <div className="overflow-x-auto border b-skin rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--surface-muted)] text-[10px] uppercase font-bold t-faint border-b b-skin">
                      <th className="p-3">Department</th>
                      <th className="p-3">Active Issues</th>
                      <th className="p-3">Avg Resolution</th>
                      <th className="p-3">SLA Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs t-ink-2">
                    {departments.map((dept, i) => (
                      <tr key={i} className="border-b b-skin last:border-0 hover:bg-[var(--surface-muted)] transition">
                        <td className="p-3 font-bold t-ink">{dept.name}</td>
                        <td className="p-3 font-mono">{dept.issues}</td>
                        <td className="p-3 font-mono">{dept.time}</td>
                        <td className={`p-3 font-bold ${dept.color}`}>{dept.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
