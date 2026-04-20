"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Info, Shield, List, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "@/app/context/SidebarContext";

interface ElementData {
    name: string;
    symbol: string;
    number: number;
    atomic_mass: number;
    category: string;
    phase: string;
    xpos: number;
    ypos: number;
    electron_configuration: string;
    shells: number[];
    summary: string;
    boil: number;
    density: number;
    bohr_model_image: string;
    block: string;
}

const CATEGORIES = [
    "Alkali Metal", "Alkaline Earth", "Transition Metal", "Post-Transition",
    "Metalloid", "Other Nonmetal", "Halogen", "Noble Gas",
    "Lanthanides", "Actinides"
];

const getDisplayCategory = (el: ElementData) => {
    const c = el.category.toLowerCase();
    if (c.includes("alkali") && !c.includes("earth")) return "Alkali Metal";
    if (c.includes("alkaline earth")) return "Alkaline Earth";
    if (c.includes("lanthanide")) return "Lanthanides";
    if (c.includes("actinide")) return "Actinides";
    if (c.includes("post-transition")) return "Post-Transition";
    if (c.includes("transition")) return "Transition Metal";
    if (c.includes("metalloid")) return "Metalloid";
    if (c.includes("noble gas")) return "Noble Gas";
    if (el.number === 117 || el.number === 85 || c.includes("halogen") || el.xpos === 17) return "Halogen";
    return "Other Nonmetal";
};

const getCategoryStyles = (normalizedCategory: string) => {
    switch (normalizedCategory) {
        case "Alkali Metal": return { bg: "bg-[#FFEBEE] dark:bg-[#C62828]/20", border: "border-[#FFCDD2] dark:border-[#C62828]/30", text: "text-[#C62828] dark:text-[#E57373]", dot: "bg-[#C62828] dark:bg-[#E57373]" };
        case "Alkaline Earth": return { bg: "bg-[#FFF3E0] dark:bg-[#E65100]/20", border: "border-[#FFE0B2] dark:border-[#E65100]/30", text: "text-[#E65100] dark:text-[#FFB74D]", dot: "bg-[#E65100] dark:bg-[#FFB74D]" };
        case "Transition Metal": return { bg: "bg-[#FEFCE8] dark:bg-[#EAB308]/20", border: "border-[#FEF08A] dark:border-[#EAB308]/30", text: "text-[#CA8A04] dark:text-[#FDE047]", dot: "bg-[#EAB308] dark:bg-[#FDE047]" };
        case "Post-Transition": return { bg: "bg-[#E1F5FE] dark:bg-[#0277BD]/20", border: "border-[#B3E5FC] dark:border-[#0277BD]/30", text: "text-[#0277BD] dark:text-[#4FC3F7]", dot: "bg-[#0277BD] dark:bg-[#4FC3F7]" };
        case "Metalloid": return { bg: "bg-[#E0F2F1] dark:bg-[#00695C]/20", border: "border-[#B2DFDB] dark:border-[#00695C]/30", text: "text-[#00695C] dark:text-[#4DB6AC]", dot: "bg-[#00695C] dark:bg-[#4DB6AC]" };
        case "Halogen": return { bg: "bg-[#F9FBE7] dark:bg-[#AFB42B]/20", border: "border-[#F0F4C3] dark:border-[#AFB42B]/30", text: "text-[#AFB42B] dark:text-[#D4E157]", dot: "bg-[#AFB42B] dark:bg-[#D4E157]" };
        case "Noble Gas": return { bg: "bg-[#F3E5F5] dark:bg-[#6A1B9A]/20", border: "border-[#E1BEE7] dark:border-[#6A1B9A]/30", text: "text-[#6A1B9A] dark:text-[#BA68C8]", dot: "bg-[#6A1B9A] dark:bg-[#BA68C8]" };
        case "Lanthanides": return { bg: "bg-[#E8EAF6] dark:bg-[#3949AB]/20", border: "border-[#C5CAE9] dark:border-[#3949AB]/30", text: "text-[#3949AB] dark:text-[#7986CB]", dot: "bg-[#3949AB] dark:bg-[#7986CB]" };
        case "Actinides": return { bg: "bg-[#E0F7FA] dark:bg-[#0097A7]/20", border: "border-[#B2EBF2] dark:border-[#0097A7]/30", text: "text-[#0097A7] dark:text-[#4DD0E1]", dot: "bg-[#0097A7] dark:bg-[#4DD0E1]" };
        case "Other Nonmetal": default: return { bg: "bg-[#E8F5E9] dark:bg-[#2E7D32]/20", border: "border-[#C8E6C9] dark:border-[#2E7D32]/30", text: "text-[#2E7D32] dark:text-[#81C784]", dot: "bg-[#2E7D32] dark:bg-[#81C784]" };
    }
};

