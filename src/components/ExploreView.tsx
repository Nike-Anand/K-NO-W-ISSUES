/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { OpenStreetMap } from './OpenStreetMap';
import type { OpenStreetMapHandle, MapZone, MapLabel } from './OpenStreetMap';
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

/* ============================================================================
   OpenStreetMap viewport presets & overlays (real Chennai geography)
   ========================================================================== */

/** Real-world viewport for each district in the filter bar. */
const DISTRICT_VIEWS: Record<string, { center: [number, number]; zoom: number }> = {
  Chennai: { center: [13.0827, 80.2707], zoom: 12 },
  Coimbatore: { center: [11.0168, 76.9558], zoom: 12 },
  Bengaluru: { center: [12.9716, 77.5946], zoom: 12 },
};

const DEFAULT_VIEW = DISTRICT_VIEWS.Chennai;

/** Approximate civic zone boundaries, drawn as dashed OSM overlay polygons. */
const CHENNAI_ZONES: MapZone[] = [
  {
    id: 'zone-anna-nagar',
    color: '#6D4AFF',
    points: [
      [13.112, 80.182],
      [13.112, 80.224],
      [13.058, 80.232],
      [13.058, 80.188],
    ],
  },
  {
    id: 'zone-kilpauk',
    color: '#3B82F6',
    points: [
      [13.112, 80.224],
      [13.112, 80.278],
      [13.06, 80.278],
      [13.058, 80.232],
    ],
  },
  {
    id: 'zone-royapettah',
    color: '#10B981',
    points: [
      [13.058, 80.232],
      [13.06, 80.278],
      [12.996, 80.302],
      [13.0, 80.226],
    ],
  },
];

/** Cartographic locality captions rendered directly on the tiles. */
const CHENNAI_LABELS: MapLabel[] = [
  { id: 'lbl-anna-nagar', text: 'ANNA NAGAR', lat: 13.0995, lng: 80.1965 },
  { id: 'lbl-kilpauk', text: 'KILPAUK', lat: 13.1005, lng: 80.2525 },
  { id: 'lbl-central', text: 'CENTRAL / CHENNAI PORT', lat: 13.0705, lng: 80.3005 },
  { id: 'lbl-royapettah', text: 'ROYAPETTAH', lat: 13.0205, lng: 80.2685 },
  { id: 'lbl-guindy', text: 'GUINDY', lat: 12.9985, lng: 80.2005 },
];

