"use client";

import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft, Search, Pause, Play, Compass, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    const [data, setData] = useState<any>(null);
    const [selectedEntity, setSelectedEntity] = useState<Planet | null>(null);
    const [isAutoRotate, setIsAutoRotate] = useState(true);
    const [zoom, setZoom] = useState(0.4);
    const [time, setTime] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stars, setStars] = useState<{x: number, y: number, size: number, opacity: number}[]>([]);

    useEffect(() => {
        fetch('/solarsystem.json')
            .then(res => res.json())
            .then(json => {
                setData(json);
                if (json.planets && json.planets.length > 0) {
                    const mars = json.planets.find((p: any) => p.name === 'Mars') || json.planets[0];
                    setSelectedEntity(mars);
                }
            })
            .catch(err => console.error("Error loading simulation data:", err));
            
        // Generate random stars for background
        const bgStars = Array.from({length: 250}).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.7 + 0.1
        }));
        setStars(bgStars);
    }, []);

    useEffect(() => {
        let animationFrame: number;
        if (isAutoRotate) {
            const animate = () => {
                setTime(prev => prev + 0.005);
                animationFrame = requestAnimationFrame(animate);
            };
            animationFrame = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [isAutoRotate]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.4));

    if (!data) return (
        <div className="w-screen h-screen bg-[#0C0F1A] flex items-center justify-center">
            <div className="text-white animate-pulse font-mono tracking-widest text-sm">INITIALIZING SIMULATION...</div>
        </div>
    );

    const formatGravity = (name: string) => {
        // Approximate gravity for display assuming 9.8 is Earth
        const gMap: Record<string, string> = {
            Mercury: '3.7', Venus: '8.87', Earth: '9.81', Mars: '3.71',
            Jupiter: '24.79', Saturn: '10.44', Uranus: '8.69', Neptune: '11.15'
        };
        return gMap[name] || 'N/A';
    };

    const getAtmospherePrimary = (atmosphere: any) => {
        if (!atmosphere) return "None";
        const keys = Object.keys(atmosphere);
        if (keys.length === 0) return "None";
        // Grab the largest constituent
        let maxKey = keys[0];
        let maxVal = atmosphere[maxKey];
        for (const k of keys) {
            if (atmosphere[k] > maxVal) {
                maxVal = atmosphere[k];
                maxKey = k;
            }
        }
        return maxKey.replace('_percent', '').replace('_ppm', '').replace('_', ' ').toUpperCase();
    };

    return (
        <div className="flex bg-[#0A0B10] text-slate-300 font-sans overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>
            
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
                                <div className="w-6 h-6 rounded bg-violet-600/20 flex items-center justify-center">
                                    <Compass className="w-3.5 h-3.5 text-violet-400" />
                                </div>
                                <h1 className="text-xl font-bold text-white tracking-tight">Interactive Space Explorer</h1>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Real-Time Gravity Simulation V4.2</p>
                        </div>
                    </div>
                </div>

                {/* Simulation Canvas */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: '-120px' }}>
                    <div
                        className="relative transition-transform duration-300 ease-out flex items-center justify-center"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        {/* Sun */}
                        <div
                            className="absolute rounded-full shadow-[0_0_80px_#f59e0b] bg-gradient-to-tr from-orange-600 to-yellow-400 z-10 cursor-pointer hover:scale-105 transition-transform"
                            style={{ width: 80, height: 80 }}
                            onClick={() => setSelectedEntity(null)} // Select Sun
                        />

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
                                            width: orbitRadius * 2, 
                                            height: orbitRadius * 2,
                                            borderColor: isSelected ? color : `${color}80`,
                                            borderWidth: isSelected ? 2 : 1.5,
                                            boxShadow: isSelected ? `0 0 20px ${color}40, inset 0 0 20px ${color}40` : 'none'
                                        }}
                                    />

                                    {/* Planet Wrapper */}
                                    <div
                                        className="absolute z-20 transition-all duration-75 cursor-pointer group"
                                        style={{ transform: `translate(${x}px, ${y}px)` }}
                                        onClick={() => setSelectedEntity(planet)}
                                    >
                                        <div
                                            className={`relative rounded-full shadow-inner transition-transform duration-300 ${isSelected ? 'scale-150 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'group-hover:scale-125'}`}
                                            style={{
                                                width: size,
                                                height: size,
                                                backgroundColor: color,
                                                transform: 'translate(-50%, -50%)',
                                                boxShadow: `inset -${size / 4}px -${size / 4}px ${size / 2}px rgba(0,0,0,0.5), 0 0 ${isSelected ? 10 : 0}px ${color}`
                                            }}
                                        >
                                            {planet.has_rings && (
                                                <div className="absolute top-1/2 left-1/2 w-[200%] h-[40%] border-2 border-white/30 rounded-[50%] -translate-x-1/2 -translate-y-1/2 rotate-12 pointer-events-none" />
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center bg-[#181A24]/90 backdrop-blur-xl border border-white/10 rounded-xl p-1.5 shadow-2xl">
                    <button 
                        onClick={handleZoomIn}
                        className="flex items-center justify-center px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors gap-1.5"
                    >
                        <ZoomIn className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Zoom In</span>
                    </button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <button 
                        onClick={handleZoomOut}
                        className="flex items-center justify-center px-3 py-1.5 hover:bg-white/5 rounded-lg transition-colors gap-1.5"
                    >
                        <ZoomOut className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">Zoom Out</span>
                    </button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <button 
                        onClick={() => setIsAutoRotate(!isAutoRotate)}
                        className={`flex items-center justify-center px-4 py-1.5 rounded-lg transition-all shadow-lg gap-1.5 ${isAutoRotate ? 'bg-violet-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
                    >
                        {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${isAutoRotate ? 'text-white' : 'text-slate-300'}`}>Auto</span>
                    </button>
                </div>

                {/* Starry Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {stars.map((star, i) => (
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
                    ))}
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
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Mission Control</div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                    </div>

                    {selectedEntity ? (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 flex-1">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight mb-1">
                                Currently<br />Selected: {selectedEntity.name}
                            </h2>
                        </div>

                        {/* Gravity Section */}
                        <div className="space-y-2">
                            <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Gravity</h3>
                            <div className="flex items-baseline gap-2 border-b border-white/10 pb-2">
                                <span className="text-4xl font-bold text-white">{formatGravity(selectedEntity.name)}</span>
                                <span className="text-sm font-medium text-slate-500">m/s²</span>
                            </div>
                        </div>

                        {/* Atmosphere Section */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Atmosphere</h3>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                                    </div>
                                    <span className="text-lg font-bold text-white">{getAtmospherePrimary(selectedEntity.atmosphere)}</span>
                                </div>
                                <div className="text-xs text-slate-500 leading-relaxed font-medium">
                                    {Object.entries(selectedEntity.atmosphere).slice(0, 2).map(([key, val]) => `${val}% ${key.split('_')[0].charAt(0).toUpperCase() + key.split('_')[0].slice(1)}`).join(', ')}.
                                    Extreme environment parameters detected.
                                </div>
                            </div>
                        </div>

                        {/* Moons Section */}
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
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
                                    moonNames = Array(Number(selectedEntity.moons)).fill('Unknown');
                                }

                                return (
                                    <div className="grid grid-cols-2 gap-3">
                                        {moonNames.map((moonName, i) => (
                                            <div key={i} className="bg-[#1A1D27] hover:bg-[#202430] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
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

                {selectedEntity && (
                    <button className="w-full py-4 mt-8 bg-[#1A1D27] hover:bg-white border border-white/10 hover:border-transparent text-white hover:text-black rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 group">
                        <Search className="w-4 h-4 text-slate-400 group-hover:text-black" />
                        Launch Surface Probe
                    </button>
                )}
                </div>
            </div>
        </div>
    );
}
