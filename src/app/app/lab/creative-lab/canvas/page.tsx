"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft, Settings2, Palette, Sun, Monitor, Printer, CloudRain, Eye, EyeOff, Sparkles
} from "lucide-react";
import Link from "next/link";
import chroma from "chroma-js";

type BlendMode = "additive" | "subtractive";
type ColorDeficiency = "none" | "protanopia" | "deuteranopia";

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

    // Math for resulting colors
    const r = mode === "additive" ? val1 : 255 - val1;
    const g = mode === "additive" ? val2 : 255 - val2;
    const b = mode === "additive" ? val3 : 255 - val3;
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
                        <div className={`flex items-center gap-1 p-1 rounded-full ${cardBg} border ${borderColor}`}>
                            <button 
                                onClick={() => setMode("additive")}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${mode === "additive" ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-md" : "text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white"}`}
                            >
                                <Sun className="w-4 h-4 inline-block mr-1" /> Additive (RGB)
                            </button>
                            <button 
                                onClick={() => setMode("subtractive")}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${mode === "subtractive" ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-md" : "text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white"}`}
                            >
                                <Printer className="w-4 h-4 inline-block mr-1" /> Subtractive (CMY)
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full transition-colors duration-200"
                                            style={{
                                                backgroundColor: mode === "additive" ? `rgb(${val1}, 0, 0)` : `rgb(${255 - val1}, 255, 255)`,
                                                mixBlendMode: mode === "additive" ? "screen" : "multiply"
                                            }}
                                        />
                                        {/* Circle 2 */}
                                        <div
                                            className="absolute bottom-0 left-0 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full transition-colors duration-200"
                                            style={{
                                                backgroundColor: mode === "additive" ? `rgb(0, ${val2}, 0)` : `rgb(255, ${255 - val2}, 255)`,
                                                mixBlendMode: mode === "additive" ? "screen" : "multiply"
                                            }}
                                        />
                                        {/* Circle 3 */}
                                        <div
                                            className="absolute bottom-0 right-0 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full transition-colors duration-200"
                                            style={{
                                                backgroundColor: mode === "additive" ? `rgb(0, 0, ${val3})` : `rgb(255, 255, ${255 - val3})`,
                                                mixBlendMode: mode === "additive" ? "screen" : "multiply"
                                            }}
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Intersection Highlight Overlay (Mobile: 240px) */}
                                <svg 
                                    className="absolute inset-0 w-full h-full pointer-events-none sm:hidden z-10 scale-[1.15] drop-shadow-2xl transition-all duration-300" 
                                    viewBox="0 0 240 240"
                                    style={{ transformOrigin: '50% 56%', filter: `drop-shadow(0 10px 15px ${mode === "additive" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.3)"})` }}
                                >
                                    <defs>
                                        <clipPath id="clip1-sm"><circle cx="120" cy="75" r="75" /></clipPath>
                                        <clipPath id="clip2-sm"><circle cx="75" cy="165" r="75" /></clipPath>
                                        <clipPath id="clip3-sm"><circle cx="165" cy="165" r="75" /></clipPath>
                                    </defs>
                                    <g clipPath="url(#clip1-sm)">
                                        <g clipPath="url(#clip2-sm)">
                                            <g clipPath="url(#clip3-sm)">
                                                <rect x="0" y="0" width="100%" height="100%" fill={resultColor} className="transition-colors duration-200" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                
                                {/* Intersection Highlight Overlay (Desktop: 280px) */}
                                <svg 
                                    className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block z-10 scale-[1.15] drop-shadow-2xl transition-all duration-300" 
                                    viewBox="0 0 280 280"
                                    style={{ transformOrigin: '50% 56%', filter: `drop-shadow(0 10px 15px ${mode === "additive" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.3)"})` }}
                                >
                                    <defs>
                                        <clipPath id="clip1-md"><circle cx="140" cy="90" r="90" /></clipPath>
                                        <clipPath id="clip2-md"><circle cx="90" cy="190" r="90" /></clipPath>
                                        <clipPath id="clip3-md"><circle cx="190" cy="190" r="90" /></clipPath>
                                    </defs>
                                    <g clipPath="url(#clip1-md)">
                                        <g clipPath="url(#clip2-md)">
                                            <g clipPath="url(#clip3-md)">
                                                <rect x="0" y="0" width="100%" height="100%" fill={resultColor} className="transition-colors duration-200" />
                                            </g>
                                        </g>
                                    </g>
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
                            </div>
                            
                            {/* Current Values Display */}
                            <div className="mt-6 flex justify-center">
                                <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono font-bold text-slate-500 dark:text-white/70 shadow-inner">
                                    {mode === "additive" ? (
                                        `R=${val1} G=${val2} B=${val3}`
                                    ) : (
                                        `C=${(val1/255).toFixed(1)} M=${(val2/255).toFixed(1)} Y=${(val3/255).toFixed(1)}`
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
                                Experience how these colors appear to people with different types of <strong className="text-fuchsia-500 dark:text-fuchsia-400 font-bold">color blindness.</strong>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {(["none", "protanopia", "deuteranopia"] as ColorDeficiency[]).map(type => (
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
            </div>
        </div>
    );
}
