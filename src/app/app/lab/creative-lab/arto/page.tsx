"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Menu, Layers, Palette, Paintbrush, Eraser,
    Wand2, Square, Type, Undo2, Redo2, X, ChevronLeft, ChevronRight,
    MousePointer2, Maximize, Scissors, Grid3X3, SplitSquareHorizontal,
    Droplets, Plus, Minus, Heart, SlidersHorizontal, Image as ImageIcon
} from "lucide-react";

const BRUSH_CATEGORIES = [
    "Favorite", "Airbrush", "Basic", "Calligraphy", "Charcoal",
    "Elements", "Hair", "Halftone", "Inking", "Particles",
    "Pixel", "Sketching", "Special", "Watercolor"
];

const CALLIGRAPHY_BRUSHES = [
    { name: "calligraphy" },
    { name: "calligraphy directional", badge: "Tilt" },
    { name: "calligraphy soft" },
    { name: "calligraphy horizontal", heart: true, options: true },
    { name: "horizontal directional", badge: "Tilt" },
    { name: "calligraphy vertical" },
    { name: "vertical directional", badge: "Tilt" },
    { name: "hook" },
    { name: "soft ribbon" },
    { name: "thick ribbon" },
    { name: "soft twisted ribbon" },
    { name: "thick twisted ribbon" },
];

const CHARCOAL_BRUSHES = [
    {
        name: "charcoal strong",
        description: "Deep pigment, heavy coverage",
        intensity: 0.95, porosity: 12, spacing: 0.015,
        expansion: 1.5, randomness: 0.1,
    },
    {
        name: "charcoal medium",
        description: "Balanced grain, moderate tooth",
        intensity: 0.28, porosity: 65, spacing: 0.04,
        expansion: 1.3, randomness: 0.4,
    },
    {
        name: "charcoal light",
        description: "Wispy, dry, high paper skip",
        intensity: 0.25, porosity: 180, spacing: 0.07,
        expansion: 1.1, randomness: 0.55,
    },
    {
        name: "chalk",
        description: "Chunky, flat-stick profile",
        intensity: 0.8, porosity: 30, spacing: 0.05,
        expansion: 1.2, randomness: 0.3,
        heart: true, options: true,
    },
];

const SKETCHING_BRUSHES = [
    {
        name: "pencil 6B",
        description: "Very soft, dark, expressive",
        darkness: 0.92, grain: 30, spacing: 0.008,
        thinness: 0.35, pressureSens: 0.8,
    },
    {
        name: "pencil 4B",
        description: "Soft, rich shading",
        darkness: 0.72, grain: 55, spacing: 0.01,
        thinness: 0.45, pressureSens: 0.7,
    },
    {
        name: "pencil 2B",
        description: "Medium-soft, versatile",
        darkness: 0.55, grain: 80, spacing: 0.012,
        thinness: 0.38, pressureSens: 0.6,
    },
    {
        name: "pencil HB",
        description: "Standard, balanced",
        darkness: 0.40, grain: 110, spacing: 0.015,
        thinness: 0.30, pressureSens: 0.5,
    },
    {
        name: "pencil H",
        description: "Hard, fine, light lines",
        darkness: 0.25, grain: 150, spacing: 0.018,
        thinness: 0.22, pressureSens: 0.4,
    },
];
import Link from "next/link";
import { useSidebar } from "@/app/context/SidebarContext";

type Tool = "paint" | "erase" | "blend";

