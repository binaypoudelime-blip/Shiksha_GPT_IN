"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Globe, Map, Info, ChevronRight, Search, X } from 'lucide-react';
import * as THREE from 'three';
import countriesData from '../../../../../public/world_countries_categorized.json';

// Dynamically import Globe to avoid SSR issues with Three.js
const GlobeComponent = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center w-full h-full text-white gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-400 animate-spin" />
      <p className="text-white/50 text-xs font-medium tracking-widest uppercase animate-pulse">Loading Globe…</p>
    </div>
  ),
});

// Stable vibrant palette
const VIBRANT_COLORS = [
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
  '#F473B9', '#9C27B0', '#00BCD4', '#FF9800',
  '#E91E63', '#4CAF50', '#03A9F4', '#FFEB3B',
  '#FF5722', '#8BC34A', '#673AB7', '#009688',
  '#FFC107', '#F44336', '#2196F3', '#76FF03',
];

// Country lat/lng lookup for fly-to (approximate centroids)
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  Afghanistan: { lat: 33, lng: 65 }, Albania: { lat: 41, lng: 20 },
  Algeria: { lat: 28, lng: 2 }, Andorra: { lat: 42.5, lng: 1.5 },
  Angola: { lat: -11, lng: 17 }, Argentina: { lat: -34, lng: -64 },
  Armenia: { lat: 40, lng: 45 }, Australia: { lat: -27, lng: 133 },
  Austria: { lat: 47.3, lng: 13.3 }, Azerbaijan: { lat: 40.5, lng: 47.5 },
  Bahrain: { lat: 26, lng: 50.5 }, Bangladesh: { lat: 24, lng: 90 },
  Belarus: { lat: 53, lng: 28 }, Belgium: { lat: 50.8, lng: 4 },
  Bolivia: { lat: -17, lng: -65 }, Brazil: { lat: -10, lng: -55 },
  Bulgaria: { lat: 43, lng: 25 }, Cambodia: { lat: 12, lng: 105 },
  Cameroon: { lat: 6, lng: 12 }, Canada: { lat: 60, lng: -95 },
  Chile: { lat: -30, lng: -71 }, China: { lat: 35, lng: 105 },
  Colombia: { lat: 4, lng: -72 }, Croatia: { lat: 45.1, lng: 15.2 },
  Cuba: { lat: 21.5, lng: -79.5 }, 'Czech Republic': { lat: 49.8, lng: 15.5 },
  Denmark: { lat: 56, lng: 10 }, Ecuador: { lat: -2, lng: -77.5 },
  Egypt: { lat: 27, lng: 30 }, Ethiopia: { lat: 8, lng: 38 },
  Finland: { lat: 64, lng: 26 }, France: { lat: 46, lng: 2 },
  Germany: { lat: 51, lng: 9 }, Ghana: { lat: 8, lng: -2 },
  Greece: { lat: 39, lng: 22 }, Guatemala: { lat: 15.5, lng: -90.25 },
  Hungary: { lat: 47, lng: 20 }, India: { lat: 20, lng: 77 },
  Indonesia: { lat: -5, lng: 120 }, Iran: { lat: 32, lng: 53 },
  Iraq: { lat: 33, lng: 44 }, Ireland: { lat: 53, lng: -8 },
  Israel: { lat: 31.5, lng: 34.75 }, Italy: { lat: 42.8, lng: 12.8 },
  Japan: { lat: 36, lng: 138 }, Jordan: { lat: 31, lng: 36 },
  Kazakhstan: { lat: 48, lng: 68 }, Kenya: { lat: 1, lng: 38 },
  'South Korea': { lat: 37, lng: 127.5 }, Kuwait: { lat: 29.3, lng: 47.7 },
  Libya: { lat: 25, lng: 17 }, Malaysia: { lat: 2.5, lng: 112.5 },
  Mexico: { lat: 23, lng: -102 }, Morocco: { lat: 32, lng: -5 },
  Mozambique: { lat: -18, lng: 35 }, Myanmar: { lat: 17, lng: 96 },
  Nepal: { lat: 28, lng: 84 }, Netherlands: { lat: 52.5, lng: 5.75 },
  'New Zealand': { lat: -41, lng: 174 }, Nigeria: { lat: 10, lng: 8 },
  Norway: { lat: 62, lng: 10 }, Pakistan: { lat: 30, lng: 70 },
  Peru: { lat: -10, lng: -76 }, Philippines: { lat: 13, lng: 122 },
  Poland: { lat: 52, lng: 20 }, Portugal: { lat: 39.5, lng: -8 },
  Qatar: { lat: 25.5, lng: 51.2 }, Romania: { lat: 46, lng: 25 },
  Russia: { lat: 60, lng: 100 }, 'Saudi Arabia': { lat: 25, lng: 45 },
  Serbia: { lat: 44, lng: 21 }, 'South Africa': { lat: -29, lng: 25 },
  Spain: { lat: 40, lng: -4 }, 'Sri Lanka': { lat: 7, lng: 81 },
  Sudan: { lat: 15, lng: 30 }, Sweden: { lat: 62, lng: 15 },
  Switzerland: { lat: 47, lng: 8 }, Syria: { lat: 35, lng: 38 },
  Taiwan: { lat: 23.5, lng: 121 }, Tanzania: { lat: -6, lng: 35 },
  Thailand: { lat: 15, lng: 101 }, Tunisia: { lat: 34, lng: 9 },
  Turkey: { lat: 39, lng: 35 }, Uganda: { lat: 1, lng: 32 },
  Ukraine: { lat: 49, lng: 32 }, 'United Arab Emirates': { lat: 24, lng: 54 },
  'United Kingdom': { lat: 54, lng: -2 }, 'United States': { lat: 38, lng: -97 },
  Uruguay: { lat: -33, lng: -56 }, Venezuela: { lat: 8, lng: -66 },
  Vietnam: { lat: 16, lng: 107 }, Yemen: { lat: 15.5, lng: 48 },
  Zambia: { lat: -13.5, lng: 28 }, Zimbabwe: { lat: -20, lng: 30 },
};

