"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Globe, Map, Info } from 'lucide-react';
import * as THREE from 'three';

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

/** Build a THREE.Points star field and inject it into the globe scene. */
function addStarField(scene: THREE.Scene) {
  const STAR_COUNT = 2500;
  const RADIUS = 900; // must be >> globe radius (100 units in react-globe.gl)

  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    // Uniform random direction on a sphere
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = Math.random() * 2 * Math.PI;
    positions[i * 3] = RADIUS * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = RADIUS * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = RADIUS * Math.cos(theta);

    // Slightly warm/cool random tint
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

export default function WorldMapPage() {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaneMode, setIsPlaneMode] = useState(false);
  const [hoverCountry, setHoverCountry] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [countries, setCountries] = useState<any>({ features: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Generate a solid ocean-blue canvas texture for the globe base sphere
  const oceanTexture = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const canvas = document.createElement('canvas');
    canvas.width = 4; canvas.height = 4;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#020d2bff'; // ocean blue
    ctx.fillRect(0, 0, 4, 4);
    return canvas.toDataURL();
  }, []);

  // Measure container for the globe
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Load GeoJSON
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(r => r.json())
      .then(data => setCountries(data))
      .catch(console.error);
  }, []);

  // Stable color map
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    (countries.features || []).forEach((f: any, i: number) => {
      map[f.properties.NAME] = VIBRANT_COLORS[i % VIBRANT_COLORS.length];
    });
    return map;
  }, [countries]);

  // Controls setup + inject Three.js star field into the scene
  useEffect(() => {
    if (!globeRef.current) return;

    // Camera / orbit controls
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
    }

    // Add star sphere to the globe's own Three.js scene
    const scene: THREE.Scene = globeRef.current.scene();
    if (scene && !scene.getObjectByName('__starField__')) {
      addStarField(scene);
    }
  }, [countries]);

  const getPolygonColor = useCallback((d: any) => {
    const name = d?.properties?.NAME;
    if (!name) return 'rgba(100,100,100,0.5)';
    if (hoverCountry && hoverCountry.properties.NAME === name) return 'rgba(255,255,255,0.95)';
    const base = colorMap[name] || '#4D96FF';
    return base + 'CC';
  }, [hoverCountry, colorMap]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div className="min-h-full flex flex-col animate-in fade-in duration-500 pb-2">



      {/* Main canvas area — full height, no top margin */}
      <div
        className="flex-1 relative rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm"
        style={{ minHeight: '520px' }}
        onMouseMove={handleMouseMove}
      >

        {/* ---- GLOBE MODE ---- */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isPlaneMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          {/* Deep-space background — stars are rendered inside the Three.js scene */}
          <div className="absolute inset-0 bg-[#020208]" />



          {/* Globe */}
          <div ref={containerRef} className="absolute inset-0">
            <GlobeComponent
              ref={globeRef}
              width={dimensions.width}
              height={dimensions.height}
              backgroundColor="rgba(0,0,0,0)"
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
                  // Set initial camera to India (lat 20°N, lng 78°E)
                  globeRef.current.pointOfView({ lat: 20, lng: 78, altitude: 2.2 }, 0);
                  const controls = globeRef.current.controls();
                  if (controls) {
                    controls.autoRotate = false;
                    controls.enableDamping = true;
                    controls.dampingFactor = 0.1;
                  }
                  // Inject star field on globe ready (scene is guaranteed to exist here)
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

          {/* Floating country label near cursor */}
          {hoverCountry && (
            <div
              className="fixed z-50 pointer-events-none"
              style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 44 }}
            >
              <div className="px-3 py-1.5 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl text-white text-xs font-bold shadow-2xl whitespace-nowrap">
                {hoverCountry.properties.NAME}
              </div>
            </div>
          )}
        </div>

        {/* ── Overlays — visible in both Globe and Plane modes ── */}

        {/* Back to Lab — top-left inside canvas */}
        <Link
          href="/app/lab"
          className="absolute top-4 left-5 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white/70 hover:text-white text-xs font-semibold tracking-wide transition-all shadow-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Lab
        </Link>

        {/* Globe / Plane Map toggle — top-center inside canvas */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
          <button
            onClick={() => setIsPlaneMode(false)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${!isPlaneMode
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-white/60 hover:text-white'
              }`}
          >
            <Globe className="w-4 h-4" />
            Globe
          </button>
          <button
            onClick={() => setIsPlaneMode(true)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${isPlaneMode
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-white/60 hover:text-white'
              }`}
          >
            <Map className="w-4 h-4" />
            Plane Map
          </button>
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
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

              {/* Info badge */}
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
      </div>


    </div>
  );
}
