"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, Settings, Star, Rocket, Code, Beaker, Bot, HeartPulse, Cpu, ChevronRight, Sparkles, Dna, Microscope, FlaskConical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LabPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 pt-4 px-2">
            {/* Hero / Banner Area */}
            <div
                className="relative rounded-3xl overflow-hidden p-8 sm:px-10 sm:py-8 shadow-lg"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='rgba(255,255,255,0.08)'%3E%3Ccircle cx='10' cy='10' r='1.5'/%3E%3Ccircle cx='50' cy='30' r='2'/%3E%3Ccircle cx='90' cy='15' r='1'/%3E%3Ccircle cx='25' cy='70' r='1.5'/%3E%3Ccircle cx='80' cy='80' r='2'/%3E%3Ccircle cx='100' cy='100' r='1'/%3E%3Cpath d='M30,30h3v-3h1.5v3h3v1.5h-3v3h-1.5v-3h-3z'/%3E%3Cpath d='M80,50h3v-3h1.5v3h3v1.5h-3v3h-1.5v-3h-3z'/%3E%3Cpath d='M40,100h3v-3h1.5v3h3v1.5h-3v3h-1.5v-3h-3z'/%3E%3Cpath d='M105,65h2v-2h1v2h2v1h-2v2h-1v-2h-2z'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(to right, #5A29DE, #9A7CF6)`,
                    backgroundSize: '120px 120px, auto'
                }}
            >
                {/* Background Decor/Icons */}
                <div className="absolute inset-0 opacity-[0.12] pointer-events-none overflow-hidden">
                    <Dna className="absolute top-[15%] right-[35%] w-[90px] h-[90px] text-white transform rotate-[25deg]" strokeWidth={1.5} />
                    <Bot className="absolute bottom-[0%] right-[22%] w-[90px] h-[90px] text-white transform rotate-[10deg]" strokeWidth={1.5} />
                    <Microscope className="absolute -bottom-6 right-0 w-[140px] h-[140px] text-white transform -rotate-[5deg]" strokeWidth={1} />
                    <FlaskConical className="absolute top-0 right-[15%] w-[85px] h-[85px] text-white transform -rotate-[15deg]" strokeWidth={1.2} />
                </div>

                <div className="relative z-10 max-w-[60%] sm:max-w-[70%] space-y-3">
                    <h1 className="text-3xl sm:text-[2.5rem] font-black text-white tracking-tight leading-[1.1]">
                        Welcome to the Lab
                    </h1>
                    <p className="text-white/90 text-[14px] sm:text-[15px] leading-relaxed max-w-xl font-medium">
                        Step into our high-end digital concierge for the mind. Explore interactive simulations designed to bridge the gap between theory and immersive discovery.
                    </p>
                </div>
            </div>

            {/* Main Lab Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Row 1: Virtual Periodic Table & Coding Lab */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-3 bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8 group hover:shadow-md transition-shadow"
                >
                    <div className="flex-1 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full w-max">
                                <span className="text-[10px] font-black uppercase tracking-widest">Featured Module</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Virtual Periodic<br />Table
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                                Master the building blocks of existence! Explore elements in 3D, run experiments, and unlock the secrets of chemistry.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <Link href="/app/lab/periodic-table" className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-sm font-bold transition-all shadow-md transform hover:-translate-y-0.5 w-max">
                                Explore Now
                                <Rocket className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative h-[250px] sm:h-[300px] rounded-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-10 transition-opacity z-10" />
                        <img
                            src="/lab/periodic_table.png"
                            alt="Virtual Periodic Table"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-1 bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >

                    <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-6 mt-4 border border-teal-100 dark:border-teal-900/50 shadow-sm">
                        <Code className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Coding Lab</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 px-2 flex-1 leading-relaxed">
                        Write your first line of code and see it come to life instantly!
                    </p>
                    <div className="w-full flex items-center justify-center mt-auto">
                        <button className="px-8 py-2.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-xl text-sm font-bold transition-colors shadow-sm">
                            Launch
                        </button>
                    </div>
                </motion.div>

                {/* Row 2: Anatomy, STEM, Robo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2 bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row overflow-hidden group hover:shadow-md transition-shadow"
                >
                    <div className="flex-1 p-8 flex flex-col justify-center">

                        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-100 dark:border-rose-900/50 shadow-sm">
                            <HeartPulse className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Interactive<br />Anatomy</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-xs">
                            Go beneath the skin! Explore 3D organs and cells with super-zoom precision.
                        </p>
                        <button className="px-6 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-2xl text-sm font-bold transition-colors w-max flex items-center gap-2 shadow-sm">
                            Start Exploration
                            <HeartPulse className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 relative h-[300px] sm:h-auto overflow-hidden">
                        <img
                            src="/lab/interactive_anatomy.png"
                            alt="Interactive Anatomy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 dark:from-[#1A1A1E] dark:via-[#1A1A1E]/50 to-transparent sm:hidden" />

                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-1 bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow relative"
                >

                    <div className="h-[140px] relative overflow-hidden flex-shrink-0">
                        <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 dark:bg-[#1A1A1E]/80 backdrop-blur-md flex items-center justify-center rounded-xl z-20 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                            <FlaskConical className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <img
                            src="/lab/stem.jpg"
                            alt="STEM World"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">STEM World</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
                            Create chemical reactions and learn physics through play.
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <Link href="/app/lab/stem" className="px-5 py-2 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-xl text-sm font-bold transition-colors inline-block">
                                Launch
                            </Link>

                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="md:col-span-1 bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow relative"
                >

                    <div className="h-[140px] relative overflow-hidden flex-shrink-0">
                        <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 dark:bg-[#1A1A1E]/80 backdrop-blur-md flex items-center justify-center rounded-xl z-20 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                            <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <img
                            src="/lab/robotics.jpg"
                            alt="Robo Workshop"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Robo Workshop</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed">
                            Build and program virtual robots to solve fun puzzles.
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <button className="px-5 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-xl text-sm font-bold transition-colors shadow-sm">
                                Launch
                            </button>

                        </div>
                    </div>
                </motion.div>

                {/* Row 3: Circuit Master and AI Playground */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="md:col-span-1 bg-white dark:bg-[#1A1A1E] rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >

                    <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-6">
                        <Cpu className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Circuit<br />Master</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                        Snap together virtual circuits and power up your imagination!
                    </p>
                    <div className="flex items-center mt-auto">
                        <button className="px-5 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl text-sm font-bold transition-colors shadow-sm">
                            Launch
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="md:col-span-1 bg-[#140C40] rounded-3xl border border-transparent p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                    <div className="absolute top-4 right-4 bg-white/10 text-white/80 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider backdrop-blur-md">
                        Mystery
                    </div>
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                        <Sparkles className="w-6 h-6 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">AI<br />Playground</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                        Chat with our AI and create your own virtual science experiments.
                    </p>
                </motion.div>
            </div>

            {/* Footer / CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-12 pb-6 flex flex-col items-center text-center space-y-4"
            >
                <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-violet-300 dark:to-violet-800" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Request a Custom Lab
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Don't see what you're looking for? Our AI Muse can generate specialized laboratory environments for your specific learning path.
                </p>
                <Link href="#" className="text-violet-600 dark:text-violet-400 text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4">
                    Contact Curriculum Design <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </motion.div>

        </div>
    );
}