// Region accent colours
const REGION_COLORS: Record<string, string> = {
  Asia: '#4D96FF', Europe: '#6BCB77', Africa: '#FFD93D',
  'North America': '#FF9800', 'South America': '#F473B9',
  Oceania: '#00BCD4', 'Middle East': '#FF6B6B',
};

/** Build a THREE.Points star field and inject it into the globe scene. */
function addStarField(scene: THREE.Scene) {
  const STAR_COUNT = 2500;
  const RADIUS = 900;

  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * 2 * Math.PI;
    positions[i * 3] = RADIUS * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = RADIUS * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = RADIUS * Math.cos(theta);

    const warm = Math.random() > 0.5;
    colors[i * 3] = warm ? 1.0 : 0.7 + Math.random() * 0.3;
    colors[i * 3 + 1] = warm ? 0.92 + Math.random() * 0.08 : 0.85 + Math.random() * 0.15;
    colors[i * 3 + 2] = warm ? 0.75 + Math.random() * 0.25 : 1.0;

    sizes[i] = 1.0 + Math.random() * 3.0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 2.2,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    depthWrite: false,
  });

  const stars = new THREE.Points(geo, mat);
  stars.name = '__starField__';
  scene.add(stars);
  return stars;
}

type CountryEntry = {
  country: string;
  capital: string;
  population_2026: number;
  land_area_km2: number;
  world_population_share_percent: number;
  population_density_per_km2: number;
  flag_image_url: string;
  region: string;
};

const ALL_COUNTRIES: CountryEntry[] = (countriesData as any).sovereign_countries as CountryEntry[];

