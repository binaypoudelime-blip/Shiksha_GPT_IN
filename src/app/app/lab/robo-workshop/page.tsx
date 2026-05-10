"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    Rocket,
    Zap,
    Activity,
    ChevronDown,
    Bot,
    Cpu,
    Wrench,
    Settings,
    Crosshair,
    Wifi,
    Car,
    Plane,
    Battery
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RoboWorkshopPage() {
    const router = useRouter();
    
    // Interactive States for Cards
    const [armAngle1, setArmAngle1] = useState(45);
    const [armAngle2, setArmAngle2] = useState(-30);
    
    const [droneTilt, setDroneTilt] = useState(0);
    const [motorSpeed, setMotorSpeed] = useState(50);
    
    const [sensorDist, setSensorDist] = useState(60);

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 py-2 md:px-6 md:py-4 animate-in fade-in duration-500 pb-20">
            {/* Header & Back Navigation */}
            <div className="flex items-center justify-between mb-2">
                <Link
                    href="/app/lab"
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-600 transition-colors dark:text-slate-400 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1E] shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-slate-200 dark:border-white/5">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Lab
                </Link>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Featured Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 relative rounded-[32px] overflow-hidden p-8 md:p-12 shadow-xl border border-white/10 group flex flex-col justify-end min-h-[400px]"
                >
                    <img
                        src="/lab/robotics.jpg"
                        alt="Mars Rover"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    <div className="relative z-10 space-y-4 max-w-lg mt-auto">
                        <div className="inline-block px-3 py-1 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-teal-500/30">
                            Featured Challenge
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                            Mars Rover<br />Navigation
                        </h1>
                        <p className="text-white/80 font-medium text-sm leading-relaxed max-w-sm mb-6">
                            Program an autonomous rover to navigate the Martian terrain, avoid craters, and collect rock samples.
                        </p>
                        <button className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-teal-600/30 hover:scale-105 transition-all w-max mt-2">
                            Enter Challenge <Rocket className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </motion.div>

                {/* Right Side Stacked Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-teal-100 dark:bg-teal-900/20 p-8 rounded-[32px] border border-teal-200 dark:border-teal-800/50 flex-1 flex flex-col justify-center"
                    >
                        <Bot className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Line Follower<br />Basics</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Learn PID control loops by keeping a fast robot precisely on track.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-[#1A1A1E] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 flex-1 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-6 right-6 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                            Tournament
                        </div>
                        <Zap className="w-8 h-8 text-amber-500 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Battle Bots<br />Arena</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Code the best AI to outmaneuver 500+ student bots.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filter and Sort Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center bg-white dark:bg-[#1A1A1E] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-sm overflow-x-auto w-full sm:w-auto hide-scrollbar">
                    <button className="px-5 py-2 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg text-xs font-bold whitespace-nowrap">
                        All Modules
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Kinematics
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Sensors
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Drones
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-full sm:w-auto justify-end">
                    Sort by:
                    <button className="flex items-center gap-1 text-teal-600 dark:text-teal-400 px-2 py-1 rounded hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors">
                        Difficulty <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Experiments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Box 1 - Robotic Arm Kinematics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-emerald-400 border border-emerald-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Interactive
                        </div>

                        {/* Dynamic SVG Visualization */}
                        <div className="absolute inset-0 p-8 pt-12 pb-6 flex items-end justify-center z-10 pointer-events-none">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" preserveAspectRatio="xMidYMax meet">
                                {/* Base */}
                                <path d="M 40 90 L 60 90 L 55 80 L 45 80 Z" fill="#334155" />
                                
                                {/* Arm Segment 1 */}
                                <g transform={`translate(50 80) rotate(${armAngle1})`}>
                                    <line x1="0" y1="0" x2="0" y2="-35" stroke="#10b981" strokeWidth="6" strokeLinecap="round" className="transition-transform duration-300" />
                                    <circle cx="0" cy="0" r="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                                    
                                    {/* Arm Segment 2 */}
                                    <g transform={`translate(0 -35) rotate(${armAngle2})`}>
                                        <line x1="0" y1="0" x2="0" y2="-25" stroke="#34d399" strokeWidth="4" strokeLinecap="round" className="transition-transform duration-300" />
                                        <circle cx="0" cy="0" r="3" fill="#0f172a" stroke="#34d399" strokeWidth="2" />
                                        {/* Claw */}
                                        <path d="M -5 -30 L 0 -25 L 5 -30" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </g>
                            </svg>
                        </div>

                        <div className="absolute w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Arm Kinematics<br />& Joints</h3>
                            <Wrench className="w-5 h-5 text-emerald-500 shrink-0" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">J1: {armAngle1}°</span>
                                <input
                                    type="range" min="-90" max="90" value={armAngle1}
                                    onChange={(e) => setArmAngle1(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">J2: {armAngle2}°</span>
                                <input
                                    type="range" min="-90" max="90" value={armAngle2}
                                    onChange={(e) => setArmAngle2(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +2k
                                </div>
                            </div>
                            <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-1.5">
                                Launch Lab <Rocket className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Box 2 - Drone Balancing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-blue-400 border border-blue-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Interactive
                        </div>

                        {/* Dynamic SVG Visualization */}
                        <div className="absolute inset-0 p-8 pt-12 pb-6 flex items-center justify-center z-10 pointer-events-none">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" preserveAspectRatio="xMidYMid meet">
                                <g transform={`translate(50 50) rotate(${droneTilt})`}>
                                    {/* Drone Body */}
                                    <rect x="-20" y="-2" width="40" height="4" fill="#3b82f6" rx="2" />
                                    <circle cx="0" cy="0" r="5" fill="#1e40af" />
                                    
                                    {/* Propeller Left */}
                                    <line x1="-20" y1="-2" x2="-20" y2="-10" stroke="#334155" strokeWidth="1.5" />
                                    <ellipse cx="-20" cy="-10" rx="8" ry="1.5" fill="#93c5fd" className="animate-pulse" />
                                    
                                    {/* Propeller Right */}
                                    <line x1="20" y1="-2" x2="20" y2="-10" stroke="#334155" strokeWidth="1.5" />
                                    <ellipse cx="20" cy="-10" rx="8" ry="1.5" fill="#93c5fd" className="animate-pulse" />
                                </g>
                                {/* Ground */}
                                <line x1="10" y1="90" x2="90" y2="90" stroke="#334155" strokeWidth="2" strokeDasharray="2 2" />
                            </svg>
                        </div>

                        <div className="absolute w-32 h-32 bg-blue-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Drone PID<br />Balancing</h3>
                            <Plane className="w-5 h-5 text-blue-500 shrink-0" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">Tilt: {droneTilt}°</span>
                                <input
                                    type="range" min="-45" max="45" value={droneTilt}
                                    onChange={(e) => setDroneTilt(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">RPM: {motorSpeed}%</span>
                                <input
                                    type="range" min="0" max="100" value={motorSpeed}
                                    onChange={(e) => setMotorSpeed(Number(e.target.value))}
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
                            <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm shadow-blue-600/20 flex items-center gap-1.5">
                                Launch Lab <Rocket className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Box 3 - Sensor Processing */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-purple-400 border border-purple-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> Interactive
                        </div>

                        {/* Dynamic SVG Visualization */}
                        <div className="absolute inset-0 p-8 pt-12 pb-6 flex items-center justify-center z-10 pointer-events-none">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" preserveAspectRatio="xMidYMid meet">
                                {/* Ultrasonic Sensor */}
                                <rect x="10" y="40" width="15" height="20" fill="#334155" rx="2" />
                                <circle cx="15" cy="45" r="3" fill="#a855f7" />
                                <circle cx="15" cy="55" r="3" fill="#a855f7" />
                                
                                {/* Sound Waves */}
                                <path d={`M 30 45 Q ${30 + sensorDist/4} 30 ${30 + sensorDist/2} 50 T ${30 + sensorDist} 50`} fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
                                <path d={`M 30 55 Q ${30 + sensorDist/4} 70 ${30 + sensorDist/2} 50 T ${30 + sensorDist} 50`} fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />

                                {/* Wall / Object */}
                                <rect x={30 + sensorDist} y="20" width="10" height="60" fill="#64748b" rx="1" />
                                
                                <text x={30 + sensorDist/2} y="80" fill="#c084fc" fontSize="8" fontWeight="bold" textAnchor="middle">
                                    {sensorDist} cm
                                </text>
                            </svg>
                        </div>

                        <div className="absolute w-32 h-32 bg-purple-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Ultrasonic<br />Sensors</h3>
                            <Wifi className="w-5 h-5 text-purple-500 shrink-0" />
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-3 mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">Dist: {sensorDist}</span>
                                <input
                                    type="range" min="10" max="60" value={sensorDist}
                                    onChange={(e) => setSensorDist(Number(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 text-center font-medium mt-1">
                                {sensorDist < 20 ? "Object Too Close! STOP" : "Path Clear. Proceed."}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +1k
                                </div>
                            </div>
                            <button className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm shadow-purple-600/20 flex items-center gap-1.5">
                                Launch Lab <Rocket className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
