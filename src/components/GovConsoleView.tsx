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
    showToast,
  } = useApp();

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
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col">
      {/* Gov Console Sub-Navbar */}
      <div className="bg-neutral-900 text-white px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wide uppercase text-neutral-300">
            Tamil Nadu State Governance Node
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400 font-mono text-[11px]">
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
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-3 shadow-xs">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
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
                        ? 'bg-[#6D4AFF] text-white shadow-xs'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
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
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="font-bold text-neutral-800">Response SLA Status</span>
              <span className="text-[10px] text-emerald-600 font-mono">NOMINAL</span>
            </div>
            <div className="space-y-1.5 text-neutral-600">
              <div className="flex justify-between">
                <span>Avg Acknowledgment:</span>
                <span className="font-bold text-neutral-900 font-mono">42 min</span>
              </div>
              <div className="flex justify-between">
                <span>Dispatch Resolution:</span>
                <span className="font-bold text-neutral-900 font-mono">5.2 hrs</span>
              </div>
              <div className="flex justify-between">
                <span>Citizen Verification:</span>
                <span className="font-bold text-emerald-600 font-mono">91.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Console Viewport */}
        <div className="flex-1 space-y-6 overflow-hidden">
          {/* TOP METRIC MODULES (Crisp Editorial Tabular Metrics) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-neutral-500 block">Total Reports</span>
              <span className="text-2xl font-extrabold text-neutral-900 tabular-nums">
                {totalReports.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                Across 5 Zones
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-neutral-500 block">Active Clusters</span>
              <span className="text-2xl font-extrabold text-[#6D4AFF] tabular-nums">
                {activeIssues}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Deduplicated</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-neutral-500 block">Under Review</span>
              <span className="text-2xl font-extrabold text-amber-600 tabular-nums">
                {underReviewCount}
              </span>
              <span className="text-[10px] text-amber-700 block mt-0.5">Awaiting Audit</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-neutral-500 block">In Progress</span>
              <span className="text-2xl font-extrabold text-blue-600 tabular-nums">
                {inProgressCount}
              </span>
              <span className="text-[10px] text-blue-700 block mt-0.5">Field Crew Active</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-neutral-500 block">Resolved Today</span>
              <span className="text-2xl font-extrabold text-emerald-600 tabular-nums">
                {resolvedCount + 2}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Audit Verified</span>
            </div>
          </div>

          {/* HIERARCHICAL STATE -> DISTRICT -> ISSUE EXPLORER + DETAIL WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT PANE: Hierarchical Tree Navigation (4 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs p-5 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Regional Signal Hierarchy
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">INDIA</span>
              </div>

              {/* State -> District -> Issue Rows */}
              <div className="space-y-2 text-xs overflow-y-auto max-h-[550px] pr-1">
                {/* State: Tamil Nadu */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <div
                    onClick={() => toggleState('Tamil Nadu')}
                    className="p-2.5 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between cursor-pointer font-bold text-neutral-900"
                  >
                    <div className="flex items-center gap-2">
                      {expandedStates['Tamil Nadu'] ? (
                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                      )}
                      <span>Tamil Nadu</span>
                    </div>
                    <span className="font-mono text-neutral-500">2,804 signals</span>
                  </div>

                  {expandedStates['Tamil Nadu'] && (
                    <div className="p-2 space-y-2 bg-white">
                      {/* District: Chennai */}
                      <div className="border border-neutral-100 rounded-lg overflow-hidden">
                        <div
                          onClick={() => toggleDistrict('Chennai')}
                          className="p-2 bg-neutral-50/70 hover:bg-neutral-100 flex items-center justify-between cursor-pointer font-semibold text-neutral-800"
                        >
                          <div className="flex items-center gap-1.5">
                            {expandedDistricts['Chennai'] ? (
                              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                            )}
                            <span>Chennai Metropolitan</span>
                          </div>
                          <span className="text-[11px] text-neutral-500 font-mono">5 clusters</span>
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
                                      ? 'bg-[#6D4AFF]/10 border-[#6D4AFF] text-neutral-900'
                                      : 'bg-white border-neutral-100 hover:border-neutral-200'
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
                                    <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                                      <span>{iss.locationName}</span>
                                      <span>·</span>
                                      <span className="font-mono font-semibold">
                                        {iss.reportCount} reports
                                      </span>
                                      <span>·</span>
                                      <span className="text-[#6D4AFF] font-bold">
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
                                      className="p-1 text-neutral-400 hover:text-[#6D4AFF] rounded"
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
                      <div className="border border-neutral-100 rounded-lg p-2 flex items-center justify-between text-neutral-600 bg-neutral-50/50">
                        <span>Coimbatore Industrial Area</span>
                        <span className="text-[11px] font-mono">140 signals</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* State: Karnataka */}
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <div
                    onClick={() => toggleState('Karnataka')}
                    className="p-2.5 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between cursor-pointer font-bold text-neutral-900"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                      <span>Karnataka (Bengaluru Urban)</span>
                    </div>
                    <span className="font-mono text-neutral-500">1,420 signals</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Government Issue Workspace & Operational Actions (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/80 shadow-xs p-6 flex flex-col justify-between">
              <div>
                {/* Header of selected issue */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#6D4AFF] uppercase">
                        {selectedIssueInConsole.category}
                      </span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-neutral-500 font-medium">
                        {selectedIssueInConsole.locationName}
                      </span>
                      <span className="text-neutral-400">·</span>
                      <span className="font-mono text-neutral-400">
                        ID: {selectedIssueInConsole.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-neutral-900 mt-1">
                      {selectedIssueInConsole.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAssignModal(selectedIssueInConsole)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors"
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
                <div className="flex border-b border-neutral-100 mt-4 mb-4 text-xs font-semibold">
                  {(['summary', 'timeline', 'actions'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setConsoleTab(tab)}
                      className={`pb-2.5 mr-6 capitalize transition-colors relative ${
                        consoleTab === tab
                          ? 'text-[#6D4AFF] font-bold'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      {tab === 'actions' ? 'Official Actions & Dispatches' : tab}
                      {consoleTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D4AFF] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* TAB: SUMMARY */}
                {consoleTab === 'summary' && (
                  <div className="space-y-4 text-xs">
                    {/* Executive AI Brief */}
                    <div className="p-4 rounded-xl bg-[#6D4AFF]/5 border border-[#6D4AFF]/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-[#6D4AFF]">
                          <Sparkles className="w-4 h-4" />
                          <span>AI-Generated Executive Summary</span>
                        </div>
                        <span className="font-mono text-[11px] text-neutral-500">
                          Confidence: {selectedIssueInConsole.confidenceScore}%
                        </span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed font-medium">
                        {selectedIssueInConsole.aiSummary}
                      </p>
                    </div>

                    {/* Operational Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-neutral-700">
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Affected Population
                        </span>
                        <span className="font-semibold text-neutral-900 block mt-0.5">
                          ~18,500 domestic households
                        </span>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                          Assigned Lead
                        </span>
                        <span className="font-semibold text-neutral-900 block mt-0.5 truncate">
                          {selectedIssueInConsole.assignedOfficer || 'K. Rajendran, EE'}
                        </span>
                      </div>
                    </div>

                    {/* Key Observations */}
                    <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-neutral-800 block">
                        Field Observations & Anomalies
                      </span>
                      {selectedIssueInConsole.aiObservations.map((obs, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-neutral-600">
                          <span className="text-[#6D4AFF] font-bold">•</span>
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
                        className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {item.current && (
                              <span className="text-[10px] bg-[#6D4AFF] text-white px-1.5 py-0.2 rounded font-mono">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-600 mt-1">{item.description}</p>
                        </div>
                        <span className="font-mono text-neutral-400 text-[11px] shrink-0">
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
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                      <label className="font-bold text-neutral-800 block">
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
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
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
                      className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900">
                          Publish Public Verified Dispatch
                        </span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                          ✓ Real-time Citizen Sync Active
                        </span>
                      </div>

                      <div>
                        <label className="block text-neutral-500 font-semibold mb-1">
                          Responding Authority Name:
                        </label>
                        <input
                          type="text"
                          value={departmentSignature}
                          onChange={(e) => setDepartmentSignature(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-500 font-semibold mb-1">
                          Official Update Text (will appear with Verified Badge on Citizen View):
                        </label>
                        <textarea
                          rows={3}
                          value={officialUpdateText}
                          onChange={(e) => setOfficialUpdateText(e.target.value)}
                          placeholder="e.g. Field teams have replaced auxiliary contact breaker. Line energization scheduled..."
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-[#6D4AFF] hover:bg-[#5835ea] text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Verified Update to Citizen Signal Feed</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Footer info strip */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Decision Support Protocol v3.8</span>
                <span className="text-neutral-500">
                  Last telemetry refresh: 2 minutes ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
