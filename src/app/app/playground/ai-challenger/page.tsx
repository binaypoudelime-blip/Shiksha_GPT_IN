"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Sword,
    Zap,
    Star,
    ChevronRight,
    Swords
} from "lucide-react";
import Link from "next/link";

const arenas = [
    {
        category: "MATHEMATICS",
        title: "Polynomials & Equations",
        description: "Master algebraic manipulation. Prove you can factor complex expressions under pressure.",
        tags: ["Quadratic Mastery", "Factoring Roots"],
        personaSelected: "The Glitchy Robot",
    },
    {
        category: "PHYSICS",
        title: "Newton's Laws",
        description: "Force, Mass, and Acceleration. Can you handle the laws of the universe?",
        difficulty: "HARD",
    },
    {
        category: "HISTORY",
        title: "The Civil War",
        description: "Navigating the complexities of strategy and societal change.",
    },
    {
        category: "BIOLOGY",
        title: "Cellular Respiration",
        description: "Analyze the Krebs cycle and electron transport chain. Spot the inaccuracies in claims.",
    }
];

const personas = [
    {
        name: "The Socratic Doubter",
        desc: "Never takes 'yes' for an answer. Challenges your definitions and logic at every turn.",
        stars: 3,
        img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&auto=format&fit=crop",
    },
    {
        name: "The Historical Rival",
        desc: "Expertly dismissive. Uses 17th-century skepticism to challenge modern scientific laws.",
        stars: 4,
        img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400&auto=format&fit=crop",
    },
    {
        name: "The Glitchy Robot",
        desc: "Logic gates failing. Needs you to provide correct proofs to stay functional.",
        stars: 2,
        img: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=400&auto=format&fit=crop",
    }
];

export default function AIChallengerPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-[#4F46E5] rounded-[2rem] p-6 lg:p-7 text-white shadow-xl">
                <div className="relative z-10 max-w-[450px] space-y-3">
                    <h1 className="text-xl lg:text-3xl font-bold leading-tight tracking-tight">
                        Choose Your Rival.<br />Prove Your Mastery.
                    </h1>
                    <p className="text-indigo-100/90 text-[11px] font-medium leading-relaxed">
                        Defeat our AI personas in a duel of knowledge. Each win earns you exclusive badges and rare artifacts.
                    </p>
                    <div className="flex items-center gap-2.5 pt-1">
                        <button className="px-5 py-1.5 bg-white text-indigo-600 rounded-full font-bold text-[10px] shadow-md hover:scale-105 transition-all">
                            Quick Start
                        </button>
                        <button className="px-5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full font-bold text-[10px] hover:bg-white/20 transition-all">
                            How it works
                        </button>
                    </div>
                </div>
                {/* Crossed Swords Decorative Icon */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-30 rotate-12">
                    <Swords className="w-32 h-32 stroke-[1.5]" />
                </div>
            </div>

            {/* Available Arenas */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Available Arenas</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Polynomials Arena (Featured) */}
                    <div className="md:col-span-8 bg-white dark:bg-[#1A1A1E] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 flex flex-col lg:flex-row gap-8 shadow-sm">
                        <div className="flex-1 space-y-4">
                            <span className="text-[10px] font-black text-orange-600 tracking-widest uppercase">MATHEMATICS</span>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white leading-tight">Polynomials & Equations</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{arenas[0].description}</p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {arenas[0].tags?.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-bold border border-slate-100 dark:border-slate-700">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-60 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 space-y-4 border border-slate-100 dark:border-slate-800 shrink-0">
                            <p className="text-[10px] font-black text-slate-400 tracking-widest text-center uppercase">SELECT PERSONA</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-500/30">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0">
                                        <img src={personas[2].img} alt="" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold truncate tracking-tight">The Glitchy Robot</p>
                                        <p className="text-[8px] text-slate-400 font-medium">Buggy Logic</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 opacity-50 grayscale scale-95 origin-left">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:border-slate-800 overflow-hidden shrink-0">
                                        <img src={personas[0].img} alt="" />
                                    </div>
                                    <p className="text-[11px] font-bold truncate">Socratic Doubter</p>
                                </div>
                            </div>
                            <Link href="/app/playground/ai-challenger/duel">
                                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-colors">
                                    Challenge the AI
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Newton Arena */}
                    <div className="md:col-span-4 bg-slate-50 dark:bg-[#121214] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 space-y-4 flex flex-col relative overflow-hidden">
                        <span className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">PHYSICS</span>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Newton's Laws</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{arenas[1].description}</p>
                        <div className="pt-2 space-y-1.5 mt-auto">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400">Difficulty</span>
                                <span className="text-orange-500">HARD</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-orange-500" />
                            </div>
                        </div>
                        <button className="w-full py-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-700 hover:bg-slate-50 transition-all">
                            Battle Newton's Rival
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Personas Section - Exact Match to Image */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between px-1">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">The AI Personas</h2>
                        <p className="text-slate-400 text-sm font-medium">Each with their own personality and "flaws" to exploit.</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm hover:gap-2 transition-all">
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {personas.map((persona, index) => (
                        <div key={persona.name} className={`bg-white dark:bg-[#1A1A1E] rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 text-center space-y-4 hover:-translate-y-1 transition-all ${index === 1 ? 'border-amber-700 shadow-md' : ''}`}>
                            <div className="relative mx-auto w-24 h-24 mb-2">
                                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800 rounded-full" />
                                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                                    <img src={persona.img} alt={persona.name} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <h3 className="text-base font-semibold text-slate-800 dark:text-white leading-tight">{persona.name}</h3>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-2">
                                {persona.desc}
                            </p>
                            <div className="flex justify-center gap-1 pt-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className={`w-3.5 h-3.5 ${star <= persona.stars ? "text-orange-400 fill-orange-400" : "text-slate-200 dark:text-slate-700"}`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-8 z-50">
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-xs shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2">
                    <Sword className="w-4 h-4" />
                    New Duel
                </button>
            </div>
        </div>
    );
}
