"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, RotateCcw, Gamepad2, X } from "lucide-react";

/* ── palette ── */
const C = {
  bg: "var(--sd-bg)",
  surface: "var(--sd-surface)",
  panel: "var(--sd-panel)",
  border: "var(--sd-border)",
  text: "var(--sd-text)",
  muted: "var(--sd-muted)",
  faint: "var(--sd-faint)",
  accent: "var(--sd-accent)",
  demand: "var(--sd-demand)",
  demandBg: "var(--sd-demand-bg)",
  supply: "var(--sd-supply)",
  supplyBg: "var(--sd-supply-bg)",
  eq: "var(--sd-eq)",
  eqBg: "var(--sd-eq-bg)",
  accentBorder: "var(--sd-accent-border)",
};

/* ── Slider ── */
function Slider({ label, value, min, max, onChange, color, unit = "", step = 1 }: any) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'Space Mono',monospace" }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          style={{ width: "100%", accentColor: color, cursor: "pointer", height: 4 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 9, color: C.faint }}>{min}{unit}</span>
        <span style={{ fontSize: 9, color: C.faint }}>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ── Real World Example Card ── */
function ExCard({ icon, text, bg, borderColor }: any) {
  return (
    <div style={{
      padding: "10px 14px", borderRadius: 8, marginBottom: 8,
      background: bg, border: `1px solid ${borderColor}`,
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontWeight: 500 }}>{text}</span>
    </div>
  );
}

/* ── Glossary Term ── */
function GlossItem({ term, def }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: `1px solid ${C.border}`, padding: "12px 0",
      cursor: "pointer",
    }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.accent, fontFamily: "'Playfair Display',serif" }}>{term}</span>
        <span style={{ fontSize: 13, color: C.faint, transition: "transform .2s", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </div>
      {open && (
        <p style={{ fontSize: 12.5, color: C.text, margin: "8px 0 0", lineHeight: 1.7, fontWeight: 500 }}>{def}</p>
      )}
    </div>
  );
}

const GLOSSARY = [
  { term: "Inflation", def: "Inflation reduces purchasing power by increasing the prices of goods and services, meaning the same amount of money buys less over time." },
  { term: "Consumer Price Index (CPI)", def: "A measure that examines the weighted average of prices of a basket of consumer goods and services, such as transportation, food, and medical care." },
  { term: "Producer Price Index (PPI)", def: "A family of indexes that measures the average change over time in selling prices received by domestic producers of goods and services." },
  { term: "Demand-Pull Inflation", def: "Upward pressure on prices that follows a shortage in supply, a condition economists describe as 'too much money chasing too few goods.'" },
  { term: "Cost-Push Inflation", def: "Occurs when overall prices increase (inflation) due to increases in the cost of wages and raw materials." },
];

const EXAMPLES = [
  { icon: "🍞", text: "In 1990, a loaf of bread cost about $0.70. Due to inflation, the same loaf today costs over $2.50. Your money buys less bread than it used to." },
  { icon: "⛽", text: "During the 1970s oil crisis, cost-push inflation caused the price of fuel to skyrocket, decreasing the purchasing power of consumers worldwide." },
  { icon: "💸", text: "In cases of hyperinflation, like Zimbabwe in 2008, people needed wheelbarrows of cash just to buy basic groceries because money lost its value daily." },
];

const SCENARIOS = [
  { title: "Central Bank Prints More Money", desc: "The government rapidly increases the money supply to pay off debts.", infAns: "up", ppAns: "down", explain: "More money circulating reduces its value, causing prices to rise (inflation) and purchasing power to fall." },
  { title: "Breakthrough in AI Tech", desc: "A massive tech boom drastically lowers the cost of producing most goods.", infAns: "down", ppAns: "up", explain: "Cheaper production costs lead to lower prices (deflation), which means your money can buy more (purchasing power goes up)." },
  { title: "Global Oil Crisis", desc: "A major conflict halts global oil production, sending energy costs skyrocketing.", infAns: "up", ppAns: "down", explain: "This is cost-push inflation. Higher fuel costs raise prices across the board, reducing purchasing power." },
  { title: "Central Bank Hikes Interest Rates", desc: "Borrowing money becomes very expensive to cool down a hot economy.", infAns: "down", ppAns: "up", explain: "Higher interest rates reduce spending and borrowing, cooling down inflation and stabilizing purchasing power." },
  { title: "Bumper Harvest", desc: "Perfect weather leads to record-breaking crop yields worldwide.", infAns: "down", ppAns: "up", explain: "An abundance of food drops agricultural prices, slightly lowering overall inflation and boosting your purchasing power." },
  { title: "Massive Supply Chain Disruption", desc: "Ports are closed globally, causing a severe shortage of imported goods.", infAns: "up", ppAns: "down", explain: "Fewer goods available with the same demand pushes prices up, meaning your money buys less." },
  { title: "Minimum Wage Doubled Everywhere", desc: "Companies must suddenly pay all workers twice as much.", infAns: "up", ppAns: "down", explain: "Companies will raise prices to cover the new labor costs, triggering cost-push inflation and lowering the real value of the wage increase." },
  { title: "Consumers Stop Spending", desc: "Due to economic fears, households decide to save their cash and stop buying non-essentials.", infAns: "down", ppAns: "up", explain: "A drop in demand forces retailers to slash prices to attract buyers, lowering inflation and increasing purchasing power." }
];

