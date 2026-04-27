"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Rocket,
    Zap,
    Activity,
    ChevronDown,
    Sun,
    Microscope,
    Beaker,
    Sparkles,
    CheckCircle2,
    Users,
    Globe2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StemWorldPage() {
    const router = useRouter();
    const [height, setHeight] = useState(50);
    const [distance, setDistance] = useState(50);
    const angle = Math.round(Math.atan(height / distance) * (180 / Math.PI));

    const [velocity, setVelocity] = useState(60);
    const [projAngle, setProjAngle] = useState(45);

    const projH = velocity * Math.sin(projAngle * Math.PI / 180);
    const projR = velocity * Math.cos(projAngle * Math.PI / 180) * 1.5;
    const projPath = `M 10 90 Q ${10 + projR / 2} ${90 - projH * 1.5} ${10 + projR} 90`;

    const [incidentAngle, setIncidentAngle] = useState(45);
    const [refractiveIndex, setRefractiveIndex] = useState(1.5);
    const sinTheta2 = (1.0 * Math.sin(incidentAngle * Math.PI / 180)) / refractiveIndex;
    const refractedAngle = Math.asin(sinTheta2) * 180 / Math.PI;

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 py-2 md:px-6 md:py-4 animate-in fade-in duration-500 pb-20">
            {/* Header & Back Navigation */}
            <div className="flex items-center justify-between mb-2">
                <Link
                    href="/app/lab"
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors dark:text-slate-400 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1E] shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-slate-200 dark:border-white/5">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Lab
                </Link>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Featured Galaxy Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 relative rounded-[32px] overflow-hidden p-8 md:p-12 shadow-xl border border-white/10 group flex flex-col justify-end min-h-[400px]"
                >
                    <img
                        src="/lab/solar-system-illustration.jpg"
                        alt="Solar System"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    <div className="relative z-10 space-y-4 max-w-lg mt-auto">
                        <div className="inline-block px-3 py-1 bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-pink-500/30">
                            Featured Module
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                            Interactive<br />Space Explorer
                        </h1>
                        <p className="text-white/80 font-medium text-sm leading-relaxed max-w-sm mb-6">
                            Explore the vast universe, navigate through planetary systems, and observe stellar formations in real-time.
                        </p>
                        <Link href="/app/lab/stem/space" className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 hover:scale-105 transition-all w-max mt-2">
                            Launch Simulation <Rocket className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </motion.div>

                {/* Right Side Stacked Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-violet-100 dark:bg-violet-900/20 p-8 rounded-[32px] border border-violet-200 dark:border-violet-800/50 flex-1 flex flex-col justify-center"
                    >
                        <Activity className="w-8 h-8 text-violet-600 dark:text-violet-400 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Newtonian<br />Sandbox</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Real-time multi-body physics engine with adjustable gravity constants.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-[#1A1A1E] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 flex-1 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-6 right-6 px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                            Live Session
                        </div>
                        <Zap className="w-8 h-8 text-rose-500 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Quantum<br />Mechanics 101</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Join 1.2k others in the particle-wave duality lab.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filter and Sort Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center bg-white dark:bg-[#1A1A1E] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-sm overflow-x-auto w-full sm:w-auto hide-scrollbar">
                    <button className="px-5 py-2 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold whitespace-nowrap">
                        All Fields
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Biology
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Physics
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Chemistry
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-full sm:w-auto justify-end">
                    Sort by:
                    <button className="flex items-center gap-1 text-violet-600 dark:text-violet-400 px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors">
                        Most Popular <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Experiments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Box 0 - Height and Distance Interactive Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-blue-400 border border-blue-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Interactive
                        </div>

                        {/* Dynamic SVG Visualization */}
                        <div className="absolute inset-0 p-8 pt-12 pb-6 flex items-end justify-center z-10 pointer-events-none">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" preserveAspectRatio="xMidYMax meet">
                                {/* Ground line */}
                                <line x1="0" y1="90" x2="100" y2="90" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

                                {/* Dynamic triangle */}
                                <line x1={90 - (distance / 100 * 80)} y1="90" x2="90" y2="90" stroke="#3b82f6" strokeWidth="3" className="transition-all duration-200" />
                                <line x1="90" y1="90" x2="90" y2={90 - (height / 100 * 70)} stroke="#ef4444" strokeWidth="3.5" className="transition-all duration-200" />
                                <line x1={90 - (distance / 100 * 80)} y1="90" x2="90" y2={90 - (height / 100 * 70)} stroke="#10b981" strokeWidth="2" className="transition-all duration-200" />

                                {/* Angle Arc */}
                                <path
                                    d={`M ${90 - (distance / 100 * 80) + 12} 90 A 12 12 0 0 0 ${90 - (distance / 100 * 80) + 12 * Math.cos(angle * Math.PI / 180)} ${90 - 12 * Math.sin(angle * Math.PI / 180)}`}
                                    stroke="#10b981" strokeWidth="1.5" fill="none" className="transition-all duration-200"
                                />
                                <text x={90 - (distance / 100 * 80) + 20} y="86" fill="#10b981" fontSize="8" fontWeight="bold">
                                    {angle}°
                                </text>
                            </svg>
                        </div>

                        <div className="absolute w-32 h-32 bg-blue-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Height &<br />Distance</h3>
                            <Activity className="w-5 h-5 text-blue-500 shrink-0" />
                        </div>

                        {/* Sliders in place of description to maintain uniform card height */}
                        <div className="flex-1 flex flex-col justify-center gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">H: {height}m</span>
                                <input
                                    type="range" min="10" max="100" value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">D: {distance}m</span>
                                <input
                                    type="range" min="10" max="100" value={distance}
                                    onChange={(e) => setDistance(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +5k
                                </div>
                            </div>
                            <Link href="/app/lab/stem/height-distance" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm shadow-blue-600/20 flex items-center gap-1.5">
                                Launch Lab <Rocket className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Projectile Motion Interactive Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-orange-400 border border-orange-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" /> Interactive
                        </div>

                        {/* Dynamic SVG Visualization */}
                        <div className="absolute inset-0 p-8 pt-12 pb-6 flex items-end justify-center z-10 pointer-events-none">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]" preserveAspectRatio="xMidYMax meet">
                                {/* Ground line */}
                                <line x1="0" y1="90" x2="100" y2="90" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

                                {/* Trajectory path */}
                                <path d={projPath} fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-60" />
                                
                                {/* Target or distance marker */}
                                <line x1="10" y1="94" x2={10 + projR} y2="94" stroke="#64748b" strokeWidth="1" />
                                <line x1={10 + projR} y1="92" x2={10 + projR} y2="96" stroke="#64748b" strokeWidth="1.5" />

                                {/* Animated Ball */}
                                <circle r="3.5" fill="#f97316">
                                    <animateMotion 
                                        dur={`${Math.max(1, 3.5 - velocity/30)}s`}
                                        repeatCount="indefinite"
                                        path={projPath} 
                                    />
                                </circle>
                            </svg>
                        </div>

                        <div className="absolute w-32 h-32 bg-orange-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Projectile<br />Motion</h3>
                            <Activity className="w-5 h-5 text-orange-500 shrink-0" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">V: {velocity}m/s</span>
                                <input
                                    type="range" min="20" max="100" value={velocity}
                                    onChange={(e) => setVelocity(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">θ: {projAngle}°</span>
                                <input
                                    type="range" min="15" max="85" value={projAngle}
                                    onChange={(e) => setProjAngle(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +3k
                                </div>
                            </div>
                            <Link href="/app/lab/stem/projectile-motion" className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm shadow-orange-600/20 flex items-center gap-1.5">
                                Launch Lab <Rocket className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Reflection & Refraction Interactive Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-pink-400 border border-pink-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" /> Interactive
                        </div>

                        {/* Dynamic SVG Visualization */}
                        <div className="absolute inset-0 p-8 pt-12 pb-6 flex items-center justify-center z-10 pointer-events-none">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]" preserveAspectRatio="xMidYMid meet">
                                {/* Medium 2 background */}
                                <rect x="0" y="50" width="100" height="50" fill="#3b82f6" fillOpacity="0.1" />
                                
                                {/* Interface line */}
                                <line x1="0" y1="50" x2="100" y2="50" stroke="#475569" strokeWidth="2" />
                                
                                {/* Normal line */}
                                <line x1="50" y1="10" x2="50" y2="90" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

                                {/* Incident ray */}
                                <line x1={50 - 40 * Math.sin(incidentAngle * Math.PI / 180)} y1={50 - 40 * Math.cos(incidentAngle * Math.PI / 180)} x2="50" y2="50" stroke="#ec4899" strokeWidth="2" />
                                
                                {/* Reflected ray (opacity lowered to emphasize refraction) */}
                                <line x1="50" y1="50" x2={50 + 40 * Math.sin(incidentAngle * Math.PI / 180)} y2={50 - 40 * Math.cos(incidentAngle * Math.PI / 180)} stroke="#ec4899" strokeWidth="1.5" className="opacity-40" />

                                {/* Refracted ray */}
                                <line x1="50" y1="50" x2={50 + 40 * Math.sin(refractedAngle * Math.PI / 180)} y2={50 + 40 * Math.cos(refractedAngle * Math.PI / 180)} stroke="#ec4899" strokeWidth="2" />
                            </svg>
                        </div>

                        <div className="absolute w-32 h-32 bg-pink-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Reflection &<br />Refraction</h3>
                            <Sparkles className="w-5 h-5 text-pink-500 shrink-0" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">θ₁: {incidentAngle}°</span>
                                <input
                                    type="range" min="10" max="80" value={incidentAngle}
                                    onChange={(e) => setIncidentAngle(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">n₂: {refractiveIndex}</span>
                                <input
                                    type="range" min="1" max="2.5" step="0.1" value={refractiveIndex}
                                    onChange={(e) => setRefractiveIndex(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +4k
                                </div>
                            </div>
                            <Link href="/app/lab/stem/reflection-refraction" className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm shadow-pink-600/20 flex items-center gap-1.5">
                                Launch Lab <Rocket className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Box 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-emerald-400 border border-emerald-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Simulation
                        </div>
                        <Beaker className="w-20 h-20 text-emerald-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                        <div className="absolute w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Thermodynamic<br />Reactions</h3>
                            <Beaker className="w-5 h-5 text-violet-600 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Analyze heat transfer and entropy changes in closed systems using virtual calorimetry.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +4k
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                Level: Advanced
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Box 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-amber-400 border border-amber-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Theory + Lab
                        </div>
                        <Sun className="w-20 h-20 text-amber-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                        <div className="absolute w-32 h-32 bg-amber-500/20 blur-3xl rounded-full" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Gravitational<br />Lensing</h3>
                            <Sun className="w-5 h-5 text-amber-500 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Visualize how massive objects bend the path of light across the cosmic web.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +12k
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                Level: Expert
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Box 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-teal-400 border border-teal-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Module
                        </div>
                        <Microscope className="w-20 h-20 text-teal-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                        <div className="absolute w-32 h-32 bg-teal-500/20 blur-3xl rounded-full" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Cellular<br />Respiration</h3>
                            <Globe2 className="w-5 h-5 text-teal-500 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Map the electron transport chain and observe ATP production in diverse cell types.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +8k
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                Level: Beginner
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Generate Custom CTA */}
            <div className="bg-violet-50 dark:bg-violet-900/10 rounded-[32px] p-8 md:p-12 border border-violet-100 dark:border-violet-500/10 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Can't find a specific experiment?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                            Our AI can generate custom 3D simulations based on your curriculum. Just describe the concept and we'll build the sandbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all hover:scale-105 active:scale-95 text-sm text-center">
                                Generate Custom Sim
                            </button>
                            <button className="px-8 py-3.5 bg-white dark:bg-transparent border-2 border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 font-bold rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all text-sm text-center">
                                View API Docs
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-[#1A1A1E] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                            <div className="text-3xl font-black text-violet-600 mb-1">240+</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lab Modules</div>
                        </div>
                        <div className="bg-white dark:bg-[#1A1A1E] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                            <div className="text-3xl font-black text-rose-500 mb-1">1.5M</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Simulations Run</div>
                        </div>
                        <div className="col-span-2 bg-white dark:bg-[#1A1A1E] px-6 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center gap-2">
                            <div className="flex -space-x-3 w-max mx-auto mb-1">
                                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white dark:border-[#1A1A1E]" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                Verified by 50+ Universities
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
