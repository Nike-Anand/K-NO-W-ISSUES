/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Filter,
  Activity,
  Flame,
  Clock,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Issue } from '../types';

export const TrendingView: React.FC = () => {
  const { issues, setSelectedIssueId, confirmIssue, userConfirmations } = useApp();
  const [timeFilter, setTimeFilter] = useState<'24h' | '48h' | '7d'>('24h');

  // Sort issues by trend percentage descending
  const sortedIssues = [...issues].sort((a, b) => b.trendPercentage - a.trendPercentage);

  // Helper to generate SVG sparkline path
  const renderSparkline = (data: number[], color: string) => {
    if (!data || data.length < 2) return null;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 160;
    const height = 44;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
      <svg className="w-36 sm:w-44 h-11 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${color})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End dot */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].split(',')[0]}
            cy={points[points.length - 1].split(',')[1]}
            r="3"
            fill={color}
          />
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8FC] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6D4AFF] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-[#6D4AFF]" />
              <span>Signal Acceleration Index</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Trending Public Signals
            </h1>
            <p className="mt-2 text-sm text-neutral-600 max-w-2xl">
              Signals exhibiting statistical surge and rapid verification velocity across the Chennai metropolitan monitoring zone.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-200/80 shadow-2xs text-xs">
            {(['24h', '48h', '7d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeFilter === t
                    ? 'bg-[#6D4AFF] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {t === '24h' ? 'Last 24h' : t === '48h' ? 'Last 48h' : 'Last 7 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* TRENDING LIST TABLE / BENTO ROWS */}
        <div className="space-y-4">
          {sortedIssues.map((issue, index) => {
            const isTop = index === 0;
            const strokeColor =
              issue.category === 'energy'
                ? '#6D4AFF'
                : issue.category === 'water'
                ? '#3B82F6'
                : issue.category === 'healthcare'
                ? '#10B981'
                : '#F59E0B';

            return (
              <div
                key={issue.id}
                className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-xs hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 group ${
                  isTop ? 'border-[#6D4AFF]/40 ring-1 ring-[#6D4AFF]/10' : 'border-neutral-200/80'
                }`}
              >
                {/* Left section: Rank + Category icon + Title + Metadata */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex flex-col items-center justify-center w-8 pt-1 text-center shrink-0">
                    <span className="font-mono text-lg font-extrabold text-neutral-400 group-hover:text-[#6D4AFF] transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="capitalize font-bold text-[#6D4AFF] bg-[#6D4AFF]/10 px-2 py-0.5 rounded">
                        {issue.category}
                      </span>
                      <span className="text-neutral-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {issue.locationName} · {issue.district}
                      </span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-neutral-500 font-medium">
                        {issue.affectedWards.join(', ')}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedIssueId(issue.id)}
                      className="text-lg sm:text-xl font-extrabold text-neutral-900 group-hover:text-[#6D4AFF] transition-colors cursor-pointer"
                    >
                      {issue.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-600 line-clamp-1">
                      {issue.description}
                    </p>
                  </div>
                </div>

                {/* Middle section: Real-time sparkline graph + Velocity badge */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-base sm:text-lg font-extrabold text-[#6D4AFF] tabular-nums">
                      <span>+{issue.trendPercentage}%</span>
                      <TrendingUp className="w-4 h-4 inline" />
                    </div>
                    <span className="text-[11px] text-neutral-400 block font-mono">
                      in past {timeFilter}
                    </span>
                  </div>

                  {/* Sparkline Drawing */}
                  <div className="py-1">
                    {renderSparkline(issue.sparklineData, strokeColor)}
                  </div>

                  {/* Quantitative report totals */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-base sm:text-lg font-extrabold text-neutral-900 tabular-nums">
                      {issue.reportCount.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-neutral-500 block">Reports Grouped</span>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={() => setSelectedIssueId(issue.id)}
                    className="p-2 text-neutral-400 hover:text-[#6D4AFF] hover:bg-[#6D4AFF]/10 rounded-xl transition-all"
                    title="Open Issue Dossier"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
