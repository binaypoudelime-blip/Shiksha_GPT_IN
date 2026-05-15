"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, Settings2, Palette, Sun, Monitor, Printer, CloudRain, Eye, EyeOff, Sparkles
} from "lucide-react";
import Link from "next/link";
import chroma from "chroma-js";

type BlendMode = "additive" | "subtractive" | "cmyk";
type ColorDeficiency = "none" | "protanopia" | "deuteranopia" | "tritanopia";

const PaintTube = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 drop-shadow-sm opacity-90" style={{ color }}>
        <path d="M9 2h6v2H9z" />
        <path d="M8 4h8l1 4H7l1-4z" />
        <path d="M7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8z" />
        <path d="M7 16h10v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4z" fill="currentColor" stroke="none" />
    </svg>
);

const InkBottle = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 drop-shadow-sm opacity-90" style={{ color }}>
        <path d="M11 2h2v3h-2z" />
        <path d="M9 5h6v3H9z" />
        <path d="M8 8h8l1.5 3v9a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-9L8 8z" />
        <path d="M6.5 15h11v5a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-5z" fill="currentColor" stroke="none" />
    </svg>
);

export default function ColorCanvasLab() {
    const [mode, setMode] = useState<BlendMode>("additive");
    const [deficiency, setDeficiency] = useState<ColorDeficiency>("none");

    const [val1, setVal1] = useState(255); // R or C
    const [val2, setVal2] = useState(255); // G or M
    const [val3, setVal3] = useState(255); // B or Y
    const [val4, setVal4] = useState(0);   // K

    // Math for resulting colors
    let r = 0, g = 0, b = 0;
    if (mode === "additive") {
        r = val1;
        g = val2;
        b = val3;
    } else if (mode === "subtractive") {
        r = 255 - val1;
        g = 255 - val2;
        b = 255 - val3;
    } else { // cmyk
        const c = val1 / 255;
        const m = val2 / 255;
        const y = val3 / 255;
        const k = val4 / 255;
        r = Math.round(255 * (1 - c) * (1 - k));
        g = Math.round(255 * (1 - m) * (1 - k));
        b = Math.round(255 * (1 - y) * (1 - k));
    }
    const resultColor = `rgb(${r}, ${g}, ${b})`;

    const hexCode = chroma(resultColor).hex().toUpperCase();
    const compChroma = chroma(resultColor).set('hsl.h', '+180');
    const compColor = compChroma.hex().toUpperCase();
    const [compR, compG, compB] = compChroma.rgb();

    const getWavelength = (colorType: string, val: number) => {
        if (val === 0) return "0 nm";
        if (colorType === 'R') return "~650 nm (Long)";
        if (colorType === 'G') return "~532 nm (Medium)";
        if (colorType === 'B') return "~450 nm (Short)";
        if (colorType === 'C') return "~490 nm";
        if (colorType === 'M') return "Non-spectral (Mix)";
        if (colorType === 'Y') return "~570 nm";
        return "";
    };

    const bgColor = "bg-transparent";
    const textColor = "text-slate-800 dark:text-slate-200";
    const cardBg = "bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-none";
    const borderColor = "border-slate-200 dark:border-white/10";

    const label1 = mode === "additive" ? "Red" : "Cyan";
    const label2 = mode === "additive" ? "Green" : "Magenta";
    const label3 = mode === "additive" ? "Blue" : "Yellow";

    return (
        <div className={`min-h-screen transition-colors duration-500 ${bgColor} ${textColor} relative overflow-hidden font-sans`}>
            {/* Purple Dotted Background */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(236,72,153,0.2) 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />


            {/* SVG Filters for Color Blindness */}
            <svg width="0" height="0" className="hidden">
                <filter id="protanopia">
                    <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
                </filter>
                <filter id="deuteranopia">
                    <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
                </filter>
                <filter id="tritanopia">
                    <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
                </filter>
            </svg>

            <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/app/lab/creative-lab"
                        className={`flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors group`}
                    >
                        <div className={`w-10 h-10 rounded-full ${cardBg} border ${borderColor} flex items-center justify-center group-hover:-translate-x-2 transition-transform`}>
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        Back to Creative Lab
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/app/lab/creative-lab/arto"
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2`}
                        >
                            <Palette className="w-4 h-4" /> Arto
                        </Link>
                        <div className={`flex items-center gap-1 p-1 rounded-full ${cardBg} border ${borderColor}`}>
                            <button
                                onClick={() => setMode("additive")}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${mode === "additive" ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-md" : "text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white"}`}
                            >
                                <Sun className="w-4 h-4 inline-block mr-1" /> RGB
                            </button>
                            <button
                                onClick={() => setMode("subtractive")}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${mode === "subtractive" ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-md" : "text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white"}`}
                            >
                                <Printer className="w-4 h-4 inline-block mr-1" /> CMY
                            </button>
                            <button
                                onClick={() => setMode("cmyk")}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${mode === "cmyk" ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-md" : "text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white"}`}
                            >
                                <Printer className="w-4 h-4 inline-block mr-1" /> CMYK
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
                    {/* Visualizer (Now order-2) */}
                    <div className="lg:col-span-7 flex flex-col gap-4 lg:order-2">
                        {/* Main Venn Diagram */}
                        <div className={`relative aspect-square sm:aspect-video rounded-[32px] ${mode === "additive" ? "bg-black/90 dark:bg-black/40" : "bg-white/60 dark:bg-white/10"} backdrop-blur-xl border ${borderColor} overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-none flex items-center justify-center p-6`}>
                            <div
                                className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]"
                                style={{ filter: deficiency !== "none" ? `url(#${deficiency})` : "none" }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mode}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0"
                                    >
                                        {/* Circle 1 */}
                                        <div
                                            className={`absolute ${mode === "cmyk" ? "top-0 left-0 border border-black/20 dark:border-white/20" : "top-0 left-1/2 -translate-x-1/2"} w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full transition-colors duration-200`}
                                            style={{
                                                backgroundColor: mode === "additive" ? `rgb(${val1}, 0, 0)` : `rgb(${255 - val1}, 255, 255)`,
                                                mixBlendMode: mode === "additive" ? "screen" : "multiply"
                                            }}
                                        />
                                        {/* Circle 2 */}
                                        <div
                                            className={`absolute ${mode === "cmyk" ? "top-0 right-0 border border-black/20 dark:border-white/20" : "bottom-0 left-0"} w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full transition-colors duration-200`}
                                            style={{
                                                backgroundColor: mode === "additive" ? `rgb(0, ${val2}, 0)` : `rgb(255, ${255 - val2}, 255)`,
                                                mixBlendMode: mode === "additive" ? "screen" : "multiply"
                                            }}
                                        />
                                        {/* Circle 3 */}
                                        <div
                                            className={`absolute ${mode === "cmyk" ? "bottom-0 left-0 border border-black/20 dark:border-white/20" : "bottom-0 right-0"} w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full transition-colors duration-200`}
                                            style={{
                                                backgroundColor: mode === "additive" ? `rgb(0, 0, ${val3})` : `rgb(255, 255, ${255 - val3})`,
                                                mixBlendMode: mode === "additive" ? "screen" : "multiply"
                                            }}
                                        />
                                        {/* Circle 4 (Black) */}
                                        {mode === "cmyk" && (
                                            <div
                                                className="absolute bottom-0 right-0 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full border border-black/20 dark:border-white/20 transition-colors duration-200"
                                                style={{
                                                    backgroundColor: `rgba(0, 0, 0, ${val4 / 255})`,
                                                    mixBlendMode: "multiply"
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* CMYK Labels & Percentages */}
                                <AnimatePresence>
                                    {mode === "cmyk" && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 pointer-events-none z-30"
                                        >
                                            {/* Labels */}
                                            <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">C</div>
                                            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">M</div>
                                            <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">Y</div>
                                            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">K</div>

                                            {/* Percentages */}
                                            <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 text-sm sm:text-base font-bold text-slate-900 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
                                                {Math.round((val1 / 255) * 100)}%
                                            </div>
                                            <div className="absolute top-[20%] right-[20%] translate-x-1/2 -translate-y-1/2 text-sm sm:text-base font-bold text-slate-900 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
                                                {Math.round((val2 / 255) * 100)}%
                                            </div>
                                            <div className="absolute bottom-[20%] left-[20%] -translate-x-1/2 translate-y-1/2 text-sm sm:text-base font-bold text-slate-900 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
                                                {Math.round((val3 / 255) * 100)}%
                                            </div>
                                            <div className="absolute bottom-[20%] right-[20%] translate-x-1/2 translate-y-1/2 text-sm sm:text-base font-bold text-slate-900 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
                                                {Math.round((val4 / 255) * 100)}%
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Intersection Highlight Overlay (Mobile: 240px) */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none sm:hidden z-10 scale-[1.15] drop-shadow-2xl transition-all duration-300"
                                    viewBox="0 0 240 240"
                                    style={{ transformOrigin: mode === "cmyk" ? '50% 50%' : '50% 56%', filter: `drop-shadow(0 10px 15px ${mode === "additive" ? "rgba(255,255,255,0.15)" : mode === "cmyk" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"})` }}
                                >
                                    <defs>
                                        <clipPath id="clip1-tri-sm"><circle cx="120" cy="75" r="75" /></clipPath>
                                        <clipPath id="clip2-tri-sm"><circle cx="75" cy="165" r="75" /></clipPath>
                                        <clipPath id="clip3-tri-sm"><circle cx="165" cy="165" r="75" /></clipPath>

                                        <clipPath id="clip1-quad-sm"><circle cx="75" cy="75" r="75" /></clipPath>
                                        <clipPath id="clip2-quad-sm"><circle cx="165" cy="75" r="75" /></clipPath>
                                        <clipPath id="clip3-quad-sm"><circle cx="75" cy="165" r="75" /></clipPath>
                                        <clipPath id="clip4-quad-sm"><circle cx="165" cy="165" r="75" /></clipPath>
                                    </defs>
                                    {mode === "cmyk" ? (
                                        <g>
                                            <g clipPath="url(#clip1-quad-sm)">
                                                <g clipPath="url(#clip2-quad-sm)">
                                                    <g clipPath="url(#clip3-quad-sm)">
                                                        <g clipPath="url(#clip4-quad-sm)">
                                                            <rect x="0" y="0" width="100%" height="100%" fill={resultColor} className="transition-colors duration-200" />
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                            <g className="opacity-80">
                                                <g clipPath="url(#clip2-quad-sm)"><g clipPath="url(#clip3-quad-sm)"><g clipPath="url(#clip4-quad-sm)"><circle cx="75" cy="75" r="75" fill="none" stroke="#ffffff" strokeWidth="4" /></g></g></g>
                                                <g clipPath="url(#clip1-quad-sm)"><g clipPath="url(#clip3-quad-sm)"><g clipPath="url(#clip4-quad-sm)"><circle cx="165" cy="75" r="75" fill="none" stroke="#ffffff" strokeWidth="4" /></g></g></g>
                                                <g clipPath="url(#clip1-quad-sm)"><g clipPath="url(#clip2-quad-sm)"><g clipPath="url(#clip4-quad-sm)"><circle cx="75" cy="165" r="75" fill="none" stroke="#ffffff" strokeWidth="4" /></g></g></g>
                                                <g clipPath="url(#clip1-quad-sm)"><g clipPath="url(#clip2-quad-sm)"><g clipPath="url(#clip3-quad-sm)"><circle cx="165" cy="165" r="75" fill="none" stroke="#ffffff" strokeWidth="4" /></g></g></g>
                                            </g>
                                        </g>
                                    ) : (
                                        <g clipPath="url(#clip1-tri-sm)">
                                            <g clipPath="url(#clip2-tri-sm)">
                                                <g clipPath="url(#clip3-tri-sm)">
                                                    <rect x="0" y="0" width="100%" height="100%" fill={resultColor} className="transition-colors duration-200" />
                                                </g>
                                            </g>
                                        </g>
                                    )}
                                </svg>

                                {/* Intersection Highlight Overlay (Desktop: 280px) */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block z-10 scale-[1.15] drop-shadow-2xl transition-all duration-300"
                                    viewBox="0 0 280 280"
                                    style={{ transformOrigin: mode === "cmyk" ? '50% 50%' : '50% 56%', filter: `drop-shadow(0 10px 15px ${mode === "additive" ? "rgba(255,255,255,0.15)" : mode === "cmyk" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"})` }}
                                >
                                    <defs>
                                        <clipPath id="clip1-tri-md"><circle cx="140" cy="90" r="90" /></clipPath>
                                        <clipPath id="clip2-tri-md"><circle cx="90" cy="190" r="90" /></clipPath>
                                        <clipPath id="clip3-tri-md"><circle cx="190" cy="190" r="90" /></clipPath>

                                        <clipPath id="clip1-quad-md"><circle cx="90" cy="90" r="90" /></clipPath>
                                        <clipPath id="clip2-quad-md"><circle cx="190" cy="90" r="90" /></clipPath>
                                        <clipPath id="clip3-quad-md"><circle cx="90" cy="190" r="90" /></clipPath>
                                        <clipPath id="clip4-quad-md"><circle cx="190" cy="190" r="90" /></clipPath>
                                    </defs>
                                    {mode === "cmyk" ? (
                                        <g>
                                            <g clipPath="url(#clip1-quad-md)">
                                                <g clipPath="url(#clip2-quad-md)">
                                                    <g clipPath="url(#clip3-quad-md)">
                                                        <g clipPath="url(#clip4-quad-md)">
                                                            <rect x="0" y="0" width="100%" height="100%" fill={resultColor} className="transition-colors duration-200" />
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                            <g className="opacity-80">
                                                <g clipPath="url(#clip2-quad-md)"><g clipPath="url(#clip3-quad-md)"><g clipPath="url(#clip4-quad-md)"><circle cx="90" cy="90" r="90" fill="none" stroke="#ffffff" strokeWidth="4" /></g></g></g>
                                                <g clipPath="url(#clip1-quad-md)"><g clipPath="url(#clip3-quad-md)"><g clipPath="url(#clip4-quad-md)"><circle cx="190" cy="90" r="90" fill="none" stroke="#ffffff" strokeWidth="4" /></g></g></g>
                                                <g clipPath="url(#clip1-quad-md)"><g clipPath="url(#clip2-quad-md)"><g clipPath="url(#clip4-quad-md)"><circle cx="90" cy="190" r="90" fill="none" stroke="#ffffff" strokeWidth="4" /></g></g></g>
                                                <g clipPath="url(#clip1-quad-md)"><g clipPath="url(#clip2-quad-md)"><g clipPath="url(#clip3-quad-md)"><circle cx="190" cy="190" r="90" fill="none" stroke="#ffffff" strokeWidth="4" /></g></g></g>
                                            </g>
                                        </g>
                                    ) : (
                                        <g clipPath="url(#clip1-tri-md)">
                                            <g clipPath="url(#clip2-tri-md)">
                                                <g clipPath="url(#clip3-tri-md)">
                                                    <rect x="0" y="0" width="100%" height="100%" fill={resultColor} className="transition-colors duration-200" />
                                                </g>
                                            </g>
                                        </g>
                                    )}
                                </svg>
                            </div>
                        </div>

                        {/* Resulting Color Card */}
                        <div className={`p-5 rounded-[24px] ${cardBg} border ${borderColor} flex items-center justify-between`}>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-xl shadow-inner border border-slate-200/50 dark:border-white/10"
                                    style={{ backgroundColor: resultColor, filter: deficiency !== "none" ? `url(#${deficiency})` : "none" }}
                                />
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 mb-1">Resulting Color</div>
                                    <div className="text-xl font-black font-mono text-slate-800 dark:text-white leading-none">{hexCode}</div>
                                    <div className="text-[10px] font-bold font-mono text-slate-400 dark:text-white/40 mt-1.5">
                                        RGB({r}, {g}, {b})
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                                <div className="flex flex-col items-end">
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/50 mb-1">Complementary</div>
                                    <div className="text-lg font-black font-mono text-slate-800 dark:text-white leading-none">{compColor}</div>
                                    <div className="text-[10px] font-bold font-mono text-slate-400 dark:text-white/40 mt-1.5 mb-0.5">
                                        RGB({Math.round(compR)}, {Math.round(compG)}, {Math.round(compB)})
                                    </div>
                                    <div className="text-[9px] text-slate-400 dark:text-white/30 mt-1 max-w-[140px] leading-tight">
                                        Opposite on the color wheel. Created by inverting the current values.
                                    </div>
                                </div>
                                <div
                                    className="w-12 h-12 rounded-full shadow-inner shrink-0 border border-slate-200/50 dark:border-white/10"
                                    style={{ backgroundColor: compColor, filter: deficiency !== "none" ? `url(#${deficiency})` : "none" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Controls & Info (Now order-1) */}
                    <div className="lg:col-span-5 flex flex-col gap-4 lg:order-1">

                        {/* Sliders */}
                        <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Settings2 className="w-5 h-5 text-slate-400 dark:text-fuchsia-400" />
                                    <h3 className="text-lg font-bold tracking-tight">Intensity Controls</h3>
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Wavelength</div>
                            </div>

                            <div className="space-y-3">
                                {/* Slider 1 */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                        <span style={{ color: mode === "additive" ? '#ef4444' : '#06b6d4' }}>{label1}</span>
                                        <span className="opacity-50 text-[10px]">{getWavelength(mode === "additive" ? 'R' : 'C', val1)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {mode === "additive" ? <PaintTube color="#ef4444" /> : <InkBottle color="#06b6d4" />}
                                        <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">{mode === "additive" ? "0" : "0.0"}</span>
                                        <input
                                            type="range" min="0" max="255" value={val1}
                                            onChange={(e) => setVal1(Number(e.target.value))}
                                            className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${mode === "additive" ? "bg-red-100 dark:bg-red-500/20 accent-red-500" : "bg-cyan-100 dark:bg-cyan-500/20 accent-cyan-500"}`}
                                        />
                                        <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">{mode === "additive" ? "255" : "1.0"}</span>
                                    </div>
                                </div>
                                {/* Slider 2 */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                        <span style={{ color: mode === "additive" ? '#22c55e' : '#d946ef' }}>{label2}</span>
                                        <span className="opacity-50 text-[10px]">{getWavelength(mode === "additive" ? 'G' : 'M', val2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {mode === "additive" ? <PaintTube color="#22c55e" /> : <InkBottle color="#d946ef" />}
                                        <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">{mode === "additive" ? "0" : "0.0"}</span>
                                        <input
                                            type="range" min="0" max="255" value={val2}
                                            onChange={(e) => setVal2(Number(e.target.value))}
                                            className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${mode === "additive" ? "bg-green-100 dark:bg-green-500/20 accent-green-500" : "bg-fuchsia-100 dark:bg-fuchsia-500/20 accent-fuchsia-500"}`}
                                        />
                                        <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">{mode === "additive" ? "255" : "1.0"}</span>
                                    </div>
                                </div>
                                {/* Slider 3 */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                        <span style={{ color: mode === "additive" ? '#3b82f6' : '#eab308' }}>{label3}</span>
                                        <span className="opacity-50 text-[10px]">{getWavelength(mode === "additive" ? 'B' : 'Y', val3)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {mode === "additive" ? <PaintTube color="#3b82f6" /> : <InkBottle color="#eab308" />}
                                        <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">{mode === "additive" ? "0" : "0.0"}</span>
                                        <input
                                            type="range" min="0" max="255" value={val3}
                                            onChange={(e) => setVal3(Number(e.target.value))}
                                            className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${mode === "additive" ? "bg-blue-100 dark:bg-blue-500/20 accent-blue-500" : "bg-yellow-100 dark:bg-yellow-500/20 accent-yellow-500"}`}
                                        />
                                        <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">{mode === "additive" ? "255" : "1.0"}</span>
                                    </div>
                                </div>

                                {/* Slider 4 */}
                                {mode === "cmyk" && (
                                    <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/5">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                            <span style={{ color: '#1e293b' }} className="dark:text-slate-300">Key (Black)</span>
                                            <span className="opacity-50 text-[10px]">Shadows</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <InkBottle color="#1e293b" />
                                            <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">0.0</span>
                                            <input
                                                type="range" min="0" max="255" value={val4}
                                                onChange={(e) => setVal4(Number(e.target.value))}
                                                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-slate-800 dark:accent-slate-300"
                                            />
                                            <span className="text-[10px] font-mono text-slate-400 font-bold whitespace-nowrap">1.0</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Current Values Display */}
                            <div className="mt-6 flex justify-center">
                                <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold text-slate-500 dark:text-white/70 shadow-inner">
                                    {mode === "additive" ? (
                                        `R=${val1} G=${val2} B=${val3}`
                                    ) : mode === "subtractive" ? (
                                        `C=${(val1 / 255).toFixed(1)} M=${(val2 / 255).toFixed(1)} Y=${(val3 / 255).toFixed(1)}`
                                    ) : (
                                        `C=${(val1 / 255).toFixed(1)} M=${(val2 / 255).toFixed(1)} Y=${(val3 / 255).toFixed(1)} K=${(val4 / 255).toFixed(1)}`
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Accessibility / Empathy */}
                        <div className={`p-5 rounded-[24px] ${cardBg} border ${borderColor}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <Eye className="w-4 h-4 text-slate-400" />
                                <h3 className="font-bold text-sm">Color Vision Simulation</h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-white/50 mb-4 leading-relaxed">
                                Experience how these colors appear to people with different types of <strong className="text-fuchsia-500 dark:text-fuchsia-400 font-bold">color vision deficiency (CVD) or color blindness.</strong>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {(["none", "protanopia", "deuteranopia", "tritanopia"] as ColorDeficiency[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setDeficiency(type)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${deficiency === type ? "bg-slate-900 dark:bg-white text-white dark:text-black" : `bg-white/50 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-white/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10`}`}
                                    >
                                        {type === "none" ? "Normal Vision" : type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Educational Narrative */}
                        <div className={`p-5 rounded-[24px] ${mode === "additive" ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20" : "bg-fuchsia-50 dark:bg-fuchsia-500/10 border-fuchsia-100 dark:border-fuchsia-500/20"} backdrop-blur-xl border`}>
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-indigo-900 dark:text-white">
                                <Sparkles className={`w-4 h-4 ${mode === "additive" ? "text-indigo-500 dark:text-indigo-400" : "text-fuchsia-500 dark:text-fuchsia-400"}`} />
                                How do we see color?
                            </h3>
                            {mode === "additive" ? (
                                <div className="space-y-4 text-sm dark:text-xs opacity-80 leading-relaxed text-indigo-900 dark:text-white/70">
                                    <p>
                                        <strong>Mixing Light:</strong> You are currently mixing pure light. When all three primary colors (Red, Green, Blue) shine at full intensity, they combine to create pure <strong className="dark:text-white">White</strong>.
                                    </p>
                                    <div className="flex items-start gap-3 mt-4">
                                        <Monitor className={`w-5 h-5 shrink-0 mt-0.5 text-indigo-500 dark:text-indigo-400`} />
                                        <p><strong>The Mobile Screen:</strong> The screen you are looking at uses millions of tiny RGB LEDs. When you see yellow on your screen, it's actually just the Red and Green LEDs glowing very closely together!</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Sun className={`w-5 h-5 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400`} />
                                        <p><strong>Perception:</strong> An object appears red because it absorbs all other wavelengths of light and only reflects red light into your eyes.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 text-sm dark:text-xs opacity-80 leading-relaxed text-indigo-900 dark:text-white/70">
                                    <p>
                                        <strong>Mixing Paint:</strong> You are now mixing pigments (ink/paint). Unlike light, pigments <em>absorb</em> light. When you mix Cyan, Magenta, and Yellow, they absorb all light, resulting in <strong className="dark:text-white">Black</strong>.
                                    </p>
                                    <div className="flex items-start gap-3 mt-4">
                                        <Printer className={`w-5 h-5 shrink-0 mt-0.5 text-indigo-500 dark:text-fuchsia-400`} />
                                        <p><strong>The Printing Press:</strong> Your textbooks and magazines are printed using CMYK dots. Cyan, Magenta, Yellow, and a "Key" (Black) plate combine to reproduce full-color images.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Palette className={`w-5 h-5 shrink-0 mt-0.5 text-pink-500 dark:text-pink-400`} />
                                        <p><strong>Subtractive Process:</strong> Yellow paint looks yellow because it absorbs blue light and reflects green and red (which your brain mixes to see yellow).</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Subtractive Color Theory Section */}
                {mode !== "additive" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${cardBg} border ${borderColor}`}>
                                <Printer className="w-5 h-5 text-fuchsia-500" />
                            </div>
                            Subtractive Color Models Theory
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                                <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                                    CMY Color Model
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    The CMY color model consists of cyan (C), magenta (M), and yellow (Y) inks and is a subtractive color model, meaning colors are created by subtracting light from a white background. In theory, combining 100% of cyan, magenta, and yellow should produce black. However, in practice, mixing these three inks produces a dark brown or muddy color rather than a true black due to limitations in ink pigments. CMY is often used in tri-color printing and is sometimes called a tri-color ink system.
                                </p>
                            </div>
                            <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                                <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-200"></span>
                                    CMYK Color Model
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    The CMYK color model adds black (K, key) to the CMY model. Black ink is included for several practical reasons: it produces true black, improves contrast and sharpness for text and outlines, reduces the amount of colored ink needed, and prevents paper distortion from excessive ink. In CMYK, black is represented as 100% K with 0% C, M, and Y, whereas in CMY, black would theoretically be 100% of all three colors.
                                </p>
                            </div>
                            <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                                <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Key Differences</h3>
                                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mt-1.5 shrink-0"></div>
                                        <div><strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Number of inks:</strong> CMY uses three inks; CMYK uses four.</div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mt-1.5 shrink-0"></div>
                                        <div><strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Black reproduction:</strong> CMY approximates black by mixing C, M, and Y; CMYK uses dedicated black ink for consistent dark tones.</div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mt-1.5 shrink-0"></div>
                                        <div><strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Printing efficiency:</strong> CMYK reduces ink consumption and drying time compared to CMY.</div>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mt-1.5 shrink-0"></div>
                                        <div><strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Color accuracy:</strong> CMYK provides more precise and richer dark colors, especially for text and detailed graphics.</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* General Color Theory Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 mb-12"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${cardBg} border ${borderColor}`}>
                            <Palette className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        Color Theory Fundamentals
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Primary Colors */}
                        <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                            <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200">1. Primary Colors</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                These are base colors that cannot be made by mixing others.
                            </p>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <strong className="text-slate-700 dark:text-slate-300 block mb-2">Traditional art model:</strong>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 rounded-md text-xs font-bold border border-red-200 dark:border-red-500/30">Red</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 rounded-md text-xs font-bold border border-blue-200 dark:border-blue-500/30">Blue</span>
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 rounded-md text-xs font-bold border border-yellow-200 dark:border-yellow-500/30">Yellow</span>
                                    </div>
                                </div>
                                <div>
                                    <strong className="text-slate-700 dark:text-slate-300 block mb-2">Digital/light model (RGB):</strong>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 rounded-md text-xs font-bold border border-red-200 dark:border-red-500/30">Red</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 rounded-md text-xs font-bold border border-green-200 dark:border-green-500/30">Green</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 rounded-md text-xs font-bold border border-blue-200 dark:border-blue-500/30">Blue</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Secondary Colors */}
                        <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                            <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200">2. Secondary Colors</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Made by mixing two primary colors.
                            </p>
                            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <span>Red + Blue</span>
                                    <span className="font-bold text-purple-600 dark:text-purple-400">Purple</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <span>Blue + Yellow</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">Green</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <span>Yellow + Red</span>
                                    <span className="font-bold text-orange-600 dark:text-orange-400">Orange</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Tertiary Colors */}
                        <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                            <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200">3. Tertiary Colors</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Made by mixing a primary and a secondary color.
                            </p>
                            <div className="flex flex-wrap gap-2 text-sm mt-6">
                                <span className="px-3 py-1.5 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300 rounded-lg font-medium border border-teal-200 dark:border-teal-500/30">Blue-green</span>
                                <span className="px-3 py-1.5 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300 rounded-lg font-medium border border-orange-200 dark:border-orange-500/30">Red-orange</span>
                                <span className="px-3 py-1.5 bg-lime-50 text-lime-700 dark:bg-lime-500/10 dark:text-lime-300 rounded-lg font-medium border border-lime-200 dark:border-lime-500/30">Yellow-green</span>
                            </div>
                        </div>

                        {/* Color Harmony */}
                        <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                            <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200">Color Harmony</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                A visually pleasing arrangement of colors based on geometric relationships on the color wheel. Harmonious palettes guide the viewer's eye and create a sense of order.
                            </p>
                            <div className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <strong className="block text-slate-800 dark:text-slate-200 mb-1">Example: Complementary Harmony</strong>
                                <span className="text-slate-600 dark:text-slate-400">Blue and Orange. Placing these opposites together creates maximum contrast and vibrant energy.</span>
                            </div>
                        </div>

                        {/* Analogous Colors */}
                        <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                            <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200">Analogous Colors</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                Groups of usually three colors that sit right next to each other on the color wheel. They share a common hue and create rich, monochromatic-like designs.
                            </p>
                            <div className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                <strong className="block text-slate-800 dark:text-slate-200 mb-2">Example Palette:</strong>
                                <div className="flex gap-2">
                                    <span className="w-6 h-6 rounded-full bg-red-500 shadow-sm border border-black/10"></span>
                                    <span className="w-6 h-6 rounded-full bg-orange-500 shadow-sm border border-black/10"></span>
                                    <span className="w-6 h-6 rounded-full bg-yellow-500 shadow-sm border border-black/10"></span>
                                </div>
                                <span className="block mt-3 text-slate-600 dark:text-slate-400">Red, Orange, and Yellow (often found in autumn leaves or fire).</span>
                            </div>
                        </div>

                        {/* Color Psychology */}
                        <div className={`p-6 rounded-[24px] ${cardBg} border ${borderColor} hover:shadow-lg transition-shadow`}>
                            <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-slate-200">Color Psychology</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                The study of how colors affect human behavior, mood, and perception. Different hues evoke specific subconscious emotional responses.
                            </p>
                            <div className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0 shadow-sm"></span>
                                    <span className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Blue:</strong> Trust, calm, professionalism.</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-red-500 shrink-0 shadow-sm"></span>
                                    <span className="text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Red:</strong> Passion, urgency, excitement.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