export const ExploreView: React.FC = () => {
  const {
    issues,
    setSelectedIssueId,
    confirmIssue,
    userConfirmations,
  } = useApp();

  const mapHandleRef = useRef<OpenStreetMapHandle | null>(null);

  const [selectedCountry, setSelectedCountry] = useState<'India' | 'Brazil' | 'South Africa'>('India');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [activePin, setActivePin] = useState<Issue | null>(issues[0]);

  const activeView = DISTRICT_VIEWS[selectedDistrict] ?? DEFAULT_VIEW;

  // Filter issues according to selection
  const filteredIssues = issues.filter((iss) => {
    if (selectedCategory !== 'all' && iss.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] themed-page overflow-hidden flex flex-col">
      {/* FLOATING TOP FILTER BAR */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
        <div className="max-w-5xl mx-auto themed-card/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border b-skin/90 shadow-sm pointer-events-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Country Selector */}
            <div className="flex items-center gap-1.5 themed-muted px-2.5 py-1.5 rounded-lg border b-skin">
              <span className="t-faint font-medium">Nation:</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as any)}
                className="bg-transparent font-bold t-ink-2 focus:outline-none cursor-pointer"
              >
                <option value="India">🇮🇳 India</option>
                <option value="Brazil">🇧🇷 Brazil</option>
                <option value="South Africa">🇿🇦 South Africa</option>
              </select>
            </div>

            {/* State / Province */}
            <div className="flex items-center gap-1.5 themed-muted px-2.5 py-1.5 rounded-lg border b-skin">
              <span className="t-faint font-medium">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent font-medium t-ink-2 focus:outline-none cursor-pointer"
              >
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            {/* District */}
            <div className="flex items-center gap-1.5 themed-muted px-2.5 py-1.5 rounded-lg border b-skin">
              <span className="t-faint font-medium">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent font-medium t-ink-2 focus:outline-none cursor-pointer"
              >
                <option value="Chennai">Chennai Metro</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Bengaluru">Bengaluru Urban</option>
              </select>
            </div>

            {/* Issue Category filter */}
            <div className="flex items-center gap-1.5 themed-muted px-2.5 py-1.5 rounded-lg border b-skin">
              <span className="t-faint font-medium">Issue:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent font-medium t-ink-2 focus:outline-none cursor-pointer"
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
          <div className="flex items-center gap-1 themed-muted p-1 rounded-lg">
            {(['24h', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeRange(t)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  selectedTimeRange === t
                    ? 'themed-card t-ink shadow-xs'
                    : 't-muted hover:t-ink'
                }`}
              >
                {t === '24h' ? 'Last 24 Hours' : t === '7d' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAP CANVAS VIEWPORT (live Leaflet map on OpenStreetMap tiles) */}
      <div className="relative flex-1 w-full h-full select-none overflow-hidden">
        {/* OPENSTREETMAP VIEWPORT (Leaflet + OpenStreetMap raster tiles) */}
        <OpenStreetMap
          issues={filteredIssues}
          selectedIssueId={activePin?.id ?? null}
          onSelectIssue={setActivePin}
          center={activeView.center}
          zoom={activeView.zoom}
          zones={CHENNAI_ZONES}
          labels={CHENNAI_LABELS}
          handleRef={mapHandleRef}
        />

        {/* FLOATING MAP ZOOM CONTROLS */}
        <div className="absolute right-4 top-24 z-20 flex flex-col gap-1.5 themed-card/95 backdrop-blur-md p-1.5 rounded-xl border b-skin/90 shadow-sm">
          <button
            onClick={() => mapHandleRef.current?.zoomIn()}
            className="p-2 t-ink-2 hover:t-ink hover:themed-muted rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapHandleRef.current?.zoomOut()}
            className="p-2 t-ink-2 hover:t-ink hover:themed-muted rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapHandleRef.current?.resetView()}
            className="p-2 t-ink-2 hover:t-ink hover:themed-muted rounded-lg transition-colors"
            title="Reset to City View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* FLOATING LEGEND (lifted so the OpenStreetMap attribution stays legible) */}
        <div className="absolute left-4 bottom-12 z-20 themed-card/95 backdrop-blur-md rounded-xl p-3 border b-skin/90 shadow-sm text-xs">
          <div className="font-bold t-ink-2 mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#6D4AFF]" />
            <span>Signal Severity & Aggregation</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] t-ink-2">
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
          <div className="mt-2 pt-2 border-t b-skin text-[10px] t-faint">
            Fuzzed spatial density · No private GPS coordinates logged
          </div>
        </div>

        {/* FLOATING GLASS DETAIL PANEL (Selected Hotspot) */}
        {activePin && (
          <div className="absolute right-4 bottom-4 z-20 max-w-sm w-full themed-card/95 backdrop-blur-md rounded-2xl p-5 border b-skin/90 shadow-xl animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-2 border-b b-skin text-xs mb-3">
              <div className="flex items-center gap-1.5 font-bold t-ink">
                <MapPin className="w-3.5 h-3.5 text-[#6D4AFF]" />
                <span className="uppercase tracking-wide">{activePin.locationName}</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {activePin.status}
              </span>
            </div>

            <h4 className="text-base font-extrabold t-ink leading-snug">
              {activePin.title}
            </h4>

            <p className="mt-1 text-xs t-ink-2 line-clamp-2">
              {activePin.description}
            </p>

            {/* Metrics */}
            <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 themed-muted rounded-xl border b-skin text-center">
              <div>
                <span className="text-[10px] t-faint block">Reports</span>
                <span className="text-sm font-bold t-ink tabular-nums">
                  {activePin.reportCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] t-faint block">Velocity</span>
                <span className="text-sm font-bold text-[#6D4AFF] tabular-nums">
                  +{activePin.trendPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] t-faint block">Confirmed</span>
                <span className="text-sm font-bold text-emerald-600 tabular-nums">
                  {activePin.confirmationsCount}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                onClick={() => confirmIssue(activePin.id, 'experienced')}
                className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg themed-muted hover:bg-neutral-200/80 t-ink-2 transition-colors"
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
