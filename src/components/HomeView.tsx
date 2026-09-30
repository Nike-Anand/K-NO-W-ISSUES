/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Zap,
  Droplets,
  Bus,
  Activity,
  Compass,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Issue, IssueCategory } from '../types';

export const HomeView: React.FC = () => {
  const {
    issues,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedArea,
    setSelectedArea,
    setSelectedIssueId,
    setActiveView,
    confirmIssue,
    userConfirmations,
    isLoading,
  } = useApp();

  const categories = [
    { id: 'all', label: 'All Signals', icon: Compass },
    { id: 'energy', label: 'Energy', icon: Zap },
    { id: 'water', label: 'Water', icon: Droplets },
    { id: 'transport', label: 'Transport', icon: Bus },
    { id: 'healthcare', label: 'Healthcare', icon: Activity },
    { id: 'infrastructure', label: 'Infrastructure', icon: SlidersHorizontal },
  ] as const;

  // Filter issues based on search and category
  const filteredIssues = issues.filter((issue) => {
    const matchesCategory =
      selectedCategoryFilter === 'all' || issue.category === selectedCategoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredIssue = issues.find((i) => i.id === 'issue-energy-01') || issues[0];
  const secondaryIssues = filteredIssues.filter((i) => i.id !== featuredIssue.id);

  // Available locations for switching
  const locations = ['Chennai', 'Bengaluru', 'Coimbatore', 'Mumbai'];

  return (
    <div className="min-h-screen themed-page pb-20 theme-transition">
      {/* Sub-header Context Bar */}
      <div className="themed-card border-b b-skin py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 t-ink-2">
            <MapPin className="w-3.5 h-3.5 text-[#6D4AFF]" />
            <span className="font-semibold t-ink">{selectedArea} · Tamil Nadu</span>
            <span className="t-faint">|</span>
            <div className="flex items-center gap-1.5">
              <span className="t-muted">Switch Area:</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-transparent font-medium t-ink-2 hover:text-[#6D4AFF] focus:outline-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="t-muted">BRICS Public Signal Engine</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200/50">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Privacy Protected
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Main Heading & Editorial Lead */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight t-ink leading-[1.15] reveal gradient-text">
            What’s happening near you?
          </h1>
          <p className="mt-3 text-base sm:text-lg t-ink-2 leading-relaxed reveal">
            Discover public issue signals, report problems securely, and track official responses with full civic transparency.
          </p>
        </div>

        {/* Functional Search Bar */}
        <div className="relative mb-6 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 t-faint pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search an area or issue (Energy, Water, Road, Hospital, Transport)..."
              className="w-full pl-12 pr-28 py-3.5 themed-card border b-skin/90 rounded-xl shadow-xs text-sm sm:text-base t-ink placeholder:t-faint focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/20 focus:border-[#6D4AFF] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 px-2 py-1 text-xs t-muted hover:t-ink-2 bg-neutral-100 rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Issue Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all whitespace-nowrap active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#6D4AFF]/10 border-[#6D4AFF] text-[#6D4AFF] shadow-xs'
                    : 'themed-card b-skin-strong t-ink-2 hover:border-neutral-300 hover:shadow-xs'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#6D4AFF]' : 't-muted'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bento Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LARGE FEATURED MODULE: LIVE NEAR YOU (Visually Dominant) */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <div className="rounded-2xl overflow-hidden">
                <div className="themed-card rounded-2xl border b-skin-strong p-6 skeleton">
                  <div className="h-6 w-48 skeleton-text mb-4" />
                  <div className="h-8 w-3/4 skeleton-text mb-3" />
                  <div className="h-4 w-5/6 skeleton-text mb-6" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="h-12 skeleton skeleton-text" />
                    <div className="h-12 skeleton skeleton-text" />
                    <div className="h-12 skeleton skeleton-text" />
                    <div className="h-12 skeleton skeleton-text" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="themed-card rounded-2xl border b-skin-strong shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between card-lift">
              {/* Card Header with Live Signal Pill and Metadata */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D4AFF] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6D4AFF]"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6D4AFF]">
                      Live Near You
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs t-muted font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 t-faint" />
                      {featuredIssue.locationName} · {featuredIssue.district}
                    </span>
                    <span>·</span>
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-200/60">
                      {featuredIssue.status}
                    </span>
                  </div>
                </div>

                {/* Primary Issue Headline */}
                <h2
                  onClick={() => setSelectedIssueId(featuredIssue.id)}
                  className="text-2xl sm:text-3xl font-extrabold t-ink hover:text-[#6D4AFF] transition-colors cursor-pointer"
                >
                  ⚡ {featuredIssue.title}
                </h2>

                <p className="mt-3 text-sm sm:text-base t-ink-2 line-clamp-2">
                  {featuredIssue.description}
                </p>

                {/* Quantitative Metric Strip (Tabular Figures) */}
                <div className="mt-6 pt-6 border-t b-skin grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="block text-xs t-muted font-medium">Grouped Reports</span>
                    <span className="text-2xl sm:text-3xl font-extrabold t-ink tabular-nums">
                      {featuredIssue.reportCount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs t-muted font-medium">24h Acceleration</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#6D4AFF] tabular-nums flex items-center">
                      +{featuredIssue.trendPercentage}%
                      <TrendingUp className="w-4 h-4 ml-1 inline" />
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs t-muted font-medium">Citizen Verifications</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums">
                      {featuredIssue.confirmationsCount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs t-muted font-medium">Activity Level</span>
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded inline-block mt-2 border border-rose-200/60">
                      High Signal Activity
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Official Notice Highlight */}
              {featuredIssue.updates.length > 0 && (
                <div className="mx-6 sm:mx-8 mb-6 p-4 rounded-xl themed-muted/90 border b-skin/70">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold t-ink">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified Official Update</span>
                    </div>
                    <span className="text-[11px] t-muted">
                      {featuredIssue.updates[0].timestamp}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm t-ink-2 leading-normal">
                    “{featuredIssue.updates[0].content}”
                  </p>
                  <span className="block text-[11px] t-muted mt-1 font-medium">
                    — {featuredIssue.updates[0].department}
                  </span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="themed-muted/60 px-6 sm:px-8 py-4 border-t b-skin flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => confirmIssue(featuredIssue.id, 'experienced')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      userConfirmations[featuredIssue.id] === 'experienced'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'themed-card t-ink-2 b-skin hover:bg-[#6D4AFF]/10'
                    }`}
                  >
                    ✓ I'm experiencing this too ({featuredIssue.confirmationsCount})
                  </button>
                  <button
                    onClick={() => confirmIssue(featuredIssue.id, 'not_affected')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      userConfirmations[featuredIssue.id] === 'not_affected'
                        ? 'bg-neutral-800 text-white border-neutral-800'
                        : 'themed-card t-ink-2 b-skin hover:bg-[#6D4AFF]/10'
                    }`}
                  >
                    Not affected
                  </button>
                </div>

                <button
                  onClick={() => setSelectedIssueId(featuredIssue.id)}
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#6D4AFF] hover:text-[#5835ea] group"
                >
                  <span>Open Full Signal Dossier</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
              </div>
            )}
          </div>

          {/* RIGHT BENTO COLUMN: AI Intelligence Signal Meter & Official Feed */}
          <div className="lg:col-span-4 space-y-6">
            {/* Bento Card: AI Cluster Intelligence */}
            <div className="themed-card rounded-2xl border b-skin-strong p-6 shadow-xs card-lift">
              <div className="flex items-center justify-between pb-3 border-b b-skin">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6D4AFF]"></span>
                  <span className="text-xs font-bold uppercase tracking-wider t-ink">
                    AI Signal Intelligence
                  </span>
                </div>
                <span className="text-[11px] t-muted font-mono">94% Confidence</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3 bg-[#6D4AFF]/5 rounded-xl border border-[#6D4AFF]/10">
                  <div className="text-xs font-semibold text-[#6D4AFF]">Cluster Detected</div>
                  <p className="text-xs t-ink-2 mt-1 leading-relaxed">
                    Automated spatial grouping correlated 1,248 complaints across 7 feeder zones without exposing personal voter or resident identities.
                  </p>
                </div>

                <div className="p-3 themed-muted rounded-xl border b-skin">
                  <div className="text-xs font-semibold t-ink-2">Under-reported Signal</div>
                  <p className="text-xs t-ink-2 mt-1">
                    Anomalous silence detected in 2nd Avenue informal market sector; potential priority follow-up needed.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('explore')}
                className="mt-4 w-full py-2 px-3 text-xs font-semibold t-ink-2 hover:t-ink bg-neutral-100 hover:bg-neutral-200/80 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Interactive Ward Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bento Card: Official Dispatch Stream */}
            <div className="themed-card rounded-2xl border b-skin-strong p-6 shadow-xs card-lift">
              <div className="flex items-center justify-between pb-3 border-b b-skin">
                <span className="text-xs font-bold uppercase tracking-wider t-ink">
                  Verified Authority Dispatches
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">3 active</span>
              </div>

              <div className="mt-3 space-y-3 text-xs">
                <div className="pb-3 border-b b-skin last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] t-faint mb-1">
                    <span className="font-semibold t-ink-2">Chennai MetroWater</span>
                    <span>15:10 IST</span>
                  </div>
                  <p className="t-ink-2 line-clamp-2">
                    Replacement gasket fitted for 600mm main conduit; booster pumps restarting.
                  </p>
                </div>

                <div className="pb-3 border-b b-skin last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] t-faint mb-1">
                    <span className="font-semibold t-ink-2">MTC Traffic Control</span>
                    <span>14:20 IST</span>
                  </div>
                  <p className="t-ink-2 line-clamp-2">
                    5 additional electric buses deployed to clear Perambur crowd build-up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECONDARY ISSUES GRID: Responsive Modular Bento */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold t-ink">Active Public Signals</h3>
              <p className="text-xs t-muted mt-0.5">
                Showing {filteredIssues.length} aggregated civic issue clusters in {selectedArea}
              </p>
            </div>

            <button
              onClick={() => setActiveView('trending')}
              className="text-xs font-semibold text-[#6D4AFF] hover:underline flex items-center gap-1"
            >
              <span>View Trending Metrics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <div key={`skel-${idx}`} className="themed-card rounded-xl border b-skin-strong p-5 shadow-xs transition-all animate-slide-up">
                    <div className="h-4 w-32 skeleton skeleton-text mb-3" />
                    <div className="h-5 w-3/4 skeleton skeleton-text mb-2" />
                    <div className="h-3 w-full skeleton skeleton-text mt-4" />
                    <div className="mt-6 pt-4 border-t b-skin flex items-center justify-between text-xs">
                      <div className="h-6 w-24 skeleton skeleton-text" />
                      <div className="h-6 w-20 skeleton skeleton-text" />
                    </div>
                  </div>
                ))
              : secondaryIssues.map((issue) => {
              const isConfirmed = userConfirmations[issue.id] === 'experienced';
              return (
                <div
                  key={issue.id}
                  className="themed-card rounded-xl border b-skin-strong p-5 shadow-xs hover:border-[#6D4AFF]/50 hover:shadow-sm transition-all flex flex-col justify-between group card-lift"
                >
                  <div>
                    {/* Header info */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="t-muted font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 t-faint" />
                        {issue.locationName}
                      </span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-semibold border ${
                          issue.status === 'Action in Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200/60'
                            : issue.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 border-amber-200/60'
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h4
                      onClick={() => setSelectedIssueId(issue.id)}
                      className="text-base font-bold t-ink group-hover:text-[#6D4AFF] transition-colors cursor-pointer line-clamp-2"
                    >
                      {issue.title}
                    </h4>

                    {/* Brief description */}
                    <p className="mt-2 text-xs t-ink-2 line-clamp-2">
                      {issue.description}
                    </p>
                  </div>

                  {/* Metrics & Interaction footer */}
                  <div className="mt-5 pt-4 border-t b-skin flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="t-faint text-[10px] block">Reports</span>
                        <span className="font-bold t-ink tabular-nums">
                          {issue.reportCount}
                        </span>
                      </div>
                      <div>
                        <span className="t-faint text-[10px] block">Velocity</span>
                        <span className="font-bold text-[#6D4AFF] tabular-nums">
                          +{issue.trendPercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => confirmIssue(issue.id, 'experienced')}
                        className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                          isConfirmed
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'themed-muted t-ink-2 b-skin hover:bg-[#6D4AFF]/10'
                        }`}
                      >
                        {isConfirmed ? '✓ Confirmed' : '+ Confirm'}
                      </button>

                      <button
                        onClick={() => setSelectedIssueId(issue.id)}
                        className="p-1.5 t-faint hover:t-ink-2 rounded hover:bg-[#6D4AFF]/10"
                        title="View details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
