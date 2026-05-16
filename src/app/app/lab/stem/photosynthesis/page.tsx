"use client";
import React, { useState, useMemo } from "react";
import { ChevronLeft, Sun, Cloud, Moon, Home, Leaf, Wind, Thermometer, Info, Globe2, Activity } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const T = {
  bg: "var(--pt-bg, transparent)",
  surface: "var(--pt-surface, #ffffff)",
  border: "var(--pt-border, #dde3ec)",
  text: "var(--pt-text, #1e293b)",
  muted: "var(--pt-muted, #64748b)",
  faint: "var(--pt-faint, #94a3b8)",
};

const PRESETS = [
  { id: "sunny", label: "Sunny Day", icon: Sun, color: "#f59e0b", values: { light: 85, co2: 45, temp: 28 } },
  { id: "optimal", label: "Optimal", icon: Leaf, color: "#10b981", values: { light: 100, co2: 80, temp: 25 } },
  { id: "cloudy", label: "Cloudy", icon: Cloud, color: "#8b5cf6", values: { light: 30, co2: 45, temp: 20 } },
  { id: "greenhouse", label: "Greenhouse", icon: Home, color: "#ef4444", values: { light: 70, co2: 90, temp: 35 } },
  { id: "night", label: "Night", icon: Moon, color: "#3b82f6", values: { light: 0, co2: 45, temp: 15 } },
];

function Card({ children, style = {} }: any) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,.06)", ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ children, color = "#16a34a" }: any) {
  return (
    <h3 style={{ fontFamily: "'Caveat',cursive", fontSize: 20, color, margin: "0 0 16px 0", fontWeight: 700 }}>
      {children}
    </h3>
  );
}

