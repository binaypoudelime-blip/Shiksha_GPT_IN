"use client";

import React from "react";
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

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 py-2 md:px-6 md:py-4 animate-in fade-in duration-500 pb-20">
            {/* Header & Back Navigation */}
            <div className="flex items-center justify-between mb-2">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-violet-600 transition-colors dark:text-slate-400 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1E] shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-slate-200 dark:border-white/5">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Lab
                </button>
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
