"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, RotateCcw, Zap, Search, Sparkles } from "lucide-react";
import Link from "next/link";

const MEDIA = [
    { name: 'Vacuum', n: 1.00 },
    { name: 'Air', n: 1.0003 },
    { name: 'Water', n: 1.33 },
    { name: 'Glass', n: 1.52 },
    { name: 'Diamond', n: 2.42 }
];

export default function ReflectionRefractionLab() {
    const [n1, setN1] = useState(1.00);
    const [n2, setN2] = useState(1.33);
    const [incidentAngle, setIncidentAngle] = useState(45);
    const [showProtractor, setShowProtractor] = useState(false);
    const [showDefs, setShowDefs] = useState(false);

    // Snell's Law Calculations
    const incidentRad = (incidentAngle * Math.PI) / 180;
    const sinRefracted = (n1 * Math.sin(incidentRad)) / n2;
    
    const isTIR = sinRefracted > 1 || sinRefracted < -1;
    const refractedRad = isTIR ? 0 : Math.asin(sinRefracted);
    const refractedAngle = isTIR ? 0 : (refractedRad * 180) / Math.PI;
    
    // Critical angle
    const criticalAngle = n1 > n2 ? (Math.asin(n2 / n1) * 180 / Math.PI).toFixed(1) : 'None';

    const v1 = (3.00 / n1).toFixed(2);
    const v2 = (3.00 / n2).toFixed(2);

    const handleMedia1Change = (val: number) => {
        setN1(val);
    };

    const handleMedia2Change = (val: number) => {
        setN2(val);
    };

    const handleReset = () => {
        setN1(1.00);
        setN2(1.33);
        setIncidentAngle(45);
        setShowProtractor(false);
    };

    const getMediumType = (n: number) => {
        if (Math.abs(n - 1.00) < 0.05) return 'air';
        if (Math.abs(n - 1.33) < 0.05) return 'water';
        if (Math.abs(n - 1.52) < 0.05) return 'glass';
        if (Math.abs(n - 2.42) < 0.05) return 'diamond';
        return 'custom';
    };

    const renderMedium = (n: number, yOffset: number) => {
        const type = getMediumType(n);
        if (type === 'air') return <rect x="0" y={yOffset} width="1000" height="300" fill="url(#air-grad)" />;
        if (type === 'water') return (
            <g>
                <rect x="0" y={yOffset} width="1000" height="300" fill="url(#water-grad)" />
                <rect x="0" y={yOffset} width="1000" height="300" fill="url(#water-pattern)" />
            </g>
        );
        if (type === 'glass') return (
            <g>
                <rect x="0" y={yOffset} width="1000" height="300" fill="url(#glass-grad)" />
                <rect x="0" y={yOffset} width="1000" height="300" fill="url(#glass-pattern)" />
            </g>
        );
        if (type === 'diamond') return (
            <g>
                <rect x="0" y={yOffset} width="1000" height="300" fill="url(#diamond-grad)" />
                <rect x="0" y={yOffset} width="1000" height="300" fill="url(#diamond-pattern)" />
            </g>
        );
        // Custom medium fallback
        return <rect x="0" y={yOffset} width="1000" height="300" fill="#3b82f6" fillOpacity={Math.min(1, 0.1 + (n - 1) * 0.1)} />;
    };

    return (
        <div className="min-h-[calc(100vh-64px)] text-slate-900 dark:text-slate-100 font-sans flex flex-col rr-bg">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Mono:wght@400;500;700&display=swap');
                .rr-bg {
                    background-image: radial-gradient(circle at 1.5px 1.5px, rgba(236, 72, 153, 0.15) 1.5px, transparent 0);
                    background-size: 24px 24px;
                }
                .dark .rr-bg {
                    background-image: radial-gradient(circle at 1.5px 1.5px, rgba(244, 114, 182, 0.08) 1.5px, transparent 0);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            
            {/* Header */}
            <div className="w-full max-w-[1600px] mx-auto px-4 pt-4 pb-2 relative flex items-center justify-center shrink-0 z-50">
                <div className="absolute left-4 top-0 bottom-0 flex items-center mt-2">
                    <Link
                        href="/app/lab/stem"
                        className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                        style={{ textDecoration: 'none' }}
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 shadow-sm">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        <span style={{ fontFamily: "'DM Mono', monospace" }}>Back</span>
                    </Link>
                </div>
                
                <h1 className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 m-0 mt-2" style={{ textShadow: "0 2px 8px rgba(236,72,153,.12)" }}>
                    <span style={{ fontFamily: "'Caveat',cursive", fontSize: 36, fontWeight: 700 }} className="text-pink-600 dark:text-pink-400">
                        Reflection & Refraction
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[15px] mx-1 mt-2 tracking-wide font-sans lowercase">
                        lab
                    </span>
                </h1>

                <div className="absolute right-4 top-0 bottom-0 flex items-center gap-3 mt-2">
                    <button 
                        onClick={() => setShowProtractor(!showProtractor)}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border shadow-sm ${showProtractor ? 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/50' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200 dark:bg-[#121826] dark:text-slate-300 dark:border-slate-800 dark:hover:bg-[#1e293b]'}`}
                    >
                        <Search className="w-4 h-4" /> <span className="hidden sm:inline">Protractor</span>
                    </button>
                    <button onClick={handleReset} className="p-1.5 md:p-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-[#121826] dark:hover:bg-[#1e293b] text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-800 shadow-sm">
                        <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
            {/* Main Workspace */}
            <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 flex flex-col lg:flex-row gap-4 pb-8">
                
                {/* Controls Panel */}
                <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-2 overflow-visible pb-2">
                    {/* Media 1 Control */}
                    <div className="bg-white dark:bg-[#121826] px-3 py-2.5 rounded-2xl border border-amber-400 dark:border-amber-500 shadow-sm shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium 1
                            </h2>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                n₁ = {n1.toFixed(2)}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {MEDIA.map(m => (
                                <button
                                    key={`m1-${m.name}`}
                                    onClick={() => handleMedia1Change(m.n)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                        Math.abs(n1 - m.n) < 0.01 
                                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <input
                                type="range" min="1.0" max="3.0" step="0.01" value={n1}
                                onChange={(e) => setN1(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>
                    </div>

                    {/* Media 2 Control */}
                    <div className="bg-white dark:bg-[#121826] px-3 py-2.5 rounded-2xl border border-blue-400 dark:border-blue-500 shadow-sm shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Medium 2
                            </h2>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                n₂ = {n2.toFixed(2)}
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {MEDIA.map(m => (
                                <button
                                    key={`m2-${m.name}`}
                                    onClick={() => handleMedia2Change(m.n)}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                        Math.abs(n2 - m.n) < 0.01 
                                        ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/20' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {m.name}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <input
                                type="range" min="1.0" max="3.0" step="0.01" value={n2}
                                onChange={(e) => setN2(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>

                    {/* Angle Control */}
                    <div className="bg-white dark:bg-[#121826] px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-pink-500" /> Angle (i)
                            </h2>
                            <span className="text-[10px] font-bold text-pink-600 bg-pink-50 dark:bg-pink-500/10 dark:text-pink-400 px-1.5 py-0.5 rounded-md">
                                {incidentAngle}°
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                            <input
                                type="range" min="0" max="89" step="1" value={incidentAngle}
                                onChange={(e) => setIncidentAngle(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                    </div>



                    {/* Definitions & Formulas */}
                    <div className="bg-white dark:bg-[#121826] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0 overflow-hidden flex flex-col">
                        <button 
                            onClick={() => setShowDefs(!showDefs)} 
                            className="w-full px-3 py-2 flex items-center justify-between text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <span className="font-bold text-sm" style={{ fontFamily: "'Caveat', cursive", fontSize: '18px', color: '#db2777' }}>
                                📌 Definitions & Formulas
                            </span>
                            <span className="text-[10px] text-slate-400">{showDefs ? "▲" : "▼"}</span>
                        </button>
                        
                        <AnimatePresence>
                            {showDefs && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 space-y-3">
                                        <div><strong className="text-pink-600 dark:text-pink-400">Reflection:</strong> The bouncing back of light when it hits a surface.</div>
                                        <div><strong className="text-blue-500 dark:text-blue-400">Refraction:</strong> The bending of light as it passes from one medium to another.</div>
                                        <div><strong className="text-slate-800 dark:text-slate-200">Angle of Incidence (i):</strong> Angle between incident ray and normal.</div>
                                        <div><strong className="text-slate-800 dark:text-slate-200">Angle of Refraction (r):</strong> Angle between refracted ray and normal.</div>
                                        <div>
                                            <strong className="text-slate-800 dark:text-slate-200">Refractive Index (n):</strong> Measure of how much light bends. 
                                            <div className="mt-1 font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 p-1.5 rounded">n = c / v</div>
                                        </div>
                                        <div>
                                            <strong className="text-slate-800 dark:text-slate-200">Laws of Reflection:</strong>
                                            <ul className="list-disc pl-3 mt-0.5 space-y-0.5">
                                                <li>Incident ray, reflected ray, and normal lie in the same plane.</li>
                                                <li>Angle of Incidence = Angle of Reflection.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <strong className="text-slate-800 dark:text-slate-200">Laws of Refraction (Snell's Law):</strong>
                                            <ul className="list-disc pl-3 mt-0.5 space-y-0.5">
                                                <li>Incident ray, refracted ray, and normal lie in the same plane.</li>
                                                <li>Ratio of sine of angle of incidence to sine of angle of refraction is constant for two given media.</li>
                                            </ul>
                                            <div className="mt-1 font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 p-1.5 rounded">n₁·sin(i) = n₂·sin(r)</div>
                                        </div>
                                        <div><strong className="text-amber-500">Critical Angle:</strong> The angle of incidence that provides an angle of refraction of 90-degrees.</div>
                                        <div><strong className="text-rose-500">Total Internal Reflection:</strong> When light travels from a denser to a rarer medium at an angle greater than the critical angle, it is entirely reflected.</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Side Column */}
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                    {/* Simulation Canvas */}
                    <div className="flex-1 bg-[#050B14] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden flex flex-col min-h-[350px] lg:min-h-[420px]">
                        <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-3 pointer-events-none">
                            <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white border border-white/10 shadow-lg flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-400" /> n₁ = {n1.toFixed(2)}
                            </div>
                            <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-white border border-white/10 shadow-lg flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400" /> n₂ = {n2.toFixed(2)}
                            </div>
                            {isTIR && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-rose-500/20 text-rose-500 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse"
                                >
                                    Total Internal Reflection
                                </motion.div>
                            )}
                        </div>

                        <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full absolute inset-0">
                            <defs>
                                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                                </radialGradient>

                                {/* Realistic Medium Patterns */}
                                <linearGradient id="air-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.02" />
                                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                </linearGradient>

                                <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
                                </linearGradient>
                                <pattern id="water-pattern" width="80" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 0 10 Q 20 0 40 10 T 80 10" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" />
                                    <path d="M 0 20 Q 20 10 40 20 T 80 20" fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.1" />
                                </pattern>

                                <linearGradient id="glass-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                                    <stop offset="2%" stopColor="#bae6fd" stopOpacity="0.1" />
                                    <stop offset="98%" stopColor="#7dd3fc" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
                                </linearGradient>
                                <pattern id="glass-pattern" width="250" height="300" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
                                    <line x1="50" y1="-100" x2="50" y2="400" stroke="#ffffff" strokeWidth="30" strokeOpacity="0.03" />
                                    <line x1="75" y1="-100" x2="75" y2="400" stroke="#ffffff" strokeWidth="8" strokeOpacity="0.06" />
                                    <line x1="200" y1="-100" x2="200" y2="400" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.04" />
                                </pattern>

                                <linearGradient id="diamond-grad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.3" />
                                    <stop offset="20%" stopColor="#bae6fd" stopOpacity="0.1" />
                                    <stop offset="30%" stopColor="#fbcfe8" stopOpacity="0.15" />
                                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
                                    <stop offset="70%" stopColor="#a7f3d0" stopOpacity="0.15" />
                                    <stop offset="80%" stopColor="#bae6fd" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.3" />
                                </linearGradient>
                                <pattern id="diamond-pattern" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                    <path d="M 0 0 L 25 50 L 50 0 Z" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />
                                    <path d="M 0 50 L 25 0 L 50 50 Z" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.1" />
                                </pattern>
                            </defs>

                            {/* Render Dynamic Backgrounds */}
                            {renderMedium(n1, 0)}
                            {renderMedium(n2, 300)}

                            {/* Interface line */}
                            <line x1="0" y1="300" x2="1000" y2="300" stroke="#475569" strokeWidth="3" />

                            {/* Normal line */}
                            <line x1="500" y1="50" x2="500" y2="550" stroke="#94a3b8" strokeWidth="2" strokeDasharray="10 10" className="opacity-50" />

                            {/* Protractor Overlay */}
                            <AnimatePresence>
                                {showProtractor && (
                                    <motion.g
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <circle cx="500" cy="300" r="200" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
                                        <circle cx="500" cy="300" r="250" fill="none" stroke="#64748b" strokeWidth="1" className="opacity-30" />
                                        <path d="M 250 300 L 750 300" fill="none" stroke="#e2e8f0" strokeWidth="2" className="opacity-50" />
                                        {/* Ticks every 10 degrees */}
                                        {Array.from({ length: 36 }).map((_, i) => {
                                            const angleRad = (i * 10 * Math.PI) / 180;
                                            const isMajor = i % 9 === 0; // 0, 90, 180, 270 degrees
                                            return (
                                                <g key={`tick-${i}`}>
                                                    <line
                                                        x1={500 + 190 * Math.sin(angleRad)} y1={300 - 190 * Math.cos(angleRad)}
                                                        x2={500 + 200 * Math.sin(angleRad)} y2={300 - 200 * Math.cos(angleRad)}
                                                        stroke="#cbd5e1" strokeWidth={isMajor ? 2 : 1} className="opacity-60"
                                                    />
                                                    {i !== 0 && i !== 18 && (
                                                        <text 
                                                            x={500 + 220 * Math.sin(angleRad)} y={300 - 220 * Math.cos(angleRad)} 
                                                            fill="#cbd5e1" fontSize="12" textAnchor="middle" alignmentBaseline="middle" className="opacity-70 font-bold"
                                                        >
                                                            {i <= 18 ? i * 10 : (36 - i) * 10}°
                                                        </text>
                                                    )}
                                                </g>
                                            );
                                        })}
                                    </motion.g>
                                )}
                            </AnimatePresence>

                            {/* Incident Ray */}
                            <g className="drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]">
                                <line 
                                    x1={500 - 500 * Math.sin(incidentRad)} 
                                    y1={300 - 500 * Math.cos(incidentRad)} 
                                    x2="500" y2="300" 
                                    stroke="#ec4899" strokeWidth="5" strokeLinecap="round" 
                                />
                                {/* Incident Arrow */}
                                <polygon 
                                    points="-10,-10 0,10 10,-10" 
                                    fill="#ec4899"
                                    transform={`translate(${500 - 250 * Math.sin(incidentRad)}, ${300 - 250 * Math.cos(incidentRad)}) rotate(${-incidentAngle})`}
                                />
                            </g>

                            {/* Reflected Ray */}
                            <g className="drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]">
                                <line 
                                    x1="500" y1="300" 
                                    x2={500 + 500 * Math.sin(incidentRad)} 
                                    y2={300 - 500 * Math.cos(incidentRad)} 
                                    stroke="#ec4899" strokeWidth={isTIR ? "5" : "2"} 
                                    strokeOpacity={isTIR ? "1" : "0.4"}
                                    strokeLinecap="round" 
                                />
                                <polygon 
                                    points="-10,10 0,-10 10,10" 
                                    fill="#ec4899" fillOpacity={isTIR ? "1" : "0.4"}
                                    transform={`translate(${500 + 250 * Math.sin(incidentRad)}, ${300 - 250 * Math.cos(incidentRad)}) rotate(${180 + incidentAngle})`}
                                />
                            </g>

                            {/* Refracted Ray */}
                            {!isTIR && (
                                <g className="drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]">
                                    <line 
                                        x1="500" y1="300" 
                                        x2={500 + 500 * Math.sin(refractedRad)} 
                                        y2={300 + 500 * Math.cos(refractedRad)} 
                                        stroke="#ec4899" strokeWidth="4" strokeLinecap="round" 
                                    />
                                    <polygon 
                                        points="-10,-10 0,10 10,-10" 
                                        fill="#ec4899"
                                        transform={`translate(${500 + 250 * Math.sin(refractedRad)}, ${300 + 250 * Math.cos(refractedRad)}) rotate(${-refractedAngle})`}
                                    />
                                </g>
                            )}

                            {/* TIR Glow */}
                            {isTIR && (
                                <circle cx="500" cy="300" r="40" fill="url(#glow)" />
                            )}
                            
                            {/* Origin point */}
                            <circle cx="500" cy="300" r="5" fill="#f8fafc" className="drop-shadow-md" />
                            
                            {/* Angle Arcs */}
                            {incidentRad > 0.1 && (
                                <>
                                    <path 
                                        d={`M 500 200 A 100 100 0 0 0 ${500 - 100 * Math.sin(incidentRad)} ${300 - 100 * Math.cos(incidentRad)}`} 
                                        fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" 
                                    />
                                    <text x={500 - 60 * Math.sin(incidentRad / 2)} y={300 - 60 * Math.cos(incidentRad / 2)} fill="#cbd5e1" fontSize="14" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                                        i = {incidentAngle}°
                                    </text>
                                </>
                            )}

                            {!isTIR && refractedRad > 0.1 && (
                                <>
                                    <path 
                                        d={`M 500 400 A 100 100 0 0 0 ${500 + 100 * Math.sin(refractedRad)} ${300 + 100 * Math.cos(refractedRad)}`} 
                                        fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" 
                                    />
                                    <text x={500 + 60 * Math.sin(refractedRad / 2)} y={300 + 60 * Math.cos(refractedRad / 2)} fill="#cbd5e1" fontSize="14" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                                        r = {refractedAngle.toFixed(1)}°
                                    </text>
                                </>
                            )}

                            {isTIR && incidentRad > 0.1 && (
                                <>
                                    <path 
                                        d={`M 500 200 A 100 100 0 0 1 ${500 + 100 * Math.sin(incidentRad)} ${300 - 100 * Math.cos(incidentRad)}`} 
                                        fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" 
                                    />
                                    <text x={500 + 60 * Math.sin(incidentRad / 2)} y={300 - 60 * Math.cos(incidentRad / 2)} fill="#cbd5e1" fontSize="14" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                                        TIR ({incidentAngle}°)
                                    </text>
                                </>
                            )}
                        </svg>
                    </div>

                <div className="flex flex-col md:flex-row gap-3 shrink-0">
                    {/* Data Readout */}
                    <div className="w-full md:w-[280px] bg-slate-900 rounded-2xl p-3 border border-slate-800 text-slate-300 space-y-2 shrink-0 shadow-sm flex flex-col justify-center">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Live Data</h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="text-[9px] text-slate-400 mb-0.5">Angle of Refraction (r)</div>
                                <div className={`text-base font-bold ${isTIR ? 'text-rose-400' : 'text-blue-400'}`}>
                                    {isTIR ? 'TIR' : `${refractedAngle.toFixed(1)}°`}
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] text-slate-400 mb-0.5">Critical Angle</div>
                                <div className="text-base font-bold text-amber-400">
                                    {criticalAngle !== 'None' ? `${criticalAngle}°` : 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 space-y-1 mt-1">
                            <div className="flex justify-between text-[10px] font-medium">
                                <span className="text-slate-500">Speed in Medium 1</span>
                                <span>{v1} × 10⁸ m/s</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-medium">
                                <span className="text-slate-500">Speed in Medium 2</span>
                                <span>{v2} × 10⁸ m/s</span>
                            </div>
                        </div>
                    </div>

                    {/* Narrative Box */}
                    <div className="flex-1 bg-white dark:bg-[#121826] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shrink-0 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-violet-500" /> Observation
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {isTIR 
                                ? `Total Internal Reflection (TIR) is occurring. Since the laser is moving from a denser medium (${getMediumType(n1)}, n₁=${n1.toFixed(2)}) to a less dense medium (${getMediumType(n2)}, n₂=${n2.toFixed(2)}), and the incident angle (${incidentAngle}°) exceeds the critical angle (${criticalAngle}°), the boundary acts as a perfect mirror. No light escapes.`
                                : `The laser beam is refracting (bending) as it crosses the boundary. Because it changes speed from ${v1} × 10⁸ m/s to ${v2} × 10⁸ m/s, Snell's Law dictates the angle must change. It hits the boundary at ${incidentAngle}° and bends to ${refractedAngle.toFixed(1)}° ${n2 > n1 ? 'towards' : 'away from'} the normal line.`
                            }
                        </p>
                    </div>
                </div>
            </div>

            </div>
        </div>
    );
}