function ScenarioMode({ onClose }: { onClose: () => void }) {
  const [questions] = useState(() => [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 8));
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [predInf, setPredInf] = useState<"up" | "down" | null>(null);
  const [predPp, setPredPp] = useState<"up" | "down" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sc = questions[round];

  const handleSubmit = () => {
    setSubmitted(true);
    if (predInf === sc.infAns && predPp === sc.ppAns) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNext = () => {
    if (round < questions.length - 1) {
      setRound(r => r + 1);
      setPredInf(null);
      setPredPp(null);
      setSubmitted(false);
    } else {
      onClose();
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", color: C.text }}>Inflation Scenarios</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.faint, fontWeight: 600 }}>
            <span>Round {round + 1} of {questions.length}</span>
            <span>·</span>
            <span style={{
              background: C.supplyBg, color: C.supply, padding: "2px 8px", borderRadius: 12, fontWeight: 800, border: `1.5px solid rgba(16, 185, 129, 0.25)`
            }}>
              {correctCount} correct
            </span>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: "50%",
          width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
          color: C.text, cursor: "pointer", transition: "all 0.2s"
        }} className="hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200">
          <X size={22} />
        </button>
      </div>

      {/* Progress Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: "50%",
            background: i === round ? C.accent : i < round ? C.supply : C.border,
            transition: "background 0.3s"
          }} />
        ))}
      </div>

      {/* Shiksha News Box */}
      <div style={{
        background: C.surface, border: `1.5px solid ${C.demandBg}`, borderRadius: 10, overflow: "hidden",
        boxShadow: "0 2px 10px rgba(239, 68, 68, 0.05)", display: "flex", flexDirection: "column"
      }}>
        <div style={{
          background: C.demand, color: "#fff", fontSize: 10, fontWeight: 800,
          padding: "4px 12px", display: "flex", alignItems: "center", gap: 6, letterSpacing: ".1em", textTransform: "uppercase"
        }}>
          <div style={{ width: 6, height: 6, background: "#fff", borderRadius: "50%", animation: "pulseEq 1.5s infinite" }} />
          SHIKSHA NEWS
        </div>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 32, lineHeight: 1 }}>⚠️</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 4px", color: C.text }}>{sc.title}</h3>
            <p style={{ fontSize: 14, color: C.text, margin: 0, fontWeight: 500 }}>{sc.desc}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

        {/* VISUAL / GRAPH */}
        <div style={{
          flex: "1 1 340px",
          background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "24px",
          display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column",
          boxShadow: "0 2px 12px rgba(0,0,0,.04)"
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.muted, marginBottom: 20, letterSpacing: ".05em", textTransform: "uppercase" }}>Impact Visualization</div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* Money */}
            <svg width="120" height="60" viewBox="0 0 160 80">
              <rect width="160" height="80" rx="8" fill="#15803d" stroke="#14532d" strokeWidth="3" />
              <rect x="8" y="8" width="144" height="64" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,4" rx="4" />
              <circle cx="80" cy="40" r="18" fill="#166534" />
              <text x="80" y="47" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="'Space Mono', monospace" textAnchor="middle">$ 1,000</text>
            </svg>
            <div style={{ fontSize: 24, color: C.border, fontWeight: 900 }}>➔</div>
            {/* Basket */}
            <div style={{ width: 100, height: 100, border: `2px dashed ${C.border}`, borderRadius: 12, display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative" }}>
              <div style={{
                transform: submitted ? `scale(${sc.ppAns === "down" ? 0.6 : 1.2})` : `scale(1)`,
                transformOrigin: "bottom center", transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 8
              }}>
                <div style={{ display: 'flex', fontSize: 20, marginBottom: -6, zIndex: 2 }}>🥛🍞⛽</div>
                <div style={{ fontSize: 48, zIndex: 1 }}>🛒</div>
              </div>
            </div>
          </div>

          {submitted && (
            <div style={{ marginTop: 24, fontSize: 13, fontWeight: 700, color: sc.ppAns === "down" ? C.demand : C.supply, background: sc.ppAns === "down" ? C.demandBg : C.supplyBg, padding: "6px 12px", borderRadius: 8 }}>
              Purchasing Power went {sc.ppAns.toUpperCase()}
            </div>
          )}
        </div>

        {/* QUESTIONS / FEEDBACK */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 16 }}>
          {!submitted ? (
            <div style={{
              background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "16px 20px",
              boxShadow: "0 2px 12px rgba(0,0,0,.04)", display: "flex", flexDirection: "column", height: "100%"
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: C.text, textAlign: "center", margin: "0 0 16px" }}>What will happen?</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
                <div>
                  <div style={{ fontSize: 10, color: C.faint, textAlign: "center", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>INFLATION WILL...</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setPredInf("up")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predInf === "up" ? C.demand : C.border}`,
                      background: predInf === "up" ? C.demandBg : C.panel, color: predInf === "up" ? C.demand : C.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s"
                    }}>↗ Go Up</button>
                    <button onClick={() => setPredInf("down")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predInf === "down" ? C.supply : C.border}`,
                      background: predInf === "down" ? C.supplyBg : C.panel, color: predInf === "down" ? C.supply : C.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s"
                    }}>↘ Go Down</button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: C.faint, textAlign: "center", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>PURCHASING POWER WILL...</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setPredPp("up")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predPp === "up" ? C.supply : C.border}`,
                      background: predPp === "up" ? C.supplyBg : C.panel, color: predPp === "up" ? C.supply : C.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s"
                    }}>↗ Go Up</button>
                    <button onClick={() => setPredPp("down")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predPp === "down" ? C.demand : C.border}`,
                      background: predPp === "down" ? C.demandBg : C.panel, color: predPp === "down" ? C.demand : C.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s"
                    }}>↘ Go Down</button>
                  </div>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={!predInf || !predPp} style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: (!predInf || !predPp) ? C.border : C.accent,
                color: (!predInf || !predPp) ? C.faint : "#fff",
                fontWeight: 800, fontSize: 14, cursor: (!predInf || !predPp) ? "not-allowed" : "pointer",
                marginTop: 24, transition: "background 0.2s"
              }}>
                Submit Prediction ❯
              </button>
            </div>
          ) : (
            <div style={{
              background: C.surface, border: `1.5px solid ${predInf === sc.infAns && predPp === sc.ppAns ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`, borderRadius: 14, padding: "24px 20px",
              boxShadow: "0 4px 16px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "100%"
            }}>
              <div style={{
                fontSize: 28, fontWeight: 800, marginBottom: 12,
                color: predInf === sc.infAns && predPp === sc.ppAns ? C.supply : C.demand
              }}>
                {predInf === sc.infAns && predPp === sc.ppAns ? "🎉 Correct!" : "❌ Incorrect"}
              </div>
              <p style={{ fontSize: 14, color: C.text, margin: "0 0 16px", lineHeight: 1.6, fontWeight: 600 }}>
                {sc.explain}
              </p>
              <button onClick={handleNext} style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: C.eq, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "background 0.2s"
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

/* ════════════════════════════════════════════════════════════════════════ */
export default function InflationLab() {
  const [isScenarioMode, setIsScenarioMode] = useState(false);
  const [inflation, setInflation] = useState(5); // 5% default
  const [years, setYears] = useState(5); // 5 years default

  const initialCash = 1000;
  // P = C / (1 + i)^n
  const purchasingPower = initialCash / Math.pow(1 + inflation / 100, years);
  const quantityPercent = (purchasingPower / initialCash) * 100;

  // Rate color logic
  const rateColor = inflation < 3 ? C.supply : inflation < 8 ? "#f59e0b" : C.demand;
  const rateColorBg = inflation < 3 ? C.supplyBg : inflation < 8 ? "rgba(245, 158, 11, 0.1)" : C.demandBg;
  const rateBorder = inflation < 3 ? "rgba(16, 185, 129, 0.25)" : inflation < 8 ? "rgba(245, 158, 11, 0.25)" : "rgba(239, 68, 68, 0.25)";

  const handleReset = () => { setInflation(5); setYears(5); };

  // Data for chart
  const W = 480, H = 220, PAD = 40;
  const dataPoints = [];
  for (let i = 0; i <= 10; i++) {
    dataPoints.push({ year: i, value: initialCash / Math.pow(1 + inflation / 100, i) });
  }

  const toSvgX = (year: number) => PAD + (year / 10) * (W - 2 * PAD);
  const toSvgY = (val: number) => H - PAD - (val / 1000) * (H - 2 * PAD);

  const pathD = "M " + dataPoints.map(d => `${toSvgX(d.year)},${toSvgY(d.value)}`).join(" L ");

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "radial-gradient(circle at 1.5px 1.5px, var(--sd-dots, rgba(225,29,72,.08)) 1.5px, transparent 0)",
      backgroundSize: "24px 24px",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: C.text,
      padding: "2px 16px 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,600&family=DM+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        :root {
          --sd-dots: rgba(225,29,72, 0.08);
          --sd-bg: #fdfafb;
          --sd-surface: #ffffff;
          --sd-panel: #fafaf7;
          --sd-border: #e2ddd6;
          --sd-text: #1a1612;
          --sd-muted: #475569;
          --sd-faint: #64748b;
          --sd-demand: #e11d48; /* rose-600 */
          --sd-demand-bg: #ffe4e6;
          --sd-supply: #10b981;
          --sd-supply-bg: #ecfdf5;
          --sd-eq: #3b82f6;
          --sd-eq-bg: #eff6ff;
          --sd-accent: #8b5cf6;
          --sd-accent-border: rgba(139, 92, 246, 0.25);
        }
        :root.dark, .dark {
          --sd-dots: rgba(225,29,72, 0.08);
          --sd-bg: #0f172a;
          --sd-surface: #1e293b;
          --sd-panel: #0f172a;
          --sd-border: #334155;
          --sd-text: #f8fafc;
          --sd-muted: #cbd5e1;
          --sd-faint: #94a3b8;
          --sd-demand: #f43f5e;
          --sd-demand-bg: rgba(244, 63, 94, 0.15);
          --sd-supply: #10b981;
          --sd-supply-bg: rgba(16, 185, 129, 0.15);
          --sd-eq: #3b82f6;
          --sd-eq-bg: rgba(59, 130, 246, 0.15);
          --sd-accent: #a78bfa;
          --sd-accent-border: rgba(139, 92, 246, 0.25);
        }
        * { box-sizing:border-box; }
        input[type=range]{ height:4px; border-radius:2px; outline:none; border:none; }
        button { font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
      `}</style>

      {/* ── Header w/ Back Button ── */}
      <div className="-mt-2" style={{ maxWidth: 1060, margin: "0 auto 28px", position: "relative", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", left: 0 }}>
          <Link href="/app/lab/bems" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors dark:text-slate-400 w-max group">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1E] shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-slate-200 dark:border-white/5">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Back
          </Link>
        </div>

        <h1 className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 m-0" style={{ textShadow: "0 2px 8px rgba(225,29,72,.12)" }}>
          <span style={{ fontFamily: "'Caveat',cursive", fontSize: 44, fontWeight: 700 }} className="text-rose-600 dark:text-rose-400">
            Inflation & Purchasing Power
          </span>
        </h1>

        {!isScenarioMode && (
          <div style={{ position: "absolute", right: 0 }}>
            <button onClick={() => setIsScenarioMode(true)} style={{
              background: C.accent, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8,
              fontWeight: 800, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 2px 10px rgba(139, 92, 246, 0.3)"
            }} className="hover:opacity-90 transition-opacity">
              <Gamepad2 size={16} /> Play Scenarios
            </button>
          </div>
        )}
      </div>

      {/* ── Main Layout ── */}
      {isScenarioMode ? (
        <ScenarioMode onClose={() => setIsScenarioMode(false)} />
      ) : (
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", gap: 14, flexWrap: "wrap" }}>

          {/* ════ LEFT PANEL ════ */}
          <div style={{ flex: "0 0 225px", display: "flex", flexDirection: "column", gap: 10 }}>

            <button onClick={handleReset} style={{
              padding: "10px 20px", borderRadius: 12, border: `1.5px solid ${C.border}`,
              background: C.surface, color: C.muted, fontSize: 13, fontWeight: 700,
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 1px 8px rgba(0,0,0,.05)"
            }} className="hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors">
              <RotateCcw size={16} />
              Reset Simulation
            </button>

            {/* Simulation Controls */}
            <div style={{
              background: C.surface, border: `1.5px solid ${rateBorder}`,
              borderRadius: 12, padding: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,.04)",
              transition: "border-color 0.3s"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: rateColor, transition: "background 0.3s" }} />
                <span style={{ fontSize: 15, fontWeight: 900, color: rateColor, fontFamily: "'Playfair Display',serif", transition: "color 0.3s" }}>
                  Economic Factors
                </span>
              </div>

              <Slider label="Inflation Rate %" value={inflation} min={0} max={20} onChange={setInflation} color={rateColor} unit="%" />
              <Slider label="Time Passed" value={years} min={1} max={10} onChange={setYears} color={C.accent} unit=" yrs" />

              <div style={{
                padding: "10px 12px", background: rateColorBg, borderRadius: 8,
                fontSize: 12, color: rateColor, marginTop: 12, lineHeight: 1.6,
                fontWeight: 600, transition: "all 0.3s"
              }}>
                At <strong>{inflation}%</strong> inflation over <strong>{years} years</strong>, prices increase by a factor of {(Math.pow(1 + inflation / 100, years)).toFixed(2)}x.
              </div>
            </div>

            {/* Formula Card */}
            <div style={{
              padding: "14px", background: C.eqBg,
              border: `1px solid ${C.eq}` + "33", borderRadius: 10,
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.eq, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 8px" }}>
                📊 Purchasing Power Math
              </p>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: C.text, textAlign: "center", background: C.surface, padding: "8px", borderRadius: 6, border: `1px solid ${C.border}` }}>
                P = C / (1 + i)<sup style={{ fontSize: 10 }}>n</sup>
              </div>
              <p style={{ fontSize: 11, color: C.faint, margin: "8px 0 0", lineHeight: 1.5, fontWeight: 500 }}>
                <strong>P</strong> = Purchasing Power<br />
                <strong>C</strong> = Initial Cash ($1,000)<br />
                <strong>i</strong> = Inflation Rate ({inflation / 100})<br />
                <strong>n</strong> = Years ({years})
              </p>
            </div>

            {/* Economic Impacts */}
            <div style={{
              background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 12, padding: 16,
            }}>
              <p style={{ fontSize: 10.5, color: C.muted, margin: "0 0 10px", letterSpacing: ".07em", textTransform: "uppercase", fontWeight: 800 }}>Broader Implications</p>
              {["Eradicates Savings Value", "Increases Borrowing Costs", "Triggers Wage-Price Spiral", "Uncertainty for Investments"].map(f => (
                <div key={f} style={{ fontSize: 12, color: C.faint, padding: "4px 0", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                  <span style={{ color: C.demand, fontSize: 10 }}>■</span>{f}
                </div>
              ))}
            </div>

          </div>

          {/* ════ CENTRE: VISUALIZATION & CHART ════ */}
          <div style={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Visualization */}
            <div style={{
              background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 14, padding: "24px 20px",
              boxShadow: "0 2px 16px rgba(0,0,0,.06)",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 24px", color: C.text }}>Shrinking Basket</h2>

              <div style={{ display: 'flex', gap: 30, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {/* The Money */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg width="160" height="80" viewBox="0 0 160 80">
                    <rect width="160" height="80" rx="8" fill="#15803d" stroke="#14532d" strokeWidth="3" />
                    <rect x="8" y="8" width="144" height="64" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,4" rx="4" />
                    <circle cx="80" cy="40" r="18" fill="#166534" />
                    <text x="80" y="47" fill="#fff" fontSize="20" fontWeight="bold" fontFamily="'Space Mono', monospace" textAnchor="middle">$ 1,000</text>
                  </svg>
                  <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700, color: C.faint, letterSpacing: ".05em", textTransform: "uppercase" }}>Initial Cash</div>
                </div>

                <div style={{ fontSize: 24, color: C.border, fontWeight: 900 }}>➔</div>

                {/* The Basket */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 140, height: 140, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    {/* Dashed outline of 100% capacity */}
                    <div style={{ position: 'absolute', width: '100%', height: '100%', border: `2px dashed ${C.border}`, borderRadius: 12 }} />

                    {/* The shrinking basket */}
                    <div style={{
                      width: '100%', height: '100%',
                      transform: `scale(${quantityPercent / 100})`,
                      transformOrigin: 'bottom center',
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                      paddingBottom: 8
                    }}>
                      <div style={{ display: 'flex', fontSize: 28, marginBottom: -8, zIndex: 2, gap: 4, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>
                        🥛 🍞 ⛽
                      </div>
                      <div style={{ fontSize: 64, zIndex: 1 }}>🛒</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 14, padding: "4px 10px", background: rateColorBg, borderRadius: 6, fontSize: 13, fontWeight: 800, color: rateColor, transition: "all 0.3s" }}>
                    Buys {quantityPercent.toFixed(1)}% of Basket
                  </div>
                </div>
              </div>

              {/* Real Value Readout */}
              <div style={{ marginTop: 32, textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 4 }}>Real Value Today</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.text, fontFamily: "'Space Mono', monospace" }}>
                  $ {purchasingPower.toFixed(2)}
                </div>
              </div>

            </div>

            {/* Decay Chart */}
            <div style={{
              background: C.surface, border: `1.5px solid ${C.border}`,
              borderRadius: 14, padding: "16px",
              boxShadow: "0 2px 16px rgba(0,0,0,.06)",
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 16px", color: C.text }}>Value Decay Over 10 Years</h3>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
                {/* Grid lines */}
                {[0, 250, 500, 750, 1000].map(val => (
                  <g key={val}>
                    <line x1={PAD} y1={toSvgY(val)} x2={W - PAD} y2={toSvgY(val)} stroke={C.border} strokeWidth={1} strokeDasharray="4,4" />
                    <text x={PAD - 8} y={toSvgY(val) + 4} fontSize={10} fill={C.faint} textAnchor="end" fontFamily="'DM Mono', monospace">{val}</text>
                  </g>
                ))}

                {/* Axis */}
                <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={C.muted} strokeWidth={2} />

                {/* Year ticks */}
                {[0, 2, 4, 6, 8, 10].map(y => (
                  <g key={y}>
                    <line x1={toSvgX(y)} y1={H - PAD} x2={toSvgX(y)} y2={H - PAD + 5} stroke={C.muted} strokeWidth={2} />
                    <text x={toSvgX(y)} y={H - PAD + 18} fontSize={10} fill={C.faint} textAnchor="middle" fontFamily="'DM Mono', monospace">Yr {y}</text>
                  </g>
                ))}

                {/* Data Path */}
                <path d={pathD} fill="none" stroke={rateColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }} />

                {/* Current Year Indicator */}
                <line x1={toSvgX(years)} y1={PAD} x2={toSvgX(years)} y2={H - PAD} stroke={C.accent} strokeWidth={1.5} strokeDasharray="4,2" />
                <circle cx={toSvgX(years)} cy={toSvgY(purchasingPower)} r={6} fill={C.surface} stroke={C.accent} strokeWidth={2.5} />
                <circle cx={toSvgX(years)} cy={toSvgY(purchasingPower)} r={3} fill={rateColor} style={{ transition: "fill 0.3s" }} />

                <text x={toSvgX(years)} y={toSvgY(purchasingPower) - 12} fontSize={12} fontWeight={700} fill={C.accent} fontFamily="'DM Mono', monospace" textAnchor="middle" paintOrder="stroke" stroke={C.surface} strokeWidth={4}>${purchasingPower.toFixed(0)}</text>
              </svg>
            </div>

          </div>

          {/* ════ RIGHT PANEL: THEORY ════ */}
          <div style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 14 }}>

            <div style={{ background: C.surface, borderRadius: 14, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ background: C.panel, padding: "12px 16px", borderBottom: `1.5px solid ${C.border}` }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: C.text, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                  <span style={{ fontSize: 16 }}>🌍</span> Real-World Examples
                </h2>
              </div>
              <div style={{ padding: "16px 16px 8px" }}>
                {EXAMPLES.map((ex, i) => (
                  <ExCard key={i} icon={ex.icon} text={ex.text} bg={C.panel} borderColor={C.border} />
                ))}
              </div>
            </div>

            <div style={{ background: C.surface, borderRadius: 14, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ background: "rgba(139, 92, 246, 0.08)", padding: "12px 16px", borderBottom: `1.5px solid ${C.border}` }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: C.accent, display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                  <span style={{ fontSize: 16 }}>📖</span> Glossary
                </h2>
              </div>
              <div style={{ padding: "0 16px" }}>
                {GLOSSARY.map((g, i) => <GlossItem key={i} term={g.term} def={g.def} />)}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
