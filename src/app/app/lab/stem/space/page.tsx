"use client";

import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft, Search, Pause, Play, Compass, Target, Move } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/app/context/SidebarContext';

interface Planet {
    name: string;
    type: string;
    order: number;
    diameter_km: number;
    mass_kg: string;
    moons: number | string;
    orbital_period_days: number;
    distance_from_sun_km: string;
    has_rings: boolean;
    ring_count?: number | string;
    surface_temperature: string;
    atmosphere: any;
    description: string;
    facts: string[];
    image: string;
    gravity: string;
}

const PLANET_COLORS: Record<string, string> = {
    Mercury: '#a3a3a3',
    Venus: '#eab308',
    Earth: '#3b82f6',
    Mars: '#ef4444',
    Jupiter: '#d97706',
    Saturn: '#fcd34d',
    Uranus: '#38bdf8',
    Neptune: '#1d4ed8'
};

const PLANET_SIZES: Record<string, number> = {
    Mercury: 8,
    Venus: 14,
    Earth: 15,
    Mars: 10,
    Jupiter: 32,
    Saturn: 28,
    Uranus: 20,
    Neptune: 20
};

// Simplified relative distances for visual representation
const PLANET_DISTANCES: Record<string, number> = {
    Mercury: 60,
    Venus: 100,
    Earth: 150,
    Mars: 200,
    Jupiter: 320,
    Saturn: 450,
    Uranus: 580,
    Neptune: 700
};

