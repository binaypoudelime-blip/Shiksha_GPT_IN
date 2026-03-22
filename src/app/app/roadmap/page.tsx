"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";
import {
    FlaskConical, Calculator, Globe, BookOpen, Terminal, Languages,
    Search, Loader2, Trophy, Backpack
} from "lucide-react";

interface Subject {
    _id: string;
    name: string;
    slug: string;
    is_active?: boolean;
    total_topics?: number;
    completed_topics?: number;
    progress_percent?: number;
}

const getSubjectIcon = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("sci")) return <FlaskConical className="w-6 h-6 text-blue-500" />;
    if (lowercaseName.includes("math")) return <Calculator className="w-6 h-6 text-orange-500" />;
    if (lowercaseName.includes("social")) return <Globe className="w-6 h-6 text-emerald-500" />;
    if (lowercaseName.includes("nepali")) return <BookOpen className="w-6 h-6 text-red-500" />;
    if (lowercaseName.includes("computer")) return <Terminal className="w-6 h-6 text-cyan-500" />;
    if (lowercaseName.includes("english")) return <Languages className="w-6 h-6 text-indigo-500" />;
    return <BookOpen className="w-6 h-6 text-primary" />;
};

const getSubjectColorStyles = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes("sci")) return "bg-blue-500/10";
    if (lowercaseName.includes("math")) return "bg-orange-500/10";
    if (lowercaseName.includes("social")) return "bg-emerald-500/10";
    if (lowercaseName.includes("nepali")) return "bg-red-500/10";
    if (lowercaseName.includes("computer")) return "bg-cyan-500/10";
    if (lowercaseName.includes("english")) return "bg-indigo-500/10";
    return "bg-primary/10";
};

