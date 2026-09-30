/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plus,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const MyIssuesView: React.FC = () => {
  const {
    userReports,
    issues,
    setSelectedIssueId,
    setIsReportModalOpen,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F8FC] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6D4AFF] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anonymized Citizen Ledger</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              My Tracked Issues
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Personal reports submitted from this device. Tokens are stored client-side without storing identity or telephone numbers on public servers.
            </p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#6D4AFF] hover:bg-[#5835ea] rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Report New Signal</span>
          </button>
        </div>

        {/* Timeline Cards */}
        {userReports.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-xs">
            <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No signals tracked yet</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              When you submit an issue, your private tracking token appears here with live updates from responding authorities.
            </p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#6D4AFF] rounded-lg"
            >
              Report an Issue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userReports.map((report) => {
              const matchedIssue = issues.find((i) => i.id === report.issueId) || issues[0];

              return (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs hover:border-[#6D4AFF]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="capitalize font-bold text-[#6D4AFF] bg-[#6D4AFF]/10 px-2.5 py-0.5 rounded">
                        {report.category}
                      </span>
                      <span className="text-neutral-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {report.location}
                      </span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-neutral-400 font-mono text-[11px]">
                        {report.timestamp}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900">{report.title}</h3>

                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {report.evidenceContent}
                    </p>

                    <div className="flex items-center gap-3 pt-2 text-xs text-neutral-500">
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Identity Vector Stripped
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-neutral-700">
                        Grouped with {report.groupedWithCount.toLocaleString()} neighborhood signals
                      </span>
                    </div>
                  </div>

                  {/* Status & CTA */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                    <span
                      className={`text-xs px-3 py-1 rounded-md font-semibold border ${
                        matchedIssue.status === 'Action in Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : matchedIssue.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {matchedIssue.status}
                    </span>

                    <button
                      onClick={() => setSelectedIssueId(matchedIssue.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#6D4AFF] hover:underline"
                    >
                      <span>Track Official Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
