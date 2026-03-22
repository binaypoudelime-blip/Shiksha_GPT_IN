"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { ArrowLeft, Check, Play, Loader2, Trophy, X, HelpCircle, Lock, BookOpen, SquareStack, ListChecks } from "lucide-react";

interface Unit {
    _id: string;
    name: string;
    subject_id: string;
    status?: string;
}

export default function SyllabusPathPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const subjectId = params.subjectId as string;
    const subjectName = searchParams.get("name") || "Subject";
    const subjectProgress = searchParams.get("progress") || "0";

    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
    const [topicProgress, setTopicProgress] = useState<any>(null);
    const [isTopicLoading, setIsTopicLoading] = useState(false);

    const openModal = async (unit: Unit, index: number) => {
        setSelectedUnit(unit);
        setSelectedUnitIndex(index);
        setIsTopicLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/roadmap/subjects/${subjectId}/topics/${unit._id}/progress`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setTopicProgress(data);
            }
        } catch (error) {
            console.error("Failed to fetch topic progress", error);
        } finally {
            setIsTopicLoading(false);
        }
    };

    useEffect(() => {
        const fetchUnits = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(`${API_BASE_URL}/api/roadmap/subjects/${subjectId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUnits(data);
                }
            } catch (error) {
                console.error("Failed to fetch units", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (subjectId) {
            fetchUnits();
        }
    }, [subjectId]);

    return (
        <div className="max-w-[1000px] mx-auto -mt-2 md:-mt-4 pb-8 px-4 relative min-h-[calc(100vh-80px)] flex flex-col">
            <div className="flex-1">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-500 transition-colors mb-1 -ml-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Subjects
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="text-center md:text-left max-w-md">
                        <h1 className="text-2xl md:text-3xl font-extrabold dark:text-white mb-1">Roadmap to Success</h1>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">Master the basics of {subjectName} through these {units.length > 0 ? units.length : "..."} units.</p>
                    </div>

                    {!isLoading && units.length > 0 && (
                        <div className="w-full md:max-w-[400px] shrink-0 animate-in fade-in duration-500">
                            <div className="bg-emerald-500/95 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-4 text-white shadow-xl shadow-emerald-500/20 flex items-center gap-4 overflow-hidden relative">
                                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0 z-10">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <h4 className="font-bold text-sm">Goal: {subjectName} Mastery</h4>
                                        <span className="text-[10px] bg-white text-emerald-500 px-2.5 py-1 rounded-full font-extrabold shadow-sm whitespace-nowrap">{subjectProgress}% DONE</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${subjectProgress}%` }} />
                                    </div>
                                </div>

                                <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] pointer-events-none -mr-8 -mt-8" />
                            </div>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : units.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">No chapters found for this subject.</div>
                ) : (
                    <div className="relative mb-16 max-w-4xl mx-auto">
                        {/* The main vertical line */}
                        <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-4 bottom-0 w-0.5 bg-slate-200 dark:bg-white/10" />

                        <div className="space-y-12">
                            {units.map((unit, index) => {
                                const isCompleted = unit.status === "completed";
                                const isCurrent = unit.status === "in_progress";
                                const isUpcoming = unit.status === "not_started" || (!isCompleted && !isCurrent);
                                const isEven = index % 2 === 0;

                                if (isCurrent) {
                                    return (
                                        <div key={unit._id} className="relative flex flex-col items-center group pt-4 pb-4">
                                            {/* Node */}
                                            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-4 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-[#0A0A0B] bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 ring-4 ring-yellow-500/20 z-10 transition-transform hover:scale-110 md:-mt-2">
                                                <Play className="w-5 h-5 ml-1" />
                                            </div>

                                            {/* Content Card (Centered on Desktop) */}
                                            <div className="w-full md:max-w-xl mt-4 md:mt-16 relative z-10 px-4 md:px-0 ml-14 md:ml-0">
                                                <div className="relative group/card cursor-pointer" onClick={() => openModal(unit, index)}>
                                                    {/* Glow effect */}
                                                    <div className="absolute -inset-4 bg-yellow-500/20 blur-[80px] rounded-[32px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                                                    <div className="relative bg-white dark:bg-[#121214] border border-yellow-500/20 rounded-[32px] p-6 md:p-8 text-center shadow-2xl shadow-yellow-500/10 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]">
                                                        {/* Inner gradient */}
                                                        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />

                                                        <div className="relative">
                                                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full uppercase tracking-widest font-bold mb-3 inline-block">
                                                                Current Chapter: {String(index + 1).padStart(2, '0')}
                                                            </span>

                                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{unit.name}</h3>
                                                            <p className="text-sm text-slate-500 mb-6 max-w-[250px] mx-auto leading-relaxed">
                                                                Dive into the topics and master the concepts of this unit.
                                                            </p>

                                                            <button className="w-full sm:w-auto min-w-[200px] bg-yellow-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 hover:scale-105 active:scale-95 transition-all text-sm mx-auto group">
                                                                <span>Start Learning</span>
                                                                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={unit._id} className="relative flex items-center group min-h-[60px] cursor-pointer" onClick={() => openModal(unit, index)}>
                                        {/* Node */}
                                        <div className={`
                                            absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-[#0A0A0B] transition-all duration-300 z-10
                                            ${isCompleted ? 'bg-emerald-500 text-white scale-100' :
                                                'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 scale-90'}
                                        `}>
                                            {isCompleted && <Check className="w-4 h-4" />}
                                            {isUpcoming && <span className="text-xs font-bold font-mono">{index + 1}</span>}
                                        </div>

                                        {/* Desktop Left Side */}
                                        <div className={`hidden md:flex w-1/2 pr-12 justify-end ${isEven ? 'text-right' : 'text-left'}`}>
                                            {isEven ? (
                                                <div className={`transition-opacity flex flex-col items-end ${isUpcoming ? 'opacity-50' : 'opacity-100'}`}>
                                                    <h3 className={`text-base uppercase font-extrabold mb-0.5 ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                                        {unit.name}
                                                    </h3>
                                                    {isCompleted && <p className="text-xs font-bold text-emerald-500">Completed</p>}
                                                    {isUpcoming && <p className="text-xs font-medium text-slate-400 italic">Upcoming</p>}
                                                </div>
                                            ) : (
                                                <span className={`text-[11px] font-bold uppercase tracking-widest self-center ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                    Chapter {String(index + 1).padStart(2, '0')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Desktop Right Side */}
                                        <div className={`hidden md:flex w-1/2 pl-12 justify-start ${!isEven ? 'text-right' : 'text-left'}`}>
                                            {!isEven ? (
                                                <div className={`transition-opacity flex flex-col items-start ${isUpcoming ? 'opacity-50' : 'opacity-100'}`}>
                                                    <h3 className={`text-base uppercase font-extrabold mb-0.5 ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                                        {unit.name}
                                                    </h3>
                                                    {isCompleted && <p className="text-xs font-bold text-emerald-500">Completed</p>}
                                                    {isUpcoming && <p className="text-xs font-medium text-slate-400 italic">Upcoming</p>}
                                                </div>
                                            ) : (
                                                <span className={`text-[11px] font-bold uppercase tracking-widest self-center ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                    Chapter {String(index + 1).padStart(2, '0')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Mobile layout */}
                                        <div className="md:hidden pl-20 w-full py-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                Chapter {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className={`transition-opacity ${isUpcoming ? 'opacity-50' : 'opacity-100'}`}>
                                                <h3 className={`text-sm uppercase font-extrabold mb-0.5 ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                                    {unit.name}
                                                </h3>
                                                {isCompleted && <p className="text-xs font-bold text-emerald-500">Completed</p>}
                                                {isUpcoming && <p className="text-xs font-medium text-slate-400 italic">Upcoming</p>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}


                        </div>
                    </div>
                )}
            </div>

            {/* Side Modal */}
            {selectedUnit && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setSelectedUnit(null)}
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white dark:bg-[#0A0A0B] z-50 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-[#0A0A0B]">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">
                                    Chapter {String(selectedUnitIndex + 1).padStart(2, '0')}
                                </span>
                                <h2 className="text-xl font-extrabold dark:text-white leading-tight pr-4">{selectedUnit.name}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedUnit(null)}
                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-12">
                            {isTopicLoading ? (
                                <div className="flex justify-center flex-col gap-4 items-center py-10 opacity-50">
                                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                                    <span className="text-xs font-bold text-slate-500">Loading progress...</span>
                                </div>
                            ) : topicProgress ? (
                                <>
                                    {/* Progress Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Chapter Progress</p>
                                                <div className="text-2xl font-extrabold dark:text-white flex items-baseline gap-2">
                                                    {topicProgress.progress_percent || 0}% Complete
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                                                {topicProgress.activities?.reduce((acc: number, act: any) => acc + (act.completed || 0), 0) || 0}/
                                                {topicProgress.activities?.reduce((acc: number, act: any) => acc + (act.required || 0), 0) || 0} Activities
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                                            <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${topicProgress.progress_percent || 0}%` }} />
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            Complete all activities to unlock the Final Chapter Quiz.
                                        </p>
                                    </div>

                                    {/* Resources */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { key: 'quiz', label: 'Quiz', icon: HelpCircle },
                                            { key: 'summary', label: 'Summary', icon: BookOpen },
                                            { key: 'flashcard', label: 'Flashcard', icon: SquareStack },
                                            { key: 'practice_set', label: 'Practice Test', icon: ListChecks }
                                        ].map((card) => {
                                            const stats = topicProgress?.activities?.find((a: any) => a.key === card.key) || { completed: 0, required: 0 };
                                            const isDone = stats.required > 0 && stats.completed >= stats.required;
                                            const Icon = card.icon;

                                            return (
                                                <button key={card.key} className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group ${isDone ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800'}`}>
                                                    {isDone && (
                                                        <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110">
                                                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                                                        </div>
                                                    )}
                                                    <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-transform mt-0.5 ${isDone ? 'text-emerald-500 group-hover:scale-110' : 'text-slate-400 group-hover:text-emerald-500 group-hover:scale-110'}`} />
                                                    <div className="text-center mt-2 flex flex-col gap-0.5 items-center">
                                                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider block leading-tight ${isDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>{card.label}</span>
                                                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md mt-0.5 ${isDone ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{stats.completed}/{stats.required}</span>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </>
                            ) : null}

                            {/* Topics List */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative">
                                        <div className="w-3 h-0.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
                                        <div className="absolute w-0.5 h-3 bg-slate-400 dark:bg-slate-500 rounded-full" />
                                    </div>
                                    <h3 className="text-sm font-bold dark:text-white">Curriculum Topics</h3>
                                </div>

                                <div className="space-y-3">
                                    {/* Completed */}
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold dark:text-white">Physical Nature of Matter</p>
                                                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Completed 2 days ago</p>
                                            </div>
                                        </div>
                                        <ArrowLeft className="w-4 h-4 rotate-180 text-slate-300" />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                                <Check className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold dark:text-white">Characteristics of Particles</p>
                                                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Completed yesterday</p>
                                            </div>
                                        </div>
                                        <ArrowLeft className="w-4 h-4 rotate-180 text-slate-300" />
                                    </div>

                                    {/* Active */}
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#121214] border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 cursor-pointer hover:scale-[1.02] transition-transform">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                                <Play className="w-4 h-4 ml-0.5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold dark:text-white">States of Matter</p>
                                                <p className="text-[11px] font-bold text-emerald-500 mt-0.5">Resume Learning</p>
                                            </div>
                                        </div>
                                        <ArrowLeft className="w-4 h-4 rotate-180 text-emerald-500" />
                                    </div>

                                    {/* Locked */}
                                    <div className="flex items-center justify-between p-4 rounded-2xl border border-transparent opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Change of State</p>
                                                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Unlock by finishing States of Matter</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-2xl border border-transparent opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Evaporation & Factors</p>
                                                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Pending prerequisites</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}

        </div>
    );
}
