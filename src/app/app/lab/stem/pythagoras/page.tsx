"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Info, Activity, BookOpen, X, RefreshCw, Triangle as TriangleIcon, Map, Monitor, Ruler, Gamepad2, Grid } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const fmt = (n: number | string, d = 2) => (+n).toFixed(d);

/* ─── colour tokens ────────────────────────────────────────────────────── */
const T = {
  bg: "var(--pt-bg, transparent)",
  surface: "var(--pt-surface, #ffffff)",
  border: "var(--pt-border, #dde3ec)",
  borderAcc: "var(--pt-borderAcc, #a5f3fc)",
  text: "var(--pt-text, #1e293b)",
  muted: "var(--pt-muted, #64748b)",
  faint: "var(--pt-faint, #94a3b8)",
  A: "#f43f5e", // Side A / Rose
  B: "#3b82f6", // Side B / Blue
  C: "#eab308", // Side C / Yellow
  svgGround: "var(--pt-svgGround, #cbd5e1)",
};

/* ─── Slider ──────────────────────────────────────────────────────────── */
function Slider({ label, value, min, max, step = 1, onChange, unit, color, disabled = false }: any) {
  return (
    <div style={{ marginBottom: 14, opacity: disabled ? 0.6 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: T.muted, letterSpacing: ".06em", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color, fontFamily: "'DM Mono',monospace" }}>
          {fmt(value, step < 1 || value % 1 !== 0 ? 1 : 0)}{unit}
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
  {
    title: "Find the Base",
    desc: "A right triangle has a hypotenuse of 10 and a height of 5. What is the length of the base (Y)?",
    options: ["75", "8.66", "15", "5"],
    correctIdx: 1,
    explanation: "Using the theorem: 5² + Y² = 10². That means 25 + Y² = 100. So Y² = 75, giving Y = √75 ≈ 8.66.",
    svgType: "triangle_find_b",
    vals: { a: 5, b: "Y", c: 10 }
  },
  {
    title: "Area of a Square",
    desc: "What is the area of a square with a diagonal length of 12 inches?",
    options: ["144", "72", "24", "8.48"],
    correctIdx: 1,
    explanation: "A square's diagonal forms two right triangles. x² + x² = 12². 2x² = 144. The area of the square is x², so the area is 144 / 2 = 72.",
    svgType: "square_diagonal",
    vals: { a: "x", b: "x", c: 12 }
  },
  {
    title: "Find the Hypotenuse",
    desc: "A right triangle has a base of 6 and a height of 8. What is the length of the hypotenuse?",
    options: ["14", "10", "100", "48"],
    correctIdx: 1,
    explanation: "6² + 8² = c². 36 + 64 = 100. c = √100 = 10.",
    svgType: "triangle_find_c",
    vals: { a: 8, b: 6, c: "c = ?" }
  },
  {
    title: "Ladder on a Wall",
    desc: "A 13-foot ladder leans against a wall. The bottom of the ladder is 5 feet from the wall. How high up the wall does the ladder reach?",
    options: ["18", "8", "12", "144"],
    correctIdx: 2,
    explanation: "a² + 5² = 13². a² + 25 = 169. a² = 144, so a = √144 = 12.",
    svgType: "ladder",
    vals: { a: "a = ?", b: 5, c: 13 }
  },
  {
    title: "Distance Walked",
    desc: "You walk 9 miles North and then 12 miles East. How far are you from your starting point in a straight line?",
    options: ["21", "225", "10.5", "15"],
    correctIdx: 3,
    explanation: "9² + 12² = c². 81 + 144 = 225. c = √225 = 15.",
    svgType: "map",
    vals: { a: 9, b: 12, c: "c = ?" }
  }
];

function ScenarioMode({ onClose }: { onClose: () => void }) {
  const [questions] = useState(() => [...SCENARIOS].sort(() => Math.random() - 0.5));
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sc = questions[round];

  const handleSubmit = () => {
    setSubmitted(true);
    if (selectedOpt === sc.correctIdx) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNext = () => {
    if (round < questions.length - 1) {
      setRound(r => r + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      onClose();
    }
  };

  const renderScenarioSVG = (sc: any) => {
    if (sc.svgType === 'square_diagonal') {
      return (
        <g transform="translate(130, 60)">
          <rect x="0" y="0" width="180" height="180" fill="rgba(99,102,241,0.05)" stroke={T.text} strokeWidth="5" />
          <line x1="0" y1="180" x2="180" y2="0" stroke={T.C} strokeWidth="5" strokeDasharray="8 8" />
          <text x="90" y="210" fill={T.B} fontSize="24" fontWeight="bold" textAnchor="middle">x</text>
          <text x="-20" y="90" fill={T.A} fontSize="24" fontWeight="bold" textAnchor="middle">x</text>
          <text x="80" y="80" fill={T.C} fontSize="26" fontWeight="bold" textAnchor="middle" transform="rotate(-45, 80, 80)">12</text>
        </g>
      );
    }

    if (sc.svgType === 'triangle_find_b') {
      return (
        <g transform="translate(150, 250)">
          <polygon points="0,0 0,-100 173,0" fill="rgba(99,102,241,0.05)" stroke={T.text} strokeWidth="5" strokeLinejoin="round" />
          <polyline points="0,-20 20,-20 20,0" fill="none" stroke={T.text} strokeWidth="3" opacity="0.6" />
          <text x="-20" y="-50" fill={T.A} fontSize="24" fontWeight="bold" textAnchor="end" dominantBaseline="middle">5</text>
          <text x="86" y="35" fill={T.B} fontSize="26" fontWeight="bold" textAnchor="middle">Y</text>
          <text x="95" y="-60" fill={T.C} fontSize="24" fontWeight="bold" textAnchor="middle" transform={`rotate(30, 95, -60)`}>10</text>
        </g>
      );
    }

    // Generic right triangle for the rest
    return (
      <g transform="translate(150, 250)">
        <polygon points="0,0 0,-150 200,0" fill="rgba(99,102,241,0.05)" stroke={T.text} strokeWidth="5" strokeLinejoin="round" />
        <polyline points="0,-20 20,-20 20,0" fill="none" stroke={T.text} strokeWidth="3" opacity="0.6" />
        <text x="-20" y="-75" fill={T.A} fontSize="24" fontWeight="bold" textAnchor="end" dominantBaseline="middle">{sc.vals.a}</text>
        <text x="100" y="35" fill={T.B} fontSize="24" fontWeight="bold" textAnchor="middle">{sc.vals.b}</text>
        <text x="110" y="-90" fill={T.C} fontSize="24" fontWeight="bold" textAnchor="middle" transform={`rotate(37, 110, -90)`}>{sc.vals.c}</text>
      </g>
    );
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", color: T.text }}>Pythagoras Scenarios</h2>
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
        }}>
          <X size={22} />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: i === round ? T.C : i < round ? "#10b981" : T.border,
            transition: "background 0.3s"
          }} />
        ))}
      </div>

      <div style={{
        background: T.surface, border: `1.5px solid rgba(239, 68, 68, 0.25)`, borderRadius: 10, overflow: "hidden",
        boxShadow: "0 2px 10px rgba(239, 68, 68, 0.05)", display: "flex", flexDirection: "column"
      }}>
        <div style={{
          background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800,
          padding: "4px 12px", display: "flex", alignItems: "center", gap: 6, letterSpacing: ".1em", textTransform: "uppercase"
        }}>
          <div style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%" }} />
          LAB PROBLEM
        </div>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 32, lineHeight: 1 }}>📐</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: T.text }}>{sc.title}</h3>
            <p style={{ fontSize: 14, color: T.text, margin: 0, fontWeight: 500 }}>{sc.desc}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{
          flex: "1 1 340px",
          background: "var(--pt-bg-canvas)", border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "16px",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,.04)", position: "relative"
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
            backgroundImage: "radial-gradient(circle at 1px 1px,rgba(99,102,241,.08) 1px,transparent 0)",
            backgroundSize: "22px 22px",
          }} />
          <svg viewBox="0 0 500 330" style={{ width: "100%", maxWidth: 450, display: "block", zIndex: 1 }}>
            {renderScenarioSVG(sc)}
          </svg>
        </div>

        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 16 }}>
          {!submitted ? (
            <div style={{
              background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,.04)", display: "flex", flexDirection: "column", height: "100%"
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: T.text, textAlign: "center", margin: "0 0 20px" }}>Select the correct answer:</h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1 }}>
                {sc.options.map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOpt(idx)}
                      style={{
                        padding: "16px", borderRadius: 12,
                        border: `2px solid ${isSelected ? T.C : T.border}`,
                        background: isSelected ? "rgba(99,102,241,0.15)" : "var(--pt-bg-canvas)",
                        color: isSelected ? T.C : T.text,
                        fontSize: 18, fontWeight: 700,
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <button onClick={handleSubmit} disabled={selectedOpt === null} style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: selectedOpt === null ? T.border : T.C,
                color: selectedOpt === null ? T.faint : "#fff",
                fontWeight: 800, fontSize: 14, cursor: selectedOpt === null ? "not-allowed" : "pointer",
                marginTop: 24, transition: "background 0.2s"
              }}>
                Check Answer ❯
              </button>
            </div>
          ) : (
            <div style={{
              background: T.surface, border: `1.5px solid ${selectedOpt === sc.correctIdx ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`, borderRadius: 14, padding: "24px 20px",
              boxShadow: "0 4px 16px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "100%"
            }}>
              <div style={{
                fontSize: 28, fontWeight: 800, marginBottom: 12,
                color: selectedOpt === sc.correctIdx ? "#10b981" : "#ef4444"
              }}>
                {selectedOpt === sc.correctIdx ? "🎉 Correct!" : "❌ Incorrect"}
              </div>
              <p style={{ fontSize: 15, color: T.text, margin: "0 0 24px", lineHeight: 1.6 }}>
                {sc.explanation}
              </p>
              <button onClick={handleNext} style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: T.text, color: T.surface, fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "background 0.2s"
              }}>
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
export default function PythagorasLab() {
  const [isScenarioMode, setIsScenarioMode] = useState(false);
  const [sideA, setSideA] = useState(3);
  const [sideB, setSideB] = useState(4);
  const [coordMode, setCoordMode] = useState(false);

  // Coordinate mode points
  const [p1x, setP1x] = useState(0);
  const [p1y, setP1y] = useState(3);
  const [p2x, setP2x] = useState(4);
  const [p2y, setP2y] = useState(0);

  // Real world example
  const [rwMode, setRwMode] = useState<'none' | 'proof' | 'ladder' | 'tv' | 'map'>('none');
  const [screenDevice, setScreenDevice] = useState<'mobile' | 'laptop'>('laptop');

  // Visual Proof States
  const [pourProgress, setPourProgress] = useState(0); // 0 to 1
  const [isPouring, setIsPouring] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [proofType, setProofType] = useState<'liquid' | 'grid'>('liquid');

  const aRaw = coordMode ? Math.abs(p1y - p2y) : sideA;
  const bRaw = coordMode ? Math.abs(p1x - p2x) : sideB;

  const a = rwMode === 'proof' ? 3 : aRaw;
  const b = rwMode === 'proof' ? 4 : bRaw;
  const c = Math.sqrt(a * a + b * b);

  const isTriple = Number.isInteger(c) && a > 0 && b > 0;

  useEffect(() => {
    if (rwMode === 'proof' && isPouring) {
      let startTime = performance.now();
      let duration = 3500; // 3.5 seconds pour
      let raf = requestAnimationFrame(function loop(time) {
        let p = (time - startTime) / duration;
        if (p > 1) {
          setPourProgress(1);
          setIsPouring(false);
        } else {
          setPourProgress(p);
          raf = requestAnimationFrame(loop);
        }
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [rwMode, isPouring]);

  const handleVisualProof = () => {
    setRwMode('proof');
    setPourProgress(0);
    setIsPouring(false);
    setIsRotated(false);
    setTimeout(() => {
      setIsRotated(true);
      setTimeout(() => {
        setIsPouring(true);
      }, 100);
    }, 1000); // 1-second delay for rotation
  };

  // Dynamic SCALE so the triangle starts large and grows only slightly as values increase
  const maxM = Math.max(a, b);
  // Scale smaller in proof mode to fit squares, but keep it large enough
  const maxSidePx = rwMode === 'proof' ? 180 : (300 + 10 * maxM);
  const SCALE = maxSidePx / maxM;

  const VW = 1000;
  const VH = 800;

  const aS = a * SCALE;
  const bS = b * SCALE;
  const cS = c * SCALE;

  // Dynamic origins for perfect centering
  const cx = rwMode === 'proof' ? (VW / 2) : (VW / 2) - (bS / 2);
  const cy = rwMode === 'proof' ? (VH / 2) - 80 : (VH / 2) + (aS / 2);

  const tvCx = VW / 2;
  const tvCy = VH / 2;

  // Rotation and Coordinates for Visual Proof
  const theta = Math.atan2(aS, bS) * 180 / Math.PI;
  const rotAngle = rwMode === 'proof' ? 180 - theta : 0;

  const R = rotAngle * Math.PI / 180;
  const cosR = Math.cos(R);
  const sinR = Math.sin(R);

  const getGlobalX = (x: number, y: number) => cx + x * cosR - y * sinR;
  const getGlobalY = (x: number, y: number) => cy + x * sinR + y * cosR;

  const lerp = (pA: { x: number, y: number }, pB: { x: number, y: number }, t: number) => ({
    x: pA.x + (pB.x - pA.x) * t,
    y: pA.y + (pB.y - pA.y) * t,
  });

  const sqA = [{ x: 0, y: 0 }, { x: -aS, y: 0 }, { x: -aS, y: -aS }, { x: 0, y: -aS }];
  const sqB = [{ x: 0, y: 0 }, { x: bS, y: 0 }, { x: bS, y: bS }, { x: 0, y: bS }];
  const sqC = [{ x: 0, y: -aS }, { x: bS, y: 0 }, { x: bS + aS, y: -bS }, { x: aS, y: -aS - bS }];

  const yA = sqA.map(p => getGlobalY(p.x, p.y));
  const minY_A = Math.min(...yA);
  const maxY_A = Math.max(...yA);

  const yB = sqB.map(p => getGlobalY(p.x, p.y));
  const minY_B = Math.min(...yB);
  const maxY_B = Math.max(...yB);

  const yC = sqC.map(p => getGlobalY(p.x, p.y));
  const minY_C = Math.min(...yC);
  const maxY_C = Math.max(...yC);

  const waterY_A = minY_A + (maxY_A - minY_A) * pourProgress;
  const waterY_B = minY_B + (maxY_B - minY_B) * pourProgress;
  const waterY_C = maxY_C - (maxY_C - minY_C) * pourProgress;

  const getLowestPoint = (sq: { x: number, y: number }[]) => {
    return sq.reduce((lowest, p) => getGlobalY(p.x, p.y) > getGlobalY(lowest.x, lowest.y) ? p : lowest, sq[0]);
  };
  const lowestA = getLowestPoint(sqA);
  const lowestB = getLowestPoint(sqB);
  const streamA_X = getGlobalX(lowestA.x, lowestA.y);
  const streamB_X = getGlobalX(lowestB.x, lowestB.y);
  const streamA_Y = getGlobalY(lowestA.x, lowestA.y);
  const streamB_Y = getGlobalY(lowestB.x, lowestB.y);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "radial-gradient(circle at 1.5px 1.5px, var(--pt-dots, rgba(6, 182, 212, 0.1)) 1.5px, transparent 0)",
      backgroundSize: "24px 24px",
      fontFamily: "'DM Mono','Courier New',monospace",
      color: T.text,
      padding: "2px 16px 18px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Mono:wght@400;500;700&display=swap');
        :root {
          --pt-dots: rgba(6, 182, 212, 0.12);
          --pt-surface: #ffffff;
          --pt-border: #dde3ec;
          --pt-borderAcc: #cffafe;
          --pt-text: #1e293b;
          --pt-muted: #64748b;
          --pt-faint: #94a3b8;
          --pt-svgGround: #cbd5e1;
          --pt-bg-canvas: #f8fafc;
        }
        :root.dark, .dark {
          --pt-dots: rgba(6, 182, 212, 0.08);
          --pt-surface: #1e293b;
          --pt-border: #334155;
          --pt-borderAcc: #164e63;
          --pt-text: #f8fafc;
          --pt-muted: #94a3b8;
          --pt-faint: #6e7a8f;
          --pt-svgGround: #334155;
          --pt-bg-canvas: #0f172a;
        }
        * { box-sizing: border-box; }
        input[type=range] { height: 4px; border-radius: 2px; outline: none; border: none; }
        button { transition: all .15s; font-family: 'DM Mono', monospace; }
        .water {
            transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .triple-badge {
            animation: bounce 1s infinite alternate;
        }
        @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-5px); }
        }
      `}</style>

      {/* Header */}
      {!isScenarioMode && (
        <div className="-mt-2" style={{ textAlign: "center", marginBottom: 18, position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
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
          <h1 className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 m-0" style={{ textShadow: "0 2px 8px rgba(99,102,241,.12)" }}>
            <span style={{ fontFamily: "'Caveat',cursive", fontSize: 36, fontWeight: 700 }} className="text-cyan-600 dark:text-cyan-400">
              Pythagoras Theorem
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[15px] mx-1 mt-2 tracking-wide font-sans lowercase">
              lab
            </span>
          </h1>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
            {!isScenarioMode && (
              <button
                onClick={rwMode === 'proof' ? () => { setRwMode('none'); setIsPouring(false); setIsRotated(false); } : handleVisualProof}
                className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg font-bold transition-all hover:-translate-y-0.5 text-sm ${rwMode === 'proof'
                  ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
                  : 'border-sky-500 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 dark:text-sky-400'
                  }`}
                style={{ cursor: 'pointer' }}
              >
                {rwMode === 'proof' ? 'Exit Proof' : 'Visual Proof'}
              </button>
            )}
            <button onClick={() => setIsScenarioMode(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg transition-all hover:-translate-y-0.5 text-sm" style={{ border: 'none', cursor: 'pointer' }}>
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
          <div style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", gap: 10 }}>

            <Card>
              <div style={{ display: "flex", gap: 8, background: T.surface, border: `1px solid ${T.border}`, padding: 4, borderRadius: 8, marginBottom: 16 }}>
                <button onClick={() => setCoordMode(false)} style={{ flex: 1, padding: "8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: !coordMode ? T.C : "transparent", color: !coordMode ? "#fff" : T.muted, border: "none", cursor: "pointer", transition: "all 0.2s" }}>Length Mode</button>
                <button onClick={() => setCoordMode(true)} style={{ flex: 1, padding: "8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: coordMode ? T.C : "transparent", color: coordMode ? "#fff" : T.muted, border: "none", cursor: "pointer", transition: "all 0.2s" }}>Coord Mode</button>
              </div>

              {!coordMode ? (
                <>
                  <Slider label="SIDE A (Perpendicular)" value={sideA} min={1} max={20} onChange={(v: number) => { setSideA(v); }} unit="u" color={T.A} />
                  <Slider label="SIDE B (Base)" value={sideB} min={1} max={20} onChange={(v: number) => { setSideB(v); }} unit="u" color={T.B} />
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 11, color: T.faint }}>Point 1 (top):</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 10, color: T.muted }}>X1</span>
                      <input type="number" value={p1x} onChange={e => { setP1x(+e.target.value); }} style={{ width: "100%", padding: 4, borderRadius: 4, border: `1px solid ${T.border}`, background: T.surface, color: T.text }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 10, color: T.muted }}>Y1</span>
                      <input type="number" value={p1y} onChange={e => { setP1y(+e.target.value); }} style={{ width: "100%", padding: 4, borderRadius: 4, border: `1px solid ${T.border}`, background: T.surface, color: T.text }} />
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: T.faint }}>Point 2 (right):</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 10, color: T.muted }}>X2</span>
                      <input type="number" value={p2x} onChange={e => { setP2x(+e.target.value); }} style={{ width: "100%", padding: 4, borderRadius: 4, border: `1px solid ${T.border}`, background: T.surface, color: T.text }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 10, color: T.muted }}>Y2</span>
                      <input type="number" value={p2y} onChange={e => { setP2y(+e.target.value); }} style={{ width: "100%", padding: 4, borderRadius: 4, border: `1px solid ${T.border}`, background: T.surface, color: T.text }} />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { a: 3, b: 4, c: 5 },
                  { a: 5, b: 12, c: 13 },
                  { a: 6, b: 8, c: 10 }
                ].map(t => (
                  <button
                    key={t.a}
                    onClick={() => {
                      if (coordMode) setCoordMode(false);
                      setSideA(t.a);
                      setSideB(t.b);
                    }}
                    style={{
                      padding: "4px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, cursor: "pointer",
                      background: "rgba(245, 158, 11, 0.1)", color: "#d97706", border: "1px solid rgba(245, 158, 11, 0.2)",
                      display: "flex", alignItems: "center", gap: 4
                    }}
                  >
                    ✨ {t.a}, {t.b}, {t.c}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle>Calculations</CardTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div style={{ background: "rgba(244, 63, 94, 0.1)", padding: 12, borderRadius: 8, border: "1px solid rgba(244, 63, 94, 0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
                    <div style={{ fontSize: 10, color: T.A, fontWeight: 700, marginBottom: 2 }}>Side a</div>
                    <div style={{ fontSize: 18, color: T.A, fontWeight: 800 }}>{a}</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.A, fontWeight: 700, opacity: 0.8 }}>a² = {(a * a).toFixed(0)}</div>
                </div>
                <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: 12, borderRadius: 8, border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
                    <div style={{ fontSize: 10, color: T.B, fontWeight: 700, marginBottom: 2 }}>Side b</div>
                    <div style={{ fontSize: 18, color: T.B, fontWeight: 800 }}>{b}</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.B, fontWeight: 700, opacity: 0.8 }}>b² = {(b * b).toFixed(0)}</div>
                </div>
              </div>

              <div style={{ background: "rgba(6, 182, 212, 0.1)", padding: 12, borderRadius: 8, border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                <div style={{ fontSize: 10, color: T.C, fontWeight: 700, marginBottom: 4 }}>c² = a² + b² = {(a * a + b * b).toFixed(0)}</div>
                <div style={{ fontSize: 10, color: T.C, fontWeight: 700 }}>c = √{(a * a + b * b).toFixed(0)}</div>
                <div style={{ fontSize: 20, color: T.C, fontWeight: 800, marginTop: 4 }}>{fmt(c)}</div>
              </div>
            </Card>

            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <CardTitle style={{ margin: 0 }}>Real-World Applications</CardTitle>
                {rwMode !== 'none' && (
                  <button onClick={() => { setRwMode('none'); setIsPouring(false); }} style={{ padding: "4px 8px", borderRadius: 6, background: T.border, color: T.text, fontSize: 10, fontWeight: "bold", border: "none", cursor: "pointer" }}>Reset</button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button onClick={() => setRwMode('ladder')} style={{
                  textAlign: "left", padding: "8px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                  background: rwMode === 'ladder' ? "#fef3c7" : T.surface, color: T.text,
                  border: `1px solid ${rwMode === 'ladder' ? "#f59e0b" : T.border}`, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                  <TriangleIcon size={12} style={{ color: "#f59e0b" }} /> Ladder on a Wall
                </button>

                <button onClick={() => setRwMode('tv')} style={{
                  textAlign: "left", padding: "8px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                  background: rwMode === 'tv' ? "#e0e7ff" : T.surface, color: T.text,
                  border: `1px solid ${rwMode === 'tv' ? "#6366f1" : T.border}`, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                  <Monitor size={12} style={{ color: "#6366f1" }} /> Screen Size (Diagonal)
                </button>
                {rwMode === 'tv' && (
                  <div style={{ display: 'flex', gap: 4, marginLeft: 28, marginTop: -2, marginBottom: 8 }}>
                    {['mobile', 'laptop'].map(dev => (
                      <button key={dev} onClick={() => setScreenDevice(dev as any)} style={{ padding: "4px 8px", fontSize: 9, fontWeight: 600, borderRadius: 10, background: screenDevice === dev ? "#6366f1" : "transparent", color: screenDevice === dev ? "#fff" : "#6366f1", border: `1px solid #6366f1`, cursor: "pointer" }}>
                        {dev.charAt(0).toUpperCase() + dev.slice(1)}
                      </button>
                    ))}
                  </div>
                )}

                <button onClick={() => setRwMode('map')} style={{
                  textAlign: "left", padding: "8px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                  background: rwMode === 'map' ? "#dcfce7" : T.surface, color: T.text,
                  border: `1px solid ${rwMode === 'map' ? "#22c55e" : T.border}`, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                  <Map size={12} style={{ color: "#22c55e" }} /> Shortest Distance
                </button>
              </div>
            </Card>

          </div>

          {/* ── RIGHT ── */}
          <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 10 }}>

            {/* SVG Canvas */}
            <div className="relative overflow-hidden rounded-[14px] shadow-[0_2px_14px_rgba(6,182,212,.08)] dark:shadow-none" style={{
              background: "var(--pt-bg-canvas)",
              border: `1.5px solid ${T.borderAcc}`,
              minHeight: 400
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
                backgroundImage: "radial-gradient(circle at 1px 1px,rgba(6,182,212,.08) 1px,transparent 0)",
                backgroundSize: "22px 22px",
              }} />

              {rwMode !== 'none' && (
                <div style={{
                  position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: 650,
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 8, padding: "8px 12px", fontSize: 11, color: T.text,
                  display: "flex", gap: 8, alignItems: "flex-start", zIndex: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)", backdropFilter: "blur(4px)"
                }}>
                  <Info size={14} style={{ color: "#0ea5e9", marginTop: 1, flexShrink: 0 }} />
                  <div style={{ lineHeight: 1.4 }}>
                    <strong style={{ color: "#0ea5e9" }}>{rwMode === 'proof' ? 'Visual Proof:' : rwMode === 'ladder' ? 'Ladder on a Wall:' : rwMode === 'tv' ? 'Screen Diagonal:' : 'Shortest Path:'}</strong>{" "}
                    {rwMode === 'proof' ? (
                      proofType === 'liquid'
                        ? 'Notice how the water from the two smaller squares (a² and b²) perfectly fills the large square (c²), proving they are exactly equal in area!'
                        : `Notice how the total number of small unit squares in a² (${a * a}) and b² (${b * b}) exactly equals the number of unit squares in c² (${c * c}), proving a² + b² = c²!`
                    ) :
                      rwMode === 'ladder' ? 'If you know the height of the wall (a) and distance from the base (b), the ladder length is the hypotenuse (c).' :
                        rwMode === 'tv' ? 'When a TV is advertised as 55 inches, that is the diagonal length (c). It forms a right triangle with the width (b) and height (a) of the screen.' :
                          'The shortest distance between two points on a map (c) can be found by mapping their horizontal (b) and vertical (a) distances.'}
                  </div>
                </div>
              )}

              {/* Proof Type Toggles */}
              {rwMode === 'proof' && (
                <div style={{ position: "absolute", top: 80, left: 24, zIndex: 10, display: "flex", gap: 8 }}>
                  <button onClick={() => { setProofType('liquid'); setPourProgress(0); setIsPouring(false); setTimeout(() => setIsPouring(true), 100); }} style={{ padding: "6px 12px", fontSize: 11, fontWeight: "bold", borderRadius: 6, cursor: "pointer", border: `2px solid ${T.C}`, background: proofType === 'liquid' ? T.C : "transparent", color: proofType === 'liquid' ? "#fff" : T.C, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                    💧 Liquid
                  </button>
                  <button onClick={() => setProofType('grid')} style={{ padding: "6px 12px", fontSize: 11, fontWeight: "bold", borderRadius: 6, cursor: "pointer", border: `2px solid ${T.C}`, background: proofType === 'grid' ? T.C : "transparent", color: proofType === 'grid' ? "#fff" : T.C, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                    <Grid size={12} /> Grid
                  </button>
                </div>
              )}

              {/* Overlay controls for Visual Proof */}
              {rwMode === 'proof' && proofType === 'liquid' && (
                <div style={{
                  position: "absolute", top: 80, right: 24, width: 220,
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 12, padding: "10px 14px", zIndex: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)", backdropFilter: "blur(8px)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: T.text, letterSpacing: 0.5 }}>POUR PROGRESS</span>
                    <button onClick={() => { setPourProgress(0); setIsPouring(false); setTimeout(() => setIsPouring(true), 100); }} style={{ background: T.C, color: "#fff", border: "none", borderRadius: 4, padding: "4px 8px", fontSize: 10, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      Replay
                    </button>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={pourProgress} onChange={(e) => { setIsPouring(false); setPourProgress(+e.target.value); }} style={{ width: "100%", accentColor: T.C, height: 6, borderRadius: 3 }} />
                </div>
              )}

              <svg
                viewBox={`0 0 ${VW} ${VH}`}
                style={{ width: "100%", height: "100%", display: "block", position: "relative", zIndex: 5 }}
              >

                {rwMode === 'proof' && (
                  <defs>
                    <clipPath id="clipA" clipPathUnits="userSpaceOnUse">
                      <polygon points={sqA.map(p => `${getGlobalX(p.x, p.y)},${getGlobalY(p.x, p.y)}`).join(' ')} />
                    </clipPath>
                    <clipPath id="clipB" clipPathUnits="userSpaceOnUse">
                      <polygon points={sqB.map(p => `${getGlobalX(p.x, p.y)},${getGlobalY(p.x, p.y)}`).join(' ')} />
                    </clipPath>
                    <clipPath id="clipC" clipPathUnits="userSpaceOnUse">
                      <polygon points={sqC.map(p => `${getGlobalX(p.x, p.y)},${getGlobalY(p.x, p.y)}`).join(' ')} />
                    </clipPath>
                  </defs>
                )}

                {rwMode === 'proof' && proofType === 'liquid' && isRotated && (
                  <g>
                    {/* Water */}
                    <rect x="0" y={waterY_A} width={VW} height={VH} fill="#3b82f6" clipPath="url(#clipA)" opacity="0.8" />
                    <rect x="0" y={waterY_B} width={VW} height={VH} fill="#3b82f6" clipPath="url(#clipB)" opacity="0.8" />
                    <rect x="0" y={waterY_C} width={VW} height={VH} fill="#3b82f6" clipPath="url(#clipC)" opacity="0.8" />

                    {/* Streams */}
                    {pourProgress > 0 && pourProgress < 1 && (
                      <>
                        <line x1={streamA_X} y1={streamA_Y} x2={streamA_X} y2={waterY_C} stroke="#3b82f6" strokeWidth={Math.max(2, aS * 0.1)} strokeLinecap="round" opacity="0.8" />
                        <line x1={streamB_X} y1={streamB_Y} x2={streamB_X} y2={waterY_C} stroke="#3b82f6" strokeWidth={Math.max(2, bS * 0.1)} strokeLinecap="round" opacity="0.8" />
                      </>
                    )}
                  </g>
                )}

                {rwMode === 'none' || rwMode === 'proof' ? (
                  <g transform={`translate(${cx}, ${cy}) rotate(${rotAngle})`} style={{ transition: "transform 1s ease-in-out" }}>
                    <polygon
                      points={`0,0 0,${-aS} ${bS},0`}
                      fill="var(--pt-bg-canvas)"
                      stroke={T.text}
                      strokeWidth="5"
                      strokeLinejoin="round"
                      style={{ transition: "all 0.15s ease-out" }}
                    />

                    {/* Proof Mode Squares & Labels */}
                    {rwMode === 'proof' && (
                      <g style={{ transition: "opacity 0.5s ease-in", opacity: rotAngle > 0 ? 1 : 0 }}>
                        <polygon points={sqA.map(p => `${p.x},${p.y}`).join(' ')} fill={proofType === 'liquid' && !isRotated ? "rgba(59, 130, 246, 0.8)" : "none"} stroke={T.A} strokeWidth="4" />
                        <polygon points={sqB.map(p => `${p.x},${p.y}`).join(' ')} fill={proofType === 'liquid' && !isRotated ? "rgba(59, 130, 246, 0.8)" : "none"} stroke={T.B} strokeWidth="4" />
                        <polygon points={sqC.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={T.C} strokeWidth="4" />

                        {/* Grid Lines */}
                        {proofType === 'grid' && (
                          <>
                            {Array.from({ length: a - 1 }).map((_, i) => {
                              const t = (i + 1) / a;
                              const p1 = lerp(sqA[0], sqA[1], t);
                              const p2 = lerp(sqA[3], sqA[2], t);
                              return <line key={`a-h-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={T.A} strokeWidth="1.5" opacity="0.4" />;
                            })}
                            {Array.from({ length: a - 1 }).map((_, i) => {
                              const t = (i + 1) / a;
                              const p1 = lerp(sqA[0], sqA[3], t);
                              const p2 = lerp(sqA[1], sqA[2], t);
                              return <line key={`a-v-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={T.A} strokeWidth="1.5" opacity="0.4" />;
                            })}

                            {Array.from({ length: b - 1 }).map((_, i) => {
                              const t = (i + 1) / b;
                              const p1 = lerp(sqB[0], sqB[1], t);
                              const p2 = lerp(sqB[3], sqB[2], t);
                              return <line key={`b-h-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={T.B} strokeWidth="1.5" opacity="0.4" />;
                            })}
                            {Array.from({ length: b - 1 }).map((_, i) => {
                              const t = (i + 1) / b;
                              const p1 = lerp(sqB[0], sqB[3], t);
                              const p2 = lerp(sqB[1], sqB[2], t);
                              return <line key={`b-v-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={T.B} strokeWidth="1.5" opacity="0.4" />;
                            })}

                            {Array.from({ length: c - 1 }).map((_, i) => {
                              const t = (i + 1) / c;
                              const p1 = lerp(sqC[0], sqC[1], t);
                              const p2 = lerp(sqC[3], sqC[2], t);
                              return <line key={`c-h-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={T.C} strokeWidth="1.5" opacity="0.4" />;
                            })}
                            {Array.from({ length: c - 1 }).map((_, i) => {
                              const t = (i + 1) / c;
                              const p1 = lerp(sqC[0], sqC[3], t);
                              const p2 = lerp(sqC[1], sqC[2], t);
                              return <line key={`c-v-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={T.C} strokeWidth="1.5" opacity="0.4" />;
                            })}
                          </>
                        )}

                        <text x={-aS / 2} y={-aS / 2} fill={T.A} fontSize="28" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${-rotAngle}, ${-aS / 2}, ${-aS / 2})`} style={{ textShadow: "0 2px 4px rgba(255,255,255,0.8)" }}>a²</text>
                        <text x={bS / 2} y={bS / 2} fill={T.B} fontSize="28" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${-rotAngle}, ${bS / 2}, ${bS / 2})`} style={{ textShadow: "0 2px 4px rgba(255,255,255,0.8)" }}>b²</text>
                        <text x={bS / 2 + aS / 2} y={-aS / 2 - bS / 2} fill={T.C} fontSize="28" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${-rotAngle}, ${bS / 2 + aS / 2}, ${-aS / 2 - bS / 2})`} style={{ textShadow: "0 2px 4px rgba(255,255,255,0.8)" }}>c²</text>
                      </g>
                    )}

                    <polyline points={`0,${Math.min(-20, -aS / 4)} ${Math.min(20, bS / 4)},${Math.min(-20, -aS / 4)} ${Math.min(20, bS / 4)},0`} fill="none" stroke={T.text} strokeWidth="3" opacity="0.6" style={{ transition: "all 0.15s ease-out" }} />

                    {rwMode === 'proof' && (
                      <g style={{ transition: "opacity 0.5s ease-in", opacity: rotAngle > 0 ? 1 : 0 }}>
                        <text x={24} y={-aS / 2} fill={T.A} fontSize="20" fontWeight="bold" textAnchor="start" dominantBaseline="middle" stroke="var(--pt-surface)" strokeWidth="4" strokeLinejoin="round" paintOrder="stroke" transform={`rotate(${-rotAngle}, 24, ${-aS / 2})`}>{a}</text>
                        <text x={bS / 2} y={-20} fill={T.B} fontSize="20" fontWeight="bold" textAnchor="middle" stroke="var(--pt-surface)" strokeWidth="4" strokeLinejoin="round" paintOrder="stroke" transform={`rotate(${-rotAngle}, ${bS / 2}, -20)`}>{b}</text>
                        <text
                          x={bS / 2 - (aS / cS) * 16}
                          y={-aS / 2 + (bS / cS) * 16}
                          fill={T.C}
                          fontSize="20"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${-rotAngle}, ${bS / 2 - (aS / cS) * 16}, ${-aS / 2 + (bS / cS) * 16})`}
                          stroke="var(--pt-surface)" strokeWidth="4" strokeLinejoin="round" paintOrder="stroke"
                        >
                          {c}
                        </text>
                      </g>
                    )}

                    {rwMode !== 'proof' && (
                      <>
                        <text x={-20} y={-aS / 2} fill={T.A} fontSize="28" fontWeight="bold" textAnchor="end" dominantBaseline="middle" stroke="var(--pt-surface)" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" style={{ transition: "all 0.15s ease-out" }}>a = {a}</text>
                        <text x={bS / 2} y={35} fill={T.B} fontSize="28" fontWeight="bold" textAnchor="middle" stroke="var(--pt-surface)" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" style={{ transition: "all 0.15s ease-out" }}>b = {b}</text>

                        <text
                          x={bS / 2 + (aS / cS) * 40}
                          y={-aS / 2 - (bS / cS) * 40}
                          fill={T.C}
                          fontSize="30"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${theta}, ${bS / 2 + (aS / cS) * 40}, ${-aS / 2 - (bS / cS) * 40})`}
                          stroke="var(--pt-surface)" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke"
                          style={{ transition: "all 0.15s ease-out" }}
                        >
                          c = {fmt(c)}
                        </text>
                      </>
                    )}
                  </g>
                ) : rwMode === 'ladder' ? (
                  <g transform={`translate(${cx}, ${cy + 100})`} style={{ transition: "transform 0.15s ease-out" }}>
                    <rect x="-20" y={-aS} width="20" height={aS} fill="#cbd5e1" />
                    <line x1="-30" y1="0" x2={bS + 50} y2="0" stroke="#94a3b8" strokeWidth="4" />
                    <line x1="0" y1={-aS} x2={bS} y2="0" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />

                    <text x="-35" y={-aS / 2} fill="#64748b" fontSize="20" fontWeight="bold" textAnchor="end" dominantBaseline="middle">Wall Height (a) = {a}</text>
                    <text x={bS / 2} y="30" fill="#64748b" fontSize="20" fontWeight="bold" textAnchor="middle">Distance (b) = {b}</text>
                    <text
                      x={bS / 2 + 30} y={-aS / 2 - 30}
                      fill="#f59e0b" fontSize="22" fontWeight="bold" textAnchor="middle"
                      transform={`rotate(${Math.atan2(aS, bS) * 180 / Math.PI}, ${bS / 2 + 30}, ${-aS / 2 - 30})`}
                      stroke="var(--pt-surface)" strokeWidth="5" paintOrder="stroke"
                    >
                      Ladder Length (c) = {fmt(c)}
                    </text>
                    <polyline points={`0,${Math.min(-20, -aS / 4)} ${Math.min(20, bS / 4)},${Math.min(-20, -aS / 4)} ${Math.min(20, bS / 4)},0`} fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.8" />
                  </g>
                ) : rwMode === 'tv' ? (
                  <g transform={`translate(${tvCx - bS / 2}, ${tvCy - aS / 2})`} style={{ transition: "transform 0.15s ease-out" }}>
                    {screenDevice === 'mobile' ? (
                      <rect x="-15" y="-30" width={bS + 30} height={aS + 60} rx="16" fill="#1e293b" />
                    ) : (
                      <rect x="-10" y="-10" width={bS + 20} height={aS + 20} rx="6" fill="#1e293b" />
                    )}
                    <rect x="0" y="0" width={bS} height={aS} fill="#e0e7ff" />

                    {screenDevice === 'laptop' && (
                      <path d={`M -30 ${aS + 20} L ${bS + 30} ${aS + 20} L ${bS + 40} ${aS + 30} L -40 ${aS + 30} Z`} fill="#cbd5e1" />
                    )}

                    <line x1="0" y1={aS} x2={bS} y2="0" stroke="#6366f1" strokeWidth="5" strokeDasharray="8 8" />

                    <text x="-25" y={aS / 2} fill="#64748b" fontSize="20" fontWeight="bold" textAnchor="end" dominantBaseline="middle">Height = {a}</text>
                    <text x={bS / 2} y={aS + 45} fill="#64748b" fontSize="20" fontWeight="bold" textAnchor="middle">Width = {b}</text>
                    <text
                      x={bS / 2 + 20} y={aS / 2 - 20}
                      fill="#6366f1" fontSize="24" fontWeight="bold" textAnchor="middle"
                      transform={`rotate(${Math.atan2(-aS, bS) * 180 / Math.PI}, ${bS / 2 + 20}, ${aS / 2 - 20})`}
                      stroke="#e0e7ff" strokeWidth="5" paintOrder="stroke"
                    >
                      Diagonal = {fmt(c)}"
                    </text>
                    <polyline points={`0,${aS - Math.min(20, aS / 4)} ${Math.min(20, bS / 4)},${aS - Math.min(20, aS / 4)} ${Math.min(20, bS / 4)},${aS}`} fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.4" />
                  </g>
                ) : (
                  <g transform={`translate(${cx}, ${cy})`} style={{ transition: "transform 0.15s ease-out" }}>
                    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                    </pattern>
                    <rect x="-100" y={-aS - 100} width={bS + 200} height={aS + 200} fill="url(#gridPattern)" />

                    <path d={`M 0 0 L 0 ${-aS} L ${bS} ${-aS}`} fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 8" opacity="0.6" />

                    <line x1="0" y1="0" x2={bS} y2={-aS} stroke="#22c55e" strokeWidth="6" />

                    <circle cx="0" cy="0" r="10" fill="#ef4444" />
                    <circle cx={bS} cy={-aS} r="10" fill="#3b82f6" />

                    <text x="0" y="30" fill="#ef4444" fontSize="20" fontWeight="bold" textAnchor="middle">Point A</text>
                    <text x={bS} y={-aS - 20} fill="#3b82f6" fontSize="20" fontWeight="bold" textAnchor="middle">Point B</text>

                    <text x={bS / 2 - 25} y={-aS / 2 + 25} fill="#22c55e" fontSize="22" fontWeight="bold" textAnchor="middle" transform={`rotate(${Math.atan2(-aS, bS) * 180 / Math.PI}, ${bS / 2 - 25}, ${-aS / 2 + 25})`} stroke="var(--pt-bg-canvas)" strokeWidth="5" paintOrder="stroke">Distance = {fmt(c)} km</text>
                    <text x="-20" y={-aS / 2} fill="#64748b" fontSize="18" fontWeight="bold" textAnchor="end" dominantBaseline="middle">North (a) = {a} km</text>
                    <text x={bS / 2} y={-aS + 30} fill="#64748b" fontSize="18" fontWeight="bold" textAnchor="middle">East (b) = {b} km</text>
                  </g>
                )}
              </svg>
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,.06)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={16} className="text-cyan-600" /> Theorem Definition
              </h3>
              <p style={{ fontSize: 13, color: T.muted, margin: "0 0 12px", lineHeight: 1.5 }}>
                In a right-angled triangle, the square of the hypotenuse side (the side opposite the right angle) is equal to the sum of squares of the other two sides.
              </p>
              <div style={{ display: "flex", gap: 12, alignItems: "center", background: "var(--pt-bg-canvas)", padding: "10px 16px", borderRadius: 8, border: `1px solid ${T.border}` }}>
                <div style={{ flex: 1, fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700, color: T.text, textAlign: "center", letterSpacing: "2px" }}>
                  a² + b² = c²
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