export default function SpaceSimulation() {
    const router = useRouter();
    const { setOpen } = useSidebar();
    const [data, setData] = useState<any>(null);
    const [selectedEntity, setSelectedEntity] = useState<Planet | null>(null);
    const [isAutoRotate, setIsAutoRotate] = useState(true);
    const [zoom, setZoom] = useState(0.25);
    const [time, setTime] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stars, setStars] = useState<{ x: number, y: number, size: number, opacity: number }[]>([]);
    const [asteroids, setAsteroids] = useState<{ angle: number, distance: number, size: number, opacity: number }[]>([]);
    const [rotation, setRotation] = useState({ x: 60, z: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const [hasInteracted, setHasInteracted] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setHasInteracted(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastPos.x;
        const deltaY = e.clientY - lastPos.y;
        setRotation(prev => ({
            x: prev.x - deltaY * 0.5,
            z: prev.z - deltaX * 0.5
        }));
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        // Auto-collapse the global sidebar to maximize the simulation space
        setOpen(false);

        fetch('/solarsystem.json')
            .then(res => res.json())
            .then(json => {
                setData(json);
                if (json.planets && json.planets.length > 0) {
                    const earth = json.planets.find((p: any) => p.name === 'Earth') || json.planets[0];
                    setSelectedEntity(earth);
                }
            })
            .catch(err => console.error("Error loading simulation data:", err));

        // Generate random stars for background
        const bgStars = Array.from({ length: 250 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.7 + 0.1
        }));
        setStars(bgStars);

        // Generate Asteroid Belt securely between Mars (200) and Jupiter (320) 
        // with guaranteed visual padding
        const beltAsteroids = Array.from({ length: 1600 }).map(() => {
            // Box-Muller transform for normal distribution for realistic clustering
            const u = 1 - Math.random();
            const v = Math.random();
            const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

            // Constrain spread entirely between 215 and 305 to carve out a clean gap from Mars and Jupiter
            const distance = 260 + (Math.random() - 0.5) * 50 + (z * 6);

            return {
                angle: Math.random() * Math.PI * 2,
                distance: distance,
                size: Math.random() * 2 + 0.8, // Larger and more visible
                opacity: Math.random() * 0.6 + 0.3
            };
        });
        setAsteroids(beltAsteroids);
    }, []);

    useEffect(() => {
        let animationFrame: number;
        if (isAutoRotate) {
            const animate = () => {
                setTime(prev => prev + 0.01);
                animationFrame = requestAnimationFrame(animate);
            };
            animationFrame = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [isAutoRotate]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.1));

    const memoizedStars = React.useMemo(() => (
        stars.map((star, i) => (
            <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: star.size,
                    height: star.size,
                    opacity: star.opacity
                }}
            />
        ))
    ), [stars]);

    const memoizedAsteroids = React.useMemo(() => (
        asteroids.map((ast, i) => (
            <div
                key={i}
                className="absolute rounded-full bg-stone-400"
                style={{
                    width: ast.size,
                    height: ast.size,
                    opacity: ast.opacity,
                    boxShadow: `0 0 ${ast.size}px rgba(168,162,158,0.5)`,
                    transform: `translate3d(${Math.cos(ast.angle) * ast.distance}px, ${Math.sin(ast.angle) * ast.distance}px, 0)`
                }}
            />
        ))
    ), [asteroids]);

    if (!data) return (
        <div className="w-screen h-screen bg-[#0C0F1A] flex items-center justify-center">
            <div className="text-white animate-pulse font-mono tracking-widest text-sm">INITIALIZING SIMULATION...</div>
        </div>
    );

    return (
        <div className="flex bg-gradient-to-b from-[#0B0D17] to-[#05050A] text-slate-300 font-sans overflow-hidden rounded-2xl shadow-2xl border border-white/5 h-[calc(100vh-5rem)] md:h-[calc(100vh-7rem)] relative">

            {/* Main Simulation Viewport */}
            <div className="flex-1 relative overflow-hidden flex flex-col">

                {/* Top Nav */}
                <div className="absolute top-0 left-0 right-0 p-6 z-20 flex items-start justify-between pointer-events-none">
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-violet-600/20 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                                    <Compass className="w-3.5 h-3.5 text-violet-400" />
                                </div>
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">Interactive Space Explorer</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulation Canvas */}
                <div
                    className="absolute inset-0 flex items-center justify-center cursor-move select-none"
                    style={{ marginTop: '-120px', perspective: '1000px' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onDragStart={(e) => e.preventDefault()}
                >
                    {!hasInteracted && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center gap-3 opacity-80 mt-32 animate-pulse">
                            <div className="w-14 h-14 bg-black/50 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                <Move className="w-6 h-6 text-white" />
                            </div>
                            <div className="bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                                <span className="text-[10px] font-black tracking-widest text-white uppercase">Click & Drag to Rotate</span>
                            </div>
                        </div>
                    )}

                    <div
                        className="relative flex items-center justify-center"
                        style={{
                            transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
                            transformStyle: 'preserve-3d',
                            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                        }}
                    >
                        {/* Sun */}
                        <div
                            style={{ top: '50%', left: '50%', transformStyle: 'preserve-3d' }}
                            className="absolute z-10 hover:scale-105 transition-transform"
                        >
                            <div
                                className="absolute rounded-full shadow-[0_0_80px_#f59e0b] bg-gradient-to-tr from-orange-600 to-yellow-400 cursor-pointer"
                                style={{ width: 80, height: 80, transform: `translate(-50%, -50%) rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)` }}
                                onClick={() => setSelectedEntity(data?.stars || null)}
                            />
                        </div>

                        {/* Asteroid Belt */}
                        <div
                            className="absolute z-0 pointer-events-none"
                            style={{
                                top: '50%', left: '50%',
                                transform: `translate(-50%, -50%) rotateZ(${time * 12}deg)`,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            {memoizedAsteroids}
                        </div>

                        {/* Asteroid Belt Label */}
                        <div
                            className="absolute z-10 transition-all duration-75 pointer-events-none"
                            style={{
                                top: '50%', left: '50%',
                                transform: `translate3d(calc(${Math.cos(time * (12 * Math.PI / 180)) * 260}px - 50%), calc(${Math.sin(time * (12 * Math.PI / 180)) * 260}px - 50%), 0)`,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <div
                                className="relative flex items-center justify-center opacity-60"
                                style={{
                                    transform: `translate(-50%, -50%) rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)`,
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <span className="text-white font-bold tracking-[0.4em] uppercase text-[10px] whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                                    Asteroid Belt
                                </span>
                            </div>
                        </div>

                        {/* Planets & Orbits */}
                        {data.planets.map((planet: Planet) => {
                            const orbitRadius = PLANET_DISTANCES[planet.name] || 100;
                            const size = PLANET_SIZES[planet.name] || 10;
                            const color = PLANET_COLORS[planet.name] || '#ffffff';

                            // Speed based on Kepler's third law approximation
                            const speedMultiplier = 365 / planet.orbital_period_days;
                            const angle = time * speedMultiplier + (planet.order * 45); // offset initial angle

                            const x = Math.cos(angle) * orbitRadius;
                            const y = Math.sin(angle) * orbitRadius;

                            const isSelected = selectedEntity?.name === planet.name;

                            return (
                                <React.Fragment key={planet.name}>
                                    {/* Orbit Path */}
                                    <div
                                        className="absolute rounded-full border pointer-events-none transition-all duration-500"
                                        style={{
                                            top: '50%', left: '50%',
                                            width: orbitRadius * 2,
                                            height: orbitRadius * 2,
                                            transform: `translate(-50%, -50%)`,
                                            borderColor: isSelected ? color : `${color}80`,
                                            borderWidth: isSelected ? 2 : 1.5,
                                            boxShadow: isSelected ? `0 0 20px ${color}40, inset 0 0 20px ${color}40` : 'none'
                                        }}
                                    />

                                    {/* Planet Wrapper */}
                                    <div
                                        className="absolute z-20 transition-all duration-75 cursor-pointer group"
                                        style={{
                                            top: '50%', left: '50%',
                                            transform: `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`,
                                            transformStyle: 'preserve-3d'
                                        }}
                                        onClick={() => setSelectedEntity(planet)}
                                    >
                                        <div
                                            className="relative flex items-center justify-center"
                                            style={{
                                                width: size,
                                                height: size,
                                                transform: `translate(-50%, -50%) rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)`,
                                                transformStyle: 'preserve-3d'
                                            }}
                                        >
                                            <div
                                                className={`relative rounded-full shadow-inner transition-transform duration-300 shrink-0 ${isSelected ? 'scale-150 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'group-hover:scale-125'}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: color,
                                                    boxShadow: `inset -${size / 4}px -${size / 4}px ${size / 2}px rgba(0,0,0,0.5), 0 0 ${isSelected ? 10 : 0}px ${color}`
                                                }}
                                            >
                                                {planet.has_rings && (
                                                    <div className="absolute top-1/2 left-1/2 w-[200%] h-[40%] border-2 border-white/30 rounded-[50%] -translate-x-1/2 -translate-y-1/2 rotate-12 pointer-events-none" />
                                                )}
                                            </div>

                                            {/* Planet Name Label */}
                                            <div
                                                className={`absolute left-[calc(100%+12px)] pointer-events-none text-white font-bold tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-300 ${isSelected ? 'opacity-100 text-[10px]' : 'opacity-60 text-[8px] group-hover:opacity-100 group-hover:scale-110 group-hover:left-[calc(100%+16px)]'}`}
                                                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                                            >
                                                {planet.name}
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-12 right-6 z-20 flex flex-col gap-2">
                    <div className="flex flex-col items-center bg-[#181A24]/90 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-2xl">
                        <button
                            onClick={handleZoomIn}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-4 h-4 text-slate-300" />
                        </button>
                        <div className="w-4 h-[1px] bg-white/10 my-1" />
                        <button
                            onClick={handleZoomOut}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-4 h-4 text-slate-300" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center bg-[#181A24]/90 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-2xl">
                        <button
                            onClick={() => setIsAutoRotate(!isAutoRotate)}
                            className={`p-2 rounded-lg transition-all shadow-lg ${isAutoRotate ? 'bg-violet-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
                            title={isAutoRotate ? "Pause Rotation" : "Auto Rotate"}
                        >
                            {isAutoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Starry Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {memoizedStars}
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/40 border-t border-white/5 px-6 flex items-center gap-6 text-[10px] font-mono tracking-widest text-slate-500 z-10">
                    <span>COORD: {Math.floor(time * 100)}.{zoom.toFixed(2)}.44</span>
                    <span>SYSTEM: SOL</span>
                    <span className="text-emerald-500">STATUS: NOMINAL</span>
                </div>
            </div>

            {/* Right Panel - Mission Control */}
            <div className={`relative bg-[#12141D] border-l border-white/10 z-30 shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'w-[380px]' : 'w-0'}`}>

                {/* Collapse Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute top-6 -left-8 w-8 h-8 bg-[#12141D] border-y border-l border-white/10 rounded-l-md flex items-center justify-center z-40 text-slate-400 hover:text-white transition-colors hover:bg-white/5"
                >
                    <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute inset-y-0 right-0 w-[380px] h-full flex flex-col p-6 overflow-y-auto hide-scrollbar transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {selectedEntity ? (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 flex-1">
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tight mb-1">
                                    {selectedEntity.name}
                                </h2>
                                <div className="flex gap-2 mt-2">
                                    {selectedEntity.type && (
                                        <span className="inline-block px-2 py-1 rounded bg-red-500/15 border border-red-500/20 text-[10px] font-bold text-red-100 uppercase tracking-widest">
                                            {selectedEntity.type}
                                        </span>
                                    )}
                                    {selectedEntity.has_rings !== undefined && (
                                        <span className="inline-block px-2 py-1 rounded bg-[#1A1D27] border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Rings: {selectedEntity.has_rings ? 'YES' : 'NO'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {selectedEntity.image && (
                                <img
                                    src={selectedEntity.image}
                                    alt={selectedEntity.name}
                                    className="w-full h-44 object-contain bg-black/40 rounded-2xl border border-white/10 shadow-lg object-center"
                                />
                            )}

                            {selectedEntity.description && (
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-black tracking-widest text-violet-400 uppercase drop-shadow-md">Overview</h3>
                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{selectedEntity.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                {/* Gravity Section */}
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-black tracking-widest text-violet-400 uppercase drop-shadow-md">Gravity</h3>
                                    <div className="flex items-baseline gap-1 border-b border-white/10 pb-2">
                                        <span className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{selectedEntity.gravity}</span>
                                        <span className="text-xs font-medium text-slate-400">m/s²</span>
                                    </div>
                                </div>

                                {/* Temperature */}
                                {selectedEntity.surface_temperature && (
                                    <div className="space-y-2">
                                        <h3 className="text-[10px] font-black tracking-widest text-violet-400 uppercase drop-shadow-md">Avg Temp</h3>
                                        <div className="flex items-baseline gap-1 border-b border-white/10 pb-2">
                                            <span className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{selectedEntity.surface_temperature}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Telemetry Stats */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black tracking-widest text-violet-400 uppercase drop-shadow-md">Orbital Telemetry</h3>
                                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-wider">
                                    {selectedEntity.diameter_km && (
                                        <div className="bg-[#1A1D27] p-3 rounded-xl border border-white/5">
                                            <div className="text-slate-500 mb-1 text-[8px]">Diameter</div>
                                            <div className="text-white">{selectedEntity.diameter_km.toLocaleString()} km</div>
                                        </div>
                                    )}
                                    {selectedEntity.mass_kg && (
                                        <div className="bg-[#1A1D27] p-3 rounded-xl border border-white/5">
                                            <div className="text-slate-500 mb-1 text-[8px]">Mass</div>
                                            <div className="text-white">
                                                {(() => {
                                                    const cleanStr = selectedEntity.mass_kg.replace(/ kg/g, '');
                                                    const parts = cleanStr.split('(');
                                                    const val = parts[0].trim();
                                                    const brackets = parts[1] ? `(${parts[1]}` : '';

                                                    let base = val;
                                                    let exp = '';

                                                    if (val.toLowerCase().includes('e')) {
                                                        const s = val.toLowerCase().split('e');
                                                        base = val.substring(0, s[0].length);
                                                        exp = s[1].replace('+', '');
                                                    }

                                                    return (
                                                        <div className="flex flex-col leading-tight">
                                                            <span>
                                                                {base}{exp ? <span>*10<sup className="text-[9px]">{exp}</sup></span> : ''} kg
                                                            </span>
                                                            {brackets && <span className="text-[9px] text-slate-400 normal-case font-medium tracking-normal mt-0.5">{brackets}</span>}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                    {selectedEntity.orbital_period_days && (
                                        <div className="bg-[#1A1D27] p-3 rounded-xl border border-white/5">
                                            <div className="text-slate-500 mb-1 text-[8px]">Orbit Period</div>
                                            <div className="text-white">{selectedEntity.orbital_period_days} Days</div>
                                        </div>
                                    )}
                                    {selectedEntity.distance_from_sun_km && (
                                        <div className="bg-[#1A1D27] p-3 rounded-xl border border-white/5">
                                            <div className="text-slate-500 mb-1 text-[8px]">Distance From Sun</div>
                                            <div className="text-emerald-400">
                                                {(() => {
                                                    const raw = selectedEntity.distance_from_sun_km;
                                                    const parts = raw.split('(');
                                                    if (parts.length > 1) {
                                                        const val = parts[0].trim();
                                                        const brackets = `(${parts[1]}`;
                                                        return (
                                                            <div className="flex flex-col leading-tight mt-0.5">
                                                                <span>{val.includes('km') ? val : `${Number(val.replace(/,/g, '')).toLocaleString()} km`}</span>
                                                                <span className="text-[9px] text-emerald-500/70 normal-case font-medium tracking-normal mt-0.5">{brackets}</span>
                                                            </div>
                                                        );
                                                    }
                                                    return raw;
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Atmosphere Section */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black tracking-widest text-violet-400 uppercase drop-shadow-md">Atmosphere Composition</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedEntity.atmosphere && Object.keys(selectedEntity.atmosphere).length > 0 ? (
                                        Object.entries(selectedEntity.atmosphere).map(([key, val]) => (
                                            <div key={key} className="bg-[#1A1D27] p-2.5 rounded-lg border border-white/5 flex flex-col gap-0.5">
                                                <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">
                                                    {key.replace('_percent', '').replace('_ppm', '').replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-xs text-white font-medium">{val as string}{key.includes('ppm') ? ' ppm' : '%'}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-xs text-slate-500 font-medium">No significant atmosphere parameters detected.</div>
                                    )}
                                </div>
                            </div>

                            {selectedEntity.facts && selectedEntity.facts.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black tracking-widest text-violet-400 uppercase drop-shadow-md">Fast Facts</h3>
                                    <ul className="space-y-3">
                                        {selectedEntity.facts.map((fact: string, idx: number) => (
                                            <li key={idx} className="flex gap-4 text-xs text-slate-300 leading-relaxed font-medium bg-[#1A1D27]/50 p-3 rounded-xl border border-white/5 shadow-sm">
                                                <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-violet-400 shrink-0 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                                                <span>{fact}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Moons Section */}
                            {selectedEntity.moons !== undefined && selectedEntity.moons !== null && (
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black tracking-widest text-violet-400 uppercase drop-shadow-md">
                                        Moons ({typeof selectedEntity.moons === 'string' ? selectedEntity.moons.split(' ')[0] : selectedEntity.moons})
                                    </h3>
                                    {(() => {
                                        if (selectedEntity.moons === 0 || selectedEntity.moons === "0") {
                                            return <div className="text-xs text-slate-500 font-medium">No natural satellites detected.</div>;
                                        }

                                        let moonNames: string[] = [];
                                        if (typeof selectedEntity.moons === 'string') {
                                            const match = selectedEntity.moons.match(/\((.*?)\)/);
                                            if (match && match[1]) {
                                                moonNames = match[1].split(/[\&\,]+/).map((s: string) => s.trim());
                                            } else {
                                                moonNames = ['Unknown'];
                                            }
                                        } else {
                                            moonNames = Array(Number(selectedEntity.moons) || 0).fill('Unknown');
                                        }

                                        return (
                                            <div className="grid grid-cols-2 gap-3">
                                                {moonNames.map((moonName, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => {
                                                            if (moonName === 'The Moon' || moonName === 'Moon') {
                                                                setSelectedEntity(data?.moons);
                                                            }
                                                        }}
                                                        className="bg-[#1A1D27] hover:bg-[#202430] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                                                    >
                                                        <div className="w-5 h-5 rounded-full bg-slate-700 shadow-inner group-hover:scale-110 transition-transform flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-300 text-center">{moonName}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-500">
                            <Target className="w-12 h-12 text-slate-700" strokeWidth={1} />
                            <div>
                                <p className="font-bold text-white mb-1">Select a Target</p>
                                <p className="text-sm">Click on any planetary body in the scanner to retrieve atmospheric and gravitational data.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