export default function PeriodicTablePage() {
    const { setOpen } = useSidebar();
    const [elements, setElements] = useState<ElementData[]>([]);
    const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activePhaseFilter, setActivePhaseFilter] = useState<string | null>(null);
    const [activeBlockFilter, setActiveBlockFilter] = useState<string | null>(null);
    const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);

    useEffect(() => {
        // Auto-collapse the global sidebar only on initial mount to ensure max screen real-estate.
        // We explicitly ignore the setOpen dependency to prevent it from auto-closing when the user manually toggles it later.
        setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetch("/PeriodicTableJSON.json")
            .then(res => res.json())
            .then(data => {
                setElements(data.elements);
                setSelectedElement(data.elements[0]);
            })
            .catch(err => console.error("Failed to fetch periodic table data:", err));
    }, []);

    const renderGrid = () => {
        if (!elements.length) return <div className="p-8 text-center animate-pulse">Loading Periodic Table...</div>;

        return (
            <div
                className="w-full min-w-[700px] md:min-w-[850px] xl:min-w-full grid gap-1 py-4 pr-2 sm:pr-4"
                style={{
                    gridTemplateColumns: `54px repeat(18, minmax(0, 1fr))`,
                    gridTemplateRows: `42px repeat(10, minmax(0, 1fr))`
                }}
            >
                {/* Top Left Corner Empty */}
                <div style={{ gridColumn: 1, gridRow: 1 }} className="flex flex-col text-[10px] text-slate-400 items-end justify-end pr-0.5 pb-1.5 leading-[1.2]">
                    <span className="text-right whitespace-nowrap translate-x-1">Group &rarr;</span>
                    <span className="text-right whitespace-nowrap translate-x-1">&darr; Period</span>
                </div>

                {/* Group Headers */}
                {Array.from({ length: 18 }).map((_, i) => (
                    <div
                        key={`group-${i + 1}`}
                        className="flex items-center justify-center text-[11px] font-bold text-slate-400 dark:text-slate-500"
                        style={{ gridColumn: i + 2, gridRow: 1 }}
                    >
                        {i + 1}
                    </div>
                ))}

                {/* Period Headers */}
                {Array.from({ length: 7 }).map((_, i) => (
                    <div
                        key={`period-${i + 1}`}
                        className="flex items-center justify-end pr-3 text-[11px] font-bold text-slate-400 dark:text-slate-500"
                        style={{ gridColumn: 1, gridRow: i + 2 }}
                    >
                        {i + 1}
                    </div>
                ))}

                {/* Lanthanides / Actinides Labels */}
                <div className="flex items-center justify-end pr-3 text-[10px] font-bold text-slate-400 dark:text-slate-500" style={{ gridColumn: '1 / span 3', gridRow: 10 }}>
                    * Lanthanides
                </div>
                <div className="flex items-center justify-end pr-3 text-[10px] font-bold text-slate-400 dark:text-slate-500" style={{ gridColumn: '1 / span 3', gridRow: 11 }}>
                    ** Actinides
                </div>

                {/* Category Legend Area inside Grid */}
                <div
                    className="flex flex-wrap gap-1.5 content-start pt-10 px-1 lg:px-2 z-20 pointer-events-none"
                    style={{ gridColumn: '4 / span 9', gridRow: '2 / span 3' }}
                >
                    {CATEGORIES.map(cat => {
                        const styles = getCategoryStyles(cat);
                        const isActive = activeCategoryFilter === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategoryFilter(prev => prev === cat ? null : cat);
                                    setActivePhaseFilter(null);
                                    setActiveBlockFilter(null);
                                }}
                                className={`pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold transition-all border ${isActive ? `${styles.bg} ${styles.border} ${styles.text} ring-1 ring-current shadow-sm scale-105` : 'bg-slate-50/50 dark:bg-[#1A1A1E]/50 border-slate-200/60 dark:border-slate-800/60 text-slate-500 hover:bg-white dark:hover:bg-[#25252A]'}`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Legend Area inside Grid */}
                <div
                    className="flex justify-end items-start pt-1 pr-2 z-20 pointer-events-none"
                    style={{ gridColumn: '3 / span 16', gridRow: 2 }}
                >
                    <div className="pointer-events-auto flex items-center gap-2 text-[9px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-[#1A1A1E] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <button
                            onClick={() => { setActivePhaseFilter(prev => prev === 'Solid' ? null : 'Solid'); setActiveBlockFilter(null); setActiveCategoryFilter(null); }}
                            className={`flex items-center gap-1 transition-all px-1.5 py-0.5 rounded ${activePhaseFilter === 'Solid' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30' : 'hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Solid
                        </button>
                        <button
                            onClick={() => { setActivePhaseFilter(prev => prev === 'Liquid' ? null : 'Liquid'); setActiveBlockFilter(null); setActiveCategoryFilter(null); }}
                            className={`flex items-center gap-1 transition-all px-1.5 py-0.5 rounded ${activePhaseFilter === 'Liquid' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/30' : 'hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Liquid
                        </button>
                        <button
                            onClick={() => { setActivePhaseFilter(prev => prev === 'Gas' ? null : 'Gas'); setActiveBlockFilter(null); setActiveCategoryFilter(null); }}
                            className={`flex items-center gap-1 transition-all px-1.5 py-0.5 rounded ${activePhaseFilter === 'Gas' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30' : 'hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Gas
                        </button>
                        <div className="w-px h-2.5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-400 dark:text-slate-500">Blocks:</span>
                            <div className="flex gap-0.5">
                                {['s', 'p', 'd', 'f'].map((b) => (
                                    <button
                                        key={b}
                                        onClick={() => {
                                            setActiveBlockFilter(prev => prev === b ? null : b);
                                            setActivePhaseFilter(null);
                                            setActiveCategoryFilter(null);
                                        }}
                                        className={`flex flex-col items-center justify-center w-[18px] h-[18px] transition-all rounded-[4px] font-black uppercase text-[9px] ${activeBlockFilter === b ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/50 shadow-sm' : 'bg-slate-100 dark:bg-[#25252A] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'}`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Elements */}
                {elements.map((el) => {
                    const normCat = getDisplayCategory(el);
                    const colors = getCategoryStyles(normCat);
                    const isSelected = selectedElement?.number === el.number;
                    const isHighlightedByFilter = (activePhaseFilter === el.phase) || (activeBlockFilter === el.block) || (activeCategoryFilter === normCat);
                    const isMutedByFilter = (activePhaseFilter || activeBlockFilter || activeCategoryFilter) && !isHighlightedByFilter;

                    let filterClasses = '';
                    if (isMutedByFilter) filterClasses = 'opacity-20 grayscale scale-[0.98]';
                    if (isHighlightedByFilter) filterClasses = 'scale-110 shadow-lg ring-1 ring-current z-10';

                    return (
                        <button
                            key={el.number}
                            onClick={() => setSelectedElement(el)}
                            className={`relative aspect-[1/1.05] p-0.5 rounded-[4px] border flex flex-col items-center justify-center transition-all duration-300 
                                ${colors.bg} ${isSelected ? 'border-primary ring-2 ring-primary/30 scale-110 z-20 shadow-xl' : `${colors.border} hover:scale-105 hover:shadow-md hover:z-10`} ${filterClasses}`}
                            style={{
                                gridColumn: el.xpos + 1,
                                gridRow: el.ypos + 1
                            }}
                        >
                            <span className={`absolute top-0.5 left-1 text-[7px] font-bold ${colors.text}`}>{el.number}</span>
                            <span className={`text-sm sm:text-base font-black ${colors.text} leading-none mt-1`}>{el.symbol}</span>
                            <span className={`text-[6px] sm:text-[7px] font-medium ${colors.text} truncate w-full px-0.5 opacity-80 leading-tight mt-0.5`}>{el.name}</span>
                        </button>
                    )
                })}
            </div>
        );
    };

    return (
        <div className="min-h-full lg:min-h-0 flex flex-col lg:flex-row gap-4 animate-in fade-in duration-500 pb-2">
            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center gap-4 mb-2 cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-max">
                    <Link href="/app/lab" className="flex items-center gap-2 font-medium text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Lab
                    </Link>
                </div>

                <div className="px-2 mb-3">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Virtual Periodic Table</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs w-full lg:max-w-max truncate">
                        Explore the building blocks of the universe in our simulated laboratory environment.
                    </p>
                </div>

                {/* Table Viewport */}
                <div className="flex-1 bg-white dark:bg-[#1A1A1E] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto pb-4 custom-scrollbar">
                    {renderGrid()}
                </div>
            </div>

            {/* Right Sidebar Inspected Element */}
            {selectedElement && (
                <div className={`shrink-0 bg-white dark:bg-[#1A1A1E] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-max overflow-hidden relative transition-all duration-300 ${isSidebarCollapsed ? 'w-14 p-2 items-center justify-start min-h-[100px]' : 'w-full lg:w-[300px] xl:w-[350px] p-3 lg:p-4'}`}>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className={`z-20 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors ${isSidebarCollapsed ? 'mt-2' : 'absolute top-4 left-4'}`}
                        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isSidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>

                    {!isSidebarCollapsed && (
                        <>
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 dark:from-indigo-900/10 to-transparent pointer-events-none" />

                            <div className="text-center space-y-3 relative z-10 pt-2 lg:pt-4">
                                <span className="inline-block px-3 py-1 bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                                    Currently Inspected
                                </span>

                                <div className="flex flex-col items-center justify-center gap-1.5">
                                    <h2 className="text-5xl font-black text-slate-800 dark:text-white leading-none">
                                        {selectedElement.symbol}
                                    </h2>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{selectedElement.name}</h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Atomic Weight: {selectedElement.atomic_mass} u</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center justify-center gap-6 mt-8 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <button className="text-sm font-bold text-primary border-b-2 border-primary pb-4 -mb-[17px]">Overview</button>
                                <button className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pb-4 -mb-[17px]">Properties</button>
                                <button className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 pb-4 -mb-[17px]">Safety</button>
                            </div>

                            {/* Bohr Model Card */}
                            <div className="bg-[#0D1117] rounded-3xl p-3 lg:p-4 mb-5 relative overflow-hidden flex flex-col items-center justify-between min-h-[300px] group">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 to-indigo-500/10" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-sky-500/20 blur-2xl rounded-full pointer-events-none" />

                                {/* 3Dish representation of bohr model */}
                                <div className="relative z-10 w-full flex-1 flex items-center justify-center mt-2">
                                    {selectedElement.shells.map((numElectrons: number, i: number) => {
                                        const shellSize = 60 + (i * 26);
                                        const halfWidth = shellSize / 2;
                                        const colors = [
                                            'border-sky-400/30',
                                            'border-indigo-400/40',
                                            'border-violet-400/50',
                                            'border-sky-400/30',
                                            'border-indigo-400/40',
                                            'border-violet-400/50',
                                            'border-sky-400/30'
                                        ];
                                        const colorClass = colors[i % colors.length];
                                        const spinDurations = [
                                            "animate-[spin_8s_linear_infinite]",
                                            "animate-[spin_12s_linear_infinite_reverse]",
                                            "animate-[spin_16s_linear_infinite]",
                                            "animate-[spin_20s_linear_infinite_reverse]",
                                            "animate-[spin_24s_linear_infinite]",
                                            "animate-[spin_28s_linear_infinite_reverse]",
                                            "animate-[spin_32s_linear_infinite]"
                                        ];
                                        const spinClass = spinDurations[i % spinDurations.length];

                                        return (
                                            <div
                                                key={i}
                                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] flex items-center justify-center ${colorClass} ${spinClass}`}
                                                style={{ width: `${shellSize}px`, height: `${shellSize}px` }}
                                            >
                                                {Array.from({ length: numElectrons }).map((_, eIndex) => {
                                                    const angle = (360 / numElectrons) * eIndex;
                                                    return (
                                                        <div
                                                            key={eIndex}
                                                            className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
                                                            style={{
                                                                top: '50%',
                                                                left: '50%',
                                                                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${halfWidth}px)`
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}

                                    {/* Nucleus */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#0D1117] rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)] border border-sky-400/30 flex items-center justify-center z-20">
                                        <span className="text-white font-bold text-lg">{selectedElement.symbol}</span>
                                    </div>
                                </div>

                                {/* Electrons per shell breakdown */}
                                <div className="relative z-20 mt-6 text-center pb-1 w-full flex items-center justify-center whitespace-nowrap px-1 scrollbar-hide overflow-x-auto overflow-y-hidden text-clip">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-normal mr-1.5 shrink-0">Electrons per shell:</span>
                                    <span className="text-[10px] font-bold text-sky-100 tracking-wide whitespace-nowrap">{selectedElement.shells.join(', ')}</span>
                                </div>
                            </div>

                            {/* Properties List */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/50 border-dashed">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Category</span>
                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 capitalize">{selectedElement.category}</span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/50 border-dashed">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Configuration</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedElement.electron_configuration}</span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/50 border-dashed">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Standard Phase</span>
                                    <span className={`text-sm font-bold flex items-center gap-1.5 ${selectedElement.phase === 'Gas' ? 'text-rose-500' :
                                        selectedElement.phase === 'Liquid' ? 'text-orange-500' : 'text-blue-500'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full ${selectedElement.phase === 'Gas' ? 'bg-rose-500' :
                                            selectedElement.phase === 'Liquid' ? 'bg-orange-500' : 'bg-blue-500'
                                            }`} />
                                        {selectedElement.phase}
                                    </span>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-4 mb-6 border border-indigo-100/50 dark:border-indigo-900/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <List className="w-4 h-4 text-indigo-500" />
                                    <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Summary</h4>
                                </div>
                                <p className="text-sm text-indigo-900/70 dark:text-indigo-200/70 leading-relaxed font-medium">
                                    {selectedElement.summary}
                                </p>
                            </div>

                            <button className="mt-auto w-full flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors py-4 rounded-2xl font-bold">
                                View Interactive Simulation <ArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
