"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    TrendingUp,
    Briefcase,
    Globe2,
    ChevronDown,
    LineChart,
    PieChart,
    Building2,
    Users,
    Activity,
    Landmark
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BemsLandingPage() {
    const router = useRouter();

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 py-2 md:px-6 md:py-4 animate-in fade-in duration-500 pb-20">
            {/* Header & Back Navigation */}
            <div className="flex items-center justify-between mb-2">
                <Link
                    href="/app/lab"
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors dark:text-slate-400 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1E] shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-slate-200 dark:border-white/5">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Lab
                </Link>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Featured BEMS Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 relative rounded-[32px] overflow-hidden p-8 md:p-12 shadow-xl border border-white/10 group flex flex-col justify-end min-h-[400px]"
                >
                    <img
                        src="/lab/globalmarket.png"
                        alt="Global Markets"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                    <div className="relative z-10 space-y-4 max-w-lg mt-auto">
                        <div className="inline-block px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/30">
                            Featured Module
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                            Global Market<br />Simulator
                        </h1>
                        <p className="text-white/80 font-medium text-sm leading-relaxed max-w-sm mb-6">
                            Step into the shoes of policy makers and market leaders. Analyze real-world data and observe how your decisions impact the global economy.
                        </p>
                        <Link href="/app/lab/bems/supply-demand" className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-105 transition-all w-max mt-2">
                            Launch Market <TrendingUp className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </motion.div>

                {/* Right Side Stacked Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-emerald-100 dark:bg-emerald-900/20 p-8 rounded-[32px] border border-emerald-200 dark:border-emerald-800/50 flex-1 flex flex-col justify-center"
                    >
                        <Landmark className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Macroeconomics<br />Policy Lab</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Adjust interest rates and government spending to control inflation and unemployment.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-[#1A1A1E] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 flex-1 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-6 right-6 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                            Live Trading
                        </div>
                        <LineChart className="w-8 h-8 text-amber-500 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Stock Market<br />Exchange</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Join 3.4k users trading virtual assets in real-time.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filter and Sort Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center bg-white dark:bg-[#1A1A1E] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-sm overflow-x-auto w-full sm:w-auto hide-scrollbar">
                    <button className="px-5 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold whitespace-nowrap">
                        All Fields
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Business
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Economics
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Management
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-full sm:w-auto justify-end">
                    Sort by:
                    <button className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                        Most Relevant <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Experiments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Box 0 - Supply and Demand Interactive Card */}
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

                        {/* Animated Visual representation of a graph */}
                        <div className="absolute inset-0 p-8 pt-12 pb-6 flex items-center justify-center z-10 pointer-events-none">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible drop-shadow-xl group-hover:scale-110 transition-transform duration-500">
                                {/* Axes */}
                                <path d="M 10 10 L 10 90 L 90 90" stroke="#64748b" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                
                                {/* Demand Curve (Red) */}
                                <path d="M 20 20 L 80 80" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                                
                                {/* Ghost Supply Curve (Original position) */}
                                <line x1="20" y1="80" x2="80" y2="20" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" opacity="0.3" strokeLinecap="round" />

                                {/* Supply Curve (Green) Shifting */}
                                <motion.line
                                    stroke="#10b981" strokeWidth="3.5" strokeLinecap="round"
                                    initial={{ x1: 20, y1: 80, x2: 80, y2: 20 }}
                                    animate={{ x1: [20, 35, 20], y1: 80, x2: [80, 95, 80], y2: 20 }}
                                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                                />

                                {/* Dashed Lines to Axes */}
                                <motion.line
                                    stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2"
                                    initial={{ x1: 10, y1: 50, x2: 50, y2: 50 }}
                                    animate={{ x1: 10, y1: [50, 57.5, 50], x2: [50, 57.5, 50], y2: [50, 57.5, 50] }}
                                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                                />
                                <motion.line
                                    stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2"
                                    initial={{ x1: 50, y1: 90, x2: 50, y2: 50 }}
                                    animate={{ x1: [50, 57.5, 50], y1: 90, x2: [50, 57.5, 50], y2: [50, 57.5, 50] }}
                                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                                />

                                {/* Equilibrium Point (Blue) */}
                                <motion.circle
                                    r="3.5" fill="#3b82f6"
                                    initial={{ cx: 50, cy: 50 }}
                                    animate={{ cx: [50, 57.5, 50], cy: [50, 57.5, 50] }}
                                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                                />
                                {/* Equilibrium Glow */}
                                <motion.circle
                                    r="6" fill="none" stroke="#3b82f6" strokeWidth="1.5"
                                    initial={{ cx: 50, cy: 50, opacity: 0.8, scale: 1 }}
                                    animate={{ 
                                        cx: [50, 57.5, 50], 
                                        cy: [50, 57.5, 50], 
                                        opacity: [0.8, 0, 0.8], 
                                        scale: [1, 1.5, 1] 
                                    }}
                                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                                />
                            </svg>
                        </div>

                        <div className="absolute w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Supply &<br />Demand</h3>
                            <Activity className="w-5 h-5 text-emerald-500 shrink-0" />
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Manipulate consumer income and resource costs to see how market equilibrium responds.
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +10k
                                </div>
                            </div>
                            <Link href="/app/lab/bems/supply-demand" className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-1.5">
                                Explore <TrendingUp className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Box 1 - Business Strategy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-blue-400 border border-blue-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Case Study
                        </div>

                        <Building2 className="w-20 h-20 text-blue-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                        <div className="absolute w-32 h-32 bg-blue-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Corporate<br />Strategy</h3>
                            <Briefcase className="w-5 h-5 text-blue-500 shrink-0" />
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Analyze Harvard Business Review cases and formulate turnaround strategies for failing tech startups.
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +4k
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                Level: Advanced
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Box 2 - Behavioral Economics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-purple-400 border border-purple-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Experiment
                        </div>

                        <Users className="w-20 h-20 text-purple-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                        <div className="absolute w-32 h-32 bg-purple-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Behavioral<br />Economics</h3>
                            <Globe2 className="w-5 h-5 text-purple-500 shrink-0" />
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Run Ultimatum Game experiments and explore cognitive biases in consumer decision making.
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +8k
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                Level: Intermediate
                            </span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Bottom Generate Custom CTA */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-[32px] p-8 md:p-12 border border-emerald-100 dark:border-emerald-500/10 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Looking for a specific market model?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                            Our AI can generate custom economic models and business case studies based on your curriculum. Just describe the concept and we'll build the simulation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 text-sm text-center">
                                Generate Custom Model
                            </button>
                            <button className="px-8 py-3.5 bg-white dark:bg-transparent border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all text-sm text-center">
                                View APIs
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-[#1A1A1E] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                            <div className="text-3xl font-black text-emerald-600 mb-1">120+</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Business Cases</div>
                        </div>
                        <div className="bg-white dark:bg-[#1A1A1E] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                            <div className="text-3xl font-black text-blue-500 mb-1">850K</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Models Run</div>
                        </div>
                        <div className="col-span-2 bg-white dark:bg-[#1A1A1E] px-6 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center gap-2">
                            <div className="flex -space-x-3 w-max mx-auto mb-1">
                                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white dark:border-[#1A1A1E]" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                Trusted by Top Business Schools
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