export default function RoadmapPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [userGrade, setUserGrade] = useState("9");
    const [overallProgress, setOverallProgress] = useState(0);

    useEffect(() => {
        const fetchSubjectsAndUnits = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access_token");
                const [response, progressResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/roadmap/subjects`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE_URL}/api/roadmap/overall`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                if (response.ok) {
                    const data: Subject[] = await response.json();
                    setSubjects(data);
                }

                if (progressResponse.ok) {
                    const progressData = await progressResponse.json();
                    setOverallProgress(progressData.progress_percent || 0);
                }
            } catch (error) {
                console.error("Failed to fetch subjects or progress", error);
            } finally {
                setIsLoading(false);
            }
        };

        const userDataStr = localStorage.getItem("user");
        if (userDataStr) {
            try {
                const user = JSON.parse(userDataStr);
                if (user.grade) setUserGrade(user.grade);
            } catch (e) { }
        }

        fetchSubjectsAndUnits();
    }, []);

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fillY = overallProgress === 0 ? 130 : (overallProgress === 100 ? 18 : 112 - (overallProgress / 100) * 94);

    return (
        <div className="max-w-[1000px] mx-auto space-y-8 p-4">
            <style>{`
                @keyframes wave-slide-svg {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100px); }
                }
                .animate-wave-slide-svg {
                    animation: wave-slide-svg 2s linear infinite;
                }
                .animate-wave-slide-svg-slow {
                    animation: wave-slide-svg 3s linear infinite;
                }
            `}</style>
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold dark:text-white">Your Backpack</h2>
                    <div className="group relative">
                        {/* SVG Container */}
                        <div className="text-emerald-500 w-16 h-16 relative cursor-help hover:scale-105 transition-transform duration-300 -my-2">
                            <svg viewBox="-4 -4 108 124" className="w-full h-full overflow-visible drop-shadow-sm">
                                <defs>
                                    <clipPath id="backpack-clip">
                                        <path d="
                                            M 2 62 C 2 56 4 54 8 54 H 92 C 96 54 98 56 98 62 V 102 C 98 108 96 110 92 110 H 8 Z
                                            M 16 32 C 16 22 24 18 34 18 H 66 C 76 18 84 22 84 32 V 102 C 84 107.5 79.5 112 74 112 H 26 C 20.5 112 16 107.5 16 102 Z
                                        " />
                                    </clipPath>
                                </defs>

                                {/* Fluid */}
                                <g clipPath="url(#backpack-clip)" className="text-pink-500">
                                    {overallProgress > 0 && (
                                        <>
                                            <rect x="0" y={fillY} width="100" height="130" fill="currentColor" fillOpacity="0.25" />
                                            {overallProgress < 100 && (
                                                <>
                                                    {/* Back wave */}
                                                    <g className="animate-wave-slide-svg-slow">
                                                        <path
                                                            fill="currentColor"
                                                            fillOpacity="0.3"
                                                            d={`M 0 ${fillY} Q 25 ${fillY + 5}, 50 ${fillY} T 100 ${fillY} T 150 ${fillY} T 200 ${fillY} T 250 ${fillY} T 300 ${fillY} L 300 130 L 0 130 Z`}
                                                        />
                                                    </g>
                                                    {/* Front wave */}
                                                    <g className="animate-wave-slide-svg">
                                                        <path
                                                            fill="currentColor"
                                                            fillOpacity="0.6"
                                                            d={`M 0 ${fillY} Q 25 ${fillY - 4}, 50 ${fillY} T 100 ${fillY} T 150 ${fillY} T 200 ${fillY} T 250 ${fillY} T 300 ${fillY} L 300 130 L 0 130 Z`}
                                                        />
                                                    </g>
                                                </>
                                            )}
                                        </>
                                    )}
                                </g>

                                {/* Icon Outline */}
                                <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                                    {/* Handle */}
                                    <path d="M 36 24 V 10 C 36 4 42 2 50 2 C 58 2 64 4 64 10 V 24" />

                                    {/* Left Side Pocket */}
                                    <path d="M 16 54 H 8 C 4 54 2 56 2 62 V 102 C 2 108 4 110 8 110 H 16" />

                                    {/* Right Side Pocket */}
                                    <path d="M 84 54 H 92 C 96 54 98 56 98 62 V 102 C 98 108 96 110 92 110 H 84" />

                                    {/* Lower Body */}
                                    <path d="M 16 40 V 102 C 16 107.5 20.5 112 26 112 H 74 C 79.5 112 84 107.5 84 102 V 40" />

                                    {/* Flap */}
                                    <path d="M 16 40 C 16 54 30 58 50 58 C 70 58 84 54 84 40 V 32 C 84 22 76 18 66 18 H 34 C 24 18 16 22 16 32 Z" />

                                    {/* Latch */}
                                    <path d="M 44 58 L 46 68 H 54 L 56 58" />

                                    {/* Front pocket */}
                                    <rect x="28" y="68" width="44" height="22" rx="6" />

                                    {/* Zipper */}
                                    <path d="M 34 76 H 66" />
                                    <path d="M 62 76 V 81" />
                                </g>
                            </svg>

                            {/* Hover Tooltip */}
                            <div className="absolute top-1/2 left-full -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100]">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45 -mr-1.5 z-0 relative"></div>
                                    <div className="bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap relative z-10">
                                        Overall Progress: <span className="text-pink-400">{overallProgress}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-slate-500">Pick a subject to view your personalized learning roadmap for the academic year.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredSubjects.map(subject => {
                        const mockProgress = subject.progress_percent || 0;
                        const unitsCount = subject.total_topics || 0;

                        return (
                            <Link
                                href={`/app/roadmap/${subject._id}?name=${encodeURIComponent(subject.name)}&progress=${mockProgress}`}
                                key={subject._id}
                                className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-slate-800 p-6 rounded-[24px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group block relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${getSubjectColorStyles(subject.name)}`}>
                                        {getSubjectIcon(subject.name)}
                                    </div>
                                    <span className="text-slate-500 text-xs font-medium mt-1">
                                        {unitsCount} Units
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold dark:text-white mb-6">{subject.name}</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-700 dark:text-slate-300">Progress</span>
                                        <span className="text-emerald-500">{mockProgress}%</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                                            style={{ width: `${mockProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}


        </div>
    );
}