export default function PhotosynthesisLabPage() {
  const [light, setLight] = useState(85);
  const [co2, setCo2] = useState(45);
  const [temp, setTemp] = useState(28);
  const [showProof, setShowProof] = useState(false);

  // Physics / Logic
  const isDay = light > 5;
  const tempFactor = Math.max(0, 1 - Math.abs(temp - 25) / 25); // Peak at 25C
  const photoRate = isDay ? Math.min(light, co2) * tempFactor : 0;

  // Speed of animation (lower duration = faster). Min duration 1.5s, Max 6s
  const photoDur = isDay ? Math.max(1.5, 6 - (photoRate / 20)) : 6;
  const respDur = 4; // Respiration happens at a relatively steady pace

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setLight(preset.values.light);
    setCo2(preset.values.co2);
    setTemp(preset.values.temp);
  };

  const getGlowIntensity = () => {
    return isDay ? (light / 100) : 0;
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, padding: "20px 0", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Dotted Background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px,rgba(34,197,94,.12) 1px,transparent 0)",
        backgroundSize: "24px 24px"
      }} />

      <style>{`
        :root {
          --pt-bg: transparent;
          --pt-surface: #ffffff;
          --pt-border: #dde3ec;
          --pt-text: #1e293b;
          --pt-muted: #64748b;
          --pt-faint: #94a3b8;
        }
        .dark {
          --pt-bg: transparent;
          --pt-surface: #1A1A1E;
          --pt-border: rgba(255,255,255,0.1);
          --pt-text: #f8fafc;
          --pt-muted: #94a3b8;
          --pt-faint: #64748b;
        }
        .slider {
          -webkit-appearance: none; width: 100%; height: 6px; border-radius: 4px; outline: none; transition: 0.2s;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; cursor: pointer;
        }
        .slider.light::-webkit-slider-thumb { background: #facc15; }
        .slider.co2::-webkit-slider-thumb { background: #94a3b8; }
        .slider.temp::-webkit-slider-thumb { background: #ef4444; }
        @keyframes pulse-glow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <Link href="/app/lab/stem" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: T.muted, textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}>
                <ChevronLeft size={16} />
              </div>
              Back
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontFamily: "'Caveat',cursive", fontSize: 28, color: "#22c55e", margin: 0, fontWeight: 700 }}>Photosynthesis & Respiration</h1>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.muted }}>lab</span>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            {showProof ? (
              <button onClick={() => setShowProof(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "transparent", color: "#ef4444", borderRadius: 8, fontWeight: "bold", border: "2px solid #ef4444", cursor: "pointer", transition: "all 0.2s" }}>
                Exit Proof
              </button>
            ) : (
              <button onClick={() => setShowProof(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#4f46e5", color: "#fff", borderRadius: 8, fontWeight: "bold", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)", transition: "all 0.2s" }}>
                <span style={{ fontSize: 16 }}>🔍</span> Visual Proof
              </button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
          {/* Left Column (Controls) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Cloud size={18} color="#0ea5e9" />
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: T.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Presets</h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {PRESETS.map((p) => {
                  const Icon = p.icon;
                  const isActive = light === p.values.light && co2 === p.values.co2 && temp === p.values.temp;
                  return (
                    <button
                      key={p.id}
                      onClick={() => applyPreset(p)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8,
                        background: isActive ? `${p.color}15` : T.surface,
                        border: `1px solid ${isActive ? p.color : T.border}`,
                        color: isActive ? p.color : T.text,
                        fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      <Icon size={14} color={isActive ? p.color : T.muted} />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Wind size={18} color="#22c55e" />
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: T.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Environment Factors</h3>
              </div>

              {/* Light Slider */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
                  <span style={{ color: "#facc15", display: "flex", alignItems: "center", gap: 6 }}><Sun size={14} /> Light Intensity</span>
                  <span>(PAR): {light * 10} µmol/m²/s</span>
                </div>
                <input type="range" min="0" max="100" value={light} onChange={(e) => setLight(Number(e.target.value))} className="slider light" style={{ background: `linear-gradient(to right, #facc15 ${light}%, ${T.border} ${light}%)` }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 11, color: T.faint }}>
                  <span>0 (Dark)</span>
                  <span>1000 (Full Sun)</span>
                </div>
              </div>

              {/* CO2 Slider */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
                  <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}><Cloud size={14} /> CO₂ Concentration</span>
                  <span>{co2 * 10} ppm</span>
                </div>
                <input type="range" min="0" max="100" value={co2} onChange={(e) => setCo2(Number(e.target.value))} className="slider co2" style={{ background: `linear-gradient(to right, #94a3b8 ${co2}%, ${T.border} ${co2}%)` }} />
                <div style={{ position: "relative", height: 16, marginTop: 4, fontSize: 11, color: T.faint }}>
                  <span style={{ position: "absolute", left: 0 }}>0</span>
                  <span style={{ position: "absolute", left: "40%", transform: "translateX(-50%)" }}>400 (Atmospheric)</span>
                  <span style={{ position: "absolute", right: 0 }}>1000</span>
                </div>
              </div>

              {/* Temp Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, fontWeight: 600 }}>
                  <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 6 }}><Thermometer size={14} /> Temperature</span>
                  <span>{temp}°C</span>
                </div>
                <input type="range" min="0" max="50" value={temp} onChange={(e) => setTemp(Number(e.target.value))} className="slider temp" style={{ background: `linear-gradient(to right, #ef4444 ${(temp / 50) * 100}%, ${T.border} ${(temp / 50) * 100}%)` }} />
                <div style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>Optimal temp is around 25°C</div>
              </div>
            </Card>

            {/* Real Life Examples */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Globe2 size={18} color="#0ea5e9" />
                <CardTitle>Real Life Connections</CardTitle>
              </div>
              <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, lineHeight: 1.6, color: T.text, display: "flex", flexDirection: "column", gap: 12 }}>
                <li>
                  <strong>The "Greenhouse" Effect:</strong> Farmers in the Hills use plastic tunnels (greenhouses) to trap heat and increase CO₂ levels, artificially boosting the photosynthesis rate for off-season vegetables.
                </li>
                <li>
                  <strong>Forests of the Terai:</strong> It feels cooler and "fresher" in dense forests like Chitwan because massive amounts of photosynthesis are constantly pumping Oxygen (O₂) into the atmosphere while transpiration cools the air.
                </li>
                <li>
                  <strong>High Altitude Adaptation:</strong> Lower CO₂ levels and colder temperatures in the high Himalayas slow down plant growth and photosynthesis compared to the fertile plains.
                </li>
              </ul>
            </Card>
          </div>

          {/* Right Column (Simulation & Info) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Visualizer */}
            <Card style={{ padding: 0, overflow: "hidden", position: "relative", height: 480, background: isDay ? "#e0f2fe" : "#1e293b", transition: "background 1s" }}>
              <AnimatePresence>
                {showProof ? (
                  <motion.div
                    key="proof"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 10, transformOrigin: "60% 52%" }}
                  >
                    <svg viewBox="0 0 600 350" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
                      <defs>
                        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#facc15" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Sun & Rays */}
                      {isDay && (
                        <g opacity={light / 100}>
                          <circle cx="80" cy="30" r={40 + light * 1.5} fill="url(#sunGlow)" opacity="0.8" />
                          <circle cx="80" cy="30" r="30" fill="#facc15" />
                          <g stroke="url(#rayGradient)" strokeWidth="5" strokeLinecap="round" opacity="0.9">
                            <line x1="95" y1="15" x2="275" y2="145" />
                            <line x1="80" y1="30" x2="260" y2="160" />
                            <line x1="65" y1="45" x2="245" y2="175" />
                          </g>
                        </g>
                      )}

                      {/* Chloroplast */}
                      <ellipse cx="320" cy="200" rx="160" ry="100" fill="#22c55e" stroke="#16a34a" strokeWidth="6" />

                      {/* Chloroplast Label */}
                      <g>
                        <text x="460" y="110" textAnchor="middle" fill="#4ade80" fontSize="18" fontWeight="bold">
                          Chloroplast
                        </text>
                        <path d="M 430 115 L 390 135" fill="none" stroke="#4ade80" strokeWidth="2" strokeDasharray="3 3" />
                      </g>

                      {/* Thylakoids (stacks) */}
                      <g fill="#15803d">
                        <rect x="220" y="180" width="16" height="70" rx="4" />
                        <rect x="240" y="180" width="16" height="70" rx="4" />
                        <rect x="260" y="180" width="16" height="70" rx="4" />

                        <rect x="360" y="190" width="16" height="60" rx="4" />
                        <rect x="380" y="190" width="16" height="60" rx="4" />
                        <rect x="400" y="190" width="16" height="60" rx="4" />
                      </g>

                      {/* Thylakoids Label */}
                      <g>
                        <text x="240" y="315" textAnchor="middle" fill="#16440aff" fontSize="15" fontWeight="bold">
                          Thylakoids
                        </text>
                        <line x1="240" y1="295" x2="240" y2="240" stroke="#16440aff" strokeWidth="2" strokeDasharray="3 3" />
                      </g>

                      {/* Equation text inside */}
                      <text x="320" y="135" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
                        Light + 6CO₂ + 6H₂O
                      </text>
                      <text x="320" y="165" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
                        → C₆H₁₂O₆ + 6O₂
                      </text>

                      {/* Entering Molecules */}
                      <g fill={isDay ? "#475569" : "#cbd5e1"} fontSize="18" fontWeight="bold">
                        <text>
                          CO₂
                          <animateMotion path="M -50 180 Q 150 130 220 180" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
                        </text>
                        <text>
                          H₂O
                          <animateMotion path="M 320 400 Q 300 300 300 250" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" />
                        </text>
                      </g>

                      {/* Exiting Molecules */}
                      <g fill={isDay ? "#ea580c" : "#f97316"} fontSize="16" fontWeight="bold">
                        <text>
                          Glucose
                          <animateMotion path="M 380 250 Q 480 300 650 350" dur="3.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;1;0" dur="3.5s" repeatCount="indefinite" />
                        </text>
                      </g>
                      <g fill={isDay ? "#0284c7" : "#38bdf8"} fontSize="18" fontWeight="bold">
                        <text>
                          O₂
                          <animateMotion path="M 380 140 Q 480 80 650 50" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" />
                        </text>
                        <text>
                          O₂
                          <animateMotion path="M 350 120 Q 420 50 550 -20" dur="2.8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" repeatCount="indefinite" />
                        </text>
                      </g>
                    </svg>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 24px", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(4px)", color: "#e2e8f0", fontSize: 13, lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                      Chloroplasts trap light energy to break down <strong>H₂O</strong> and <strong>CO₂</strong> into <strong>Glucose</strong> (food), releasing <strong>O₂</strong>!
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal"
                    initial={{ scale: 8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 8, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transformOrigin: "60% 52%" }}
                  >
                    {/* Sky Background adjustments */}
                    {isDay && <div style={{ position: "absolute", top: 20, right: 20, width: 60, height: 60, borderRadius: "50%", background: "#facc15", boxShadow: `0 0 ${light}px #facc15, 0 0 ${light * 2}px ${light * 0.5}px rgba(250, 204, 21, 0.4), 0 0 ${light * 4}px ${light}px rgba(250, 204, 21, 0.2)`, opacity: light / 100 }} />}
                    {!isDay && <div style={{ position: "absolute", top: 20, left: 40, width: 40, height: 40, borderRadius: "50%", background: "#e2e8f0", boxShadow: "0 0 20px rgba(255,255,255,0.2)" }} />}

                    {/* Mode indicator */}
                    <div style={{ position: "absolute", top: 16, left: isDay ? 16 : "auto", right: !isDay ? 16 : "auto", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "6px 12px", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, transition: "all 0.5s" }}>
                      {isDay ? <Sun size={14} color="#facc15" /> : <Moon size={14} color="#cbd5e1" />}
                      {isDay ? "Photosynthesis Dominates" : "Respiration Dominates"}
                    </div>

                    {/* Main SVG Simulation */}
                    <svg viewBox="-60 -60 520 390" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
                      <defs>
                        <marker id="arrow-co2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                        </marker>
                        <marker id="arrow-o2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
                        </marker>
                        <marker id="arrow-chloroplast" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#15803d" />
                        </marker>
                        <filter id="roughLeaf" x="-10%" y="-10%" width="120%" height="120%">
                          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                      </defs>

                      {/* STEM Ground line */}
                      <line x1="-60" y1="280" x2="460" y2="280" stroke={isDay ? "#166534" : "#064e3b"} strokeWidth="4" />

                      {/* Plant Stem */}
                      <path d="M 200 280 Q 190 200 200 150" fill="none" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />

                      {/* Main Leaf with Organic Texture */}
                      <g filter="url(#roughLeaf)">
                        <path d="M 200 180 C 120 180 80 100 200 50 C 320 100 280 180 200 180" fill="#22c55e" stroke="#166534" strokeWidth="3" />
                        {/* Leaf Midrib and Veins */}
                        <path d="M 200 180 L 200 50" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 200 160 Q 175 155 152 148 M 200 135 Q 165 125 142 112 M 200 105 Q 175 95 158 84 M 200 75 Q 190 68 182 66" fill="none" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        <path d="M 200 160 Q 225 155 248 148 M 200 135 Q 235 125 258 112 M 200 105 Q 225 95 242 84 M 200 75 Q 210 68 218 66" fill="none" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                      </g>

                      {/* Chloroplast Label */}
                      <g opacity={isDay ? 1 : 0.6} style={{ transition: "all 0.5s" }}>
                        <path d="M 300 220 Q 280 190 255 150" fill="none" stroke="#15803d" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-chloroplast)" />
                        <text x="305" y="220" textAnchor="start" dominantBaseline="middle" fill="#15803d" fontSize="13" fontWeight="bold">Chloroplasts</text>
                      </g>

                      {/* Chloroplasts - Glow intensifies with light */}
                      {[
                        { x: 160, y: 110, r: 12 }, { x: 240, y: 110, r: 12 },
                        { x: 150, y: 140, r: 10 }, { x: 250, y: 140, r: 10 },
                        { x: 180, y: 80, r: 8 }, { x: 220, y: 80, r: 8 },
                      ].map((c, i) => (
                        <g key={i}>
                          {isDay && light > 0 && (
                            <circle cx={c.x} cy={c.y} r={c.r} fill="#86efac"
                              style={{
                                transformOrigin: `${c.x}px ${c.y}px`,
                                animation: `pulse-glow ${photoDur || 2}s infinite ease-out`
                              }}
                            />
                          )}
                          <circle cx={c.x} cy={c.y} r={c.r} fill="#4ade80" stroke="#16a34a" strokeWidth="1"
                            style={{
                              filter: `drop-shadow(0 0 ${getGlowIntensity() * 2}px #86efac)`,
                              opacity: 0.8 + getGlowIntensity() * 0.2,
                              transition: "all 0.5s"
                            }}
                          />
                          {/* Internal thylakoid details */}
                          <circle cx={c.x - c.r * 0.3} cy={c.y} r={c.r * 0.2} fill="#15803d" opacity="0.5" />
                          <circle cx={c.x + c.r * 0.3} cy={c.y} r={c.r * 0.2} fill="#15803d" opacity="0.5" />
                        </g>
                      ))}

                      {/* Animated Molecules based on Time of Day */}
                      {isDay ? (
                        <g>
                          {/* Trajectory Arrows */}
                          <path d="M 30 200 Q 80 160 140 140" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-co2)" opacity="0.4" />
                          <path d="M 370 180 Q 320 140 260 140" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-co2)" opacity="0.4" />
                          <path d="M 140 100 Q 80 70 30 30" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-o2)" opacity="0.4" />
                          <path d="M 260 100 Q 320 70 370 30" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-o2)" opacity="0.4" />

                          {/* Photosynthesis: CO2 in, O2 out */}
                          {/* CO2 Entering */}
                          <g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="12" fontWeight="bold">CO₂</text>
                              <animateMotion path="M 30 200 Q 80 160 140 140" dur={`${photoDur}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${photoDur}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="12" fontWeight="bold">CO₂</text>
                              <animateMotion path="M 370 180 Q 320 140 260 140" dur={`${photoDur + 0.5}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${photoDur + 0.5}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="12" fontWeight="bold">CO₂</text>
                              <animateMotion path="M 30 200 Q 80 160 140 140" dur={`${photoDur + 1.2}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${photoDur + 1.2}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="12" fontWeight="bold">CO₂</text>
                              <animateMotion path="M 370 180 Q 320 140 260 140" dur={`${photoDur + 1.7}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${photoDur + 1.7}s`} repeatCount="indefinite" />
                            </g>
                          </g>
                          {/* O2 Exiting */}
                          <g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#0284c7" fontSize="12" fontWeight="bold">O₂</text>
                              <animateMotion path="M 140 100 Q 80 70 30 30" dur={`${photoDur}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${photoDur}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#0284c7" fontSize="12" fontWeight="bold">O₂</text>
                              <animateMotion path="M 260 100 Q 320 70 370 30" dur={`${photoDur + 0.5}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${photoDur + 0.5}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#0284c7" fontSize="12" fontWeight="bold">O₂</text>
                              <animateMotion path="M 140 100 Q 80 70 30 30" dur={`${photoDur + 1.2}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${photoDur + 1.2}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#0284c7" fontSize="12" fontWeight="bold">O₂</text>
                              <animateMotion path="M 260 100 Q 320 70 370 30" dur={`${photoDur + 1.7}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${photoDur + 1.7}s`} repeatCount="indefinite" />
                            </g>
                          </g>
                        </g>
                      ) : (
                        <g>
                          {/* Trajectory Arrows */}
                          <path d="M 30 200 Q 80 160 140 140" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-o2)" opacity="0.4" />
                          <path d="M 370 180 Q 320 140 260 140" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-o2)" opacity="0.4" />
                          <path d="M 140 100 Q 80 70 30 30" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-co2)" opacity="0.4" />
                          <path d="M 260 100 Q 320 70 370 30" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-co2)" opacity="0.4" />

                          {/* Respiration: O2 in, CO2 out */}
                          {/* O2 Entering */}
                          <g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#0284c7" fontSize="12" fontWeight="bold">O₂</text>
                              <animateMotion path="M 30 200 Q 80 160 140 140" dur={`${respDur}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${respDur}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#0284c7" fontSize="12" fontWeight="bold">O₂</text>
                              <animateMotion path="M 370 180 Q 320 140 260 140" dur={`${respDur + 0.5}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${respDur + 0.5}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#0284c7" fontSize="12" fontWeight="bold">O₂</text>
                              <animateMotion path="M 30 200 Q 80 160 140 140" dur={`${respDur + 1.2}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${respDur + 1.2}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#0284c7" fontSize="12" fontWeight="bold">O₂</text>
                              <animateMotion path="M 370 180 Q 320 140 260 140" dur={`${respDur + 1.7}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${respDur + 1.7}s`} repeatCount="indefinite" />
                            </g>
                          </g>
                          {/* CO2 Exiting */}
                          <g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="12" fontWeight="bold">CO₂</text>
                              <animateMotion path="M 140 100 Q 80 70 30 30" dur={`${respDur}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${respDur}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="12" fontWeight="bold">CO₂</text>
                              <animateMotion path="M 260 100 Q 320 70 370 30" dur={`${respDur + 0.5}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${respDur + 0.5}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="12" fontWeight="bold">CO₂</text>
                              <animateMotion path="M 140 100 Q 80 70 30 30" dur={`${respDur + 1.2}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${respDur + 1.2}s`} repeatCount="indefinite" />
                            </g>
                            <g>
                              <circle cx="0" cy="-2" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                              <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="12" fontWeight="bold">CO₂</text>
                              <animateMotion path="M 260 100 Q 320 70 370 30" dur={`${respDur + 1.7}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;1;1;0" dur={`${respDur + 1.7}s`} repeatCount="indefinite" />
                            </g>
                          </g>
                        </g>
                      )}
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Definition & Equation */}
            <Card style={{ borderColor: "rgba(34, 197, 94, 0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Info size={18} color="#22c55e" />
                <CardTitle>What is Photosynthesis?</CardTitle>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: T.text, marginBottom: 12 }}>
                    Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: T.text, margin: 0 }}>
                    This occurs in <strong>chloroplasts</strong>, where chlorophyll absorbs light (primarily red and blue) to drive reactions that produce ATP and NADPH. These power the Calvin cycle to fix carbon into sugar molecules (Glucose).
                  </p>
                </div>
                <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 8, padding: 16 }}>
                  <strong style={{ fontSize: 11, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>The Equation:</strong>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, textAlign: "center", letterSpacing: "0.05em" }}>
                    6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂
                  </div>
                </div>
              </div>
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Cellular Respiration Definition */}
              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Activity size={18} color="#0ea5e9" />
                  <CardTitle color="#0ea5e9">What is Cellular Respiration?</CardTitle>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: T.text, marginBottom: 12 }}>
                  Cellular respiration is a process in which cells use carbohydrates (glucose) and oxygen to produce chemical energy, carbon dioxide, and water.
                </p>
                <div style={{ background: "rgba(14, 165, 233, 0.1)", border: "1px solid rgba(14, 165, 233, 0.2)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                  <strong style={{ fontSize: 11, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>The Equation:</strong>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, textAlign: "center" }}>
                    C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + chemical energy for life (ATP)
                  </div>
                </div>
              </Card>

              {/* Net Effect Section */}
              <Card style={{ borderColor: "rgba(234, 179, 8, 0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Sun size={18} color="#eab308" />
                  <CardTitle color="#eab308">The "Net" Effect</CardTitle>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: T.text, marginBottom: 12 }}>
                      Unlike photosynthesis, which requires sunlight, <strong>respiration happens continuously</strong>, 24 hours a day.
                    </p>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: T.text, margin: 0 }}>
                      In "Day," the rate of photosynthesis is typically much higher than the rate of respiration. This means the plant <strong>produces more oxygen than it consumes</strong>, which is why we primarily see O₂ being released during the day.
                    </p>
                  </div>

                  {/* Visual: Leaf with large CO2 arrows and small ghosted O2 arrows */}
                  <div style={{ background: "rgba(34, 197, 94, 0.05)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 8, padding: 16, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <svg viewBox="0 0 400 180" style={{ width: "100%", height: 180, maxWidth: 400 }}>
                      <defs>
                        <marker id="net-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
                        </marker>
                        <marker id="net-arrow-green-faint" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" opacity="0.6" />
                        </marker>
                        <marker id="net-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" opacity="0.6" />
                        </marker>
                        <marker id="net-arrow-blue-solid" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
                        </marker>
                      </defs>
                      {/* Stylized Leaf (Enlarged) */}
                      <path d="M 200 155 C 100 155 50 5 200 5 C 350 5 300 155 200 155" fill="#4ade80" stroke="#16a34a" strokeWidth="2.5" />
                      <path d="M 200 155 L 200 5" fill="none" stroke="#16a34a" strokeWidth="2" />

                      {/* Thylakoids (Left, Enlarged) */}
                      <g transform="translate(145, 80)">
                        <rect x="-18" y="-26" width="36" height="52" fill="#15803d" stroke="#166534" strokeWidth="2" rx="3" />
                        <line x1="-18" y1="-8" x2="18" y2="-8" stroke="#166534" strokeWidth="2" />
                        <line x1="-18" y1="8" x2="18" y2="8" stroke="#166534" strokeWidth="2" />
                        <text x="0" y="42" textAnchor="middle" fill="#14532d" fontSize="10" fontWeight="bold">Thylakoids</text>
                      </g>

                      {/* Mitochondria (Right, Enlarged) */}
                      <g transform="translate(255, 80)">
                        <ellipse cx="0" cy="0" rx="28" ry="18" fill="#d946ef" stroke="#a21caf" strokeWidth="2" />
                        <path d="M -16 0 Q -8 -10 0 0 T 16 0" fill="none" stroke="#fdf4ff" strokeWidth="2" opacity="0.6" />
                        <text x="0" y="42" textAnchor="middle" fill="#831843" fontSize="10" fontWeight="bold">Mitochondria</text>
                      </g>

                      {/* CO2 Entering - Large Green Arrows (Left) */}
                      <path d="M 35 50 Q 65 45 95 65" fill="none" stroke="#22c55e" strokeWidth="4" markerEnd="url(#net-arrow-green)" />
                      <circle cx="20" cy="50" r="16" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                      <text x="20" y="51" textAnchor="middle" dominantBaseline="middle" fill="#166534" fontSize="11" fontWeight="bold">CO₂</text>

                      <path d="M 35 110 Q 65 115 95 95" fill="none" stroke="#22c55e" strokeWidth="4" markerEnd="url(#net-arrow-green)" />
                      <circle cx="20" cy="110" r="16" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                      <text x="20" y="111" textAnchor="middle" dominantBaseline="middle" fill="#166534" fontSize="11" fontWeight="bold">CO₂</text>

                      {/* O2 Export - Large Blue Arrow (Bottom Right) */}
                      <path d="M 160 130 Q 210 165 270 155" fill="none" stroke="#0ea5e9" strokeWidth="3.5" markerEnd="url(#net-arrow-blue-solid)" />
                      <circle cx="285" cy="160" r="15" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2" />
                      <text x="285" y="161" textAnchor="middle" dominantBaseline="middle" fill="#0369a1" fontSize="11" fontWeight="bold">O₂</text>

                      {/* O2 Flow: Thylakoids -> Mitochondria */}
                      <path d="M 165 80 Q 200 80 220 80" fill="none" stroke="#0ea5e9" strokeWidth="2.5" markerEnd="url(#net-arrow-blue)" strokeDasharray="4 4" />
                      <text x="196" y="73" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="bold">O₂</text>

                      {/* Label for internal respiration */}
                      <text x="196" y="28" textAnchor="middle" fill="#0ea5e9" fontSize="10" opacity="0.9">Small amount</text>
                      <text x="196" y="40" textAnchor="middle" fill="#0ea5e9" fontSize="10" opacity="0.9">for respiration</text>
                      <path d="M 196 44 L 196 63" fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.6" />

                      {/* CO2 Flow: Mitochondria -> Out (Top Right) */}
                      <path d="M 275 65 Q 310 35 345 25" fill="none" stroke="#16a34a" strokeWidth="2" markerEnd="url(#net-arrow-green-faint)" strokeDasharray="4 4" opacity="0.8" />
                      <circle cx="360" cy="22" r="12" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1" opacity="0.8" />
                      <text x="360" y="23" textAnchor="middle" dominantBaseline="middle" fill="#14532d" fontSize="9" fontWeight="bold">CO₂</text>
                    </svg>
                  </div>
                </div>
              </Card>

              {/* Complementary Process / Cycle */}
              <Card style={{ background: "rgba(241, 243, 100, 0.1)", border: "1px solid rgba(14, 165, 233, 0.2)", color: T.text }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Activity size={18} color="#0284c7" />
                  <h3 style={{ fontFamily: "'Caveat',cursive", fontSize: 20, color: "#0284c7", margin: 0, fontWeight: 700 }}>Complementary Process (Energy Cycle of Life)</h3>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: T.text, marginBottom: 16 }}>
                  The net chemical reaction for photosynthesis is the <strong>opposite</strong> of cellular respiration. The products of one process are the reactants of the other. This creates a circular process where energy enters as light and leaves as chemical energy.
                </p>
                <div style={{ width: "100%", height: 480, position: "relative" }}>
                  <svg viewBox="0 -10 500 380" style={{ width: "100%", height: "100%" }}>
                    <defs>
                      <marker id="arrowDark" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                      </marker>
                      <marker id="arrowYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
                      </marker>
                    </defs>

                    {/* Top Circle: Carbohydrates + Oxygen */}
                    <circle cx="250" cy="50" r="50" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                    <text x="250" y="45" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">Carbohydrates</text>
                    <text x="250" y="60" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">+ oxygen</text>

                    {/* Bottom Circle: Carbon Dioxide + Water */}
                    <circle cx="250" cy="210" r="50" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                    <text x="250" y="205" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">Carbon dioxide</text>
                    <text x="250" y="220" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="bold">+ water</text>

                    {/* Left Circle: Photosynthesis */}
                    <circle cx="90" cy="130" r="60" fill="#ffffff" stroke="#22c55e" strokeWidth="2" />
                    <text x="90" y="95" textAnchor="middle" fill="#16a34a" fontSize="13" fontWeight="bold">Photosynthesis</text>
                    {/* Mini Chloroplast */}
                    <g transform="translate(90, 140) scale(0.35)">
                      <ellipse cx="0" cy="0" rx="90" ry="50" fill="#22c55e" stroke="#16a34a" strokeWidth="4" />
                      <g fill="#15803d">
                        <rect x="-40" y="-20" width="12" height="40" rx="3" />
                        <rect x="-24" y="-20" width="12" height="40" rx="3" />
                        <rect x="-8" y="-20" width="12" height="40" rx="3" />
                        <rect x="16" y="-15" width="12" height="30" rx="3" />
                        <rect x="32" y="-15" width="12" height="30" rx="3" />
                        <rect x="48" y="-15" width="12" height="30" rx="3" />
                      </g>
                    </g>
                    <text x="90" y="175" textAnchor="middle" fill="#64748b" fontSize="11">Chloroplast</text>

                    {/* Right Circle: Respiration */}
                    <circle cx="410" cy="130" r="60" fill="#ffffff" stroke="#0ea5e9" strokeWidth="2" />
                    <text x="410" y="90" textAnchor="middle" fill="#0284c7" fontSize="13" fontWeight="bold">Cellular</text>
                    <text x="410" y="105" textAnchor="middle" fill="#0284c7" fontSize="13" fontWeight="bold">respiration</text>
                    {/* Mini Mitochondrion */}
                    <g transform="translate(410, 145) scale(0.4)">
                      <ellipse cx="0" cy="0" rx="70" ry="35" fill="#d946ef" stroke="#a21caf" strokeWidth="4" />
                      <path d="M -50 0 Q -35 -25 -20 0 T 10 0 T 40 0" fill="none" stroke="#fdf4ff" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
                    </g>
                    <text x="410" y="175" textAnchor="middle" fill="#64748b" fontSize="11">Mitochondrion</text>

                    {/* Light Input */}
                    <path id="lightIn" d="M 20 30 L 60 80" fill="none" stroke="#d97706" strokeWidth="2" markerEnd="url(#arrowYellow)" />
                    <circle r="4" fill="#facc15" filter="drop-shadow(0 0 4px #facc15)">
                      <animateMotion dur="1.5s" repeatCount="indefinite">
                        <mpath href="#lightIn" />
                      </animateMotion>
                    </circle>
                    <circle cx="15" cy="20" r="12" fill="#facc15" />
                    <text x="35" y="25" textAnchor="start" fill="#d97706" fontSize="13" fontWeight="bold">Light energy</text>

                    {/* ATP Output */}
                    <path id="atpOut" d="M 440 80 L 480 30" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowDark)" />
                    <circle r="4" fill="#eab308" filter="drop-shadow(0 0 4px #eab308)">
                      <animateMotion dur="1.5s" repeatCount="indefinite" begin="1s">
                        <mpath href="#atpOut" />
                      </animateMotion>
                    </circle>
                    <text x="490" y="20" textAnchor="end" fill="#334155" fontSize="13" fontWeight="bold">Chemical energy</text>
                    <text x="490" y="35" textAnchor="end" fill="#334155" fontSize="13" fontWeight="bold">(ATP)</text>

                    {/* Cycle Arrows */}
                    {/* Photo -> Glucose */}
                    <path id="flow1" d="M 140 90 Q 180 50 200 50" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowDark)" />
                    <circle r="4" fill="#0ea5e9" filter="drop-shadow(0 0 4px #0ea5e9)">
                      <animateMotion dur="2.5s" repeatCount="indefinite">
                        <mpath href="#flow1" />
                      </animateMotion>
                    </circle>
                    <text x="150" y="55" transform="rotate(-30, 150, 55)" fill="#475569" fontSize="11" fontWeight="bold">Produces</text>

                    {/* Glucose -> Resp */}
                    <path id="flow2" d="M 300 50 Q 320 50 360 90" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowDark)" />
                    <circle r="4" fill="#0ea5e9" filter="drop-shadow(0 0 4px #0ea5e9)">
                      <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.2s">
                        <mpath href="#flow2" />
                      </animateMotion>
                    </circle>
                    <text x="350" y="55" transform="rotate(30, 350, 55)" fill="#475569" fontSize="11" fontWeight="bold">Move to</text>

                    {/* Resp -> CO2 */}
                    <path id="flow3" d="M 360 170 Q 320 210 300 210" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowDark)" />
                    <circle r="4" fill="#22c55e" filter="drop-shadow(0 0 4px #22c55e)">
                      <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s">
                        <mpath href="#flow3" />
                      </animateMotion>
                    </circle>
                    <text x="350" y="205" transform="rotate(-30, 350, 205)" fill="#475569" fontSize="11" fontWeight="bold">Produces</text>

                    {/* CO2 -> Photo */}
                    <path id="flow4" d="M 200 210 Q 180 210 140 170" fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowDark)" />
                    <circle r="4" fill="#22c55e" filter="drop-shadow(0 0 4px #22c55e)">
                      <animateMotion dur="2.5s" repeatCount="indefinite" begin="1.7s">
                        <mpath href="#flow4" />
                      </animateMotion>
                    </circle>
                    <text x="150" y="205" transform="rotate(30, 150, 205)" fill="#475569" fontSize="11" fontWeight="bold">Move to</text>

                    {/* Photosynthesis Definition Text */}
                    <line x1="90" y1="195" x2="90" y2="225" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="25" y="240" textAnchor="start" fill="#334155" fontSize="11">
                      <tspan x="25" dy="0" fill="#16a34a" fontSize="13" fontWeight="bold">Photosynthesis</tspan>
                      <tspan x="25" dy="14">is a process in </tspan>
                      <tspan x="25" dy="14">which sunlight is</tspan>
                      <tspan x="25" dy="14">used to produce</tspan>
                      <tspan x="25" dy="14">carbohydrates</tspan>
                      <tspan x="25" dy="14">and oxygen from</tspan>
                      <tspan x="25" dy="14">carbon dioxide</tspan>
                      <tspan x="25" dy="14">and water.</tspan>
                    </text>

                    {/* Cellular Respiration Definition Text */}
                    <line x1="410" y1="195" x2="410" y2="225" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="345" y="240" textAnchor="start" fill="#334155" fontSize="11">
                      <tspan x="345" dy="0" fill="#0284c7" fontSize="13" fontWeight="bold">Cellular</tspan>
                      <tspan x="345" dy="14" fill="#0284c7" fontSize="13" fontWeight="bold">respiration</tspan>
                      <tspan x="345" dy="18">is a process in</tspan>
                      <tspan x="345" dy="14">which cells use</tspan>
                      <tspan x="345" dy="14">carbohydrates</tspan>
                      <tspan x="345" dy="14">and oxygen</tspan>
                      <tspan x="345" dy="14">to produce</tspan>
                      <tspan x="345" dy="14">chemical energy,</tspan>
                      <tspan x="345" dy="14">carbon dioxide,</tspan>
                      <tspan x="345" dy="14">and water.</tspan>
                    </text>
                  </svg>
                </div>
              </Card>

            </div>

            {/* Differences Table */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Activity size={18} color="#f59e0b" />
                <CardTitle>Photosynthesis vs. Respiration</CardTitle>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${T.border}`, color: T.muted }}>
                      <th style={{ padding: "12px 8px" }}>Feature</th>
                      <th style={{ padding: "12px 8px" }}>Photosynthesis</th>
                      <th style={{ padding: "12px 8px" }}>Respiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "12px 8px", fontWeight: 700, color: T.text }}>Primary Goal</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Capture light energy to create food (glucose).</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Break down food (glucose) to release energy for life.</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "12px 8px", fontWeight: 700, color: T.text }}>Timing</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Occurs only in the presence of light (Day Mode).</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Occurs continuously, 24 hours a day (24/7 Process).</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "12px 8px", fontWeight: 700, color: T.text }}>Location</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Takes place in the <strong>Chloroplasts</strong>.</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Takes place in the <strong>Mitochondria</strong>.</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: "12px 8px", fontWeight: 700, color: T.text }}>Gas Exchange</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Absorbs CO₂ and releases Oxygen (O₂).</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Absorbs Oxygen (O₂) and releases CO₂.</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px 8px", fontWeight: 700, color: T.text }}>Energy Change</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Energy is stored (Endothermic).</td>
                      <td style={{ padding: "12px 8px", color: T.text }}>Energy is released (Exothermic).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
