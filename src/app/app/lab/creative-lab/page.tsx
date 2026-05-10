"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
    ChevronLeft,
    Palette,
    Music,
    Video,
    Wand2,
    PenTool,
    Layers,
    Sparkles,
    Play,
    Paintbrush,
    MousePointer2
} from "lucide-react";
import Link from "next/link";

const WaveVisualizer = ({ frequency, amplitude }: { frequency: number; amplitude: number }) => {
    const [phase, setPhase] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        let animationFrameId: number;
        let lastTime = 0;
        const animate = (time: number) => {
            if (time - lastTime > 30) {
                setPhase((p) => (p + 3) % 360);
                lastTime = time;
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (!mounted) return null;

    const wavePoints = Array.from({ length: 150 }).map((_, i) => {
        const x = i;
        const y = 50 + amplitude * Math.sin(((x / 150) * frequency * 2 * Math.PI) + (phase * Math.PI / 180));
        return `${x},${y}`;
    }).join(" ");

    return (
        <>
            <polyline points={wavePoints} fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={wavePoints} fill="none" stroke="#c7d2fe" strokeWidth="0.5" transform="translate(0, -2)" className="opacity-50" />
        </>
    );
};

export default function CreativeLabPage() {
    // Interactive States for Color Mixer
    const [red, setRed] = useState(244);
    const [green, setGreen] = useState(63);
    const [blue, setBlue] = useState(94);
    const mixedColor = `rgb(${red}, ${green}, ${blue})`;

    // Interactive States for Wave Synthesizer
    const [frequency, setFrequency] = useState(4);
    const [amplitude, setAmplitude] = useState(30);
    const [phase, setPhase] = useState(0);

    // Interactive States for Bezier Curves
    const [cp1x, setCp1x] = useState(30);
    const [cp1y, setCp1y] = useState(80);
    const [cp2x, setCp2x] = useState(70);
    const [cp2y, setCp2y] = useState(20);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div 
            className="min-h-screen bg-[#050505] relative overflow-hidden selection:bg-pink-500/30 text-slate-200"
            onMouseMove={handleMouseMove}
            style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` } as React.CSSProperties}
        >
            {/* Massive Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-fuchsia-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
            
            {/* Interactive Stitch / Dot Grid Base */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.07) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

            {/* Highlighted Dotted Grid on Hover */}
            <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300" 
                style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(236,72,153,0.8) 1.5px, transparent 0)', 
                    backgroundSize: '32px 32px',
                    WebkitMaskImage: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
                    maskImage: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), black, transparent)`
                }} 
            />

            <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 relative z-10">
                
                {/* Minimal Header */}
                <div className="flex items-center justify-between mb-16">
                    <Link
                        href="/app/lab"
                        className="flex items-center gap-3 text-sm font-bold text-white/50 hover:text-white transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:-translate-x-2 transition-transform">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        Back to Lab Hub
                    </Link>
                    <div className="text-white/30 font-mono text-xs uppercase tracking-[0.3em]">
                        Creative Studio // v2.0
                    </div>
                </div>

                {/* Hero / Title Area */}
                <div className="mb-16 max-w-2xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40 tracking-tighter mb-6">
                            Create.<br/>Mutate.<br/><span className="text-pink-500">Inspire.</span>
                        </h1>
                        <p className="text-lg text-white/50 font-light leading-relaxed max-w-xl">
                            A boundless digital playground where art and algorithms collide. Sculpt color, sequence waves, and bend mathematics.
                        </p>
                    </motion.div>
                </div>

                {/* Asymmetric Masonry-style Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[240px]">
                    
                    {/* Module: Piano Card (New) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                        className="md:col-span-4 md:row-span-2 group relative rounded-[40px] p-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-white/0 rounded-[40px] pointer-events-none" />
                        <div className="w-full h-full bg-emerald-950/40 backdrop-blur-xl rounded-[36px] border border-emerald-500/20 flex flex-col relative isolate">
                            
                            {/* Visualizer Area (Piano Keys) */}
                            <div className="flex-1 relative flex items-center justify-center p-6 min-h-[160px]">
                                <div className="flex gap-1 h-32 w-full max-w-[220px] relative">
                                    {/* White Keys */}
                                    {[...Array(7)].map((_, i) => (
                                        <div key={`w-${i}`} className="flex-1 bg-white/90 rounded-b-md relative shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/20 hover:bg-white transition-colors cursor-pointer" />
                                    ))}
                                    {/* Black Keys (Absolute positioned over white keys) */}
                                    {/* C#, D# */}
                                    <div className="absolute top-0 left-[14.28%] w-[10%] h-20 bg-black rounded-b-sm z-10 translate-x-[-50%] shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)] hover:bg-zinc-800 cursor-pointer" />
                                    <div className="absolute top-0 left-[28.57%] w-[10%] h-20 bg-black rounded-b-sm z-10 translate-x-[-50%] shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)] hover:bg-zinc-800 cursor-pointer" />
                                    {/* F#, G#, A# */}
                                    <div className="absolute top-0 left-[57.14%] w-[10%] h-20 bg-black rounded-b-sm z-10 translate-x-[-50%] shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)] hover:bg-zinc-800 cursor-pointer" />
                                    <div className="absolute top-0 left-[71.42%] w-[10%] h-20 bg-black rounded-b-sm z-10 translate-x-[-50%] shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)] hover:bg-zinc-800 cursor-pointer" />
                                    <div className="absolute top-0 left-[85.71%] w-[10%] h-20 bg-black rounded-b-sm z-10 translate-x-[-50%] shadow-[inset_0_-2px_4px_rgba(255,255,255,0.2)] hover:bg-zinc-800 cursor-pointer" />
                                </div>
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mask-image-radial" style={{ WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 100%)' }} />
                            </div>

                            {/* Controls */}
                            <div className="p-6 border-t border-white/5 bg-black/40 flex-1 flex flex-col justify-end">
                                <div>
                                    <div className="flex items-center gap-2 text-emerald-400 mb-4">
                                        <Music className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-white tracking-tight">Virtual Piano</h3>
                                    </div>
                                    <p className="text-sm text-emerald-200/50 font-light mb-4">
                                        Compose melodies and explore musical scales with an interactive digital keyboard.
                                    </p>
                                </div>
                                <div className="mt-auto flex justify-end">
                                    <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm rounded-full transition-colors w-full sm:w-auto">
                                        Launch Lab
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Module 1: Color Mixology (Concised) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                        className="md:col-span-4 md:row-span-2 group relative rounded-[40px] p-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-white/0 rounded-[40px] pointer-events-none" />
                        <div className="w-full h-full bg-black/40 backdrop-blur-2xl rounded-[36px] border border-white/10 flex flex-col relative isolate">
                            
                            {/* Color Orb Visualizer */}
                            <div className="flex-1 relative flex items-center justify-center p-6 min-h-[160px]">
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-40 h-40 rounded-full blur-[60px] opacity-20 transition-colors duration-300" style={{ backgroundColor: mixedColor }} />
                                </div>
                                <motion.div 
                                    className="w-28 h-28 rounded-[24px] rotate-12 transition-all duration-300 relative z-10 shadow-2xl"
                                    style={{ backgroundColor: mixedColor, boxShadow: `0 20px 40px -20px ${mixedColor}` }}
                                    whileHover={{ rotate: 0, scale: 1.05 }}
                                >
                                    <div className="absolute inset-0 rounded-[24px] bg-gradient-to-tr from-black/20 to-transparent mix-blend-overlay" />
                                    <div className="absolute inset-0 rounded-[24px] border border-white/20" />
                                </motion.div>
                            </div>

                            {/* Controls */}
                            <div className="p-6 border-t border-white/5 bg-black/40 flex-1 flex flex-col justify-end">
                                <div>
                                    <div className="flex items-center gap-2 text-pink-400 mb-4">
                                        <Palette className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-white tracking-tight">Canvas</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                                                <span>Red</span><span>{red}</span>
                                            </div>
                                            <input type="range" min="0" max="255" value={red} onChange={(e) => setRed(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-500 hover:h-2 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                                                <span>Green</span><span>{green}</span>
                                            </div>
                                            <input type="range" min="0" max="255" value={green} onChange={(e) => setGreen(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-green-500 hover:h-2 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-white/40 uppercase tracking-widest">
                                                <span>Blue</span><span>{blue}</span>
                                            </div>
                                            <input type="range" min="0" max="255" value={blue} onChange={(e) => setBlue(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-between">
                                    <span className="font-mono text-sm tracking-[0.2em] text-white/70">
                                        #{((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1).toUpperCase()}
                                    </span>
                                    <Link href="/app/lab/creative-lab/canvas" className="px-6 py-2 bg-white text-black font-bold text-sm rounded-full hover:bg-white/90 hover:scale-105 transition-all w-full sm:w-auto inline-block text-center">
                                        Launch
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Module 2: Generative Waveform (Tall & Vertical) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                        className="md:col-span-4 md:row-span-2 group relative rounded-[40px] p-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-white/0 rounded-[40px] pointer-events-none" />
                        <div className="w-full h-full bg-indigo-950/40 backdrop-blur-xl rounded-[36px] border border-indigo-500/20 flex flex-col relative isolate">
                            
                            {/* Visualizer Area */}
                            <div className="flex-1 relative flex items-center justify-center p-6 min-h-[160px]">
                                <svg width="100%" height="100%" viewBox="0 0 150 100" preserveAspectRatio="none" className="drop-shadow-[0_0_12px_rgba(99,102,241,0.8)]">
                                    <WaveVisualizer frequency={frequency} amplitude={amplitude} />
                                </svg>
                                {/* Decorative grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mask-image-radial" style={{ WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 100%)' }} />
                            </div>

                            {/* Controls */}
                            <div className="p-6 border-t border-white/5 bg-black/40 flex-1 flex flex-col justify-end">
                                <div>
                                    <div className="flex items-center gap-2 text-indigo-400 mb-4">
                                        <Music className="w-5 h-5" />
                                        <h3 className="text-lg font-bold text-white tracking-tight">Audio Sculptor</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-indigo-200/50 uppercase tracking-widest">
                                                <span>Frequency</span><span>{frequency} Hz</span>
                                            </div>
                                            <input type="range" min="1" max="15" value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} className="w-full h-1 bg-indigo-900/50 rounded-full appearance-none cursor-pointer accent-indigo-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-indigo-200/50 uppercase tracking-widest">
                                                <span>Amplitude</span><span>{amplitude}</span>
                                            </div>
                                            <input type="range" min="5" max="45" value={amplitude} onChange={(e) => setAmplitude(Number(e.target.value))} className="w-full h-1 bg-indigo-900/50 rounded-full appearance-none cursor-pointer accent-indigo-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm rounded-full transition-colors w-full sm:w-auto">
                                        Launch Lab
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Module 3: Vector Math (Wide) */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                        className="md:col-span-7 md:row-span-1 group relative rounded-[40px] p-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-white/0 rounded-[40px] pointer-events-none" />
                        <div className="w-full h-full bg-amber-950/20 backdrop-blur-xl rounded-[36px] border border-amber-500/20 p-6 flex items-center gap-6 isolate">
                            
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-amber-400 mb-2">
                                    <PenTool className="w-5 h-5" />
                                    <h3 className="text-lg font-bold text-white tracking-tight">Vector Sketch & Animation</h3>
                                </div>
                                <p className="text-sm text-white/50 font-light mb-4">
                                    Master bezier curves to draw precise vector art and create smooth keyframe animations.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-bold text-amber-200/50 uppercase tracking-widest">Vector X/Y</div>
                                        <input type="range" min="10" max="90" value={cp1y} onChange={(e) => setCp1y(Number(e.target.value))} className="w-full h-1 bg-amber-900/50 rounded-full appearance-none cursor-pointer accent-amber-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-bold text-amber-200/50 uppercase tracking-widest">Tension</div>
                                        <input type="range" min="10" max="90" value={cp2y} onChange={(e) => setCp2y(Number(e.target.value))} className="w-full h-1 bg-amber-900/50 rounded-full appearance-none cursor-pointer accent-amber-400" />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-start">
                                    <button className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full transition-colors">
                                        Launch Lab
                                    </button>
                                </div>
                            </div>

                            <div className="w-48 h-full bg-black/30 rounded-[24px] relative overflow-hidden flex items-center justify-center border border-white/5 shrink-0">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" preserveAspectRatio="xMidYMid meet">
                                    <path d={`M 10 50 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, 90 50`} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                                    <circle cx="10" cy="50" r="2.5" fill="#fff" />
                                    <circle cx="90" cy="50" r="2.5" fill="#fff" />
                                    <circle cx={cp1x} cy={cp1y} r="3.5" fill="#f59e0b" className="animate-pulse" />
                                    <circle cx={cp2x} cy={cp2y} r="3.5" fill="#f59e0b" className="animate-pulse" />
                                </svg>
                            </div>

                        </div>
                    </motion.div>

                    {/* Quick Access Tiles */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="md:col-span-5 md:row-span-1 grid grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">3D Topology</h4>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">Locked</p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500/20 to-fuchsia-600/20 backdrop-blur-md rounded-[32px] border border-pink-500/30 p-6 flex flex-col items-center justify-center text-center hover:border-pink-500/60 transition-colors cursor-pointer group shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                                <Wand2 className="w-5 h-5 text-pink-400" />
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">AI Prompt Lab</h4>
                            <p className="text-[10px] text-pink-200/50 uppercase tracking-widest font-bold">New</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
