"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
    Sword, 
    Zap, 
    Shield, 
    RotateCcw, 
    Mic, 
    Target, 
    Rocket, 
    Lightbulb, 
    Heart,
    Bot,
    User,
    CheckCircle2
} from "lucide-react";

export default function DuelChallengePage() {
    const [response, setResponse] = useState("");
    const [shieldProgress, setShieldProgress] = useState(72);

    return (
        <div className="max-w-4xl mx-auto pb-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Left Section: Boss Image & Stats - More Compact */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="bg-white dark:bg-[#1A1A1E] rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex flex-col items-center gap-3 relative overflow-hidden">
                        <div className="px-2.5 py-0.5 bg-rose-500 text-white rounded-full text-[8px] font-black tracking-widest uppercase">
                            LEVEL 14 BOSS
                        </div>
                        
                        <div className="text-center space-y-0.5">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">The Polynomial Warden</h3>
                            <p className="text-slate-400 font-medium text-[9px] uppercase tracking-wider">Guardian of Algebriac Gates</p>
                        </div>

                        <div className="w-full space-y-1">
                             <div className="flex justify-between text-[8px] font-black items-end uppercase tracking-widest">
                                <span className="text-slate-400 flex items-center gap-1">
                                    <Shield className="w-2.5 h-2.5" />
                                    Shield
                                </span>
                                <span className="text-indigo-600 text-sm">{shieldProgress}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${shieldProgress}%` }} className="h-full bg-indigo-500" />
                            </div>
                        </div>

                        <div className="w-full aspect-square max-w-[200px] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-slate-900 relative group">
                            <img 
                                src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=400" 
                                alt="Robot Warden"
                                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-all duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                    </div>

                    {/* Student Stats Bar */}
                    <div className="bg-white dark:bg-[#1A1A1E] rounded-xl border border-slate-100 dark:border-slate-800 p-3.5 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full border border-indigo-50 dark:border-indigo-900/30 overflow-hidden shadow-sm shrink-0">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                            </div>
                            <div>
                                <p className="text-[7px] font-black text-slate-400 tracking-widest uppercase mb-0.5">Life</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(i => (
                                        <Heart key={i} className={`w-3 h-3 ${i < 3 ? "text-rose-500 fill-rose-500" : "text-slate-200 dark:text-slate-700"}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-[7px] font-black text-slate-400 tracking-widest uppercase mb-0.5">Combo</p>
                             <span className="text-lg font-black text-orange-500 italic">x5</span>
                        </div>
                    </div>
                </div>

                {/* Right Section: Challenge Area */}
                <div className="lg:col-span-8 space-y-4">
                    
                    {/* Boss Quote Card */}
                    <div className="relative">
                        <div className="absolute top-2 -left-3 w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 shadow-xs animate-bounce">
                            <Bot className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-md space-y-1.5">
                             <h4 className="text-base italic font-semibold leading-tight">"You claim to understand roots!"</h4>
                             <p className="text-indigo-100/90 text-[12px] font-medium leading-relaxed">
                                Listen closely. For any polynomial function, if the degree is even, it <span className="underline underline-offset-4 decoration-white/50 font-bold text-white">must</span> have at least two real roots because it eventually turns back toward its starting direction.
                             </p>
                             <button className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors pt-1">
                                BREAK MY LOGIC
                             </button>
                        </div>
                    </div>

                    {/* Logic Breach Card */}
                    <div className="bg-white dark:bg-[#1A1A1E] rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex items-start gap-2.5 shadow-xs relative group">
                        <div className="absolute top-2 -right-3 w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center border border-emerald-200 shadow-xs">
                            <User className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 space-y-1">
                             <p className="text-slate-500 font-medium italic text-[12px] leading-relaxed line-clamp-2">
                                Incorrect because the turning point could occur entirely above or below the x-axis, meaning it never intersects.
                             </p>
                             <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-[8px] tracking-widest uppercase">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Critical Hit: Breach Detected
                             </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="bg-slate-50 dark:bg-[#121214] rounded-2xl p-5 border border-white dark:border-slate-800 shadow-xl space-y-3">
                        <div className="flex items-center justify-center">
                            <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded-md text-[8px] font-black tracking-widest uppercase border border-indigo-200">
                                Weapon: Detailed Explanation
                            </span>
                        </div>

                        <textarea 
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Type your logical counter-attack here..."
                            className="w-full bg-transparent text-[14px] font-medium text-slate-700 dark:text-white placeholder:text-slate-400 outline-none resize-none h-20 leading-relaxed"
                        />

                        <div className="flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-3">
                            <div className="flex items-center gap-1.5">
                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0">
                                    <Mic className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0">
                                    <Target className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-black text-[10px] shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-1.5">
                                UNLEASH COUNTER
                                <Rocket className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