export default function ArtoCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [activeTool, setActiveTool] = useState<Tool>("paint");
    const [color, setColor] = useState("#4ade80"); // Default green matching screenshot
    const [canvasBgColor, setCanvasBgColor] = useState("#ffffff");
    const [brushSize, setBrushSize] = useState(15);
    const [opacity, setOpacity] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(true);
    const [isBrushMenuOpen, setIsBrushMenuOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState("Calligraphy");
    const [zoom, setZoom] = useState(0.7);
    const [activeBrush, setActiveBrush] = useState("calligraphy horizontal");
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const brushTipCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastPosRef = useRef<{ x: number, y: number } | null>(null);
    const pointerPressureRef = useRef<number>(0.5); // Default to 0.5 for mouse
    const pointerTiltRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    // Point buffer for Catmull-Rom spline interpolation (smooth strokes)
    const pointBufferRef = useRef<{ x: number; y: number; pressure: number }[]>([]);
    // Stabilizer (lazy mouse) for charcoal/chalk
    const stabilizedPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const velocityRef = useRef<number>(0);
    const CHARCOAL_SMOOTHING = 0.18;
    const { setOpen } = useSidebar();

    // Auto-collapse sidebar on mount
    useEffect(() => {
        setOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // History for Undo/Redo
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyStep, setHistoryStep] = useState(-1);

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set high DPI canvas resolution
        const width = 800;
        const height = 600;
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);

        // Clear canvas completely to allow CSS background color to show through
        ctx.clearRect(0, 0, width, height);

        // Save initial blank state
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialState]);
        setHistoryStep(0);

        // Create offscreen canvas for smooth opacity rendering
        const offscreen = document.createElement('canvas');
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const offCtx = offscreen.getContext('2d');
        if (offCtx) {
            offCtx.scale(2, 2);
        }
        offscreenCanvasRef.current = offscreen;
    }, []);

    // Generate Brush Tip Texture
    useEffect(() => {
        const size = Math.max(50, brushSize * 2); // Higher resolution tip
        const tipCanvas = document.createElement('canvas');
        tipCanvas.width = size;
        tipCanvas.height = size;
        const tCtx = tipCanvas.getContext('2d');
        if (!tCtx) return;

        const center = size / 2;

        if (activeBrush.includes("charcoal") || activeBrush.includes("chalk")) {
            // --- Dynamics Engine: Solid core + carved polygon voids ---
            const brushConfig = CHARCOAL_BRUSHES.find(b => b.name === activeBrush) || CHARCOAL_BRUSHES[0];
            const HR = 128;
            tipCanvas.width = HR;
            tipCanvas.height = HR;
            const hc = HR / 2;
            const radius = HR * 0.45;
            const isChalk = activeBrush === "chalk";
            const flatness = isChalk ? 0.6 : 0.75;

            tCtx.clearRect(0, 0, HR, HR);

            // Core Pigment: Solid elliptical fill (crisp, no gradient)
            tCtx.save();
            tCtx.translate(hc, hc);
            tCtx.scale(1, flatness);
            tCtx.translate(-hc, -hc);
            tCtx.fillStyle = color;
            tCtx.beginPath();
            tCtx.arc(hc, hc, radius, 0, Math.PI * 2);
            tCtx.fill();
            tCtx.restore();

            // Carve high-contrast polygon voids (paper tooth)
            tCtx.globalCompositeOperation = "destination-out";
            const voidCount = brushConfig.porosity;
            for (let i = 0; i < voidCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * radius;
                const vx = hc + Math.cos(angle) * r;
                const vy = hc + Math.sin(angle) * r * flatness;
                tCtx.globalAlpha = 1.0; // Sharp voids
                tCtx.beginPath();
                const sides = 3 + Math.floor(Math.random() * 3);
                const vRadius = (Math.random() * 4 + 1.5);
                for (let s = 0; s < sides; s++) {
                    const sa = (s / sides) * Math.PI * 2;
                    const sx = vx + Math.cos(sa) * vRadius;
                    const sy = vy + Math.sin(sa) * vRadius;
                    if (s === 0) tCtx.moveTo(sx, sy); else tCtx.lineTo(sx, sy);
                }
                tCtx.fill();
            }
            tCtx.globalCompositeOperation = "source-over";
            tCtx.globalAlpha = 1;

        } else if (activeBrush.includes("pencil")) {
            // --- Pencil Engine: Solid core + fine polygon voids (graphite on paper) ---
            const pencilConfig = SKETCHING_BRUSHES.find(b => b.name === activeBrush) || SKETCHING_BRUSHES[3];
            const HR = 128;
            tipCanvas.width = HR;
            tipCanvas.height = HR;
            const hc = HR / 2;
            const radius = HR * 0.42;

            tCtx.clearRect(0, 0, HR, HR);

            // Solid elliptical graphite core (slightly flattened)
            tCtx.save();
            tCtx.translate(hc, hc);
            tCtx.scale(1, 0.85);
            tCtx.translate(-hc, -hc);
            tCtx.fillStyle = color;
            tCtx.beginPath();
            tCtx.arc(hc, hc, radius, 0, Math.PI * 2);
            tCtx.fill();
            tCtx.restore();

            // Carve polygon voids for paper tooth texture (denser than charcoal)
            tCtx.globalCompositeOperation = "destination-out";
            const voidCount = pencilConfig.grain;
            for (let i = 0; i < voidCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * radius;
                const vx = hc + Math.cos(angle) * r;
                const vy = hc + Math.sin(angle) * r * 0.85;
                tCtx.globalAlpha = 0.6 + Math.random() * 0.4;
                tCtx.beginPath();
                const sides = 3 + Math.floor(Math.random() * 3);
                const vRadius = Math.random() * 3 + 1;
                for (let s = 0; s < sides; s++) {
                    const sa = (s / sides) * Math.PI * 2;
                    const sx = vx + Math.cos(sa) * vRadius;
                    const sy = vy + Math.sin(sa) * vRadius;
                    if (s === 0) tCtx.moveTo(sx, sy); else tCtx.lineTo(sx, sy);
                }
                tCtx.fill();
            }

            // Add scattered micro-grain for extra graphite texture
            for (let i = 0; i < voidCount * 2; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()) * radius * 0.9;
                const gx = hc + Math.cos(angle) * r;
                const gy = hc + Math.sin(angle) * r * 0.85;
                tCtx.globalAlpha = 0.3 + Math.random() * 0.5;
                tCtx.beginPath();
                tCtx.arc(gx, gy, 0.3 + Math.random() * 1.2, 0, Math.PI * 2);
                tCtx.fill();
            }
            tCtx.globalCompositeOperation = "source-over";
            tCtx.globalAlpha = 1;

        } else if (activeBrush.includes("calligraphy") || activeBrush.includes("directional") || activeBrush.includes("ribbon")) {
            // Calligraphy uses filled-polygon rendering in draw() for crisp edges.
            // Store the nib angle on the canvas for retrieval. Also draw a preview tip.
            let nibAngle = Math.PI / 6;
            if (activeBrush.includes("horizontal")) nibAngle = 0;
            else if (activeBrush.includes("vertical")) nibAngle = Math.PI / 2;
            else if (activeBrush.includes("directional")) nibAngle = Math.PI / 4;
            else if (activeBrush.includes("hook")) nibAngle = Math.PI / 8;
            (tipCanvas as any)._nibAngle = nibAngle;

            // Draw a preview ellipse on the tip canvas (used for initial dab)
            tCtx.fillStyle = color;
            tCtx.translate(center, center);
            tCtx.rotate(nibAngle);
            tCtx.beginPath();
            tCtx.ellipse(0, 0, size / 2, Math.max(1, size * 0.06), 0, 0, Math.PI * 2);
            tCtx.fill();
        } else {
            // Standard brush (can be soft or hard)
            tCtx.fillStyle = color;
            tCtx.beginPath();
            tCtx.arc(center, center, size / 2, 0, Math.PI * 2);
            tCtx.fill();
        }
        brushTipCanvasRef.current = tipCanvas;
    }, [activeBrush, color, brushSize]);

    const saveHistoryState = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const newState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newState);

        // Limit history to 50 steps
        if (newHistory.length > 50) newHistory.shift();

        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const undo = () => {
        if (historyStep > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!ctx || !canvas) return;

            const prevStep = historyStep - 1;
            ctx.putImageData(history[prevStep], 0, 0);
            setHistoryStep(prevStep);
        }
    };

    const redo = () => {
        if (historyStep < history.length - 1) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!ctx || !canvas) return;

            const nextStep = historyStep + 1;
            ctx.putImageData(history[nextStep], 0, 0);
            setHistoryStep(nextStep);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveHistoryState();
    };

    // --- PointerEvent coordinate extractor with pressure + tilt ---
    const getPointerPos = (e: React.PointerEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (800 / rect.width),
            y: (e.clientY - rect.top) * (600 / rect.height)
        };
    };

    // Keep legacy for touch fallback
    const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        return {
            x: (clientX - rect.left) * (800 / rect.width),
            y: (clientY - rect.top) * (600 / rect.height)
        };
    };

    // --- Catmull-Rom spline interpolation for buttery-smooth strokes ---
    const catmullRomInterpolate = (
        p0: { x: number; y: number },
        p1: { x: number; y: number },
        p2: { x: number; y: number },
        p3: { x: number; y: number },
        subdivisions: number
    ): { x: number; y: number }[] => {
        const points: { x: number; y: number }[] = [];
        for (let i = 1; i <= subdivisions; i++) {
            const t = i / subdivisions;
            const t2 = t * t;
            const t3 = t2 * t;
            // Catmull-Rom basis matrix
            const x = 0.5 * (
                (2 * p1.x) +
                (-p0.x + p2.x) * t +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
            );
            const y = 0.5 * (
                (2 * p1.y) +
                (-p0.y + p2.y) * t +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
            );
            points.push({ x, y });
        }
        return points;
    };

    const startDrawing = (e: React.PointerEvent) => {
        // Capture pressure (0–1) and tilt (-90 to 90 degrees)
        pointerPressureRef.current = e.pressure > 0 ? e.pressure : 0.5;
        pointerTiltRef.current = { x: e.tiltX ?? 0, y: e.tiltY ?? 0 };
        setIsDrawing(true);
        const pos = getPointerPos(e);
        lastPosRef.current = pos;

        // Initialize point buffer for spline interpolation
        const pressure = e.pressure > 0 ? e.pressure : 0.5;
        pointBufferRef.current = [{ ...pos, pressure }];
        // Initialize stabilizer and velocity for charcoal dynamics
        stabilizedPosRef.current = { ...pos };
        velocityRef.current = 0;

        // Clear offscreen canvas for the new stroke (no initial dab)
        const offCanvas = offscreenCanvasRef.current;
        const offCtx = offCanvas?.getContext("2d");
        if (offCtx && offCanvas) {
            offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
        }
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            lastPosRef.current = null;
            pointBufferRef.current = [];
            saveHistoryState();
        }
    };

    const draw = (e: React.PointerEvent) => {
        if (!isDrawing || !lastPosRef.current) return;

        // Update pressure and tilt every move event
        if (e.pointerType === "pen" && e.pressure > 0) {
            pointerPressureRef.current = e.pressure;
        } else if (e.pointerType !== "pen") {
            pointerPressureRef.current = 1.0;
        }
        pointerTiltRef.current = { x: e.tiltX ?? 0, y: e.tiltY ?? 0 };

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const offCanvas = offscreenCanvasRef.current;
        const offCtx = offCanvas?.getContext("2d");
        const tipCanvas = brushTipCanvasRef.current;

        if (!ctx || !canvas || !offCtx || !offCanvas || !tipCanvas || historyStep < 0) return;

        const rawPos = getPointerPos(e);
        const pressure = Math.max(0.1, Math.min(1, pointerPressureRef.current));

        // ==============================================================
        // CHARCOAL / CHALK: Dynamics Engine (direct canvas rendering)
        // Uses lazy-mouse stabilizer, velocity, scalar Catmull-Rom,
        // dynamic spacing, per-stamp rotation, and dry/solid dab logic.
        // ==============================================================
        if (activeBrush.includes("charcoal") || activeBrush.includes("chalk")) {
            const brushConfig = CHARCOAL_BRUSHES.find(b => b.name === activeBrush) || CHARCOAL_BRUSHES[0];

            // Lazy-mouse stabilizer
            const sPos = stabilizedPosRef.current;
            sPos.x += (rawPos.x - sPos.x) * CHARCOAL_SMOOTHING;
            sPos.y += (rawPos.y - sPos.y) * CHARCOAL_SMOOTHING;

            const dist = Math.hypot(sPos.x - lastPosRef.current.x, sPos.y - lastPosRef.current.y);
            if (dist === 0) return;

            // Velocity tracking
            const rawVel = Math.min(3.5, dist / 10);
            velocityRef.current = velocityRef.current * 0.8 + rawVel * 0.2;

            // Point buffer for scalar Catmull-Rom
            const buf = pointBufferRef.current;
            buf.push({ ...sPos, pressure });
            if (buf.length > 5) buf.shift();

            const p0 = buf[0], p1 = buf[1] || buf[0], p2 = buf[2] || buf[1] || buf[0], p3 = buf[3] || buf[2] || buf[1] || buf[0];

            // Scalar Catmull-Rom helper
            const cr = (a: number, b: number, c: number, d: number, t: number) => {
                const v0 = (c - a) * 0.5;
                const v1 = (d - b) * 0.5;
                const t2 = t * t;
                const t3 = t * t2;
                return (2 * b - 2 * c + v0 + v1) * t3 + (-3 * b + 3 * c - 2 * v0 - v1) * t2 + v0 * t + b;
            };

            // Dynamic spacing from brush config
            const spacing = Math.max(1.5, brushSize * brushConfig.spacing);
            const steps = Math.ceil(dist / spacing);

            const baseIntensity = brushConfig.intensity * (opacity / 100);

            ctx.save();
            if (activeTool === "erase") {
                ctx.globalCompositeOperation = "destination-out";
            } else {
                ctx.globalCompositeOperation = "source-over";
            }

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = cr(p0.x, p1.x, p2.x, p3.x, t);
                const y = cr(p0.y, p1.y, p2.y, p3.y, t);

                // Velocity-driven dynamic size (clamped to ±50% of brushSize)
                const velocityImpact = velocityRef.current * brushConfig.expansion;
                const scale = Math.min(1.20, 0.65 + velocityImpact * 0.25);
                const currentSize = brushSize * scale;

                // Scuff logic: low velocity = more randomness and transparency
                const velInv = Math.max(0, 1.5 - velocityRef.current);
                const randomnessFactor = brushConfig.randomness + (velInv * 0.5);
                const patchSeed = Math.random();

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Math.random() * Math.PI * 2);

                if (patchSeed < randomnessFactor) {
                    // DRY DAB (Scuffing) — faint, reveals paper tooth
                    ctx.globalAlpha = baseIntensity * (0.1 + Math.random() * 0.3);
                } else {
                    // SOLID DAB — full coverage
                    ctx.globalAlpha = baseIntensity * (0.8 + Math.random() * 0.2);
                }

                ctx.drawImage(tipCanvas, -currentSize / 2, -currentSize / 2, currentSize, currentSize);
                ctx.restore();
            }
            ctx.restore();

            lastPosRef.current = { ...sPos };
            return; // Skip the offscreen compositing path
        }

        // ==============================================================
        // PENCIL ENGINE: Fine graphite strokes (direct canvas rendering)
        // Uses stabilizer, pressure-sensitive thin lines, and grain.
        // ==============================================================
        if (activeBrush.includes("pencil")) {
            const pencilConfig = SKETCHING_BRUSHES.find(b => b.name === activeBrush) || SKETCHING_BRUSHES[3];

            // Lazy-mouse stabilizer (tighter than charcoal for precision)
            const sPos = stabilizedPosRef.current;
            sPos.x += (rawPos.x - sPos.x) * 0.3;
            sPos.y += (rawPos.y - sPos.y) * 0.3;

            const dist = Math.hypot(sPos.x - lastPosRef.current.x, sPos.y - lastPosRef.current.y);
            if (dist === 0) return;


            // Point buffer for scalar Catmull-Rom
            const buf = pointBufferRef.current;
            buf.push({ ...sPos, pressure });
            if (buf.length > 5) buf.shift();

            const p0 = buf[0], p1 = buf[1] || buf[0], p2 = buf[2] || buf[1] || buf[0], p3 = buf[3] || buf[2] || buf[1] || buf[0];

            const cr = (a: number, b: number, c: number, d: number, t: number) => {
                const v0 = (c - a) * 0.5;
                const v1 = (d - b) * 0.5;
                const t2 = t * t;
                const t3 = t * t2;
                return (2 * b - 2 * c + v0 + v1) * t3 + (-3 * b + 3 * c - 2 * v0 - v1) * t2 + v0 * t + b;
            };

            const spacing = Math.max(0.5, brushSize * pencilConfig.spacing);
            const steps = Math.ceil(dist / spacing);

            // Pencil size: pressure drives thickness
            const pressureScale = (1 - pencilConfig.pressureSens) + pressure * pencilConfig.pressureSens;
            const pencilSize = brushSize * pencilConfig.thinness * pressureScale;
            const baseAlpha = pencilConfig.darkness * (opacity / 100);

            ctx.save();
            if (activeTool === "erase") {
                ctx.globalCompositeOperation = "destination-out";
            } else {
                ctx.globalCompositeOperation = "source-over";
            }

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = cr(p0.x, p1.x, p2.x, p3.x, t);
                const y = cr(p0.y, p1.y, p2.y, p3.y, t);

                // --- Pure particle cloud: no stamp, all graphite specs ---
                // Scale particle count with area so density stays consistent at all sizes.
                // Reference: at brushSize=41, pencilSize≈14, we want ~24 particles for 6B.
                const refSize = 41 * pencilConfig.thinness;
                const refParticles = Math.floor(8 + pencilConfig.darkness * 18);
                const areaRatio = (pencilSize * pencilSize) / (refSize * refSize);
                const particleCount = Math.max(2, Math.floor(refParticles * areaRatio));
                const strokeRadius = Math.max(2, pencilSize * 0.55);

                ctx.fillStyle = color;

                for (let p = 0; p < particleCount; p++) {
                    // Gaussian-ish distribution: pow biases toward center
                    const pAngle = Math.random() * Math.PI * 2;
                    const pDist = Math.pow(Math.random(), 0.6) * strokeRadius;
                    const px = x + Math.cos(pAngle) * pDist;
                    const py = y + Math.sin(pAngle) * pDist;

                    // Fixed absolute particle size (doesn't shrink with brush size)
                    const centerBias = 1 - (pDist / strokeRadius);
                    const pSize = (0.4 + Math.random() * 1.6) * (0.6 + centerBias * 0.5);

                    // Alpha: center particles denser, edge particles fainter
                    const alphaBase = baseAlpha * (0.3 + centerBias * 0.6);
                    ctx.globalAlpha = alphaBase * (0.5 + Math.random() * 0.5);

                    // Tiny rotated rectangles (graphite flake shape)
                    ctx.save();
                    ctx.translate(px, py);
                    ctx.rotate(Math.random() * Math.PI);
                    ctx.fillRect(-pSize / 2, -pSize * 0.3, pSize, pSize * 0.6);
                    ctx.restore();
                }
            }
            ctx.restore();

            lastPosRef.current = { ...sPos };
            return;
        }

        // ==============================================================
        // NON-CHARCOAL BRUSHES: calligraphy, basic (offscreen compositing)
        // ==============================================================
        const pos = rawPos;
        const lastPos = lastPosRef.current;
        const dx = pos.x - lastPos.x;
        const dy = pos.y - lastPos.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) return;

        // --- Tilt ---
        const tilt = pointerTiltRef.current;
        const tiltMag = Math.hypot(tilt.x, tilt.y) / 90;
        const tiltScaleX = 1 + tiltMag * 1.5;
        const tiltScaleY = 1 - tiltMag * 0.4;

        let baseSize = brushSize;
        let flow = 1;
        let spacing = Math.max(1, brushSize * 0.04);

        if (activeBrush.includes("calligraphy")) {
            baseSize = brushSize * (0.3 + pressure * 0.7);
        } else {
            baseSize = brushSize * (0.5 + pressure * 0.5);
        }

        spacing = Math.min(spacing, baseSize * 0.45);
        const steps = Math.max(1, Math.floor(dist / spacing));

        // ============================================================
        // CALLIGRAPHY: Catmull-Rom spline interpolated nib renderer
        // ============================================================
        if (activeBrush.includes("calligraphy") || activeBrush.includes("directional") || activeBrush.includes("ribbon")) {
            const nibAngle: number = (tipCanvas as any)._nibAngle ?? (Math.PI / 6);
            const halfLen = baseSize / 2;
            const halfThick = Math.max(0.8, baseSize * 0.06);
            const cosA = Math.cos(nibAngle);
            const sinA = Math.sin(nibAngle);

            const nibCorners = (cx: number, cy: number) => ([
                { x: cx + cosA * halfLen, y: cy + sinA * halfLen },
                { x: cx - cosA * halfLen, y: cy - sinA * halfLen },
            ]);

            offCtx.fillStyle = color;
            offCtx.globalAlpha = activeTool === "erase" ? 1 : Math.min(1, opacity / 100);
            offCtx.globalCompositeOperation = activeTool === "erase" ? "destination-out" : "source-over";

            pointBufferRef.current.push({ ...pos, pressure });
            const buf = pointBufferRef.current;

            if (buf.length >= 2) {
                let smoothPoints: { x: number; y: number }[];
                if (buf.length === 2) {
                    smoothPoints = [buf[0], buf[1]];
                } else if (buf.length === 3) {
                    smoothPoints = [buf[1], ...catmullRomInterpolate(buf[0], buf[1], buf[2], buf[2], 8)];
                } else {
                    const len = buf.length;
                    smoothPoints = [buf[len - 3], ...catmullRomInterpolate(buf[len - 4], buf[len - 3], buf[len - 2], buf[len - 1], 8)];
                }

                for (let i = 1; i < smoothPoints.length; i++) {
                    const from = smoothPoints[i - 1];
                    const to = smoothPoints[i];
                    const c0 = nibCorners(from.x, from.y);
                    const c1 = nibCorners(to.x, to.y);
                    offCtx.beginPath();
                    offCtx.moveTo(c0[0].x, c0[0].y);
                    offCtx.lineTo(c1[0].x, c1[0].y);
                    offCtx.lineTo(c1[1].x, c1[1].y);
                    offCtx.lineTo(c0[1].x, c0[1].y);
                    offCtx.closePath();
                    offCtx.fill();
                }

                for (const pt of smoothPoints) {
                    offCtx.save();
                    offCtx.translate(pt.x, pt.y);
                    offCtx.rotate(nibAngle);
                    offCtx.beginPath();
                    offCtx.ellipse(0, 0, halfLen, halfThick, 0, 0, Math.PI * 2);
                    offCtx.fill();
                    offCtx.restore();
                }
            } else {
                offCtx.save();
                offCtx.translate(pos.x, pos.y);
                offCtx.rotate(nibAngle);
                offCtx.beginPath();
                offCtx.ellipse(0, 0, halfLen, halfThick, 0, 0, Math.PI * 2);
                offCtx.fill();
                offCtx.restore();
            }

            if (buf.length > 4) {
                pointBufferRef.current = buf.slice(-4);
            }

        } else {
            // ============================================================
            // BASIC BRUSH STAMP RENDERER (non-charcoal, non-calligraphy)
            // ============================================================
            offCtx.globalAlpha = activeTool === "erase" ? 1 : Math.min(1, flow);
            offCtx.globalCompositeOperation = "source-over";

            pointBufferRef.current.push({ ...pos, pressure });
            const buf = pointBufferRef.current;

            let pathPoints: { x: number; y: number }[];
            if (buf.length < 4) {
                pathPoints = [];
                for (let i = 0; i <= steps; i++) {
                    const t = steps === 0 ? 1 : i / steps;
                    pathPoints.push({ x: lastPos.x + dx * t, y: lastPos.y + dy * t });
                }
            } else {
                const len = buf.length;
                pathPoints = [buf[len - 3], ...catmullRomInterpolate(buf[len - 4], buf[len - 3], buf[len - 2], buf[len - 1], Math.max(4, steps))];
            }

            for (const pt of pathPoints) {
                if (baseSize > 0.5) {
                    const stampW = baseSize * tiltScaleX;
                    const stampH = baseSize * tiltScaleY;
                    offCtx.drawImage(tipCanvas, pt.x - stampW / 2, pt.y - stampH / 2, stampW, stampH);
                }
            }

            if (buf.length > 4) {
                pointBufferRef.current = buf.slice(-4);
            }
        }

        // Restore base state and composite offscreen onto main canvas
        ctx.putImageData(history[historyStep], 0, 0);
        ctx.save();
        ctx.resetTransform();

        if (activeTool === "erase") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.globalAlpha = opacity / 100;
        } else if (activeTool === "blend") {
            ctx.globalCompositeOperation = "multiply";
            ctx.globalAlpha = opacity / 100;
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = activeBrush.includes("soft") ? (opacity / 100) * 0.5 : opacity / 100;
        }

        ctx.drawImage(offCanvas, 0, 0);
        ctx.restore();

        lastPosRef.current = pos;
    };

    const stopDrawingPointer = (e: React.PointerEvent) => {
        if (isDrawing) {
            setIsDrawing(false);
            lastPosRef.current = null;
            pointBufferRef.current = [];
            pointerPressureRef.current = 0.5;
            saveHistoryState();
        }
    };

    // Prevent scrolling while drawing on touch devices
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const preventDefault = (e: TouchEvent) => e.preventDefault();
        canvas.addEventListener('touchstart', preventDefault, { passive: false });
        canvas.addEventListener('touchmove', preventDefault, { passive: false });
        return () => {
            canvas.removeEventListener('touchstart', preventDefault);
            canvas.removeEventListener('touchmove', preventDefault);
        };
    }, []);


    return (
        <div
            className={`${isFullscreen ? "fixed inset-0 z-[100]" : "relative w-full h-[calc(100vh-80px)] border-t border-white/5"} flex flex-col bg-[#1e1e1e] text-white font-sans overflow-hidden`}
            style={{
                backgroundImage: `linear-gradient(to right, #2c2c2e 1px, transparent 1px), linear-gradient(to bottom, #2c2c2e 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }}
        >
            {/* SVG Filter for Charcoal Noise Preview */}
            <svg width="0" height="0" className="absolute">
                <filter id="charcoal-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" in="noise" result="coloredNoise" />
                    <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" />
                </filter>
            </svg>
            {/* Top Toolbar */}
            <div className="flex items-center p-2 bg-transparent h-14 shrink-0 transition-all z-20">

                {/* Sticky Left: Back Button & Toggle */}
                <div className="flex items-center gap-1 shrink-0">
                    <Link href="/app/lab/creative-lab/canvas" className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-[9px] mt-0.5 font-medium">Back</span>
                    </Link>

                    <button
                        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                        className={`flex flex-col items-center justify-center h-10 px-3 rounded hover:bg-[#3e3e42]/50 text-white font-black tracking-widest text-sm transition-colors ml-1`}
                        title={isOptionsOpen ? "Collapse tools" : "Expand tools"}
                    >
                        ARTO
                    </button>
                    <div className="w-px h-8 bg-[#3e3e42] mx-1" />
                </div>

                {/* Collapsible Middle: Options */}
                <div className={`flex items-center gap-1 overflow-x-auto overflow-y-hidden no-scrollbar transition-all duration-300 origin-left ${isOptionsOpen ? "opacity-100 max-w-full flex-1" : "opacity-0 max-w-0 flex-none"}`}>


                    <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] shrink-0">
                        <Menu className="w-5 h-5" />
                        <span className="text-[9px] mt-0.5">Menu</span>
                    </button>

                    <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] shrink-0">
                        <Layers className="w-5 h-5" />
                        <span className="text-[9px] mt-0.5">Layers</span>
                    </button>

                    <div className="relative group shrink-0">
                        <button className="flex flex-col items-center justify-center w-12 h-10 rounded bg-[#4a3473] border border-[#5d4191] text-[#d4b5ff] shrink-0">
                            <Palette className="w-5 h-5" />
                            <span className="text-[9px] mt-0.5">Color</span>
                        </button>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                    </div>

                    <div className="relative group shrink-0">
                        <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] text-slate-400 shrink-0">
                            <ImageIcon className="w-5 h-5" />
                            <span className="text-[9px] mt-0.5">Bg Color</span>
                        </button>
                        <input
                            type="color"
                            value={canvasBgColor}
                            onChange={(e) => setCanvasBgColor(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                    </div>

                    <div className="w-px h-8 bg-[#3e3e42] mx-1 shrink-0" />

                    <button
                        onClick={() => {
                            if (activeTool === "paint") setIsBrushMenuOpen(!isBrushMenuOpen);
                            else { setActiveTool("paint"); setIsBrushMenuOpen(true); }
                        }}
                        className={`flex flex-col items-center justify-center w-12 h-10 rounded shrink-0 transition-colors ${activeTool === "paint" ? "bg-[#2d2d30] border border-[#007acc] text-[#569cd6]" : "hover:bg-[#3e3e42]"}`}
                    >
                        <Paintbrush className="w-5 h-5" />
                        <span className="text-[9px] mt-0.5">Paint</span>
                    </button>

                    <button
                        onClick={() => setActiveTool("erase")}
                        className={`flex flex-col items-center justify-center w-12 h-10 rounded shrink-0 transition-colors ${activeTool === "erase" ? "bg-[#2d2d30] border border-[#007acc] text-[#569cd6]" : "hover:bg-[#3e3e42]"}`}
                    >
                        <Eraser className="w-5 h-5" />
                        <span className="text-[9px] mt-0.5">Erase</span>
                    </button>

                    <button
                        onClick={() => setActiveTool("blend")}
                        className={`flex flex-col items-center justify-center w-12 h-10 rounded shrink-0 transition-colors ${activeTool === "blend" ? "bg-[#2d2d30] border border-[#007acc] text-[#569cd6]" : "hover:bg-[#3e3e42]"}`}
                    >
                        <Droplets className="w-5 h-5" />
                        <span className="text-[9px] mt-0.5">Blend</span>
                    </button>

                    <div className="w-px h-8 bg-[#3e3e42] mx-1 shrink-0" />

                    <div className="flex items-center gap-2 px-2 bg-[#1e1e1e] rounded h-10 shrink-0">
                        <div className="flex flex-col items-center justify-center w-8">
                            <span className="text-xs font-bold text-[#007acc]">{brushSize}</span>
                            <span className="text-[9px] text-slate-400">Size</span>
                        </div>
                        <input
                            type="range" min="1" max="100"
                            value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="w-20 accent-[#007acc]"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-2 bg-[#1e1e1e] rounded h-10 shrink-0">
                        <div className="flex flex-col items-center justify-center w-8">
                            <span className="text-xs font-bold text-[#ce9178]">{opacity}%</span>
                            <span className="text-[9px] text-slate-400">Opacity</span>
                        </div>
                        <input
                            type="range" min="1" max="100"
                            value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))}
                            className="w-20 accent-[#ce9178]"
                        />
                    </div>

                    <div className="w-px h-8 bg-[#3e3e42] mx-1 shrink-0" />

                    {/* Additional Kreska-like tools */}
                    <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] text-slate-400 shrink-0">
                        <Wand2 className="w-4 h-4 mb-0.5" />
                        <span className="text-[8px]">Auto</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] text-slate-400 shrink-0">
                        <Scissors className="w-4 h-4 mb-0.5" />
                        <span className="text-[8px]">Lasso</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] text-slate-400 shrink-0">
                        <Grid3X3 className="w-4 h-4 mb-0.5" />
                        <span className="text-[8px]">Guides</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] text-slate-400 shrink-0">
                        <SplitSquareHorizontal className="w-4 h-4 mb-0.5" />
                        <span className="text-[8px]">Mirror</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] text-slate-400 shrink-0">
                        <Type className="w-4 h-4 mb-0.5" />
                        <span className="text-[8px]">Text</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-12 h-10 rounded hover:bg-[#3e3e42] text-slate-400 shrink-0">
                        <Square className="w-4 h-4 mb-0.5" />
                        <span className="text-[8px]">Shapes</span>
                    </button>
                </div>

                {/* Spacer to push Full Screen to right if options are collapsed */}
                {!isOptionsOpen && <div className="flex-1" />}

                {/* Fullscreen Toggle */}
                <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className={`flex flex-col items-center justify-center w-12 h-10 rounded shrink-0 transition-colors ${isFullscreen ? "bg-[#2d2d30] border border-[#007acc] text-[#569cd6]" : "hover:bg-[#3e3e42] text-slate-400"}`}
                >
                    <Maximize className="w-4 h-4 mb-0.5" />
                    <span className="text-[8px]">Full</span>
                </button>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden bg-transparent relative z-10" ref={containerRef}>

                {/* Canvas Area (with checkered background simulating transparency or grid) */}
                <div
                    className="flex-1 w-full h-full flex items-center justify-center overflow-auto relative"
                    onWheel={(e) => {
                        if (e.ctrlKey || e.metaKey) {
                            e.preventDefault();
                            const delta = e.deltaY > 0 ? -0.1 : 0.1;
                            setZoom(prev => Math.min(Math.max(0.1, prev + delta), 5));
                        }
                    }}
                >
                    <div
                        className="relative shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-75 origin-center"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        <canvas
                            ref={canvasRef}
                            style={{
                                width: '800px',
                                height: '600px',
                                backgroundColor: canvasBgColor,
                                cursor: activeTool === "erase" ? "cell" : "crosshair"
                            }}
                            className="rounded-sm touch-none"
                            onPointerDown={startDrawing}
                            onPointerUp={stopDrawingPointer}
                            onPointerLeave={stopDrawingPointer}
                            onPointerMove={draw}
                            onPointerCancel={stopDrawingPointer}
                        />
                    </div>
                </div>

                {/* Brush Selection Panel Overlay */}
                {isBrushMenuOpen && (
                    <div className="absolute top-0 left-0 bottom-0 w-72 bg-[#252526] border-r border-[#3e3e42] flex flex-col shadow-2xl z-20 animate-in slide-in-from-left-4 duration-200">
                        <div className="flex items-center justify-between p-3 border-b border-[#3e3e42]">
                            <h3 className="font-bold text-sm text-slate-200">Painting Brushes</h3>
                            <button onClick={() => setIsBrushMenuOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                            {BRUSH_CATEGORIES.map(category => (
                                <div key={category} className="border-b border-[#3e3e42]/50">
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === category ? "" : category)}
                                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#3e3e42]/30 transition-colors ${expandedCategory === category ? 'bg-[#3e3e42]/50' : ''}`}
                                    >
                                        <span className={`font-bold text-sm ${expandedCategory === category ? 'text-[#569cd6]' : 'text-[#85b5e1]'}`}>
                                            {category}
                                        </span>
                                        {expandedCategory === category ? (
                                            <Minus className="w-4 h-4 text-[#569cd6]" />
                                        ) : (
                                            <Plus className="w-4 h-4 text-[#85b5e1]" />
                                        )}
                                    </button>

                                    {/* Calligraphy Specific Brushes Rendering */}
                                    {expandedCategory === category && category === "Calligraphy" && (
                                        <div className="p-2 space-y-2 bg-[#1e1e1e]/50">
                                            {CALLIGRAPHY_BRUSHES.map((brush, idx) => {
                                                const isSelected = brush.name === activeBrush;
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveBrush(brush.name)}
                                                        className={`w-full flex flex-col p-3 rounded-lg border text-left group transition-all
                                                        ${isSelected ? 'bg-[#569cd6] border-[#007acc] text-white shadow-lg' : 'bg-[#2d2d30] border-transparent hover:border-[#569cd6]/50 hover:bg-[#3e3e42]'}`}
                                                    >
                                                        <div className="flex justify-between w-full mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[13px] tracking-wide">{brush.name}</span>
                                                                {brush.badge && (
                                                                    <span className="text-[9px] font-black italic bg-black/30 px-1.5 py-0.5 rounded tracking-widest uppercase">
                                                                        {brush.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {brush.heart && (
                                                                <Heart className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between w-full mt-1">
                                                            {/* Simulated Brush Stroke Graphic */}
                                                            <div className="flex items-center flex-1 h-6">
                                                                <div className="w-8 h-[2px] bg-current opacity-70" />
                                                                <svg className="h-6 flex-1 ml-2 fill-current" viewBox="0 0 100 24" preserveAspectRatio="none">
                                                                    <path d="M0,12 Q20,0 40,12 T80,12 T100,12 L100,16 Q80,16 40,16 T0,16 Z" opacity={brush.name.includes('soft') ? 0.5 : 1} />
                                                                </svg>
                                                            </div>
                                                            {brush.options && (
                                                                <SlidersHorizontal className={`w-4 h-4 ml-4 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                                            )}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Charcoal Specific Brushes Rendering */}
                                    {expandedCategory === category && category === "Charcoal" && (
                                        <div className="p-2 space-y-2 bg-[#1e1e1e]/50">
                                            {CHARCOAL_BRUSHES.map((brush, idx) => {
                                                const isSelected = brush.name === activeBrush;
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveBrush(brush.name)}
                                                        className={`w-full flex flex-col p-3 rounded-lg border text-left group transition-all
                                                        ${isSelected ? 'bg-[#569cd6] border-[#007acc] text-white shadow-lg' : 'bg-[#2d2d30] border-transparent hover:border-[#569cd6]/50 hover:bg-[#3e3e42]'}`}
                                                    >
                                                        <div className="flex justify-between w-full mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[13px] tracking-wide">{brush.name}</span>
                                                            </div>
                                                            {brush.heart && (
                                                                <Heart className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between w-full mt-1">
                                                            <div className="flex items-center flex-1 h-6">
                                                                <div className="w-6 h-6 rounded-full border border-current border-dashed opacity-50 shrink-0" />
                                                                <svg className="h-6 flex-1 ml-2 fill-current" viewBox="0 0 100 24" preserveAspectRatio="none">
                                                                    <path d="M0,12 Q20,8 40,12 T80,12 T100,12 L100,18 Q80,18 40,16 T0,16 Z"
                                                                        opacity={brush.name.includes('light') ? 0.3 : brush.name.includes('medium') ? 0.6 : 1}
                                                                        filter="url(#charcoal-noise)"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            {brush.options && (
                                                                <SlidersHorizontal className={`w-4 h-4 ml-4 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                                            )}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Sketching / Pencil Brushes */}
                                    {expandedCategory === category && category === "Sketching" && (
                                        <div className="p-2 space-y-2 bg-[#1e1e1e]/50">
                                            {SKETCHING_BRUSHES.map((brush, idx) => {
                                                const isSelected = brush.name === activeBrush;
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveBrush(brush.name)}
                                                        className={`w-full flex flex-col p-3 rounded-lg border text-left group transition-all
                                                        ${isSelected ? 'bg-[#569cd6] border-[#007acc] text-white shadow-lg' : 'bg-[#2d2d30] border-transparent hover:border-[#569cd6]/50 hover:bg-[#3e3e42]'}`}
                                                    >
                                                        <div className="flex justify-between w-full mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[13px] tracking-wide font-medium">{brush.name}</span>
                                                            </div>
                                                            <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden self-center">
                                                                <div className="h-full bg-current transition-all duration-300 rounded-full" style={{ width: `${brush.darkness * 100}%`, opacity: 0.7 }} />
                                                            </div>
                                                        </div>
                                                        <div className="text-[9px] opacity-40 group-hover:opacity-80 uppercase tracking-tighter">
                                                            {brush.description}
                                                        </div>
                                                        <div className="flex items-center flex-1 h-4 mt-2">
                                                            <svg className="h-3 flex-1 fill-current" viewBox="0 0 100 12" preserveAspectRatio="none">
                                                                <path d={`M0,6 Q25,${6 - brush.darkness * 4} 50,6 T100,6 L100,${6 + brush.thinness * 8} Q75,${6 + brush.thinness * 6} 50,${6 + brush.thinness * 8} T0,${6 + brush.thinness * 8} Z`}
                                                                    opacity={brush.darkness}
                                                                />
                                                            </svg>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Floating Undo/Redo/Clear — always visible, shifts when brush panel is open */}
                <div className={`absolute bottom-4 flex items-center gap-1 z-30 bg-[#252526]/90 backdrop-blur border border-[#3e3e42] rounded-lg p-1 shadow-xl transition-all duration-200 ${isBrushMenuOpen ? 'left-[19rem]' : 'left-4'}`}>
                    <button
                        onClick={undo}
                        disabled={historyStep <= 0}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${historyStep <= 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#3e3e42] active:bg-[#1e1e1e]"}`}
                        title="Undo"
                    >
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={redo}
                        disabled={historyStep >= history.length - 1}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${historyStep >= history.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#3e3e42] active:bg-[#1e1e1e]"}`}
                        title="Redo"
                    >
                        <Redo2 className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-[#3e3e42]" />
                    <button
                        onClick={clearCanvas}
                        className="w-8 h-8 rounded flex items-center justify-center hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Clear Canvas"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Bottom Right Floating Zoom Control */}
                <div className="absolute right-4 bottom-4 flex items-center gap-1 z-10 bg-[#252526]/90 backdrop-blur border border-[#3e3e42] rounded-lg p-1 shadow-xl">
                    <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))} className="w-8 h-8 flex items-center justify-center hover:bg-[#3e3e42] rounded transition-colors text-slate-300 font-black">-</button>
                    <span className="text-[10px] w-12 text-center font-medium cursor-pointer hover:text-white" onClick={() => setZoom(1)} title="Reset Zoom">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="w-8 h-8 flex items-center justify-center hover:bg-[#3e3e42] rounded transition-colors text-slate-300 font-black">+</button>
                </div>

            </div>
        </div>
    );
}
