/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as LeafletModule from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Issue, IssueCategory } from '../types';

/**
 * Leaflet is published as UMD/CommonJS, so depending on how the bundler
 * interops it the real namespace can land on `default` (Vite dep pre-bundle)
 * or on the namespace object itself (ESM flattening). Unwrap defensively.
 */
const L = ((LeafletModule as unknown as { default?: typeof LeafletModule }).default ??
  LeafletModule) as typeof LeafletModule;

/* ============================================================================
   OpenStreetMap canvas (Leaflet)

   Renders genuine OpenStreetMap raster tiles in both color grades. The dark
   grade is produced with a tile-pane filter over the same OSM tiles, so no
   third-party basemap provider is required and the OSM attribution stays
   accurate in every theme.
   ========================================================================== */

/** Palette shared by the map pins and the floating legend. */
export const CATEGORY_MAP_COLORS: Record<IssueCategory, string> = {
  energy: '#6D4AFF',
  water: '#3B82F6',
  transport: '#F59E0B',
  healthcare: '#10B981',
  infrastructure: '#EF4444',
  food: '#F97316',
  sanitation: '#0EA5E9',
  education: '#8B5CF6',
  emergency: '#DC2626',
  other: '#64748B',
};

const CATEGORY_GLYPHS: Record<IssueCategory, string> = {
  energy: '⚡',
  water: '💧',
  transport: '🚌',
  healthcare: '🏥',
  infrastructure: '🛣',
  food: '🍚',
  sanitation: '🚰',
  education: '🎓',
  emergency: '🚨',
  other: '📍',
};

/** Approximate administrative zone drawn as a dashed OSM overlay polygon. */
export interface MapZone {
  id: string;
  color: string;
  /** `[lat, lng]` ring, clockwise. */
  points: [number, number][];
}

/** Static cartographic locality caption. */
export interface MapLabel {
  id: string;
  text: string;
  lat: number;
  lng: number;
}

/** Imperative surface exposed to the parent view (zoom buttons, deep links). */
export interface OpenStreetMapHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  flyTo: (lat: number, lng: number, zoom?: number) => void;
}

interface OpenStreetMapProps {
  issues: Issue[];
  selectedIssueId?: string | null;
  onSelectIssue: (issue: Issue) => void;
  /** Viewport the map opens on and returns to via `resetView()`. */
  center: [number, number];
  zoom: number;
  zones?: MapZone[];
  labels?: MapLabel[];
  /** Receives the imperative handle once the Leaflet map is live. */
  handleRef?: React.MutableRefObject<OpenStreetMapHandle | null>;
  className?: string;
}

const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

const buildPinHtml = (issue: Issue, isSelected: boolean): string => {
  const color = CATEGORY_MAP_COLORS[issue.category] ?? CATEGORY_MAP_COLORS.other;
  const glyph = CATEGORY_GLYPHS[issue.category] ?? CATEGORY_GLYPHS.other;
  return [
    `<div class="ld-map-pin${isSelected ? ' is-selected' : ''}">`,
    `<span class="ld-map-pin__pulse" style="background:${color}"></span>`,
    `<span class="ld-map-pin__dot" style="background:${color}">${glyph}</span>`,
    `<span class="ld-map-pin__badge">${issue.reportCount} reports</span>`,
    `</div>`,
  ].join('');
};

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  issues,
  selectedIssueId,
  onSelectIssue,
  center,
  zoom,
  zones = [],
  labels = [],
  handleRef,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const zoneLayerRef = useRef<L.LayerGroup | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const initialViewRef = useRef<{ center: [number, number]; zoom: number }>({ center, zoom });
  const liveViewRef = useRef<{ center: [number, number]; zoom: number }>({ center, zoom });
  const didSyncViewRef = useRef(false);

  const [centerLat, centerLng] = center;
  // Keep the imperative handle pointed at the latest viewport preset.
  liveViewRef.current = { center, zoom };

  /* ---- 1. Map bootstrap (runs once) ---- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center: initialViewRef.current.center,
      zoom: initialViewRef.current.zoom,
      zoomControl: false,
      maxZoom: 19,
      worldCopyJump: true,
    });

    L.tileLayer(OSM_TILE_URL, {
      maxZoom: 19,
      attribution: OSM_ATTRIBUTION,
    }).addTo(map);

    // Required OSM credit, parked bottom-left so the legend/zoom UI stays clear.
    map.attributionControl.setPosition('bottomleft');
    map.attributionControl.setPrefix(false);

    const zoneLayer = L.layerGroup().addTo(map);
    const markerLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    zoneLayerRef.current = zoneLayer;
    markerLayerRef.current = markerLayer;

    if (handleRef) {
      handleRef.current = {
        zoomIn: () => map.zoomIn(),
        zoomOut: () => map.zoomOut(),
        resetView: () => map.flyTo(liveViewRef.current.center, liveViewRef.current.zoom, { duration: 0.6 }),
        flyTo: (lat, lng, targetZoom) =>
          map.flyTo([lat, lng], targetZoom ?? map.getZoom(), { duration: 0.6 }),
      };
    }

    // Leaflet measures the container on init; keep it honest across layout shifts.
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);
    const rafId = requestAnimationFrame(() => map.invalidateSize());

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      zoneLayerRef.current = null;
      markerLayerRef.current = null;
      if (handleRef) handleRef.current = null;
    };
    // Bootstrap is intentionally mount-only; viewport changes are handled below.
  }, []);

  /* ---- 2. Programmatic viewport changes ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // The initial viewport is already applied by the bootstrap effect.
    if (!didSyncViewRef.current) {
      didSyncViewRef.current = true;
      return;
    }
    map.flyTo([centerLat, centerLng], zoom, { duration: 0.6 });
  }, [centerLat, centerLng, zoom]);

  /* ---- 3. Administrative zone overlay ---- */
  useEffect(() => {
    const layer = zoneLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    zones.forEach((zone) => {
      L.polygon(zone.points, {
        color: zone.color,
        weight: 1.4,
        dashArray: '5 4',
        fillColor: zone.color,
        fillOpacity: 0.05,
      }).addTo(layer);
    });
  }, [zones]);

  /* ---- 4. Locality captions ---- */
  useEffect(() => {
    const layer = zoneLayerRef.current;
    if (!layer) return;

    labels.forEach((label) => {
      L.marker([label.lat, label.lng], {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({ className: 'ld-map-label', html: label.text }),
      }).addTo(layer);
    });
  }, [labels]);

  /* ---- 5. Aggregated signal pins ---- */
  useEffect(() => {
    const layer = markerLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    issues.forEach((issue) => {
      const { lat, lng } = issue.coordinates;
      const isSelected = issue.id === selectedIssueId;

      L.marker([lat, lng], {
        title: `${issue.locationName} — ${issue.title}`,
        riseOnHover: true,
        zIndexOffset: isSelected ? 1000 : 0,
        icon: L.divIcon({
          className: 'ld-map-pin-wrap',
          html: buildPinHtml(issue, isSelected),
        }),
      })
        .on('click', () => onSelectIssue(issue))
        .addTo(layer);
    });
  }, [issues, selectedIssueId, onSelectIssue]);

  return (
    <div
      ref={containerRef}
      className={`ld-map-canvas ${className}`}
      role="application"
      aria-label="OpenStreetMap — aggregated civic signal map"
    />
  );
};
