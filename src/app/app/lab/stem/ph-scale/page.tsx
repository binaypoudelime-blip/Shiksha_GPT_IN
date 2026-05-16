"use client";
import React, { useState } from "react";
import { ChevronLeft, Beaker, BookOpen, Map, RotateCcw, X } from "lucide-react";
import Link from "next/link";

// Helper
const fmt = (n: number | string, d = 2) => (+n).toFixed(d);

const T = {
  bg: "var(--pt-bg, transparent)",
  surface: "var(--pt-surface, #ffffff)",
  border: "var(--pt-border, #dde3ec)",
  text: "var(--pt-text, #1e293b)",
  muted: "var(--pt-muted, #64748b)",
  faint: "var(--pt-faint, #94a3b8)",
  svgGround: "var(--pt-svgGround, #cbd5e1)",
};

const SUBSTANCES = [
  { name: "Hydrochloric Acid (HCl)", ph: 0.0 },
  { name: "Lemon Juice", ph: 2.2 },
  { name: "Coffee", ph: 5.0 },
  { name: "Milk", ph: 6.5 },
  { name: "Drinking Water", ph: 7.0 },
  { name: "Blood", ph: 7.4 },
  { name: "Soapy Water", ph: 10.0 },
  { name: "Bleach", ph: 12.5 },
  { name: "Liquid Drain Cleaner", ph: 14.0 },
];

function Card({ children, style = {} }: any) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 15, boxShadow: "0 1px 6px rgba(0,0,0,.06)", ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ children, style = {} }: any) {
  return (
    <div style={{ fontFamily: "'Caveat',cursive", fontSize: 17, color: "#14b8a6", marginBottom: 13, fontWeight: 700, ...style }}>
      {children}
    </div>
  );
}

const PH_COLORS = [
  "#dc2626", // 0
  "#ea580c", // 1
  "#f97316", // 2
  "#f59e0b", // 3
  "#eab308", // 4
  "#a3e635", // 5
  "#84cc16", // 6
  "#22c55e", // 7
  "#10b981", // 8
  "#14b8a6", // 9
  "#0ea5e9", // 10
  "#3b82f6", // 11
  "#6366f1", // 12
  "#8b5cf6", // 13
  "#a855f7"  // 14
];

// Map pH to color for Litmus paper and Custom slider
const getPhColor = (ph: number) => {
  return PH_COLORS[Math.round(ph)] || PH_COLORS[7];
};

