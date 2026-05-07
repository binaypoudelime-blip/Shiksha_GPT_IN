"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Zap, Info, Activity, BookOpen, X } from "lucide-react";
import Link from "next/link";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const fmt = (n: number | string, d = 2) => (+n).toFixed(d);

/* ─── colour tokens ────────────────────────────────────────────────────── */
const T = {
  bg: "var(--ol-bg, transparent)",
  surface: "var(--ol-surface, #ffffff)",
  border: "var(--ol-border, #dde3ec)",
  borderAcc: "var(--ol-borderAcc, #fef08a)",
  text: "var(--ol-text, #1e293b)",
  muted: "var(--ol-muted, #64748b)",
  faint: "var(--ol-faint, #94a3b8)",
  V: "#facc15", // Voltage/Yellow
  R: "#ef4444", // Resistance/Red
  I: "#3b82f6", // Current/Blue
  svgGround: "var(--ol-svgGround, #cbd5e1)",
};

/* ─── Slider ──────────────────────────────────────────────────────────── */
function Slider({ label, value, min, max, step = 1, onChange, unit, color, disabled = false }: any) {
  return (
    <div style={{ marginBottom: 14, opacity: disabled ? 0.6 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: T.muted, letterSpacing: ".06em", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color, fontFamily: "'DM Mono',monospace" }}>
          {fmt(value, step < 1 || value % 1 !== 0 ? 2 : 0)}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        disabled={disabled}
        style={{ width: "100%", accentColor: color, cursor: disabled ? "not-allowed" : "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
        <span style={{ fontSize: 9, color: T.faint }}>{min}{unit}</span>
        <span style={{ fontSize: 9, color: T.faint }}>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ─── Card wrapper ────────────────────────────────────────────────────── */
function Card({ children, style = {} }: any) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12, padding: 15,
      boxShadow: "0 1px 6px rgba(0,0,0,.06)",
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardTitle({ children }: any) {
  return (
    <div style={{ fontFamily: "'Caveat',cursive", fontSize: 17, color: "#1e3a5f", marginBottom: 13, fontWeight: 700 }}>
      {children}
    </div>
  );
}

/* ─── Scenario Mode ───────────────────────────────────────────────────── */
const SCENARIOS = [
  { title: "Voltage Surge", desc: "A power surge causes the battery voltage to suddenly double.", vShift: 15, rShift: 0, iAns: "up", rAns: "same" },
  { title: "Heating Up", desc: "The resistor gets very hot after prolonged use, increasing its internal resistance.", vShift: 0, rShift: 15, iAns: "down", rAns: "up" },
  { title: "Battery Drain", desc: "The battery is running out of charge, providing less electromotive force.", vShift: -10, rShift: 0, iAns: "down", rAns: "same" },
  { title: "Thicker Wires", desc: "The thin connecting wires are replaced with much thicker ones.", vShift: 0, rShift: -10, iAns: "up", rAns: "down" },
  { title: "Longer Extension Cord", desc: "A very long extension cord is added to the circuit.", vShift: 0, rShift: 15, iAns: "down", rAns: "up" },
  { title: "Poor Connection", desc: "The wire is loosely connected to the battery terminal.", vShift: 0, rShift: 15, iAns: "down", rAns: "up" },
  { title: "Upgraded Power Supply", desc: "The old 9V battery is replaced with a new 12V power supply.", vShift: 10, rShift: 0, iAns: "up", rAns: "same" },
  { title: "Better Conductor", desc: "The iron wire is replaced with a highly conductive copper wire.", vShift: 0, rShift: -10, iAns: "up", rAns: "down" },
  { title: "Corroded Terminals", desc: "Rust builds up on the battery terminals over time.", vShift: 0, rShift: 15, iAns: "down", rAns: "up" },
  { title: "Adding Another Battery", desc: "A second identical battery is added in series.", vShift: 15, rShift: 0, iAns: "up", rAns: "same" }
];

function ScenarioMode({ onClose }: { onClose: () => void }) {
  const [questions] = useState(() => [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 10));
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [predI, setPredI] = useState<"up" | "down" | "same" | null>(null);
  const [predR, setPredR] = useState<"up" | "down" | "same" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sc = questions[round];

  const baseV = 15;
  const baseR = 15;

  const currentV = submitted ? Math.max(1, baseV + sc.vShift) : baseV;
  const currentR = submitted ? Math.max(1, baseR + sc.rShift) : baseR;
  const currentI = currentV / currentR;

  const handleSubmit = () => {
    setSubmitted(true);
    if (predI === sc.iAns && predR === sc.rAns) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNext = () => {
    if (round < questions.length - 1) {
      setRound(r => r + 1);
      setPredI(null);
      setPredR(null);
      setSubmitted(false);
    } else {
      onClose();
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", color: T.text }}>Ohm's Law Scenarios</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.faint, fontWeight: 600 }}>
            <span>Round {round + 1} of {questions.length}</span>
            <span>·</span>
            <span style={{
              background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "2px 8px", borderRadius: 12, fontWeight: 800, border: `1.5px solid rgba(16, 185, 129, 0.25)`
            }}>
              {correctCount} correct
            </span>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: "50%",
          width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
          color: T.text, cursor: "pointer", transition: "all 0.2s"
        }} className="hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200">
          <X size={22} />
        </button>
      </div>

      {/* Progress Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: i === round ? T.V : i < round ? "#10b981" : T.border,
            transition: "background 0.3s"
          }} />
        ))}
      </div>

      {/* Shiksha News Box */}
      <div style={{
        background: T.surface, border: `1.5px solid rgba(239, 68, 68, 0.25)`, borderRadius: 10, overflow: "hidden",
        boxShadow: "0 2px 10px rgba(239, 68, 68, 0.05)", display: "flex", flexDirection: "column"
      }}>
        <div style={{
          background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800,
          padding: "4px 12px", display: "flex", alignItems: "center", gap: 6, letterSpacing: ".1em", textTransform: "uppercase"
        }}>
          <div style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%", animation: "pulse-ring 1.5s infinite" }} />
          LAB EVENT
        </div>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 32, lineHeight: 1 }}>⚡</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: T.text }}>{sc.title}</h3>
            <p style={{ fontSize: 14, color: T.text, margin: 0, fontWeight: 500 }}>{sc.desc}</p>
          </div>
        </div>
      </div>

      {/* Graph & Question Area Layout */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* GRAPH */}
        <div style={{
          flex: "1 1 340px",
          background: "var(--ol-bg-canvas)", border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,.04)", position: "relative"
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
            backgroundImage: "radial-gradient(circle at 1px 1px,rgba(250,204,21,.08) 1px,transparent 0)",
            backgroundSize: "22px 22px",
          }} />
          <svg viewBox="0 0 500 330" style={{ width: "100%", maxWidth: 450, display: "block", "--anim-dur": `${Math.max(0.2, 24 / Math.pow(currentI + 0.5, 0.5))}s`, zIndex: 1 } as any}>
            {/* Circuit Wires */}
            <rect x="100" y="110" width="300" height="140" fill="none" stroke={T.text} strokeWidth="10" rx="10" opacity="0.1" />
            <rect x="100" y="110" width="300" height="140" fill="none" stroke={T.text} strokeWidth="2" rx="10" opacity="0.3" />

            {/* Particles */}
            <path d="M 110 110 L 390 110 A 10 10 0 0 1 400 120 L 400 240 A 10 10 0 0 1 390 250 L 110 250 A 10 10 0 0 1 100 240 L 100 120 A 10 10 0 0 1 110 110 Z" fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" opacity="0.25" className="particle-flow" />
            <path d="M 110 110 L 390 110 A 10 10 0 0 1 400 120 L 400 240 A 10 10 0 0 1 390 250 L 110 250 A 10 10 0 0 1 100 240 L 100 120 A 10 10 0 0 1 110 110 Z" fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" opacity="0.7" className="particle-flow" />

            {/* Battery */}
            <rect x="220" y="230" width="60" height="40" fill="var(--ol-bg-canvas)" />
            <line x1="235" y1="225" x2="235" y2="275" stroke={T.text} strokeWidth="4" />
            <line x1="250" y1="240" x2="250" y2="260" stroke={T.text} strokeWidth="6" />
            <line x1="265" y1="225" x2="265" y2="275" stroke={T.text} strokeWidth="4" />
            <line x1="280" y1="240" x2="280" y2="260" stroke={T.text} strokeWidth="6" />

            <text x="222" y="252" fill={T.text} fontSize="20" fontWeight="bold">+</text>
            <text x="290" y="252" fill={T.text} fontSize="20" fontWeight="bold">-</text>

            {/* Resistor */}
            <rect x="200" y="90" width="100" height="40" fill="var(--ol-bg-canvas)" />
            <path d="M 200 110 L 210 95 L 225 125 L 240 95 L 255 125 L 270 95 L 285 125 L 300 110" fill="none" stroke={T.R} strokeWidth="6" strokeLinejoin="round" />

            {/* Values */}
            <text x="250" y="150" textAnchor="middle" fill={T.R} fontSize="20" fontWeight="bold" fontFamily="DM Mono">{fmt(currentR)} Ω</text>
            <text x="250" y="295" textAnchor="middle" fill={T.V} fontSize="20" fontWeight="bold" fontFamily="DM Mono">{fmt(currentV)} V</text>

            {submitted && (
              <g>
                <rect x="200" y="170" width="100" height="30" rx="8" fill={T.I} opacity="0.1" />
                <text x="250" y="192" textAnchor="middle" fill={T.I} fontSize="20" fontWeight="bold" fontFamily="DM Mono">{fmt(currentI)} A</text>
              </g>
            )}
          </svg>
        </div>

        {/* QUESTIONS / FEEDBACK */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 16 }}>
          {!submitted ? (
            <div style={{
              background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px 20px",
              boxShadow: "0 2px 12px rgba(0,0,0,.04)", display: "flex", flexDirection: "column", height: "100%"
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: T.text, textAlign: "center", margin: "0 0 16px" }}>What will happen?</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
                <div>
                  <div style={{ fontSize: 10, color: T.faint, textAlign: "center", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>RESISTANCE (R) WILL...</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setPredR("up")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predR === "up" ? T.R : T.border}`,
                      background: predR === "up" ? "rgba(239, 68, 68, 0.15)" : "var(--ol-bg-canvas)", color: predR === "up" ? T.R : T.muted,
                      fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s"
                    }}>↗ Go Up</button>
                    <button onClick={() => setPredR("down")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predR === "down" ? T.I : T.border}`,
                      background: predR === "down" ? "rgba(59, 130, 246, 0.15)" : "var(--ol-bg-canvas)", color: predR === "down" ? T.I : T.muted,
                      fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s"
                    }}>↘ Go Down</button>
                    <button onClick={() => setPredR("same")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predR === "same" ? T.muted : T.border}`,
                      background: predR === "same" ? "rgba(100, 116, 139, 0.15)" : "var(--ol-bg-canvas)", color: predR === "same" ? T.text : T.muted,
                      fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s"
                    }}>→ Stay Same</button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: T.faint, textAlign: "center", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>CURRENT (I) WILL...</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setPredI("up")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predI === "up" ? T.R : T.border}`,
                      background: predI === "up" ? "rgba(239, 68, 68, 0.15)" : "var(--ol-bg-canvas)", color: predI === "up" ? T.R : T.muted,
                      fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s"
                    }}>↗ Go Up</button>
                    <button onClick={() => setPredI("down")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predI === "down" ? T.I : T.border}`,
                      background: predI === "down" ? "rgba(59, 130, 246, 0.15)" : "var(--ol-bg-canvas)", color: predI === "down" ? T.I : T.muted,
                      fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s"
                    }}>↘ Go Down</button>
                    <button onClick={() => setPredI("same")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predI === "same" ? T.muted : T.border}`,
                      background: predI === "same" ? "rgba(100, 116, 139, 0.15)" : "var(--ol-bg-canvas)", color: predI === "same" ? T.text : T.muted,
                      fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.15s"
                    }}>→ Stay Same</button>
                  </div>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={!predI || !predR} style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: (!predI || !predR) ? T.border : T.V,
                color: (!predI || !predR) ? T.faint : "#854d0e",
                fontWeight: 800, fontSize: 14, cursor: (!predI || !predR) ? "not-allowed" : "pointer",
                marginTop: 24, transition: "background 0.2s"
              }}>
                Submit Prediction ❯
              </button>
            </div>
          ) : (
            <div style={{
              background: T.surface, border: `1.5px solid ${predI === sc.iAns && predR === sc.rAns ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`, borderRadius: 14, padding: "24px 20px",
              boxShadow: "0 4px 16px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "100%"
            }}>
              <div style={{
                fontSize: 28, fontWeight: 800, marginBottom: 12,
                color: predI === sc.iAns && predR === sc.rAns ? "#10b981" : "#ef4444"
              }}>
                {predI === sc.iAns && predR === sc.rAns ? "🎉 Correct!" : "❌ Incorrect"}
              </div>
              <p style={{ fontSize: 15, color: T.text, margin: "0 0 24px", lineHeight: 1.6 }}>
                Based on Ohm's Law (I = V / R), resistance went <strong style={{
                  color: sc.rAns === 'up' ? T.R : sc.rAns === 'down' ? T.I : T.muted, background: "var(--ol-bg-canvas)",
                  padding: "2px 8px", borderRadius: 6, border: `1px solid ${T.border}`
                }}>{sc.rAns.toUpperCase()}</strong>, causing the current to go <strong style={{
                  color: sc.iAns === 'up' ? T.R : sc.iAns === 'down' ? T.I : T.muted, background: "var(--ol-bg-canvas)",
                  padding: "2px 8px", borderRadius: 6, border: `1px solid ${T.border}`
                }}>{sc.iAns.toUpperCase()}</strong>.
              </p>
              <button onClick={handleNext} style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: T.text, color: T.surface, fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "background 0.2s"
              }} className="hover:opacity-90">
                {round < questions.length - 1 ? "Next Scenario ❯" : "Finish Scenarios"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                         */
/* ═══════════════════════════════════════════════════════════════════════ */
export default function OhmsLawLab() {
  const [isScenarioMode, setIsScenarioMode] = useState(false);
  const [voltage, setVoltage] = useState(15);
  const [resistance, setResistance] = useState(17);
  const [showRef, setShowRef] = useState(true);

  // Conductor states
  const [useConductor, setUseConductor] = useState(false);
  const [material, setMaterial] = useState<'copper' | 'aluminium' | 'iron'>('copper');
  const [wireLength, setWireLength] = useState(1000); // 1000 cm
  const [wireArea, setWireArea] = useState(0.1); // 0.1 mm²

  // Real world modes
  const [realMode, setRealMode] = useState<'none' | 'bulb' | 'short' | 'motor'>('none');
  const [bulbBlown, setBulbBlown] = useState(false);

  // Multimeter states
  const [vmActive, setVmActive] = useState(false);
  const [probeRed, setProbeRed] = useState({ x: 235, y: 180, node: null as string | null });
  const [probeBlack, setProbeBlack] = useState({ x: 265, y: 180, node: null as string | null });
  const [dragging, setDragging] = useState<'red' | 'black' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const MATERIALS = {
    copper: { name: 'Copper', rho: 1.68e-8 },
    aluminium: { name: 'Aluminium', rho: 2.65e-8 },
    iron: { name: 'Iron', rho: 9.71e-8 }
  };

  const currentResistance = useConductor
    ? Math.max(0.001, (MATERIALS[material].rho * wireLength * 10000) / wireArea)
    : resistance;

  const theoreticalCurrent = voltage / currentResistance;
  const current = (realMode === 'bulb' && bulbBlown) ? 0 : theoreticalCurrent;
  const isShortCircuit = (realMode === 'short' && current > 2) || current >= 40;

  useEffect(() => {
    if (realMode === 'bulb' && !bulbBlown && theoreticalCurrent > 2) {
      setBulbBlown(true);
    }
  }, [realMode, bulbBlown, theoreticalCurrent]);

  const VW = 500, VH = 330;

  // Higher current = faster animation.
  // We calculate the time it takes for one particle to complete the entire circuit loop.
  const circuitAnimDuration = current > 0 ? Math.max(0.05, 24 / Math.pow(current + 0.5, 0.5)) : 0;

  const circuitPathStr = "M 110 110 L 390 110 A 10 10 0 0 1 400 120 L 400 240 A 10 10 0 0 1 390 250 L 110 250 A 10 10 0 0 1 100 240 L 100 120 A 10 10 0 0 1 110 110 Z";

  const visualW = 40 + ((wireLength - 10) / 9990) * 80;
  const visualH = 10 + (wireArea / 5) * 20;

  const MATERIAL_COLORS = {
    copper: { border: '#b87333', fill: 'rgba(184, 115, 51, 0.4)' },
    aluminium: { border: '#9ca3af', fill: 'rgba(156, 163, 175, 0.4)' },
    iron: { border: '#52525b', fill: 'rgba(82, 82, 91, 0.4)' }
  };

  const TEST_POINTS = [
    { id: 't1', x: 150, y: 110, node: 'pos' },
    { id: 't2', x: 100, y: 130, node: 'pos' },
    { id: 't3', x: 100, y: 230, node: 'pos' },
    { id: 't4', x: 150, y: 250, node: 'pos' },
    { id: 't5', x: 350, y: 110, node: 'neg' },
    { id: 't6', x: 400, y: 150, node: 'neg' },
    { id: 't7', x: 400, y: 210, node: 'neg' },
    { id: 't8', x: 350, y: 250, node: 'neg' },
  ];

  let displayVoltage = "0.00V";
  if (probeRed.node && probeBlack.node) {
    if (probeRed.node === 'pos' && probeBlack.node === 'neg') displayVoltage = `${voltage.toFixed(2)}V`;
    else if (probeRed.node === 'neg' && probeBlack.node === 'pos') displayVoltage = `-${voltage.toFixed(2)}V`;
    else displayVoltage = "0.00V";
  }

  const handlePointerDown = (e: React.PointerEvent, probe: 'red' | 'black') => {
    e.stopPropagation();
    try { (e.target as Element).setPointerCapture(e.pointerId); } catch (e) { }
    setDragging(probe);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    if (dragging === 'red') setProbeRed({ x: svgP.x, y: svgP.y, node: null });
    else setProbeBlack({ x: svgP.x, y: svgP.y, node: null });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch (e) { }

    const probe = dragging === 'red' ? probeRed : probeBlack;
    const setProbe = dragging === 'red' ? setProbeRed : setProbeBlack;

    let snapped = false;
    for (const tp of TEST_POINTS) {
      const dx = probe.x - tp.x;
      const dy = probe.y - tp.y;
      if (Math.sqrt(dx * dx + dy * dy) < 25) {
        setProbe({ x: tp.x, y: tp.y, node: tp.node });
        snapped = true;
        break;
      }
    }
    setDragging(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "radial-gradient(circle at 1.5px 1.5px, var(--ol-dots, rgba(250,204,21,.1)) 1.5px, transparent 0)",
      backgroundSize: "24px 24px",
      fontFamily: "'DM Mono','Courier New',monospace",
      color: T.text,
      padding: "2px 16px 18px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Mono:wght@400;500;700&display=swap');
        :root {
          --ol-dots: rgba(250, 204, 21, 0.12);
          --ol-surface: #ffffff;
          --ol-border: #dde3ec;
          --ol-borderAcc: #fef08a;
          --ol-text: #1e293b;
          --ol-muted: #64748b;
          --ol-faint: #94a3b8;
          --ol-svgGround: #cbd5e1;
          --ol-bg-canvas: #fffbf5;
        }
        :root.dark, .dark {
          --ol-dots: rgba(250, 204, 21, 0.08);
          --ol-surface: #1e293b;
          --ol-border: #334155;
          --ol-borderAcc: #854d0e;
          --ol-text: #f8fafc;
          --ol-muted: #94a3b8;
          --ol-faint: #64748b;
          --ol-svgGround: #334155;
          --ol-bg-canvas: #0f172a;
        }
        * { box-sizing: border-box; }
        input[type=range] { height: 4px; border-radius: 2px; outline: none; border: none; }
        button { transition: all .15s; font-family: 'DM Mono', monospace; }
        .particle-flow {
            stroke-dasharray: 0 43.14159;
            animation: dash-flow var(--anim-dur) linear infinite;
        }
        @keyframes dash-flow {
            to {
                stroke-dashoffset: -862.8318;
            }
        }
        @keyframes pulse-ring {
            0% { stroke-width: 1; opacity: 0.3; }
            50% { stroke-width: 3; opacity: 1; }
            100% { stroke-width: 1; opacity: 0.3; }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-3px, 2px); }
          50% { transform: translate(3px, -2px); }
          75% { transform: translate(-2px, 3px); }
        }
        .test-point {
            animation: pulse-ring 2s infinite;
        }
      `}</style>

      {/* Header */}
      {!isScenarioMode && (
        <div className="-mt-2" style={{ textAlign: "center", marginBottom: 18, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
            <Link href="/app/lab/stem" style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 700, color: T.muted,
              textDecoration: "none"
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: T.surface,
                boxShadow: "0 1px 4px rgba(0,0,0,.08)", display: "flex",
                alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}`
              }}>
                <ChevronLeft size={16} />
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace" }}>Back</span>
            </Link>
          </div>
          <h1 className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 m-0" style={{ textShadow: "0 2px 8px rgba(250,204,21,.12)" }}>
            <span style={{ fontFamily: "'Caveat',cursive", fontSize: 36, fontWeight: 700 }} className="text-yellow-600 dark:text-yellow-400">
              Ohm's Law
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[15px] mx-1 mt-2 tracking-wide font-sans lowercase">
              lab
            </span>
          </h1>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => {
                setVmActive(!vmActive);
                if (!vmActive) {
                  setProbeRed({ x: 235, y: 180, node: null });
                  setProbeBlack({ x: 265, y: 180, node: null });
                }
              }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: vmActive ? T.V : T.surface,
                color: vmActive ? "#854d0e" : T.text,
                border: `1px solid ${vmActive ? T.V : T.border}`,
                padding: "6px 12px", borderRadius: 20,
                fontSize: 12, fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,.05)"
              }}
            >
              <Activity size={14} />
              {vmActive ? "Hide Voltmeter" : "Use Voltmeter"}
            </button>

            <button onClick={() => setIsScenarioMode(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg transition-all hover:-translate-y-0.5 text-sm" style={{ border: 'none' }}>
              <span className="text-lg">🎮</span> Play Scenarios
            </button>
          </div>
        </div>
      )}

      {/* Layout */}
      {isScenarioMode ? (
        <ScenarioMode onClose={() => setIsScenarioMode(false)} />
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 960, margin: "0 auto" }}>

          {/* ── LEFT ── */}
          <div style={{ flex: "0 0 214px", display: "flex", flexDirection: "column", gap: 10 }}>

            <Card>
              <CardTitle>Circuit Parameters</CardTitle>
              <Slider label="VOLTAGE (V)" value={voltage} min={1} max={50} onChange={setVoltage} unit=" V" color={T.V} />
              <Slider label="RESISTANCE (R)" value={currentResistance} min={useConductor ? 0.01 : 1} max={useConductor ? Math.max(100, currentResistance) : 100} step={useConductor ? 0.01 : 1} onChange={setResistance} unit=" Ω" color={T.R} disabled={useConductor} />

              {/* Real-World Modes */}
              <div style={{ marginTop: 20, paddingTop: 15, borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 12 }}>Real-World Modes</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => {
                    if (realMode === 'bulb') setRealMode('none');
                    else { setRealMode('bulb'); setVoltage(15); setResistance(17); setUseConductor(false); setBulbBlown(false); }
                  }} style={{
                    padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: "left", cursor: "pointer",
                    background: realMode === 'bulb' ? "#fef08a" : T.surface, border: `1px solid ${realMode === 'bulb' ? "#facc15" : T.border}`, color: T.text,
                    transition: "all 0.2s"
                  }}>💡 The Light Bulb</button>

                  <button onClick={() => {
                    if (realMode === 'short') setRealMode('none');
                    else {
                      setRealMode('short');
                      setVoltage(15);
                      setResistance(17);
                      setUseConductor(false);
                    }
                  }} style={{
                    padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: "left", cursor: "pointer",
                    background: realMode === 'short' ? "#fee2e2" : T.surface, border: `1px solid ${realMode === 'short' ? "#ef4444" : T.border}`, color: T.text,
                    transition: "all 0.2s"
                  }}>🔥 Short Circuit</button>

                  <button onClick={() => {
                    if (realMode === 'motor') setRealMode('none');
                    else { setRealMode('motor'); setVoltage(15); setResistance(17); setUseConductor(false); }
                  }} style={{
                    padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: "left", cursor: "pointer",
                    background: realMode === 'motor' ? "#dbeafe" : T.surface, border: `1px solid ${realMode === 'motor' ? "#3b82f6" : T.border}`, color: T.text,
                    transition: "all 0.2s"
                  }}>⚙️ DC Motor</button>
                </div>

                {realMode === 'bulb' && bulbBlown && (
                  <button onClick={() => { setBulbBlown(false); setVoltage(5); }} style={{
                    marginTop: 10, width: "100%", padding: "8px", background: "#ef4444", color: "#fff", borderRadius: 6, fontSize: 12, fontWeight: "bold", border: "none", cursor: "pointer"
                  }}>Reset Bulb (Lower Voltage!)</button>
                )}
              </div>

              {/* Conductors Toggle */}
              <div style={{ marginTop: 20, paddingTop: 15, borderTop: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: useConductor ? 12 : 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Try Conductors</span>
                  <button onClick={() => {
                    const next = !useConductor;
                    setUseConductor(next);
                    if (next) setRealMode('none');
                  }} style={{
                    background: useConductor ? T.I : T.surface,
                    color: useConductor ? "#fff" : T.text,
                    border: `1px solid ${useConductor ? T.I : T.border}`,
                    padding: "4px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, cursor: "pointer"
                  }}>
                    {useConductor ? "ON" : "OFF"}
                  </button>
                </div>

                {useConductor && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {Object.entries(MATERIALS).map(([key, mat]) => (
                        <button key={key} onClick={() => setMaterial(key as any)} style={{
                          flex: 1, padding: "6px 0", fontSize: 10, fontWeight: 700, borderRadius: 6,
                          background: material === key ? T.muted : T.surface,
                          color: material === key ? "#fff" : T.text,
                          border: `1px solid ${material === key ? T.muted : T.border}`,
                          cursor: "pointer"
                        }}>
                          {mat.name}
                        </button>
                      ))}
                    </div>

                    <div style={{ fontSize: 10, color: T.muted, marginBottom: 2 }}>
                      Resistivity (ρ): <span style={{ fontFamily: "'DM Mono',monospace", color: T.text, fontWeight: "bold" }}>{MATERIALS[material].rho.toExponential(2)} Ω·m</span>
                    </div>

                    <Slider label="LENGTH (L)" value={wireLength} min={10} max={10000} step={10} onChange={setWireLength} unit=" cm" color={T.muted} />
                    <Slider label="CROSS-SECTION (A)" value={wireArea} min={0.01} max={5} step={0.01} onChange={setWireArea} unit=" mm²" color={T.muted} />
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardTitle>Live Calculations</CardTitle>
              {[
                { lbl: "Current (I = V/R)", val: `${fmt(current)} A`, c: T.I },
                { lbl: "Voltage (V = I×R)", val: `${fmt(current * currentResistance)} V`, c: T.V },
                { lbl: "Resistance (R = V/I)", val: `${fmt(voltage / current)} Ω`, c: T.R },
              ].map((r, i) => (
                <div key={i} style={{
                  marginBottom: 9, paddingBottom: 9,
                  borderBottom: i < 2 ? `1px solid ${T.border}` : "none",
                }}>
                  <div style={{ fontSize: 9, color: T.faint, letterSpacing: ".07em", marginBottom: 2 }}>{r.lbl.toUpperCase()}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: r.c, fontFamily: "'DM Mono',monospace" }}>{r.val}</div>
                </div>
              ))}
            </Card>

            {/* Formula Reference */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.06)" }}>
              <button onClick={() => setShowRef(!showRef)} style={{
                width: "100%", padding: "11px 15px", background: "transparent",
                border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between",
                color: "#1e3a5f", fontFamily: "'Caveat',cursive", fontSize: 17, fontWeight: 700,
              }}>
                📌 Formulas
                <span style={{ fontSize: 11, color: T.muted }}>{showRef ? "▲" : "▼"}</span>
              </button>
              {showRef && (
                <div style={{ padding: "2px 15px 13px", borderTop: `1px solid ${T.border}` }}>
                  {[
                    ["Ohm's Law (Voltage)", `V = I × R`, T.V],
                    ["Current", `I = V / R`, T.I],
                    ["Resistance", `R = V / I`, T.R],
                    ["Resistivity (ρ)", `R = ρ × (L/A)`, T.muted]
                  ].map(([n, r, c]) => (
                    <div key={n} style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}>
                      <span style={{ color: c, fontSize: 10, fontWeight: 700, letterSpacing: ".05em" }}>{n}</span>
                      <span style={{ color: T.muted, fontSize: 12, fontFamily: "'DM Mono',monospace" }}>{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 10 }}>

            {/* SVG Canvas */}
            <div className="relative overflow-hidden rounded-[14px] p-[12px_12px_8px] shadow-[0_2px_14px_rgba(250,204,21,.08)] dark:shadow-none" style={{
              background: "var(--ol-bg-canvas)",
              border: `1.5px solid ${T.borderAcc}`,
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
                backgroundImage: "radial-gradient(circle at 1px 1px,rgba(250,204,21,.08) 1px,transparent 0)",
                backgroundSize: "22px 22px",
              }} />

              {realMode !== 'none' && (
                <div style={{
                  position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: 650,
                  background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.25)",
                  borderRadius: 8, padding: "8px 12px", fontSize: 11, color: T.text,
                  display: "flex", gap: 8, alignItems: "flex-start", zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)", backdropFilter: "blur(4px)"
                }}>
                  <Info size={14} style={{ color: "#3b82f6", marginTop: 1, flexShrink: 0 }} />
                  <div style={{ lineHeight: 1.4 }}>
                    <strong style={{ color: "#2563eb" }}>{realMode === 'bulb' ? 'Light Bulb Info:' : realMode === 'short' ? 'Short Circuit Info:' : 'DC Motor Info:'}</strong>{" "}
                    {realMode === 'bulb' ? 'See the light intensity increases when the current increases. When the current increases to more than 2A, the bulb filament cannot resist and will break.' :
                      realMode === 'short' ? 'A short circuit happens when resistance is too low. Increase the current to >2A to see the wires overheat and catch fire!' :
                        'Increase the current to see the motor spin faster. Notice how electrical energy converts to mechanical energy.'}
                  </div>
                </div>
              )}

              <svg
                ref={svgRef}
                viewBox={`0 0 ${VW} ${VH}`}
                style={{ width: "100%", display: "block", position: "relative", zIndex: 20, "--anim-dur": `${circuitAnimDuration}s`, touchAction: dragging ? 'none' : 'auto' } as React.CSSProperties}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                {/* Circuit Wires */}
                <rect x="100" y="110" width="300" height="140" fill="none" stroke={isShortCircuit ? "#ef4444" : T.text} strokeWidth="10" rx="10" opacity={isShortCircuit ? "0.6" : "0.1"} style={isShortCircuit ? { filter: "drop-shadow(0 0 8px #ef4444)" } : {}} />
                <rect x="100" y="110" width="300" height="140" fill="none" stroke={isShortCircuit ? "#dc2626" : T.text} strokeWidth="2" rx="10" opacity={isShortCircuit ? "1" : "0.3"} />

                {/* Animated Current Particles (Using stroke-dasharray for perfect sync) */}
                {current > 0 && (
                  <>
                    <path d={circuitPathStr} fill="none" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" opacity="0.25" className="particle-flow" />
                    <path d={circuitPathStr} fill="none" stroke="#22d3ee" strokeWidth="5" strokeLinecap="round" opacity="0.7" className="particle-flow" />
                    <path d={circuitPathStr} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" className="particle-flow" />
                  </>
                )}

                {/* Battery at bottom */}
                <rect x="220" y="230" width="60" height="40" fill="var(--ol-bg-canvas)" />
                <line x1="235" y1="225" x2="235" y2="275" stroke={T.text} strokeWidth="4" />
                <line x1="250" y1="240" x2="250" y2="260" stroke={T.text} strokeWidth="6" />
                <line x1="265" y1="225" x2="265" y2="275" stroke={T.text} strokeWidth="4" />
                <line x1="280" y1="240" x2="280" y2="260" stroke={T.text} strokeWidth="6" />

                {/* Terminal markers */}
                <text x="222" y="252" fill={T.text} fontSize="20" fontWeight="bold">+</text>
                <text x="290" y="252" fill={T.text} fontSize="20" fontWeight="bold">-</text>

                {/* Resistor or Conductor at top */}
                {realMode === 'bulb' ? (
                  <g transform="translate(250, 110)">
                    {/* Bulb Base */}
                    <rect x="-12" y="-10" width="24" height="20" fill="#94a3b8" rx="2" />
                    <path d="M -12 -2 L 12 -2 M -12 3 L 12 3 M -12 8 L 12 8" stroke="#475569" strokeWidth="1" />

                    {/* Glow effect */}
                    {!bulbBlown && current > 0 && (
                      <circle cx="0" cy="-35" r={25 + current * 1.5} fill="#facc15" opacity="0.3" filter="blur(6px)" />
                    )}

                    {/* Bulb Glass */}
                    <circle cx="0" cy="-35" r="25" fill={bulbBlown ? "#f1f5f9" : `rgba(250, 204, 21, ${Math.min(1, current / 2)})`} stroke="#cbd5e1" strokeWidth="2" />

                    {/* Filament */}
                    {!bulbBlown ? (
                      <path d="M -8 -15 L -12 -30 L -4 -40 L 0 -35 L 4 -40 L 12 -30 L 8 -15" fill="none" stroke={current > 0 ? "#ea580c" : "#64748b"} strokeWidth={current > 0 ? "3" : "2"} />
                    ) : (
                      <path d="M -8 -15 L -12 -30 M 12 -30 L 8 -15 M -4 -40 L 4 -40" fill="none" stroke="#64748b" strokeWidth="2" /> // broken filament
                    )}
                  </g>
                ) : realMode === 'motor' ? (
                  <g transform="translate(250, 110)">
                    {/* Motor Body */}
                    <rect x="-25" y="-20" width="50" height="40" fill="#cbd5e1" rx="6" stroke="#475569" strokeWidth="2" />
                    <circle cx="0" cy="0" r="10" fill="#475569" />
                    <circle cx="0" cy="0" r="4" fill="#94a3b8" />

                    {/* Spinning Fan */}
                    <g style={{ transformOrigin: "0px 0px", animation: current > 0 ? `spin ${Math.max(0.05, 2 / current)}s linear infinite` : 'none' }}>
                      <path d="M 0 -10 C 15 -35 30 -20 10 0 C 30 20 15 35 0 10 C -15 35 -30 20 -10 0 C -30 -20 -15 -35 0 -10 Z" fill="#3b82f6" opacity="0.9" stroke="#1d4ed8" strokeWidth="1" />
                    </g>
                  </g>
                ) : !useConductor ? (
                  <>
                    <rect x="200" y="90" width="100" height="40" fill="var(--ol-bg-canvas)" />
                    <path d="M 200 110 L 210 95 L 225 125 L 240 95 L 255 125 L 270 95 L 285 125 L 300 110" fill="none" stroke={isShortCircuit ? "#ef4444" : T.R} strokeWidth="6" strokeLinejoin="round" />
                  </>
                ) : (
                  <rect
                    x={250 - visualW / 2}
                    y={110 - visualH / 2}
                    width={visualW}
                    height={visualH}
                    fill={isShortCircuit ? "rgba(239, 68, 68, 0.5)" : MATERIAL_COLORS[material].fill}
                    stroke={isShortCircuit ? "#ef4444" : MATERIAL_COLORS[material].border}
                    strokeWidth="2"
                    rx="2"
                  />
                )}

                {/* Short Circuit Warning & Fire */}
                {isShortCircuit && (
                  <g transform="translate(250, 200)">
                    <text x="0" y="0" fontSize="45" textAnchor="middle" style={{ animation: "shake 0.4s infinite" }}>🔥</text>
                    <text x="0" y="-35" fontSize="14" fill="#ef4444" fontWeight="bold" textAnchor="middle" style={{ animation: "pulse-ring 1s infinite", textShadow: "0 0 4px #fca5a5" }}>WARNING: SHORT CIRCUIT!</text>
                    <text x="0" y="25" fontSize="11" fill="#ef4444" fontWeight="bold" textAnchor="middle">WIRES OVERHEATING</text>
                  </g>
                )}

                {/* Ammeter on left wire */}
                <rect x="80" y="160" width="40" height="40" fill="var(--ol-bg-canvas)" />
                <circle cx="100" cy="180" r="25" fill={T.surface} stroke={T.text} strokeWidth="4" />
                <text x="100" y="175" textAnchor="middle" fill={T.text} fontSize="14" fontWeight="bold">A</text>
                {(() => {
                  const valStr = current >= 1000 ? `${fmt(current / 1000, 1)}k` : fmt(current, 1);
                  return (
                    <text x="100" y="192" textAnchor="middle" fill={T.I} fontSize={valStr.length > 4 ? "11" : "14"} fontWeight="bold" fontFamily="DM Mono">
                      {valStr}A
                    </text>
                  );
                })()}

                {/* Interactive / Static Voltmeter */}
                {vmActive ? (
                  <>
                    <g transform="translate(205, 10)">
                      <rect width="90" height="55" rx="6" fill="#334155" stroke="#1e293b" strokeWidth="2" />
                      <rect x="10" y="8" width="70" height="24" rx="3" fill="#cbd5e1" />
                      <text x="45" y="25" textAnchor="middle" fill="#0f172a" fontSize="14" fontFamily="DM Mono" fontWeight="bold">
                        {displayVoltage}
                      </text>
                      <circle cx="30" cy="42" r="4" fill="#ef4444" />
                      <circle cx="60" cy="42" r="4" fill="#0f172a" />
                    </g>

                    <path d={`M 235 52 C 235 110, ${probeRed.x} ${probeRed.y - 40}, ${probeRed.x} ${probeRed.y - 45}`} fill="none" stroke="#ef4444" strokeWidth="2.5" />
                    <path d={`M 265 52 C 265 110, ${probeBlack.x} ${probeBlack.y - 40}, ${probeBlack.x} ${probeBlack.y - 45}`} fill="none" stroke="#1e293b" strokeWidth="2.5" />

                    {TEST_POINTS.map(tp => (
                      <circle key={tp.id} cx={tp.x} cy={tp.y} r="10" fill="transparent" stroke={T.V} strokeWidth="2" strokeDasharray="4 4" className="test-point" />
                    ))}

                    <g transform={`translate(${probeBlack.x}, ${probeBlack.y})`} onPointerDown={(e) => handlePointerDown(e, 'black')} style={{ cursor: 'grab' }}>
                      <polygon points="0,0 2,-15 -2,-15" fill="#cbd5e1" />
                      <rect x="-3" y="-45" width="6" height="30" fill="#1e293b" rx="2" />
                    </g>

                    <g transform={`translate(${probeRed.x}, ${probeRed.y})`} onPointerDown={(e) => handlePointerDown(e, 'red')} style={{ cursor: 'grab' }}>
                      <polygon points="0,0 2,-15 -2,-15" fill="#cbd5e1" />
                      <rect x="-3" y="-45" width="6" height="30" fill="#ef4444" rx="2" />
                    </g>
                  </>
                ) : realMode === 'none' ? (
                  <>
                    <path d="M 180 110 L 180 70 L 320 70 L 320 110" fill="none" stroke={T.muted} strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="250" cy="70" r="20" fill={T.surface} stroke={T.muted} strokeWidth="3" />
                    <text x="250" y="67" textAnchor="middle" fill={T.text} fontSize="12" fontWeight="bold">V</text>
                    <text x="250" y="82" textAnchor="middle" fill={T.V} fontSize="12" fontWeight="bold" fontFamily="DM Mono">{voltage}V</text>
                  </>
                ) : null}

                {/* Current Direction Arrows (Clockwise) */}
                <g fill={T.R} opacity="0.75">
                  {/* Top wire (flowing right) */}
                  <polygon points="335,106 347,110 335,114" />
                  {/* Bottom wire (left of battery, flowing left) */}
                  <polygon points="165,254 153,250 165,246" />
                  {/* Bottom wire (right of battery, flowing left to negative terminal) */}
                  <polygon points="350,254 338,250 350,246" />
                  {/* Right wire (flowing down) */}
                  <polygon points="396,170 400,182 404,170" />
                  {/* Left wire (flowing up) */}
                  <polygon points="104,145 100,133 96,145" />
                </g>

                {/* Current labels */}
                <text x="365" y="100" fill={T.I} opacity="0.8" fontSize="14" fontWeight="bold">I</text>

                {/* Component labels */}
                <text x="250" y="150" textAnchor="middle" fill={T.R} fontSize="16" fontWeight="bold" fontFamily="DM Mono">{fmt(currentResistance, currentResistance % 1 !== 0 ? 2 : 0)} Ω</text>
                <text x="250" y="295" textAnchor="middle" fill={T.V} fontSize="16" fontWeight="bold" fontFamily="DM Mono">{voltage} V</text>
              </svg>
            </div>

            {/* Theory / Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/30 md:col-span-2">
                <h4 className="text-yellow-800 dark:text-yellow-300 font-bold text-[13px] uppercase tracking-wider mb-2 flex items-center gap-1.5"><BookOpen size={16} /> What is Ohm's Law?</h4>
                <p className="text-[13px] leading-relaxed text-yellow-900/80 dark:text-yellow-200/80 m-0">
                  <strong>Ohm's Law</strong> states that the current through a conductor between two points is directly proportional to the voltage across the two points. It's expressed as <strong>V = IR</strong>, where V is voltage, I is current, and R is resistance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30">
                <h4 className="text-blue-800 dark:text-blue-300 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Activity size={14} /> Relationships</h4>
                <ul className="text-[11px] leading-relaxed text-blue-900/80 dark:text-blue-200/80 m-0 pl-4 space-y-1 list-disc">
                  <li><strong>V</strong> is the voltage across the conductor.</li>
                  <li><strong>I</strong> is the current flowing through the conductor.</li>
                  <li><strong>R</strong> is the resistance of the conductor.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30">
                <h4 className="text-emerald-800 dark:text-emerald-300 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap size={14} /> Units of Measurement</h4>
                <ul className="text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-200/80 m-0 pl-4 space-y-1 list-disc">
                  <li>Voltage is measured in <strong>volts (V)</strong>.</li>
                  <li>Current is measured in <strong>amperes (A)</strong>.</li>
                  <li>Resistance is measured in <strong>ohms (Ω)</strong>.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-900/10 dark:border-purple-900/30 md:col-span-2">
                <h4 className="text-purple-800 dark:text-purple-300 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Info size={14} /> Resistivity Formula</h4>
                <p className="text-[11px] leading-relaxed text-purple-900/80 dark:text-purple-200/80 m-0 mb-2">
                  Resistance depends on the material's resistivity (ρ), its length (L), and its cross-sectional area (A).
                </p>
                <div className="flex justify-center items-center bg-white dark:bg-purple-950/50 py-3 rounded border border-purple-100 dark:border-purple-800/50 mb-2 text-purple-900 dark:text-purple-100 text-[15px]" style={{ fontFamily: "math, 'Times New Roman', serif" }}>
                  <i>R</i> <span className="mx-1.5">=</span> <i>ρ</i> <span className="mx-1.5">×</span>
                  <div className="flex flex-col items-center mx-1 text-[13px]" style={{ transform: "translateY(2px)" }}>
                    <span className="border-b border-purple-900/80 dark:border-purple-100/80 px-2 pb-[1px] leading-none inline-flex items-center">
                      <i>L</i>
                    </span>
                    <span className="pt-[3px] leading-none inline-flex items-center">
                      <i>A</i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
