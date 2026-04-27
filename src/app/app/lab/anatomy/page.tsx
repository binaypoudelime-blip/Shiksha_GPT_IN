"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    HeartPulse,
    Activity,
    Dna,
    ChevronDown,
    Brain,
    Microscope,
    Bone,
    ScanFace
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AnatomyLandingPage() {
    const router = useRouter();

    return (
        <div className="max-w-6xl mx-auto space-y-6 px-4 py-2 md:px-6 md:py-4 animate-in fade-in duration-500 pb-20">
            {/* Header & Back Navigation */}
            <div className="flex items-center justify-between mb-2">
                <Link
                    href="/app/lab"
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors dark:text-slate-400 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1E] shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-slate-200 dark:border-white/5">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Lab
                </Link>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Featured Anatomy Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 relative rounded-[32px] overflow-hidden p-8 md:p-12 shadow-xl border border-white/10 group flex flex-col justify-end min-h-[400px]"
                >
                    <img
                        src="/lab/interactive_anatomy.png"
                        alt="Human Anatomy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 object-top"
                    />

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

                    <div className="relative z-10 space-y-4 max-w-lg mt-auto">
                        <div className="inline-block px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-rose-500/30">
                            Featured Module
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                            Interactive 3D<br />Human Anatomy
                        </h1>
                        <p className="text-white/80 font-medium text-sm leading-relaxed max-w-sm mb-6">
                            Go beneath the skin. Dissect and explore fully interactive 3D models of organs, the circulatory system, and cellular structures.
                        </p>
                        <Link href="/app/lab/anatomy/skeleton_system" className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 hover:scale-105 transition-all w-max mt-2">
                            Launch Explorer <HeartPulse className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </motion.div>

                {/* Right Side Stacked Cards */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-rose-100 dark:bg-rose-900/20 p-8 rounded-[32px] border border-rose-200 dark:border-rose-800/50 flex-1 flex flex-col justify-center"
                    >
                        <Brain className="w-8 h-8 text-rose-600 dark:text-rose-400 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Neurology<br />Mapping</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            Trace neural pathways and witness synapses firing in real-time simulations.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-[#1A1A1E] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 flex-1 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-6 right-6 px-2.5 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-500 text-[9px] font-black uppercase tracking-widest rounded-md">
                            Micro Level
                        </div>
                        <Dna className="w-8 h-8 text-violet-500 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Cellular<br />Biology Lab</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Zoom into the microscopic world. Explore organelles and DNA replication.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filter and Sort Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="flex items-center bg-white dark:bg-[#1A1A1E] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-sm overflow-x-auto w-full sm:w-auto hide-scrollbar">
                    <button className="px-5 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold whitespace-nowrap">
                        All Systems
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Cardiovascular
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Nervous
                    </button>
                    <button className="px-5 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap">
                        Skeletal
                    </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-full sm:w-auto justify-end">
                    Sort by:
                    <button className="flex items-center gap-1 text-rose-600 dark:text-rose-400 px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                        Most Detailed <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Experiments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Box 0 - Cardiovascular System */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-rose-400 border border-rose-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" /> Animated
                        </div>

                        <motion.div
                            animate={{ scale: [1, 1.15, 1, 1.15, 1] }}
                            transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                repeatDelay: 1,
                                ease: "easeInOut" 
                            }}
                        >
                            <HeartPulse className="w-20 h-20 text-rose-500/80" strokeWidth={1.5} />
                        </motion.div>
                        <div className="absolute w-32 h-32 bg-rose-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Cardiovascular<br />System</h3>
                            <Activity className="w-5 h-5 text-rose-500 shrink-0" />
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Watch the heart pump blood through the intricate network of arteries and veins in 3D space.
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +12k
                                </div>
                            </div>
                            <Link href="/app/lab/anatomy/cardiovascular_system" className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors shadow-sm shadow-rose-600/20 flex items-center gap-1.5">
                                Enter <HeartPulse className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Box 1 - Skeletal System */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-slate-300 border border-slate-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Dissection
                        </div>

                        <Bone className="w-20 h-20 text-slate-300/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                        <div className="absolute w-32 h-32 bg-slate-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Skeletal<br />Architecture</h3>
                            <ScanFace className="w-5 h-5 text-slate-400 shrink-0" />
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Isolate individual bones, examine joints, and understand the biomechanics of movement.
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +5k
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                Level: Core
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Box 2 - Respiratory System */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                    <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 isolate">
                        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-black/40 backdrop-blur-md text-cyan-400 border border-cyan-400/20 text-[9px] font-black uppercase tracking-widest rounded-md flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> VR Ready
                        </div>

                        <Microscope className="w-20 h-20 text-cyan-500/80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                        <div className="absolute w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight pr-4">Respiratory<br />Mechanics</h3>
                            <Dna className="w-5 h-5 text-cyan-500 shrink-0" />
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6 flex-1">
                            Analyze alveoli gas exchange and see how lung capacity changes during physical exercise.
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
                            <div className="flex -space-x-2">
                                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-[#1A1A1E] flex items-center justify-center text-[9px] font-bold text-slate-600">
                                    +9k
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                Level: Advanced
                            </span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Bottom Generate Custom CTA */}
            <div className="bg-rose-50 dark:bg-rose-900/10 rounded-[32px] p-8 md:p-12 border border-rose-100 dark:border-rose-500/10 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Need a custom anatomical view?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                            Our AI can generate specialized cross-sections, cellular pathologies, and unique physiological states for your medical curriculum.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 text-sm text-center">
                                Generate Custom View
                            </button>
                            <button className="px-8 py-3.5 bg-white dark:bg-transparent border-2 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all text-sm text-center">
                                Browse Library
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-[#1A1A1E] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                            <div className="text-3xl font-black text-rose-600 mb-1">500+</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">3D Models</div>
                        </div>
                        <div className="bg-white dark:bg-[#1A1A1E] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
                            <div className="text-3xl font-black text-violet-500 mb-1">2M</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Simulations</div>
                        </div>
                        <div className="col-span-2 bg-white dark:bg-[#1A1A1E] px-6 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center gap-2">
                            <div className="flex -space-x-3 w-max mx-auto mb-1">
                                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white dark:border-[#1A1A1E]" />
                                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white dark:border-[#1A1A1E]" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                Trusted by Leading Medical Institutions
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