const SCENARIOS = [
  {
    title: "Hydrogen Ion Concentration",
    desc: "What is the pH of an aqueous solution whose hydrogen ion concentration is 1.0 x 10⁻³M?",
    options: ["1", "3", "11", "10"],
    correctIdx: 1,
    explanation: "pH = -log₁₀[H⁺]. So pH = -log₁₀(10⁻³) = 3.",
  },
  {
    title: "Solution Type",
    desc: "Is a solution with a pH of 3 acidic, basic, or neutral?",
    options: ["Acidic", "Basic", "Neutral", "Cannot be determined"],
    correctIdx: 0,
    explanation: "A pH less than 7 indicates an acidic solution.",
  },
  {
    title: "Calculating [H⁺] from pH",
    desc: "What is the [H⁺] for an aqueous solution whose pH is 11?",
    options: ["1.0 x 10⁻³ M", "1.0 x 10¹¹ M", "1.0 x 10⁻¹¹ M", "1.0 x 10³ M"],
    correctIdx: 2,
    explanation: "[H⁺] = 10⁻ᵖᴴ. So [H⁺] = 10⁻¹¹ M.",
  },
  {
    title: "Calculating [OH⁻] from pH",
    desc: "What is the [OH⁻] for an aqueous solution whose pH is 6?",
    options: ["1.0 x 10⁻⁶ M", "1.0 x 10⁻⁸ M", "1.0 x 10⁸ M", "1.0 x 10⁻¹⁴ M"],
    correctIdx: 1,
    explanation: "If pH = 6, then pOH = 14 - 6 = 8. [OH⁻] = 10⁻ᵖᴼᴴ = 10⁻⁸ M.",
  },
  {
    title: "Finding pH from pOH",
    desc: "If the pOH of a solution is 9, what is its pH?",
    options: ["9", "7", "14", "5"],
    correctIdx: 3,
    explanation: "pH + pOH = 14. So pH = 14 - 9 = 5.",
  },
  {
    title: "pH of a Strong Acid",
    desc: "Calculate the pH of a 0.01M HCl solution.",
    options: ["1", "2", "0.01", "12"],
    correctIdx: 1,
    explanation: "HCl is a strong acid and fully dissociates. [H⁺] = 0.01 M = 10⁻² M. pH = -log₁₀(10⁻²) = 2.",
  },
  {
    title: "pOH of a Neutral Solution",
    desc: "If a solution has a pH of 7, what is its pOH?",
    options: ["0", "7", "14", "1"],
    correctIdx: 1,
    explanation: "pH + pOH = 14. For a neutral solution with pH 7, the pOH is also 14 - 7 = 7.",
  },
  {
    title: "Comparing Acidity",
    desc: "Which of the following pH values represents the strongest acid?",
    options: ["pH 1", "pH 4", "pH 7", "pH 14"],
    correctIdx: 0,
    explanation: "The lower the pH, the higher the concentration of hydrogen ions, meaning a stronger acid. pH 1 is the lowest.",
  },
  {
    title: "Identifying Bases",
    desc: "Which of the following represents a basic solution?",
    options: ["[H⁺] = 10⁻⁹ M", "[H⁺] = 10⁻² M", "[H⁺] = 10⁻⁷ M", "[OH⁻] = 10⁻¹³ M"],
    correctIdx: 0,
    explanation: "A basic solution has a pH > 7. If [H⁺] = 10⁻⁹ M, the pH is 9, which is basic.",
  },
  {
    title: "Logarithmic Scale",
    desc: "A solution changes from pH 5 to pH 3. How has the hydrogen ion concentration changed?",
    options: ["Increased by 100x", "Decreased by 2x", "Increased by 2x", "Decreased by 100x"],
    correctIdx: 0,
    explanation: "Each unit on the pH scale represents a 10-fold change. A decrease of 2 pH units means a 10² = 100x increase in [H⁺].",
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

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", color: T.text }}>pH Scenarios</h2>
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
            background: i === round ? "#14b8a6" : i < round ? "#10b981" : T.border,
            transition: "background 0.3s"
          }} />
        ))}
      </div>

      <div style={{
        background: T.surface, border: `1.5px solid rgba(239, 68, 68, 0.25)`, borderRadius: 10, overflow: "hidden",
        boxShadow: "0 2px 10px rgba(239, 68, 68, 0.05)", display: "flex", flexDirection: "column", marginBottom: 12
      }}>
        <div style={{
          background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 800,
          padding: "4px 12px", display: "flex", alignItems: "center", gap: 6, letterSpacing: ".1em", textTransform: "uppercase"
        }}>
          <div style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%" }} />
          LAB PROBLEM
        </div>
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 32, lineHeight: 1 }}>🧪</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: T.text }}>{sc.title}</h3>
            <p style={{ fontSize: 15, color: T.text, margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{sc.desc}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ flex: "1 1 300px", maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
          {!submitted ? (
            <div style={{
              background: T.surface, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "24px",
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
                        border: `2px solid ${isSelected ? "#14b8a6" : T.border}`,
                        background: isSelected ? "rgba(20, 184, 166, 0.1)" : "transparent",
                        color: isSelected ? "#0d9488" : T.text,
                        fontSize: 16, fontWeight: 700,
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
                background: selectedOpt === null ? T.border : "#14b8a6",
                color: selectedOpt === null ? T.faint : "#fff",
                fontWeight: 800, fontSize: 14, cursor: selectedOpt === null ? "not-allowed" : "pointer",
                marginTop: 24, transition: "background 0.2s"
              }}>
                Check Answer ❯
              </button>
            </div>
          ) : (
            <div style={{
              background: T.surface, border: `1.5px solid ${selectedOpt === sc.correctIdx ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`, borderRadius: 14, padding: "32px 24px",
              boxShadow: "0 4px 16px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "100%"
            }}>
              <div style={{
                fontSize: 28, fontWeight: 800, marginBottom: 12,
                color: selectedOpt === sc.correctIdx ? "#10b981" : "#ef4444"
              }}>
                {selectedOpt === sc.correctIdx ? "🎉 Correct!" : "❌ Incorrect"}
              </div>
              <p style={{ fontSize: 16, color: T.text, margin: "0 0 24px", lineHeight: 1.6 }}>
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

export default function PhLabPage() {
  const [isScenarioMode, setIsScenarioMode] = useState(false);
  const [selectedSubstance, setSelectedSubstance] = useState<typeof SUBSTANCES[0] | null>(SUBSTANCES[4]);
  const [customPh, setCustomPh] = useState(7.0);
  const [animStep, setAnimStep] = useState(0); // 0: idle right, 1: center high, 2: center dipped
  const [dippedColor, setDippedColor] = useState<string | null>(null);
  const [isFilling, setIsFilling] = useState(false);

  const ph = selectedSubstance ? selectedSubstance.ph : customPh;
  const color = selectedSubstance ? getPhColor(selectedSubstance.ph) : getPhColor(customPh);

  // Calculate H+ concentration (10^-pH)
  const hPlus = Math.pow(10, -ph);
  const hPlusStr = hPlus.toExponential(2);

  // Calculate pOH and OH- concentration
  const pOH = 14 - ph;
  const ohMinus = Math.pow(10, -pOH);
  const ohMinusStr = ohMinus.toExponential(2);

  const handleDip = () => {
    setAnimStep(1); // Move to center above beaker
    setTimeout(() => {
      setAnimStep(2); // Dip into liquid
      setTimeout(() => {
        setDippedColor(color); // Absorb color
        setTimeout(() => {
          setAnimStep(1); // Pull out of liquid
          setTimeout(() => {
            setAnimStep(0); // Return to right side
          }, 800);
        }, 600);
      }, 800);
    }, 800);
  };

  const handleSelectSubstance = (sub: typeof SUBSTANCES[0] | null) => {
    if (selectedSubstance?.name === sub?.name && sub !== null) return;
    if (selectedSubstance === null && sub === null) return;

    setSelectedSubstance(sub);
    setDippedColor(null);
    setIsFilling(true);
    setTimeout(() => setIsFilling(false), 50);
  };

  const handleChangeCustom = (val: number) => {
    setCustomPh(val);
    setDippedColor(null);
  };

  const liquidY = isFilling ? 240 : 140;
  const fillTransition = isFilling ? "none" : "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";

  return (
    <div className="animate-in fade-in duration-500 pb-20" style={{ background: T.bg, color: T.text, minHeight: "100vh", fontFamily: "'Inter',sans-serif", position: "relative" }}>
      {/* Page-wide Dotted Background */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "radial-gradient(circle at 1px 1px,rgba(20,184,166,.12) 1px,transparent 0)",
        backgroundSize: "24px 24px"
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", position: "relative", zIndex: 1 }}>
        <style>{`
          :root {
            --pt-bg: transparent;
            --pt-surface: #ffffff;
            --pt-border: #dde3ec;
            --pt-text: #1e293b;
            --pt-muted: #64748b;
            --pt-faint: #94a3b8;
            --pt-svgGround: #cbd5e1;
          }
          .dark {
            --pt-bg: transparent;
            --pt-surface: #1A1A1E;
            --pt-border: rgba(255,255,255,0.1);
            --pt-text: #f8fafc;
            --pt-muted: #94a3b8;
            --pt-faint: #64748b;
            --pt-svgGround: #475569;
          }
        `}</style>
        {/* Header */}
        {!isScenarioMode && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <Link href="/app/lab/stem" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: T.muted, textDecoration: "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
                  <ChevronLeft size={16} />
                </div>
                Back
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h1 style={{ fontFamily: "'Caveat',cursive", fontSize: 28, color: "#14b8a6", margin: 0, fontWeight: 700 }}>pH Scale & Acidity</h1>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.muted }}>lab</span>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setIsScenarioMode(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#4f46e5", color: "#fff", borderRadius: 8, fontWeight: "bold", border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}>
                <span style={{ fontSize: 16 }}>🎮</span> Play Scenarios
              </button>
            </div>
          </div>
        )}

        {/* Main layout */}
        {isScenarioMode ? (
          <ScenarioMode onClose={() => setIsScenarioMode(false)} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
            {/* Left Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
                  <CardTitle style={{ marginBottom: 0 }}>Substances</CardTitle>
                  <button
                    onClick={() => { handleSelectSubstance(SUBSTANCES[4]); setCustomPh(7.0); }}
                    style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 6, border: `1px solid ${T.border}`, background: T.surface, color: T.text, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SUBSTANCES.map((sub) => {
                    const subColor = getPhColor(sub.ph);
                    return (
                      <button
                        key={sub.name}
                        onClick={() => handleSelectSubstance(sub)}
                        style={{
                          padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: "left",
                          background: selectedSubstance?.name === sub.name ? `${subColor}22` : T.surface,
                          border: `1px solid ${selectedSubstance?.name === sub.name ? subColor : T.border}`,
                          color: selectedSubstance?.name === sub.name ? subColor : T.text,
                          cursor: "pointer", display: "flex", justifyContent: "space-between"
                        }}
                      >
                        <span>{sub.name}</span>
                        <span style={{ opacity: 0.7 }}>pH {sub.ph.toFixed(1)}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handleSelectSubstance(null)}
                    style={{
                      padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: "left",
                      background: !selectedSubstance ? "var(--pt-border, #e2e8f0)" : T.surface,
                      border: `1px solid ${!selectedSubstance ? "#94a3b8" : T.border}`,
                      color: !selectedSubstance ? T.text : T.text,
                      cursor: "pointer", display: "flex", justifyContent: "space-between"
                    }}
                  >
                    <span>Custom</span>
                  </button>
                </div>

                {!selectedSubstance && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>Custom pH</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: color }}>{customPh.toFixed(1)}</span>
                    </div>
                    <input
                      type="range" min="0" max="14" step="0.1" value={customPh}
                      onChange={(e) => handleChangeCustom(+e.target.value)}
                      style={{ width: "100%", accentColor: color }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: T.faint }}>0 (Acidic)</span>
                      <span style={{ fontSize: 10, color: T.faint }}>14 (Basic)</span>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <CardTitle>pH & pOH Calculators</CardTitle>

                {/* pH Calculator */}
                <div style={{ background: "rgba(20, 184, 166, 0.1)", padding: 12, borderRadius: 8, border: "1px solid rgba(20, 184, 166, 0.2)", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#0d9488", fontWeight: 700, marginBottom: 8 }}>Formula: pH = -log₁₀([H⁺])</div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>[H⁺] Concentration:</span>
                    <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace" }}>{hPlusStr} M</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px dashed rgba(20, 184, 166, 0.3)" }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>Calculated pH:</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: color }}>{ph.toFixed(1)}</span>
                  </div>
                </div>

                {/* pOH Calculator */}
                <div style={{ background: "rgba(139, 92, 246, 0.1)", padding: 12, borderRadius: 8, border: "1px solid rgba(139, 92, 246, 0.2)", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, marginBottom: 8 }}>Formula: pOH = -log₁₀([OH⁻])</div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>[OH⁻] Concentration:</span>
                    <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace" }}>{ohMinusStr} M</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px dashed rgba(139, 92, 246, 0.3)" }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>Calculated pOH:</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: getPhColor(pOH) }}>{pOH.toFixed(1)}</span>
                  </div>
                </div>

                {/* Relationship */}
                <div style={{ background: T.surface, padding: 12, borderRadius: 8, border: `1px solid ${T.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Relationship</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: T.text, display: "flex", justifyContent: "center", gap: 12 }}>
                    <span>pH + pOH = 14</span>
                  </div>
                </div>
              </Card>

              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Map size={16} color="#0ea5e9" />
                  <CardTitle style={{ margin: 0 }}>Real-World Applications</CardTitle>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, lineHeight: 1.6, color: T.muted }}>
                  <li><strong>Agriculture:</strong> Soil pH affects plant growth.</li>
                  <li><strong>Medicine:</strong> Blood pH must stay around 7.4.</li>
                  <li><strong>Food:</strong> pH affects taste and preservation.</li>
                  <li><strong>Environment:</strong> Acid rain impacts ecosystems.</li>
                  <li><strong>Industry:</strong> pH control in manufacturing.</li>
                </ul>
              </Card>
            </div>

            {/* Right Column: Visualization & Definition */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{
                flex: 1, background: T.surface, border: `2px solid #14b8a6`, borderRadius: 24,
                display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
                minHeight: 400, boxShadow: "0 4px 20px rgba(20, 184, 166, 0.1)"
              }}>
                {/* Inner subtle glow */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "radial-gradient(circle at center, rgba(20,184,166,0.02) 0%, transparent 70%)"
                }} />

                {/* Lab area */}
                <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 32px 120px 32px" }}>

                  {/* Litmus Paper Test Button */}
                  <button
                    onClick={handleDip}
                    disabled={animStep !== 0}
                    style={{
                      position: "absolute", top: 24, right: 24, zIndex: 20,
                      background: "rgba(15, 23, 42, 0.8)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 16px",
                      fontSize: 12, fontWeight: "bold", cursor: animStep !== 0 ? "not-allowed" : "pointer",
                      backdropFilter: "blur(4px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      opacity: animStep !== 0 ? 0.7 : 1
                    }}
                  >
                    Test with Litmus Paper
                  </button>

                  {/* SVG Visualization */}
                  <svg width="100%" height="100%" viewBox="0 0 400 300" style={{ maxWidth: 500, overflow: "visible" }}>
                    {/* Table/Surface */}
                    <rect x="50" y="250" width="300" height="10" rx="4" fill={T.svgGround} opacity="0.5" />

                    {/* Beaker Back */}
                    <path d="M 140 100 L 140 240 C 140 248 145 250 150 250 L 250 250 C 255 250 260 248 260 240 L 260 100" fill="none" stroke="var(--pt-muted)" strokeWidth="4.5" />

                    {/* Liquid */}
                    <path
                      d={`M 142 ${liquidY} L 142 240 C 142 248 145 248 150 248 L 250 248 C 255 248 258 248 258 240 L 258 ${liquidY} Z`}
                      fill={color} fillOpacity="0.85"
                      style={{ transition: fillTransition }}
                    />
                    {/* Liquid Surface */}
                    <ellipse cx="200" cy={liquidY} rx="58" ry="10" fill={color} fillOpacity="0.95" style={{ transition: fillTransition }} />

                    {/* Beaker Front Lip */}
                    <ellipse cx="200" cy="100" rx="60" ry="10" fill="none" stroke="var(--pt-text)" strokeWidth="4" />

                    {/* Graduations & Liter Markings */}
                    <line x1="140" y1="130" x2="156" y2="130" stroke="var(--pt-text)" strokeWidth="3" />
                    <text x="162" y="134" fill="var(--pt-text)" fontSize="12" fontWeight="800" letterSpacing="0.5">1.0L</text>

                    <line x1="140" y1="170" x2="148" y2="170" stroke="var(--pt-text)" strokeWidth="3" />
                    <text x="154" y="174" fill="var(--pt-text)" fontSize="11" fontWeight="700">0.5L</text>

                    <line x1="140" y1="210" x2="156" y2="210" stroke="var(--pt-text)" strokeWidth="3" />
                    <text x="162" y="214" fill="var(--pt-text)" fontSize="12" fontWeight="800" letterSpacing="0.5">0.1L</text>

                    {/* Litmus Paper Animation */}
                    <g style={{
                      transform: animStep === 0 ? "translate(170px, 60px)" :
                        animStep === 1 ? "translate(0px, -40px)" :
                          "translate(0px, 80px)",
                      transition: "transform 0.8s ease-in-out"
                    }}>
                      {/* Paper Texture Def */}
                      <defs>
                        <pattern id="paper-texture" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.05)" />
                          <circle cx="0" cy="0" r="0.5" fill="rgba(0,0,0,0.03)" />
                        </pattern>
                        <filter id="paper-shadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.15" />
                        </filter>
                      </defs>

                      {/* Shadow Layer */}
                      <rect x="190" y="20" width="20" height="120" fill="none" filter="url(#paper-shadow)" />

                      {/* Paper Base Shapes */}
                      {/* Paper Top (Uncolored portion, always stays above liquid) */}
                      <rect x="190" y="20" width="20" height="40" fill="#fef08a" />
                      {/* Paper Bottom (Dipped portion, exactly matches submerged depth) */}
                      <rect x="190" y="60" width="20" height="80" fill={dippedColor || "#fef08a"} style={{ transition: "fill 0.3s ease" }} />

                      {/* Paper Texture Overlay */}
                      <rect x="190" y="20" width="20" height="120" fill="url(#paper-texture)" pointerEvents="none" />
                    </g>
                  </svg>

                  {/* pH Label indicator overlay */}
                  <div style={{ position: "absolute", bottom: 94, left: "50%", transform: "translateX(-50%)", background: T.surface, border: `1px solid ${color}`, borderRadius: 20, padding: "8px 24px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>{selectedSubstance ? selectedSubstance.name : "Custom Solution"}</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: color }}>pH {ph.toFixed(1)}</div>
                  </div>

                  {/* pH Color Scale */}
                  <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 48px)", maxWidth: 500 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T.muted, marginBottom: 8, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>pH Scale (0-14)</div>
                    <div style={{
                      display: "flex", height: 36,
                      borderRadius: 8, overflow: "hidden", border: `2px solid ${T.border}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                    }}>
                      {PH_COLORS.map((c, i) => (
                        <div key={i} style={{
                          flex: 1, background: c, display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: 12, fontWeight: "900", textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                          borderRight: i < PH_COLORS.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none"
                        }}>
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <BookOpen size={16} color="#0ea5e9" />
                  <CardTitle style={{ margin: 0 }}>Theorem Definition: Understanding pH</CardTitle>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: T.text }}>
                  <p style={{ marginBottom: 12 }}>
                    pH stands for <strong>"potential of Hydrogen"</strong> and measures the concentration of hydrogen ions (H⁺) in a solution. The scale is logarithmic, meaning each unit represents a 10-fold change in acidity.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: 12, borderRadius: 8, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>Acid</div>
                      <div style={{ fontSize: 11, color: T.muted }}>Substance that has a pH lower than 7 and is capable of releasing hydrogen ions in a solution.<br /><strong>Acidic (pH &lt; 7)<br />
                        High concentration of H⁺ ions</strong></div>
                    </div>
                    <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: 12, borderRadius: 8, border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#3b82f6", marginBottom: 4 }}>Base</div>
                      <div style={{ fontSize: 11, color: T.muted }}>Substance that has a pH higher than 7 and can accept hydrogen ions or release hydroxyl ions.<br /><strong>Basic/Alkaline (pH &gt; 7)<br />
                        High concentration of OH⁻ ions</strong></div>
                    </div>
                  </div>

                  <div style={{ background: "rgba(148, 163, 184, 0.1)", padding: 12, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Logarithmic Scale</div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 11, color: T.muted }}>
                      <li>pH 6 is 10× more acidic than pH 7</li>
                      <li>pH 5 is 100× more acidic than pH 7</li>
                      <li>pH 4 is 1,000× more acidic than pH 7</li>
                    </ul>
                    <p style={{ fontSize: 11, fontStyle: "italic", marginTop: 4, color: T.muted }}>Small changes in pH represent large changes in acidity.</p>
                  </div>

                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 12 }}>Neutralization:</strong>
                      <p style={{ fontSize: 11, color: T.muted, margin: "4px 0 0 0" }}>Chemical reaction between an acid and a base that produces salt and water, bringing the pH closer to a neutral value (7).</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: 12 }}>pOH:</strong>
                      <p style={{ fontSize: 11, color: T.muted, margin: "4px 0 0 0" }}>Logarithmic measure of the concentration of hydroxyl ions in a solution, complementary to pH.</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <BookOpen size={16} color="#eab308" />
                  <CardTitle style={{ margin: 0 }}>What is Litmus Paper?</CardTitle>
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: T.text }}>
                  <p style={{ marginBottom: 8 }}>
                    Litmus paper is a <strong>pH indicator strip</strong> that changes color to show whether a solution is acidic, neutral, or basic.
                  </p>
                  <p>
                    It is absorbent paper treated with a natural dye extracted from lichens, primarily the litmus lichen. The dye is sensitive to hydrogen ion concentration (pH) in a solution, allowing the paper to indicate whether a substance is acidic or basic by changing color.
                  </p>
                </div>
              </Card>

              <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Beaker size={18} color="#14b8a6" />
                  <CardTitle style={{ margin: 0 }}>pH Scale with H⁺ & OH⁻ Concentration</CardTitle>
                </div>

                <div style={{ width: "100%", overflowX: "auto", paddingBottom: 8 }}>
                  <div style={{ minWidth: 600, display: "flex", flexDirection: "column", gap: 8 }}>

                    {/* H+ Concentration Row */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: 60, fontSize: 13, fontWeight: 800, color: "#ef4444" }}>[H⁺]</div>
                      <div style={{ flex: 1, display: "flex" }}>
                        {PH_COLORS.map((_, i) => (
                          <div key={`h-${i}`} style={{ flex: 1, textAlign: "center", fontSize: 11, color: T.text, fontWeight: 700 }}>
                            10<sup style={{ fontSize: 8 }}>{-i}</sup>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* OH- Concentration Row */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: 60, fontSize: 13, fontWeight: 800, color: "#3b82f6" }}>[OH⁻]</div>
                      <div style={{ flex: 1, display: "flex" }}>
                        {PH_COLORS.map((_, i) => (
                          <div key={`oh-${i}`} style={{ flex: 1, textAlign: "center", fontSize: 11, color: T.text, fontWeight: 700 }}>
                            10<sup style={{ fontSize: 8 }}>{-(14 - i)}</sup>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* pH Scale Bar */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ width: 60, fontSize: 13, fontWeight: 800, color: T.text }}>pH</div>
                      <div style={{
                        flex: 1, display: "flex", height: 40,
                        borderRadius: 8, overflow: "hidden", border: `2px solid ${T.border}`,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                      }}>
                        {PH_COLORS.map((c, i) => (
                          <div key={i} style={{
                            flex: 1, background: c, display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 13, fontWeight: "900", textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                            borderRight: i < PH_COLORS.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none"
                          }}>
                            {i}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Labels (Acidity, Neutral, Base) */}
                <div style={{ display: "flex", marginTop: 12 }}>
                  <div style={{ width: 60 }}></div>
                  <div style={{ flex: 1, display: "flex", gap: 8 }}>
                    {/* Acidic */}
                    <div style={{
                      flex: 1, background: "rgba(239, 68, 68, 0.08)", borderRadius: 6, padding: "8px",
                      textAlign: "center", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)",
                      display: "flex", flexDirection: "column", justifyContent: "center"
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>Acidic (&lt;7)</div>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>High [H⁺] ions</div>
                    </div>
                    {/* Neutral */}
                    <div style={{
                      width: 100, background: "rgba(16, 185, 129, 0.08)", borderRadius: 6, padding: "8px 4px",
                      textAlign: "center", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.2)",
                      display: "flex", flexDirection: "column", justifyContent: "center"
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 2 }}>Neutral (pH = 7)</div>
                      <div style={{ fontSize: 10, fontWeight: 600 }}>[H⁺] = [OH⁻] ions</div>
                    </div>
                    {/* Base */}
                    <div style={{
                      flex: 1, background: "rgba(59, 130, 246, 0.08)", borderRadius: 6, padding: "8px",
                      textAlign: "center", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.2)",
                      display: "flex", flexDirection: "column", justifyContent: "center"
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 2 }}>Basic (&gt;7)</div>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>High [OH⁻] ions</div>
                    </div>
                  </div>
                </div>

              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