export default function WorldMapPage() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [isPlaneMode, setIsPlaneMode] = useState(false);
  const [hoverCountry, setHoverCountry] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [countries, setCountries] = useState<any>({ features: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Generate ocean texture
  const oceanTexture = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = 4; canvas.height = 4;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#020d2bff';
    ctx.fillRect(0, 0, 4, 4);
    return canvas.toDataURL();
  }, []);

  // Measure container — ResizeObserver reacts to sidebar open/close too
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Load GeoJSON
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(r => r.json())
      .then(data => setCountries(data))
      .catch(console.error);
  }, []);

  // Color map
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    (countries.features || []).forEach((f: any, i: number) => {
      map[f.properties.NAME] = VIBRANT_COLORS[i % VIBRANT_COLORS.length];
    });
    return map;
  }, [countries]);

  // Controls + star field
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minDistance = 120;
      controls.maxDistance = 1200;
    }
    const scene: THREE.Scene = globeRef.current.scene();
    if (scene && !scene.getObjectByName('__starField__')) {
      addStarField(scene);
    }
  }, [countries]);

  const getPolygonColor = useCallback((d: any) => {
    const name = d?.properties?.NAME;
    if (!name) return 'rgba(100,100,100,0.5)';
    if (hoverCountry && hoverCountry.properties.NAME === name) return 'rgba(255,255,255,0.95)';
    if (selectedCountry === name) return 'rgba(255,255,255,0.9)';
    const base = colorMap[name] || '#4D96FF';
    return base + 'CC';
  }, [hoverCountry, selectedCountry, colorMap]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  // Fly to country on click
  const flyToCountry = useCallback((name: string) => {
    setSelectedCountry(name);
    setIsPlaneMode(false);
    const coords = COUNTRY_COORDS[name];
    if (globeRef.current && coords) {
      globeRef.current.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 1.5 }, 1200);
    }
  }, []);

  // Filtered list
  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter(c =>
      c.country.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)
    );
  }, [search]);

  // Scroll selected into view
  useEffect(() => {
    if (!selectedCountry || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-country="${selectedCountry}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedCountry]);

  return (
    <div className="min-h-full flex flex-col animate-in fade-in duration-500 pb-2">

      {/* Outer layout: canvas + sidebar side by side */}
      <div className="flex-1 flex gap-0 relative" style={{ minHeight: '520px' }}>

        {/* ══ MAIN CANVAS ══ */}
        <div
          className="flex-1 relative rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300"
          onMouseMove={handleMouseMove}
        >

          {/* ---- GLOBE MODE ---- */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${isPlaneMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="absolute inset-0 bg-[#020208]" />
            <div ref={containerRef} className="absolute inset-0">
              <GlobeComponent
                ref={globeRef}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="rgba(63, 173, 241, 0)"
                globeImageUrl={oceanTexture}
                showGlobe={true}
                atmosphereColor="rgba(40,100,255,0.5)"
                atmosphereAltitude={0.18}
                showAtmosphere={true}
                polygonsData={countries.features}
                polygonAltitude={(d: any) =>
                  hoverCountry && d?.properties?.NAME === hoverCountry.properties.NAME ? 0.03 : 0.006
                }
                polygonCapColor={getPolygonColor}
                polygonSideColor={() => 'rgba(0,0,0,0.3)'}
                polygonStrokeColor={() => '#00000066'}
                onPolygonHover={(d: any) => setHoverCountry(d)}
                polygonsTransitionDuration={200}
                onGlobeReady={() => {
                  if (globeRef.current) {
                    globeRef.current.pointOfView({ lat: 20, lng: 78, altitude: 2.2 }, 0);
                    const controls = globeRef.current.controls();
                    if (controls) {
                      controls.autoRotate = false;
                      controls.enableDamping = true;
                      controls.dampingFactor = 0.1;
                      controls.minDistance = 120;
                      controls.maxDistance = 1200;
                    }
                    const scene: THREE.Scene = globeRef.current.scene();
                    if (scene && !scene.getObjectByName('__starField__')) {
                      addStarField(scene);
                    }
                  }
                }}
              />
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 left-5 z-10 pointer-events-none">
              <div className="px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white/35 text-[9px] font-semibold tracking-wider uppercase shadow-xl whitespace-nowrap">
                Drag · Scroll to zoom · Hover for name
              </div>
            </div>

            {/* Floating country tooltip */}
            {hoverCountry && (
              <div className="fixed z-50 pointer-events-none" style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 44 }}>
                <div className="px-3 py-1.5 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl text-white text-xs font-bold shadow-2xl whitespace-nowrap">
                  {hoverCountry.properties.NAME}
                </div>
              </div>
            )}
          </div>

          {/* ---- PLANE MODE ---- */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${isPlaneMode ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ background: 'radial-gradient(ellipse at center, #0d1a2e 0%, #030308 80%)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  src="/lab/worldmap.png"
                  alt="World Map Flat View"
                  className="w-full h-full object-contain bg-[#1a2a4a] transition-transform duration-[2000ms] group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3 px-4 py-2.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-2xl">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-0.5">Plane Mode</p>
                    <p className="text-sm font-bold">Political World Map — {countries.features.length} Countries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Canvas Overlays (always on top) ── */}

          {/* Back to Lab */}
          <Link
            href="/app/lab"
            className="absolute top-4 left-5 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-semibold tracking-wide transition-all shadow-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Lab
          </Link>

          {/* Globe / Plane Map toggle — top-center */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
            <button
              onClick={() => setIsPlaneMode(false)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${!isPlaneMode ? 'bg-blue-600 text-white shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              <Globe className="w-4 h-4" />Globe
            </button>
            <button
              onClick={() => setIsPlaneMode(true)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${isPlaneMode ? 'bg-blue-600 text-white shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              <Map className="w-4 h-4" />Plane Map
            </button>
          </div>

        </div>

        {/* ══ COLLAPSIBLE SIDEBAR ══ */}
        <div className={`relative flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>

          {/* Sidebar panel */}
          <div className="absolute inset-0 flex flex-col border border-sky-400/20 rounded-[2rem] ml-2 overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(160deg, #0c2d48 0%, #0e3a5c 60%, #0a2a45 100%)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-sky-300/15 shrink-0">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-sky-200/60 mb-0.5">Select a Country</p>
                <p className="text-white font-bold text-sm">{ALL_COUNTRIES.length} Nations</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-sky-300/10 hover:bg-sky-300/20 text-sky-200/60 hover:text-white transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-3 py-2.5 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 bg-sky-300/10 border border-sky-300/20 rounded-xl">
                <Search className="w-3.5 h-3.5 text-sky-200/50 shrink-0" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white text-xs placeholder-sky-200/35 outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-sky-200/40 hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Country List */}
            <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-3">
              {filteredCountries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-sky-200/30 text-xs gap-2">
                  <Globe className="w-6 h-6" />
                  <p>No countries found</p>
                </div>
              ) : (
                filteredCountries.map(c => {
                  const isSelected = selectedCountry === c.country;
                  const regionColor = REGION_COLORS[c.region] || '#4D96FF';
                  return (
                    <button
                      key={c.country}
                      data-country={c.country}
                      onClick={() => flyToCountry(c.country)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all group
                        ${isSelected
                          ? 'bg-white/15 border border-sky-300/30'
                          : 'hover:bg-sky-300/10 border border-transparent'
                        }`}
                    >
                      {/* Flag */}
                      <div className="w-8 h-5 rounded overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
                        <img
                          src={c.flag_image_url}
                          alt={c.country}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>

                      {/* Name + region */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate transition-colors ${isSelected ? 'text-white' : 'text-sky-50/80 group-hover:text-white'}`}>
                          {c.country}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: regionColor + '99' }}>
                          {c.region}
                        </p>
                      </div>

                      {/* Region dot */}
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 opacity-60" style={{ backgroundColor: regionColor }} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer legend */}
            <div className="px-4 py-3 border-t border-sky-300/15 shrink-0">
              <div className="flex flex-wrap gap-2">
                {Object.entries(REGION_COLORS).map(([region, color]) => (
                  <div key={region} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[9px] text-sky-100/40 font-medium">{region}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar toggle tab (always visible) */}
        <button
          onClick={() => setSidebarOpen(p => !p)}
          className={`absolute top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-6 h-12 rounded-l-xl border border-sky-400/20 border-r-0 text-sky-200/60 hover:text-white transition-all shadow-xl ${sidebarOpen ? 'right-[16.5rem]' : 'right-0'}`}
          style={{ background: 'linear-gradient(160deg, #0c2d48, #0e3a5c)' }}
          title={sidebarOpen ? 'Collapse' : 'Expand country list'}
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>

      </div>
    </div>
  );
}
