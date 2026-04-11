"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ThumbsUp, Users, Sparkles, Languages, Brain, Wand2, Flame, Star, UserCircle, Briefcase, Lightbulb } from "lucide-react";
import Link from "next/link";

const playgroundApps = [
    {
        id: "ai-challenger",
        title: "AI Challenger",
        description: "Test your knowledge against our advanced AI in a rapid-fire quiz showdown.",
        likes: 245,
        users: 1205,
        category: "Games",
        gradient: "from-blue-600 to-indigo-900",
        icon: Brain,
        isHot: true,
        isComingSoon: false,
    },
    {
        id: "language-tutor",
        title: "Language Tutor",
        description: "Master a new language with personalized, conversational AI practice.",
        likes: 512,
        users: 3400,
        category: "Learning",
        gradient: "from-emerald-500 to-teal-800",
        icon: Languages,
        isHot: true,
        isComingSoon: true,
    },
    {
        id: "character-chatbot",
        title: "Character Chatbot",
        description: "Chat with historical figures or fictional characters brought to life by AI.",
        likes: 890,
        users: 5600,
        category: "Entertainment",
        gradient: "from-purple-600 to-pink-900",
        icon: UserCircle,
        isHot: true,
        isComingSoon: true,
    },
    {
        id: "career-counselor",
        title: "Career Counselor",
        description: "Get personalized career advice and roadmap guidance from our expert AI Counselor.",
        likes: 420,
        users: 2100,
        category: "Guidance",
        gradient: "from-amber-500 to-orange-800",
        icon: Briefcase,
        isHot: false,
        isComingSoon: true,
    },
    {
        id: "idea-generation",
        title: "Idea Generation",
        description: "Brainstorm and generate creative ideas with AI assistance.",
        likes: 310,
        users: 1540,
        category: "Productivity",
        gradient: "from-cyan-500 to-blue-800",
        icon: Lightbulb,
        isHot: false,
        isComingSoon: true,
    }
];

export default function PlaygroundPage() {
    const [activeTab, setActiveTab] = useState("Explore");

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800/50">
                        <Wand2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Playground</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                            Discover and create interactive learning tools.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        Create App
                    </button>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {["Explore", "My Apps", "Bookmarks"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${activeTab === tab
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tools..."
                        className="w-full bg-slate-50 dark:bg-[#121214] border border-slate-200 dark:border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Featured Section */}
            <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    Featured
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {playgroundApps.map((app, index) => {
                        const isLink = app.id === "ai-challenger";
                        
                        const CardUI = (
                            <div className={`relative h-[180px] w-full bg-gradient-to-br ${app.gradient} group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-500`}>
                                {/* Mesh Background Pattern */}
                                <div className="absolute inset-0 opacity-15 overflow-hidden">
                                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white blur-[60px] rounded-full" />
                                    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-black/20 blur-[80px] rounded-full" />
                                </div>
                                
                                {/* Top Badges */}
                                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-30">
                                    {app.isComingSoon && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full shadow-lg">
                                            <span className="text-[9px] font-black text-white uppercase tracking-wider">Coming Soon</span>
                                        </div>
                                    )}
                                    {app.isHot && !app.isComingSoon && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg">
                                            <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400 animate-pulse" />
                                            <span className="text-[9px] font-black text-white uppercase tracking-wider">Hot</span>
                                        </div>
                                    )}
                                    <button className="p-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg hover:bg-white/30 transition-all group/star">
                                        <Star className="w-3 h-3 text-white group-hover:fill-white transition-colors" />
                                    </button>
                                </div>

                                {/* Main Content */}
                                <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center justify-center p-4 text-center z-20 space-y-2">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                        <app.icon className="w-11 h-11 text-white drop-shadow-xl group-hover:-translate-y-1.5 transition-transform duration-500 ease-out" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-base font-black text-white tracking-widest uppercase mb-0.5 drop-shadow-md">
                                            {app.title}
                                        </h3>
                                        <div className="h-0.5 w-6 bg-white/30 mx-auto rounded-full group-hover:w-12 transition-all duration-500" />
                                    </div>
                                </div>

                                {/* Modern Glass Bottom Bar */}
                                <div className="absolute bottom-0 inset-x-0 bg-black/20 backdrop-blur-md border-t border-white/10 p-3 flex items-center justify-between z-30">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-white/9 disabledtext-[10px] font-black group/stat cursor-pointer">
                                            <ThumbsUp className="w-3 h-3 group-hover:fill-white group-hover:scale-110 transition-all" />
                                            <span className="text-[10px] text-white/90">{app.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-white/90 text-[10px] font-black group/stat cursor-pointer">
                                            <Users className="w-3 h-3 group-hover:scale-110 transition-all" />
                                            <span className="text-[10px] text-white/90">{app.users}</span>
                                        </div>
                                    </div>
                                    <div className="px-2 py-0.5 bg-white/10 rounded-md border border-white/10">
                                        <span className="text-[8px] font-black text-white/70 uppercase tracking-[0.1em]">
                                            {app.category}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Shine Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transform transition-transform duration-1000 ease-in-out pointer-events-none" />
                            </div>
                        );

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                key={app.id}
                                className="group relative rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all cursor-pointer bg-white dark:bg-[#0A0A0C]"
                            >
                                {isLink ? (
                                    <Link href="/app/playground/ai-challenger">
                                        {CardUI}
                                    </Link>
                                ) : (
                                    CardUI
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
