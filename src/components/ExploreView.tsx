/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Info,
  Zap,
  Droplets,
  Bus,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { Issue, IssueCategory } from '../types';

export const ExploreView: React.FC = () => {
  const {
    issues,
    setSelectedIssueId,
    confirmIssue,
    userConfirmations,
  } = useApp();

  const [selectedCountry, setSelectedCountry] = useState<'India' | 'Brazil' | 'South Africa'>('India');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [zoomLevel, setZoomLevel] = useState<number>(2); // 1: Country, 2: District/City, 3: Ward/Neighborhood
  const [activePin, setActivePin] = useState<Issue | null>(issues[0]);

  // Filter issues according to selection
  const filteredIssues = issues.filter((iss) => {
    if (selectedCategory !== 'all' && iss.category !== selectedCategory) return false;
    return true;
  });

  const getMarkerStyle = (issue: Issue) => {
    switch (issue.category) {
      case 'energy':
        return {
          bg: 'bg-[#6D4AFF]',
          ring: 'ring-[#6D4AFF]/30',
          text: 'text-[#6D4AFF]',
          pulseColor: '#6D4AFF',
        };
      case 'water':
        return {
          bg: 'bg-blue-500',
          ring: 'ring-blue-500/30',
          text: 'text-blue-500',
          pulseColor: '#3B82F6',
        };
      case 'healthcare':
        return {
          bg: 'bg-emerald-500',
          ring: 'ring-emerald-500/30',
          text: 'text-emerald-500',
          pulseColor: '#10B981',
        };
      case 'transport':
        return {
          bg: 'bg-amber-500',
          ring: 'ring-amber-500/30',
          text: 'text-amber-500',
          pulseColor: '#F59E0B',
        };
      default:
        return {
          bg: 'bg-rose-500',
          ring: 'ring-rose-500/30',
          text: 'text-rose-500',
          pulseColor: '#EF4444',
        };
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#F8F8FC] overflow-hidden flex flex-col">
      {/* FLOATING TOP FILTER BAR */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-neutral-200/90 shadow-sm pointer-events-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Country Selector */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-400 font-medium">Nation:</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as any)}
                className="bg-transparent font-bold text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="India">🇮🇳 India</option>
                <option value="Brazil">🇧🇷 Brazil</option>
                <option value="South Africa">🇿🇦 South Africa</option>
              </select>
            </div>

            {/* State / Province */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-400 font-medium">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            {/* District */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-400 font-medium">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="Chennai">Chennai Metro</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Bengaluru">Bengaluru Urban</option>
              </select>
            </div>

            {/* Issue Category filter */}
            <div className="flex items-center gap-1.5 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-400 font-medium">Issue:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="energy">⚡ Energy</option>
                <option value="water">💧 Water</option>
                <option value="transport">🚌 Transport</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="infrastructure">🛣 Infrastructure</option>
              </select>
            </div>
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
            {(['24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeRange(t)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  selectedTimeRange === t
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {t === '24h' ? 'Last 24 Hours' : t === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAP CANVAS VIEWPORT (SVG Interactive Light Geospatial Grid) */}
      <div className="relative flex-1 w-full h-full bg-[#F5F4FA] select-none overflow-hidden">
        {/* Geographic Light Map Background */}
        <svg
          className="w-full h-full object-cover transition-transform duration-500"
          viewBox="0 0 1000 650"
          preserveAspectRatio="xMidYMid slice"
          style={{
            transform: `scale(${zoomLevel === 1 ? 0.9 : zoomLevel === 2 ? 1.05 : 1.3})`,
            transformOrigin: '55% 45%',
          }}
        >
          {/* Subtle Cartographic Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E5E7EB" strokeWidth="0.75" />
            </pattern>
            {/* Coastal gradient */}
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EFF6FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Coastal Bay of Bengal representation (East) */}
          <path
            d="M 760,0 C 740,120 780,280 750,420 C 720,540 760,650 760,650 L 1000,650 L 1000,0 Z"
            fill="url(#oceanGrad)"
            stroke="#BFDBFE"
            strokeWidth="1.5"
          />

          {/* Major Urban Arterial Corridors (EVR Periyar Salai, Mount Road / Anna Salai, OMR, Inner Ring) */}
          <path
            d="M 120,380 Q 420,360 740,320"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 220,140 Q 520,290 730,440"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 480,80 Q 560,340 520,620"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeDasharray="6 3"
          />

          {/* Ward & Zone Boundary Polygons */}
          <polygon
            points="380,220 540,200 620,320 460,360"
            fill="#6D4AFF"
            fillOpacity="0.04"
            stroke="#6D4AFF"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <polygon
            points="540,200 710,180 740,320 620,320"
            fill="#3B82F6"
            fillOpacity="0.04"
            stroke="#3B82F6"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <polygon
            points="460,360 620,320 660,490 480,510"
            fill="#10B981"
            fillOpacity="0.04"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />

          {/* Locality Labels */}
          <text x="440" y="240" fill="#94A3B8" fontSize="13" fontWeight="600" letterSpacing="1">
            ANNA NAGAR
          </text>
          <text x="630" y="230" fill="#94A3B8" fontSize="13" fontWeight="600" letterSpacing="1">
            KILPAUK
          </text>
          <text x="680" y="360" fill="#94A3B8" fontSize="13" fontWeight="600" letterSpacing="1">
            CENTRAL / CHENNAI PORT
          </text>
          <text x="590" y="470" fill="#94A3B8" fontSize="13" fontWeight="600" letterSpacing="1">
            ROYAPETTAH
          </text>
          <text x="430" y="540" fill="#94A3B8" fontSize="13" fontWeight="600" letterSpacing="1">
            GUINDY
          </text>
          <text x="820" y="100" fill="#93C5FD" fontSize="12" fontWeight="700" letterSpacing="2">
            BAY OF BENGAL
          </text>
        </svg>

        {/* INTERACTIVE SIGNAL NODES (Aggregated Signal Pins) */}
        {filteredIssues.map((issue) => {
          const style = getMarkerStyle(issue);
          const isSelected = activePin?.id === issue.id;

          return (
            <div
              key={issue.id}
              onClick={() => setActivePin(issue)}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group"
              style={{
                left: `${issue.coordinates.x}%`,
                top: `${issue.coordinates.y}%`,
              }}
            >
              {/* Pulse rings */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`animate-ping absolute inline-flex h-10 w-10 rounded-full opacity-60 ${style.bg}`}
                />
                <span
                  className={`relative inline-flex items-center justify-center h-8 w-8 rounded-full text-white font-bold text-xs shadow-md border-2 border-white transition-transform ${
                    style.bg
                  } ${isSelected ? 'scale-125 ring-4 ring-[#6D4AFF]/40' : 'group-hover:scale-110'}`}
                >
                  {issue.category === 'energy'
                    ? '⚡'
                    : issue.category === 'water'
                    ? '💧'
                    : issue.category === 'transport'
                    ? '🚌'
                    : '🏥'}
                </span>
              </div>

              {/* Attached micro badge */}
              <div
                className={`mt-1 text-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/95 border border-neutral-200/90 shadow-2xs whitespace-nowrap transition-all ${
                  isSelected ? 'text-[#6D4AFF] ring-1 ring-[#6D4AFF]' : 'text-neutral-700'
                }`}
              >
                {issue.reportCount} reports
              </div>
            </div>
          );
        })}

        {/* FLOATING MAP ZOOM CONTROLS */}
        <div className="absolute right-4 top-24 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-neutral-200/90 shadow-sm">
          <button
            onClick={() => setZoomLevel((z) => Math.min(3, z + 1))}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(1, z - 1))}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(2)}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Reset to City View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* FLOATING LEGEND */}
        <div className="absolute left-4 bottom-4 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-neutral-200/90 shadow-sm text-xs">
          <div className="font-bold text-neutral-800 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6D4AFF]" />
            <span>Signal Severity & Aggregation</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Critical / Urgent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6D4AFF]" />
              <span>High Activity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Under Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Action in Progress</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-400">
            Fuzzed spatial density · No private GPS coordinates logged
          </div>
        </div>

        {/* FLOATING GLASS DETAIL PANEL (Selected Hotspot) */}
        {activePin && (
          <div className="absolute right-4 bottom-4 z-20 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-neutral-200/90 shadow-xl animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs mb-3">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                <MapPin className="w-3.5 h-3.5 text-[#6D4AFF]" />
                <span className="uppercase tracking-wide">{activePin.locationName}</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {activePin.status}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-neutral-900 leading-snug">
              {activePin.title}
            </h4>

            <p className="mt-1 text-xs text-neutral-600 line-clamp-2">
              {activePin.description}
            </p>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
              <div>
                <span className="text-[10px] text-neutral-400 block">Reports</span>
                <span className="text-sm font-bold text-neutral-900 tabular-nums">
                  {activePin.reportCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Velocity</span>
                <span className="text-sm font-bold text-[#6D4AFF] tabular-nums">
                  +{activePin.trendPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Confirmed</span>
                <span className="text-sm font-bold text-emerald-600 tabular-nums">
                  {activePin.confirmationsCount}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => confirmIssue(activePin.id, 'experienced')}
                className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 transition-colors"
              >
                {userConfirmations[activePin.id] === 'experienced' ? '✓ Confirmed' : '+ Confirm'}
              </button>

              <button
                onClick={() => setSelectedIssueId(activePin.id)}
                className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-[#6D4AFF] hover:bg-[#5835ea] text-white flex items-center justify-center gap-1 transition-colors"
              >
                <span>Open Issue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
