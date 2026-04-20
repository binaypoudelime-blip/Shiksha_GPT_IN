"use client";

import React, { useState, useEffect } from "react";
import {
    Film,
    Plus,
    Search,
    Play,
    Clock,
    Eye,
    X,
    Loader2,
    ChevronDown,
    Filter,
    Mic2,
    Video,
    LayoutGrid,
    List,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";


interface Explainer {
    _id: string;
    name: string;
    description: string;
    tags: string[];
    is_active: boolean;
    duration: number | null;
    views_count: number;
    video_url: string;
    thumbnail_url: string | null;
    status?: string;
    error_message?: string | null;
}


export default function ExplainersPage() {
    const [explainers, setExplainers] = useState<Explainer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"all" | "video" | "audio">("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const router = useRouter();

    // Modal states for generation
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [explainerPrompt, setExplainerPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const explainersRef = React.useRef(explainers);
    useEffect(() => {
        explainersRef.current = explainers;
    }, [explainers]);

    useEffect(() => {
        const interval = setInterval(() => {
            const processing = explainersRef.current.filter(e => e.status && e.status !== 'completed' && e.status !== 'failed');
            processing.forEach(async (exp) => {
                try {
                    const token = localStorage.getItem("access_token");
                    const res = await fetch(`${API_BASE_URL}/api/explainer/${exp._id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.status === 'completed' || data.status === 'failed') {
                            setExplainers(prev => prev.map(p => p._id === data._id ? data : p));
                        }
                    }
                } catch (e) {}
            });
        }, 15000); // Poll every 15 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchExplainers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/explainer/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setExplainers(data);
            }
        } catch (error) {
            console.error("Failed to fetch explainers", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchExplainers();
    }, []);


    const formatDuration = (seconds?: number | null) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const filteredExplainers = explainers.filter(exp => {
        const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Response doesn't explicitly have a type, but we can mock it or check tags
        const isAudio = exp.tags.includes('audio') || exp.tags.includes('podcast');
        const isVideo = !isAudio;

        if (activeFilter === "video") return matchesSearch && isVideo;
        if (activeFilter === "audio") return matchesSearch && isAudio;
        return matchesSearch;
    });

    const handleGenerateExplainer = async () => {
        if (!explainerPrompt.trim()) return;
        setIsGenerating(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/explainer/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: explainerPrompt.slice(0, 100), // Setting the name based on prompt as required by API
                    description: explainerPrompt
                })
            });
            
            if (response.ok) {
                const newExplainer = await response.json();
                setExplainers(prev => [newExplainer, ...prev]);
                setIsModalOpen(false);
                setExplainerPrompt("");
            } else {
                const errorText = await response.text();
                console.error(`Failed to generate explainer: ${response.status} ${response.statusText}`, errorText);
                alert(`Generation failed (${response.status}): ${errorText}`);
            }
        } catch (error) {
            console.error("Failed to generate explainer (network error)", error);
            alert(`Network error: ${error}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-4 p-4 pt-0 md:pt-0">
            {/* Combined Header & Filter Section */}
            <div className="bg-white dark:bg-[#121214] p-3 md:p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                            <Film className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold dark:text-white tracking-tight">Explainers</h1>
                            <p className="text-slate-500 text-[10px]">Visual and audio guides to master complex topics.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs"
                    >
                        <Plus className="w-3.5 h-3.5" /> Generate Explainer
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-full md:w-auto">
                        <button
                            onClick={() => setActiveFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeFilter === "all" ? "bg-white dark:bg-[#1A1A1E] shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveFilter("video")}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${activeFilter === "video" ? "bg-white dark:bg-[#1A1A1E] shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            <Video className="w-3 h-3" /> Videos
                        </button>
                        <button
                            onClick={() => setActiveFilter("audio")}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${activeFilter === "audio" ? "bg-white dark:bg-[#1A1A1E] shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                        >
                            <Mic2 className="w-3 h-3" /> Audio
                        </button>
                    </div>

                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search explainers..."
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 pl-9 pr-4 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-[#1A1A1E] shadow-sm text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-[#1A1A1E] shadow-sm text-primary" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
                        >
                            <List className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Explainers List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Fetching explainers...</p>
                </div>
            ) : filteredExplainers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-[#121214] border border-dashed border-slate-300 dark:border-slate-800 rounded-[32px]">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center">
                        <Film className="w-8 h-8 text-primary/40" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold dark:text-white">No explainers found</h3>
                        <p className="text-slate-500 text-sm max-w-[250px]">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                </div>
            ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6" : "space-y-4"}>
                    <AnimatePresence mode="popLayout">
                        {filteredExplainers.map((exp) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                key={exp._id}
                                onClick={() => {
                                    if (!exp.status || exp.status === 'completed') {
                                        router.push(`/app/explainers/${exp._id}`);
                                    }
                                }}
                                className={`group flex flex-col ${viewMode === "list" ? "flex-row h-32 bg-white dark:bg-[#121214] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden" : ""} ${(!exp.status || exp.status === 'completed') ? 'cursor-pointer' : 'opacity-80'}`}
                            >
                                <div className={`relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 ${viewMode === "list" ? "w-48 h-full shrink-0 rounded-none" : "aspect-video w-full mb-3"}`}>
                                    {exp.thumbnail_url ? (
                                        <img
                                            src={exp.thumbnail_url}
                                            alt={exp.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-800 p-4 text-center">
                                            {exp.status === 'failed' ? (
                                                <>
                                                    <X className="w-8 h-8 text-red-500 mb-2" />
                                                    <span className="text-xs text-red-500 font-bold">Failed</span>
                                                </>
                                            ) : typeof exp.status === 'string' && exp.status !== 'completed' ? (
                                                <>
                                                    <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                                                    <span className="text-xs text-primary font-bold animate-pulse">Generating...</span>
                                                </>
                                            ) : (
                                                <Film className="w-8 h-8 text-slate-400" />
                                            )}
                                        </div>
                                    )}

                                    {(!exp.status || exp.status === 'completed') && (
                                        <>
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                                                    <Play className="w-5 h-5 fill-current" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-[10px] font-bold text-white rounded">
                                                {formatDuration(exp.duration)}
                                            </div>
                                            <div className="absolute top-2 left-2 flex gap-1">
                                                <div className="px-1.5 py-0.5 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-md flex items-center gap-1 shadow-md">
                                                    {(exp.tags || []).includes('audio') || (exp.tags || []).includes('podcast') ? (
                                                        <Mic2 className="w-2.5 h-2.5 text-primary" />
                                                    ) : (
                                                        <Video className="w-2.5 h-2.5 text-primary" />
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className={`flex flex-col ${viewMode === "list" ? "p-4 flex-1 justify-center" : "px-0.5"}`}>
                                    <h3 className="font-bold text-[13.5px] dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">{exp.name}</h3>

                                    <div className="flex flex-col text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        <p className="truncate">{exp.status === 'failed' ? exp.error_message || 'Video generation failed' : 'Shiksha GPT'}</p>
                                        <div className="flex items-center gap-1.5">
                                            <span>Just now</span>
                                            {(!exp.status || exp.status === 'completed') && (
                                                <>
                                                    <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-2.5 h-2.5" /> {exp.views_count}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}



            {/* Generate Explainer Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] w-screen h-screen"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[500px] bg-white dark:bg-[#1A1A1E] rounded-[32px] shadow-2xl z-[101] overflow-hidden border border-slate-200 dark:border-white/10"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold dark:text-white">Generate Explainer</h2>
                                        <p className="text-slate-500 text-sm">Tell us what you want to learn about</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 dark:text-white" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            What should this explainer cover?
                                        </label>
                                        <textarea
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none dark:text-white text-sm resize-none h-32"
                                            placeholder="e.g. Explaining Newton's Second Law of Motion (F=ma) with simple examples"
                                            value={explainerPrompt}
                                            onChange={(e) => setExplainerPrompt(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">
                                        AI will generate a visual guide and script based on your description.
                                    </p>
                                </div>

                                <button
                                    onClick={handleGenerateExplainer}
                                    disabled={!explainerPrompt.trim() || isGenerating}
                                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold mt-8 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Generating Explainer...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Create Explainer
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
