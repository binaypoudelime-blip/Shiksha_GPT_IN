"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, RotateCcw, X } from "lucide-react";

/* ── palette ── */
const C = {
  bg: "var(--sd-bg)",
  surface: "var(--sd-surface)",
  panel: "var(--sd-panel)",
  border: "var(--sd-border)",
  text: "var(--sd-text)",
  muted: "var(--sd-muted)",
  faint: "var(--sd-faint)",
  demand: "var(--sd-demand)",
  demandBg: "var(--sd-demand-bg)",
  supply: "var(--sd-supply)",
  supplyBg: "var(--sd-supply-bg)",
  eq: "var(--sd-eq)",
  eqBg: "var(--sd-eq-bg)",
  accent: "var(--sd-accent)",
  demandBorder: "var(--sd-demand-border)",
  supplyBorder: "var(--sd-supply-border)",
  eqBorder: "var(--sd-eq-border)",
  accentBorder: "var(--sd-accent-border)",
};

/* ── helpers ── */
const W = 480, H = 360, PAD = 48;
const toSvgX = (q: number, qMax = 100) => PAD + (q / qMax) * (W - 2 * PAD);
const toSvgY = (p: number, pMax = 100) => H - PAD - (p / pMax) * (H - 2 * PAD);
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

function getDemand(q: number, dShift: number) { return 90 - 0.8 * q + dShift; }
function getSupply(q: number, sShift: number) { return 10 + 0.8 * q - sShift; }
function getEq(dShift: number, sShift: number) {
  // 90 - 0.8Q + dShift = 10 + 0.8Q - sShift
  // 80 + dShift + sShift = 1.6Q
  const Q = (80 + dShift + sShift) / 1.6;
  const P = getDemand(Q, dShift);
  return { Q: clamp(Q, 0, 100), P: clamp(P, 0, 100) };
}
function linePath(fn: any, shift: number, qMin = 0, qMax = 100) {
  const pts = [];
  for (let q = qMin; q <= qMax; q += 2) {
    const p = fn(q, shift);
    if (p >= 0 && p <= 105) pts.push(`${toSvgX(q)},${toSvgY(p)}`);
  }
  return pts.length > 1 ? "M " + pts.join(" L ") : "";
}

/* ── Slider ── */
function Slider({ label, value, min, max, onChange, color, unit = "", step = 1 }: any) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "'Space Mono',monospace" }}>
          {value > 0 ? "+" : ""}{value}{unit}
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          style={{ width: "100%", accentColor: color, cursor: "pointer", height: 4 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 9, color: C.faint }}>Low</span>
        <span style={{ fontSize: 9, color: C.faint }}>High</span>
      </div>
    </div>
  );
}

/* ── Real World Example Card ── */
function ExCard({ icon, text, color, bg, borderColor }: any) {
  return (
    <div style={{
      padding: "9px 12px", borderRadius: 8, marginBottom: 7,
      background: bg, border: `1px solid ${borderColor}`,
      display: "flex", gap: 8, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 11, color: C.text, lineHeight: 1.6 }}>{text}</span>
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
  { term: "Demand", def: "The relationship between the price and the quantity demanded of a certain good or service." },
  { term: "Quantity Demanded", def: "The total number of units of a good or service consumers are willing to purchase at a given price." },
  { term: "Quantity Supplied", def: "The total number of units of a good or service producers are willing to sell at a given price." },
  { term: "Shift in Demand", def: "When a change in some economic factor (other than price) causes a different quantity to be demanded at every price level." },
  { term: "Shift in Supply", def: "When a change in some economic factor (other than price) causes a different quantity to be supplied at every price level." },
  { term: "Supply", def: "The relationship between price and the quantity supplied of a certain good or service." },
  { term: "Equilibrium", def: "The point where the supply and demand curves intersect — the market-clearing price and quantity." },
  { term: "Movement Along Curve", def: "A change in quantity demanded or supplied caused only by a change in price — the curve itself does not move." },
];

const D_EXAMPLES = [
  { icon: "💻", text: "During COVID-era stimulus in the U.S., demand for laptops surged as household income temporarily increased." },
  { icon: "⚡", text: "When gasoline prices rise, demand for electric vehicles (e.g. Tesla) increases as consumers substitute away from petrol." },
  { icon: "💪", text: "Fitness trends boosted demand for protein products and gym memberships, shifting the demand curve right." },
];
const S_EXAMPLES = [
  { icon: "✈️", text: "When crude oil prices increase, airline operating costs rise — reducing supply of flights and shifting the curve left." },
  { icon: "🚗", text: "Semiconductor shortages affected companies like Toyota, lowering car supply and shifting the curve left." },
  { icon: "🤖", text: "Automation in warehouses (e.g. Amazon) increases output efficiency, shifting the supply curve right." },
  { icon: "☀️", text: "Government subsidies for solar energy lower production costs, shifting the supply curve right." },
];

const SCENARIOS = [
  { title: "Health Scare About Product", desc: "A viral study links the product to health risks.", demandShift: -25, supplyShift: 0, priceAns: "down", qtyAns: "down" },
  { title: "Celebrity Endorsement", desc: "A major pop star is seen using the product everywhere.", demandShift: 25, supplyShift: 0, priceAns: "up", qtyAns: "up" },
  { title: "Breakthrough in Automation", desc: "New robotic assembly lines cut production time in half.", demandShift: 0, supplyShift: 25, priceAns: "down", qtyAns: "up" },
  { title: "Severe Weather Destroys Crops", desc: "A hurricane wipes out major manufacturing centers.", demandShift: 0, supplyShift: -25, priceAns: "up", qtyAns: "down" },
  { title: "Consumer Incomes Rise", desc: "A booming economy gives people more disposable income to spend.", demandShift: 25, supplyShift: 0, priceAns: "up", qtyAns: "up" },
  { title: "Price of Substitute Skyrockets", desc: "A competing product suddenly doubles in price.", demandShift: 25, supplyShift: 0, priceAns: "up", qtyAns: "up" },
  { title: "Government Subsidizes Producers", desc: "The government offers tax breaks to manufacturers of this good.", demandShift: 0, supplyShift: 25, priceAns: "down", qtyAns: "up" },
  { title: "Raw Material Shortage", desc: "The cost of essential materials spikes globally.", demandShift: 0, supplyShift: -25, priceAns: "up", qtyAns: "down" },
  { title: "Expectation of Future Price Drop", desc: "Consumers hear a much cheaper version is coming next month.", demandShift: -25, supplyShift: 0, priceAns: "down", qtyAns: "down" },
  { title: "Massive Influx of New Competitors", desc: "Dozens of new companies enter the market selling the same good.", demandShift: 0, supplyShift: 25, priceAns: "down", qtyAns: "up" },
  { title: "Electric Vehicle Boom", desc: "A global push for green energy skyrockets the demand for EVs.", demandShift: 25, supplyShift: 0, priceAns: "up", qtyAns: "up" }
];

function ScenarioMode({ onClose }: { onClose: () => void }) {
  const [questions] = useState(() => [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 10));
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [predPrice, setPredPrice] = useState<"up"|"down"|null>(null);
  const [predQty, setPredQty] = useState<"up"|"down"|null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sc = questions[round];

  const eq1 = getEq(submitted ? sc.demandShift : 0, submitted ? sc.supplyShift : 0);

  const handleSubmit = () => {
    setSubmitted(true);
    if (predPrice === sc.priceAns && predQty === sc.qtyAns) {
      setCorrectCount(c => c + 1);
    }
  };

  const handleNext = () => {
    if (round < questions.length - 1) {
      setRound(r => r + 1);
      setPredPrice(null);
      setPredQty(null);
      setSubmitted(false);
    } else {
      onClose();
    }
  };

  const pTicks = [0, 20, 40, 60, 80, 100];
  const qTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 8px", color: C.text }}>Supply & Demand Scenarios</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.faint, fontWeight: 600 }}>
            <span>Round {round + 1} of {questions.length}</span>
            <span>·</span>
            <span style={{ 
              background: C.supplyBg, color: C.supply, padding: "2px 8px", borderRadius: 12, fontWeight: 800, border: `1.5px solid ${C.supplyBorder}`
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
        background: C.surface, border: `1.5px solid ${C.demandBorder}`, borderRadius: 10, overflow: "hidden",
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

      {/* Graph & Question Area Layout */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        
        {/* GRAPH */}
        <div style={{
          flex: "1 1 340px",
          background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "16px",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,.04)"
        }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 400, display: "block" }}>
            {pTicks.map(p => (
              <line key={`p${p}`} x1={PAD} y1={toSvgY(p)} x2={W - PAD} y2={toSvgY(p)} stroke="#e2ddd6" className="dark:stroke-slate-700" strokeWidth={1} />
            ))}
            {qTicks.map(q => (
              <line key={`q${q}`} x1={toSvgX(q)} y1={PAD} x2={toSvgX(q)} y2={H - PAD} stroke="#e2ddd6" className="dark:stroke-slate-700" strokeWidth={1} />
            ))}

            <line x1={PAD} y1={PAD - 8} x2={PAD} y2={H - PAD + 2} stroke={C.faint} strokeWidth={2} strokeLinecap="round" />
            <line x1={PAD - 2} y1={H - PAD} x2={W - PAD + 8} y2={H - PAD} stroke={C.faint} strokeWidth={2} strokeLinecap="round" />
            
            <text x={14} y={H / 2} fontSize={13} fontWeight={700} fill={C.faint} fontFamily="'DM Mono', monospace" textAnchor="middle" transform={`rotate(-90, 14, ${H / 2})`}>Price</text>
            <text x={W / 2} y={H - 14} fontSize={13} fontWeight={700} fill={C.faint} fontFamily="'DM Mono', monospace" textAnchor="middle">Quantity</text>

            {/* Base curves */}
            <path d={linePath(getDemand, 0)} stroke={submitted && sc.demandShift ? C.demandBorder : C.demand} strokeWidth={submitted && sc.demandShift ? 2 : 3} fill="none" strokeDasharray={submitted && sc.demandShift ? "5,4" : "none"} strokeLinecap="round" />
            <path d={linePath(getSupply, 0)} stroke={submitted && sc.supplyShift ? C.supplyBorder : C.supply} strokeWidth={submitted && sc.supplyShift ? 2 : 3} fill="none" strokeDasharray={submitted && sc.supplyShift ? "5,4" : "none"} strokeLinecap="round" />

            <text x={toSvgX(90) + 12} y={toSvgY(getDemand(90, 0)) - 12} fontSize={14} fontWeight={700} fill={submitted && sc.demandShift ? C.faint : C.demand}>D</text>
            <text x={toSvgX(88) + 12} y={toSvgY(getSupply(88, 0)) + 16} fontSize={14} fontWeight={700} fill={submitted && sc.supplyShift ? C.faint : C.supply}>S</text>

            {/* Shifted curves */}
            {submitted && sc.demandShift !== 0 && (
              <>
                <path d={linePath(getDemand, sc.demandShift)} stroke={C.demand} strokeWidth={3} fill="none" strokeLinecap="round" />
                <text x={toSvgX(90) + 12} y={toSvgY(getDemand(90, sc.demandShift)) - 12} fontSize={14} fontWeight={700} fill={C.demand}>D'</text>
              </>
            )}
            {submitted && sc.supplyShift !== 0 && (
              <>
                <path d={linePath(getSupply, sc.supplyShift)} stroke={C.supply} strokeWidth={3} fill="none" strokeLinecap="round" />
                <text x={toSvgX(88) + 12} y={toSvgY(getSupply(88, sc.supplyShift)) + 16} fontSize={14} fontWeight={700} fill={C.supply}>S'</text>
              </>
            )}

            <line x1={toSvgX(eq1.Q)} y1={H - PAD} x2={toSvgX(eq1.Q)} y2={toSvgY(eq1.P)} stroke={C.eq} strokeWidth={1.5} strokeDasharray="4,4" />
            <line x1={PAD} y1={toSvgY(eq1.P)} x2={toSvgX(eq1.Q)} y2={toSvgY(eq1.P)} stroke={C.eq} strokeWidth={1.5} strokeDasharray="4,4" />
            <circle cx={toSvgX(eq1.Q)} cy={toSvgY(eq1.P)} r={6} fill={C.surface} stroke={C.eq} strokeWidth={2.5} />
            <circle cx={toSvgX(eq1.Q)} cy={toSvgY(eq1.P)} r={3} fill={C.eq} />
          </svg>
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
                  <div style={{ fontSize: 10, color: C.faint, textAlign: "center", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>PRICE WILL...</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setPredPrice("up")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predPrice === "up" ? C.supply : C.border}`,
                      background: predPrice === "up" ? C.supplyBg : C.panel, color: predPrice === "up" ? C.supply : C.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s"
                    }}>↗ Go Up</button>
                    <button onClick={() => setPredPrice("down")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predPrice === "down" ? C.demand : C.border}`,
                      background: predPrice === "down" ? C.demandBg : C.panel, color: predPrice === "down" ? C.demand : C.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s"
                    }}>↘ Go Down</button>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 10, color: C.faint, textAlign: "center", marginBottom: 8, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>QUANTITY WILL...</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setPredQty("up")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predQty === "up" ? C.supply : C.border}`,
                      background: predQty === "up" ? C.supplyBg : C.panel, color: predQty === "up" ? C.supply : C.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s"
                    }}>↗ Go Up</button>
                    <button onClick={() => setPredQty("down")} style={{
                      flex: 1, padding: "12px 0", borderRadius: 8, border: `1.5px solid ${predQty === "down" ? C.demand : C.border}`,
                      background: predQty === "down" ? C.demandBg : C.panel, color: predQty === "down" ? C.demand : C.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s"
                    }}>↘ Go Down</button>
                  </div>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={!predPrice || !predQty} style={{
                width: "100%", padding: 14, borderRadius: 8, border: "none",
                background: (!predPrice || !predQty) ? C.border : C.accent,
                color: (!predPrice || !predQty) ? C.faint : "#fff",
                fontWeight: 800, fontSize: 14, cursor: (!predPrice || !predQty) ? "not-allowed" : "pointer",
                marginTop: 24, transition: "background 0.2s"
              }}>
                Submit Prediction ❯
              </button>
            </div>
          ) : (
            <div style={{
              background: C.surface, border: `1.5px solid ${predPrice === sc.priceAns && predQty === sc.qtyAns ? C.supplyBorder : C.demandBorder}`, borderRadius: 14, padding: "24px 20px",
              boxShadow: "0 4px 16px rgba(0,0,0,.05)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "100%"
            }}>
              <div style={{
                fontSize: 28, fontWeight: 800, marginBottom: 12,
                color: predPrice === sc.priceAns && predQty === sc.qtyAns ? C.supply : C.demand
              }}>
                {predPrice === sc.priceAns && predQty === sc.qtyAns ? "🎉 Correct!" : "❌ Incorrect"}
              </div>
              <p style={{ fontSize: 15, color: C.text, margin: "0 0 24px", lineHeight: 1.6 }}>
                The <strong>{sc.demandShift !== 0 ? 'Demand' : 'Supply'}</strong> curve shifted {sc.demandShift > 0 || sc.supplyShift > 0 ? 'right' : 'left'}, causing the price to go <strong style={{ 
                  color: sc.priceAns === 'up' ? C.supply : C.demand, background: sc.priceAns === 'up' ? C.supplyBg : C.demandBg,
                  padding: "2px 8px", borderRadius: 6, border: `1.5px solid ${sc.priceAns === 'up' ? C.supplyBorder : C.demandBorder}`
                }}>{sc.priceAns.toUpperCase()}</strong> and quantity to go <strong style={{ 
                  color: sc.qtyAns === 'up' ? C.supply : C.demand, background: sc.qtyAns === 'up' ? C.supplyBg : C.demandBg,
                  padding: "2px 8px", borderRadius: 6, border: `1.5px solid ${sc.qtyAns === 'up' ? C.supplyBorder : C.demandBorder}`
                }}>{sc.qtyAns.toUpperCase()}</strong>.
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
export default function SupplyDemandLab() {
  const [dShift, setDShift] = useState(0);   // demand shift: positive = right
  const [sShift, setSShift] = useState(0);   // supply shift: positive = right (lower cost)
  const [priceOffset, setPriceOffset] = useState(0); // price movement
  const [activeTab, setActiveTab] = useState("demand");  // examples tab
  const [showGloss, setShowGloss] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [isScenarioMode, setIsScenarioMode] = useState(false);

  const eq0 = useMemo(() => getEq(0, 0), []);
  const eq = useMemo(() => getEq(dShift, sShift), [dShift, sShift]);

  const currentPrice = clamp(eq.P + priceOffset, 0, 100);
  const Qd = clamp((90 + dShift - currentPrice) / 0.8, 0, 100);
  const Qs = clamp((currentPrice - 10 + sShift) / 0.8, 0, 100);
  const hasPriceOffset = priceOffset !== 0;

  const dPath0 = useMemo(() => linePath(getDemand, 0), []);
  const sPath0 = useMemo(() => linePath(getSupply, 0), []);
  const dPath = useMemo(() => linePath(getDemand, dShift), [dShift]);
  const sPath = useMemo(() => linePath(getSupply, sShift), [sShift]);

  const dChanged = dShift !== 0;
  const sChanged = sShift !== 0;

  const dDir = dShift > 0 ? "right ↗ (Higher Demand)" : dShift < 0 ? "left ↙ (Lower Demand)" : "";
  const sDir = sShift > 0 ? "right ↗ (Higher Supply)" : sShift < 0 ? "left ↙ (Lower Supply)" : "";

  const eqDeltaQ = (eq.Q - eq0.Q).toFixed(1);
  const eqDeltaP = (eq.P - eq0.P).toFixed(1);

  // tick labels
  const pTicks = [0, 20, 40, 60, 80, 100];
  const qTicks = [0, 20, 40, 60, 80, 100];

  const handleReset = () => { setDShift(0); setSShift(0); setPriceOffset(0); setAnimKey(k => k + 1); };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "radial-gradient(circle at 1.5px 1.5px, var(--sd-dots, rgba(16,185,129,.1)) 1.5px, transparent 0)",
      backgroundSize: "24px 24px",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: C.text,
      padding: "2px 16px 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,600&family=DM+Sans:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        :root {
          --sd-dots: rgba(16,185,129, 0.12);
          --sd-bg: #f7f5f0;
          --sd-surface: #ffffff;
          --sd-panel: #fafaf7;
          --sd-border: #e2ddd6;
          --sd-text: #1a1612;
          --sd-muted: #475569;
          --sd-faint: #64748b;
          --sd-demand: #ef4444;
          --sd-demand-bg: #fef2f2;
          --sd-supply: #10b981;
          --sd-supply-bg: #ecfdf5;
          --sd-eq: #3b82f6;
          --sd-eq-bg: #eff6ff;
          --sd-accent: #8b5cf6;
          --sd-card-warn-bg: #fff8f0;
          --sd-card-info-bg: #f0f6ff;
          --sd-demand-border: rgba(239, 68, 68, 0.25);
          --sd-supply-border: rgba(16, 185, 129, 0.25);
          --sd-eq-border: rgba(59, 130, 246, 0.3);
          --sd-accent-border: rgba(139, 92, 246, 0.25);
        }
        :root.dark, .dark {
          --sd-dots: rgba(16,185,129, 0.08);
          --sd-bg: #0f172a;
          --sd-surface: #1e293b;
          --sd-panel: #0f172a;
          --sd-border: #334155;
          --sd-text: #f8fafc;
          --sd-muted: #cbd5e1;
          --sd-faint: #94a3b8;
          --sd-demand: #ef4444;
          --sd-demand-bg: rgba(239, 68, 68, 0.15);
          --sd-supply: #10b981;
          --sd-supply-bg: rgba(16, 185, 129, 0.15);
          --sd-eq: #3b82f6;
          --sd-eq-bg: rgba(59, 130, 246, 0.15);
          --sd-accent: #a78bfa;
          --sd-card-warn-bg: rgba(245, 158, 11, 0.1);
          --sd-card-info-bg: rgba(59, 130, 246, 0.1);
          --sd-demand-border: rgba(239, 68, 68, 0.25);
          --sd-supply-border: rgba(16, 185, 129, 0.25);
          --sd-eq-border: rgba(59, 130, 246, 0.3);
          --sd-accent-border: rgba(139, 92, 246, 0.25);
        }
        * { box-sizing:border-box; }
        input[type=range]{ height:4px; border-radius:2px; outline:none; border:none; }
        button { font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .15s; }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseEq { 0%{r:7px} 50%{r:10px} 100%{r:7px} }
        .eq-dot { animation: pulseEq 1.6s ease-in-out infinite; }
      `}</style>

      {/* ── Header w/ Back Button ── */}
      {!isScenarioMode && (
        <div className="-mt-2" style={{ maxWidth: 1060, margin: "0 auto 28px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Back Button positioned left */}
          <div style={{ position: "absolute", left: 0 }}>
            <Link href="/app/lab/bems" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors dark:text-slate-400 w-max group">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1E] shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-slate-200 dark:border-white/5">
                <ChevronLeft className="w-4 h-4" />
              </div>
              Back
            </Link>
          </div>

          <h1 className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 m-0" style={{ textShadow: "0 2px 8px rgba(16,185,129,.12)" }}>
            <span style={{ fontFamily: "'Caveat',cursive", fontSize: 44, fontWeight: 700 }} className="text-emerald-600 dark:text-emerald-400">
              Supply & Demand
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-[16px] mx-1 mt-3 tracking-wide font-sans lowercase">
              curve shifter
            </span>
          </h1>

          {/* Play Scenarios Button positioned right */}
          <div style={{ position: "absolute", right: 0 }}>
            <button onClick={() => setIsScenarioMode(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg transition-all hover:-translate-y-0.5 text-sm">
              <span className="text-lg">🎮</span> Play Scenarios
            </button>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      {isScenarioMode ? (
        <ScenarioMode onClose={() => setIsScenarioMode(false)} />
      ) : (
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", gap: 14, flexWrap: "wrap" }}>

        {/* ════ LEFT PANEL ════ */}
        <div style={{ flex: "0 0 230px", display: "flex", flexDirection: "column", gap: 10 }}>

          <button onClick={handleReset} style={{
            padding: "10px 20px", borderRadius: 12, border: `1.5px solid ${C.border}`,
            background: C.surface, color: C.muted, fontSize: 13, fontWeight: 700,
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 1px 8px rgba(0,0,0,.05)"
          }} className="hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors">
            <RotateCcw size={16} />
            Reset Simulation
          </button>

          {/* Demand Shifters */}
          <div style={{
            background: C.surface, border: `1.5px solid ${C.demandBorder}`,
            borderRadius: 12, padding: 16,
            boxShadow: "0 1px 8px rgba(192,57,43,.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.demand }} />
              <span style={{ fontSize: 15, fontWeight: 900, color: C.demand, fontFamily: "'Playfair Display',serif" }}>
                Demand Shifters
              </span>
            </div>

            <Slider label="Consumer Income" value={dShift} min={-30} max={30} onChange={setDShift} color={C.demand} />

            {dChanged && (
              <div style={{
                padding: "8px 10px", background: C.demandBg, borderRadius: 7,
                fontSize: 12, color: C.demand, marginTop: 4, lineHeight: 1.6,
                fontWeight: 600, animation: "fadeSlide .3s ease",
              }}>
                Demand curve shifted <strong>{dDir}</strong>
                <br />↳ At every price, consumers buy <strong>{dShift > 0 ? "more" : "less"}</strong>
              </div>
            )}

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 10.5, color: C.faint, margin: "0 0 6px", letterSpacing: ".07em", textTransform: "uppercase", fontWeight: 700 }}>Also shifts demand:</p>
              {["Tastes & Preferences", "Prices of Related Goods", "Consumer Expectations", "Number of Buyers"].map(f => (
                <div key={f} style={{ fontSize: 12, color: C.muted, padding: "3px 0", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                  <span style={{ color: C.demand, fontSize: 9 }}>●</span>{f}
                </div>
              ))}
            </div>
          </div>

          {/* Supply Shifters */}
          <div style={{
            background: C.surface, border: `1.5px solid ${C.supplyBorder}`,
            borderRadius: 12, padding: 16,
            boxShadow: "0 1px 8px rgba(26,107,60,.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.supply }} />
              <span style={{ fontSize: 15, fontWeight: 900, color: C.supply, fontFamily: "'Playfair Display',serif" }}>
                Supply Shifters
              </span>
            </div>

            <Slider label="Cost of Raw Materials" value={-sShift} min={-30} max={30}
              onChange={(v: number) => setSShift(-v)} color={C.supply} />

            {sChanged && (
              <div style={{
                padding: "8px 10px", background: C.supplyBg, borderRadius: 7,
                fontSize: 12, color: C.supply, marginTop: 4, lineHeight: 1.6,
                fontWeight: 600, animation: "fadeSlide .3s ease",
              }}>
                Supply curve shifted <strong>{sDir}</strong>
                <br />↳ Producers offer <strong>{sShift > 0 ? "more" : "less"}</strong> at every price
              </div>
            )}

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 10.5, color: C.faint, margin: "0 0 6px", letterSpacing: ".07em", textTransform: "uppercase", fontWeight: 700 }}>Also shifts supply:</p>
              {["Technology & Automation", "Number of Sellers", "Government Subsidies", "Natural Events / Weather"].map(f => (
                <div key={f} style={{ fontSize: 12, color: C.muted, padding: "3px 0", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                  <span style={{ color: C.supply, fontSize: 9 }}>●</span>{f}
                </div>
              ))}
            </div>
          </div>

          {/* Price Interventions */}
          <div style={{
            background: C.surface, border: `1.5px solid ${C.accentBorder}`,
            borderRadius: 12, padding: 16,
            boxShadow: "0 1px 8px rgba(139,92,246,.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.accent }} />
              <span style={{ fontSize: 15, fontWeight: 900, color: C.accent, fontFamily: "'Playfair Display',serif" }}>
                Price Control
              </span>
            </div>

            <Slider label="Change in Price" value={priceOffset} min={-40} max={40} onChange={setPriceOffset} color={C.accent} />

            {hasPriceOffset && (
              <div style={{
                padding: "8px 10px", background: "var(--sd-card-info-bg)", borderRadius: 7,
                fontSize: 12, color: C.accent, marginTop: 4, lineHeight: 1.6,
                fontWeight: 600, animation: "fadeSlide .3s ease",
              }}>
                Movement along the curves!
                <br />↳ Creates a <strong>{Qd > Qs ? "Shortage" : Qd < Qs ? "Surplus" : "Equilibrium"}</strong>
              </div>
            )}
          </div>

          {/* Key Insight Box */}
          <div style={{
            padding: "12px 14px", background: C.eqBg,
            border: `1px solid ${C.accent}33`, borderRadius: 10,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: ".08em", textTransform: "uppercase", margin: "0 0 6px" }}>
              💡 Key Insight
            </p>
            <p style={{ fontSize: 11, color: C.text, margin: 0, lineHeight: 1.7 }}>
              <strong>Price change</strong> → movement <em>along</em> the curve.<br />
              <strong>Non-price factor</strong> → shift <em>of</em> the curve.
            </p>
          </div>
        </div>

        {/* ════ CENTRE: GRAPH ════ */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Graph */}
          <div style={{
            background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 14, padding: "16px 14px 12px",
            boxShadow: "0 2px 16px rgba(0,0,0,.06)",
          }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
              {/* grid */}
              {pTicks.map(p => (
                <line key={p} x1={PAD} y1={toSvgY(p)} x2={W - PAD} y2={toSvgY(p)}
                  stroke="#ece9e2" strokeWidth={1} />
              ))}
              {qTicks.map(q => (
                <line key={q} x1={toSvgX(q)} y1={PAD} x2={toSvgX(q)} y2={H - PAD}
                  stroke="#ece9e2" strokeWidth={1} />
              ))}

              {/* axes */}
              <line x1={PAD} y1={PAD - 8} x2={PAD} y2={H - PAD + 2} stroke={C.text} strokeWidth={2} strokeLinecap="round" />
              <line x1={PAD - 2} y1={H - PAD} x2={W - PAD + 8} y2={H - PAD} stroke={C.text} strokeWidth={2} strokeLinecap="round" />

              {/* axis arrows */}
              <polygon points={`${PAD},${PAD - 10} ${PAD - 4},${PAD - 2} ${PAD + 4},${PAD - 2}`} fill={C.text} />
              <polygon points={`${W - PAD + 10},${H - PAD} ${W - PAD + 2},${H - PAD - 4} ${W - PAD + 2},${H - PAD + 4}`} fill={C.text} />

              {/* axis labels */}
              <text x={14} y={H / 2} fontSize={13} fontWeight={700} fill={C.text} fontFamily="'DM Mono', monospace" textAnchor="middle" transform={`rotate(-90, 14, ${H / 2})`}>Price (P)</text>
              <text x={W / 2} y={H - 14} fontSize={13} fontWeight={700} fill={C.text} fontFamily="'DM Mono', monospace" textAnchor="middle">Quantity (Q)</text>
              <text x={PAD - 10} y={H - PAD + 18} fontSize={9} fill={C.faint} fontFamily="'DM Mono',monospace">0</text>

              {/* tick labels */}
              {pTicks.filter(p => p > 0).map(p => (
                <text key={p} x={PAD - 6} y={toSvgY(p) + 4} fontSize={8.5} fill={C.faint} textAnchor="end" fontFamily="'DM Mono',monospace">{p}</text>
              ))}
              {qTicks.filter(q => q > 0).map(q => (
                <text key={q} x={toSvgX(q)} y={H - PAD + 14} fontSize={8.5} fill={C.faint} textAnchor="middle" fontFamily="'DM Mono',monospace">{q}</text>
              ))}

              {/* original curves (ghost) */}
              {dChanged && <path d={dPath0} stroke={C.demand} strokeWidth={1.4} fill="none" strokeDasharray="5,4" opacity={0.3} />}
              {sChanged && <path d={sPath0} stroke={C.supply} strokeWidth={1.4} fill="none" strokeDasharray="5,4" opacity={0.3} />}

              {/* original equilibrium (ghost) */}
              {(dChanged || sChanged) && (
                <>
                  <line x1={toSvgX(eq0.Q)} y1={H - PAD} x2={toSvgX(eq0.Q)} y2={toSvgY(eq0.P)}
                    stroke={C.eq} strokeWidth={1} strokeDasharray="4,3" opacity={0.35} />
                  <line x1={PAD} y1={toSvgY(eq0.P)} x2={toSvgX(eq0.Q)} y2={toSvgY(eq0.P)}
                    stroke={C.eq} strokeWidth={1} strokeDasharray="4,3" opacity={0.35} />
                  <circle cx={toSvgX(eq0.Q)} cy={toSvgY(eq0.P)} r={5} fill="none" stroke={C.eq} strokeWidth={1.5} opacity={0.4} />
                </>
              )}

              {/* DEMAND curve */}
              <path d={dPath} stroke={C.demand} strokeWidth={2.8} fill="none" strokeLinecap="round" />

              {/* SUPPLY curve */}
              <path d={sPath} stroke={C.supply} strokeWidth={2.8} fill="none" strokeLinecap="round" />

              {/* equilibrium dashed lines */}
              <line x1={toSvgX(eq.Q)} y1={H - PAD} x2={toSvgX(eq.Q)} y2={toSvgY(eq.P)}
                stroke={C.eq} strokeWidth={1.5} strokeDasharray="6,3" />
              <line x1={PAD} y1={toSvgY(eq.P)} x2={toSvgX(eq.Q)} y2={toSvgY(eq.P)}
                stroke={C.eq} strokeWidth={1.5} strokeDasharray="6,3" />

              {/* equilibrium dot */}
              <circle cx={toSvgX(eq.Q)} cy={toSvgY(eq.P)} r={7} fill={C.surface} stroke={C.eq} strokeWidth={2.5} className="eq-dot" />
              <circle cx={toSvgX(eq.Q)} cy={toSvgY(eq.P)} r={3} fill={C.eq} />
              <text x={toSvgX(eq.Q)} y={toSvgY(eq.P) - 14} fontSize={12} fontWeight={700} fill={C.eq} fontFamily="'DM Mono', monospace" textAnchor="middle" paintOrder="stroke" stroke={C.surface} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">E*</text>

              {/* CURRENT PRICE line (if shifted) */}
              {hasPriceOffset && (
                <>
                  <line x1={PAD} y1={toSvgY(currentPrice)} x2={W - PAD} y2={toSvgY(currentPrice)}
                    stroke={C.accent} strokeWidth={1.5} strokeDasharray="6,3" opacity={0.6} />
                  
                  {/* Surplus / Shortage bracket */}
                  <line x1={toSvgX(Math.min(Qd, Qs))} y1={toSvgY(currentPrice)} x2={toSvgX(Math.max(Qd, Qs))} y2={toSvgY(currentPrice)}
                    stroke={C.accent} strokeWidth={4} opacity={0.5} />
                  
                  {/* Qd dot and line */}
                  <line x1={toSvgX(Qd)} y1={H - PAD} x2={toSvgX(Qd)} y2={toSvgY(currentPrice)}
                    stroke={C.demand} strokeWidth={1.5} strokeDasharray="4,4" opacity={0.7} />
                  <circle cx={toSvgX(Qd)} cy={toSvgY(currentPrice)} r={5} fill={C.demand} stroke={C.surface} strokeWidth={1.5} />
                  <text x={toSvgX(Qd)} y={H - PAD - 8} fontSize={11} fontWeight={700} fill={C.demand} fontFamily="'DM Mono', monospace" textAnchor="middle" paintOrder="stroke" stroke={C.surface} strokeWidth={3}>Qd</text>
                  
                  {/* Qs dot and line */}
                  <line x1={toSvgX(Qs)} y1={H - PAD} x2={toSvgX(Qs)} y2={toSvgY(currentPrice)}
                    stroke={C.supply} strokeWidth={1.5} strokeDasharray="4,4" opacity={0.7} />
                  <circle cx={toSvgX(Qs)} cy={toSvgY(currentPrice)} r={5} fill={C.supply} stroke={C.surface} strokeWidth={1.5} />
                  <text x={toSvgX(Qs)} y={H - PAD - 8} fontSize={11} fontWeight={700} fill={C.supply} fontFamily="'DM Mono', monospace" textAnchor="middle" paintOrder="stroke" stroke={C.surface} strokeWidth={3}>Qs</text>
                </>
              )}

              {/* curve labels */}
              <text x={toSvgX(90) + 12} y={toSvgY(getDemand(90, dShift)) - 12} fontSize={14} fontWeight={700}
                fill={C.demand} fontFamily="'DM Mono', monospace" textAnchor="middle" paintOrder="stroke" stroke={C.surface} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">D{dShift !== 0 ? "'" : ""}</text>
              <text x={toSvgX(88) + 12} y={toSvgY(getSupply(88, sShift)) + 16} fontSize={14} fontWeight={700}
                fill={C.supply} fontFamily="'DM Mono', monospace" textAnchor="middle" paintOrder="stroke" stroke={C.surface} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">S{sShift !== 0 ? "'" : ""}</text>

              {/* shift arrows */}
              {dChanged && (
                <g>
                  <defs>
                    <marker id="arrowD" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill={C.demand} />
                    </marker>
                  </defs>
                  <line
                    x1={toSvgX(50)} y1={toSvgY(getDemand(50, 0))}
                    x2={toSvgX(50) + dShift * 2.8} y2={toSvgY(getDemand(50, dShift))}
                    stroke={C.demand} strokeWidth={1.8} markerEnd="url(#arrowD)" opacity={0.65}
                  />
                </g>
              )}
              {sChanged && (
                <g>
                  <defs>
                    <marker id="arrowS" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill={C.supply} />
                    </marker>
                  </defs>
                  <line
                    x1={toSvgX(50)} y1={toSvgY(getSupply(50, 0))}
                    x2={toSvgX(50) + sShift * 2.8} y2={toSvgY(getSupply(50, sShift))}
                    stroke={C.supply} strokeWidth={1.8} markerEnd="url(#arrowS)" opacity={0.65}
                  />
                </g>
              )}
            </svg>
          </div>

          {/* ── Readout ── */}
          <div style={{
            background: C.eqBg, border: `1.5px solid ${C.eqBorder}`,
            borderRadius: 12, padding: "13px 16px",
            display: "flex", gap: 10, flexWrap: "wrap",
            boxShadow: "0 1px 8px rgba(212,160,23,.08)",
          }}>
            <div style={{ flex: 1, minWidth: 130 }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: hasPriceOffset ? C.accent : C.supply, margin: "0 0 2px", letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {hasPriceOffset ? "Market Price" : "Equilibrium Price"}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: hasPriceOffset ? C.accent : C.eq, fontFamily: "'Space Mono',monospace" }}>
                  {currentPrice.toFixed(1)}
                </span>
                {!hasPriceOffset && (dChanged || sChanged) && (
                  <span style={{ fontSize: 13, color: +eqDeltaP >= 0 ? C.demand : C.supply, fontWeight: 600 }}>
                    {+eqDeltaP >= 0 ? "↑" : "↓"} {Math.abs(+eqDeltaP)}
                  </span>
                )}
                {hasPriceOffset && (
                  <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>
                    {priceOffset > 0 ? "↑" : "↓"} {Math.abs(priceOffset)}
                  </span>
                )}
              </div>
            </div>

            {hasPriceOffset ? (
              <>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <p style={{ fontSize: 12, fontWeight: 900, color: C.demand, margin: "0 0 2px", letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Qty Demanded</p>
                  <span style={{ fontSize: 26, fontWeight: 700, color: C.demand, fontFamily: "'Space Mono',monospace" }}>
                    {Qd.toFixed(1)}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 100 }}>
                  <p style={{ fontSize: 12, fontWeight: 900, color: C.supply, margin: "0 0 2px", letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Qty Supplied</p>
                  <span style={{ fontSize: 26, fontWeight: 700, color: C.supply, fontFamily: "'Space Mono',monospace" }}>
                    {Qs.toFixed(1)}
                  </span>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ fontSize: 12, fontWeight: 900, color: C.supply, margin: "0 0 2px", letterSpacing: ".08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Equilibrium Quantity</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: C.eq, fontFamily: "'Space Mono',monospace" }}>
                    {eq.Q.toFixed(1)}
                  </span>
                  {(dChanged || sChanged) && (
                    <span style={{ fontSize: 13, color: +eqDeltaQ >= 0 ? C.supply : C.demand, fontWeight: 600 }}>
                      {+eqDeltaQ >= 0 ? "↑" : "↓"} {Math.abs(+eqDeltaQ)}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div style={{ flex: 2, minWidth: 180 }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: C.demand, margin: "0 0 4px", letterSpacing: ".08em", textTransform: "uppercase" }}>Market Narrative</p>
              <p style={{ fontSize: 12.5, color: C.text, margin: 0, lineHeight: 1.65, fontWeight: 500 }}>
                {hasPriceOffset ? (
                  Qd > Qs ? 
                    `At $${currentPrice.toFixed(1)}, consumers want ${Qd.toFixed(1)} units but producers only supply ${Qs.toFixed(1)} units. This creates a SHORTAGE of ${(Qd - Qs).toFixed(1)} units.` :
                  Qd < Qs ?
                    `At $${currentPrice.toFixed(1)}, producers supply ${Qs.toFixed(1)} units but consumers only want ${Qd.toFixed(1)} units. This creates a SURPLUS of ${(Qs - Qd).toFixed(1)} units.` :
                    "The market is in equilibrium. Quantity Demanded equals Quantity Supplied."
                ) : (
                  !dChanged && !sChanged ? "Adjust a slider to see the market respond in real time." :
                  dChanged && !sChanged && dShift > 0 ? "Rising consumer income has boosted demand. The curve shifts right, pushing equilibrium price UP and quantity UP." :
                  dChanged && !sChanged && dShift < 0 ? "Falling income has reduced demand. The curve shifts left, pulling price DOWN and quantity DOWN." :
                  sChanged && !dChanged && sShift > 0 ? "Lower material costs have increased supply. The curve shifts right — price FALLS but quantity RISES." :
                  sChanged && !dChanged && sShift < 0 ? "Higher material costs have squeezed supply. The curve shifts left — price RISES but quantity FALLS." :
                  "Both curves have shifted. The new equilibrium reflects the combined market effect — observe the direction of each change."
                )}
              </p>
            </div>
          </div>

          {/* ── Movement vs Shift Explainer ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
          }}>
            <div style={{ background: "var(--sd-card-warn-bg)", border: "1px solid #f59e0b44", borderRadius: 10, padding: "12px 14px" }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#b45309", margin: "0 0 5px", letterSpacing: ".07em", textTransform: "uppercase" }}>↕ Movement Along Curve</p>
              <p style={{ fontSize: 12.5, color: C.text, margin: 0, lineHeight: 1.65, fontWeight: 500 }}>Caused by a change in <strong>price only</strong>. The quantity demanded/supplied changes, but the curve stays in place.</p>
            </div>
            <div style={{ background: "var(--sd-card-info-bg)", border: `1px solid ${C.accentBorder}`, borderRadius: 10, padding: "12px 14px" }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: C.accent, margin: "0 0 5px", letterSpacing: ".07em", textTransform: "uppercase" }}>⇔ Shift of Curve</p>
              <p style={{ fontSize: 12.5, color: C.text, margin: 0, lineHeight: 1.65, fontWeight: 500 }}>Caused by a <strong>non-price factor</strong> (income, costs, tech…). The entire curve moves left or right.</p>
            </div>
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Real World Examples */}
          <div style={{
            background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 12, padding: 15,
            boxShadow: "0 1px 8px rgba(0,0,0,.05)",
          }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: C.muted, letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 12px" }}>
              🌍 Real-World Examples
            </p>
            <div style={{ display: "flex", gap: 0, marginBottom: 12, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
              {[
                { id: "demand", label: "Demand", color: C.demand },
                { id: "supply", label: "Supply", color: C.supply },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  flex: 1, padding: "7px 0", fontSize: 11, fontWeight: 600, border: "none",
                  background: activeTab === t.id ? t.color : C.panel,
                  color: activeTab === t.id ? "#fff" : C.muted,
                }}>{t.label}</button>
              ))}
            </div>

            {activeTab === "demand" && D_EXAMPLES.map((e, i) => (
              <ExCard key={i} icon={e.icon} text={e.text} color={C.demand} bg={C.demandBg} borderColor={C.demandBorder} />
            ))}
            {activeTab === "supply" && S_EXAMPLES.map((e, i) => (
              <ExCard key={i} icon={e.icon} text={e.text} color={C.supply} bg={C.supplyBg} borderColor={C.supplyBorder} />
            ))}
          </div>

          {/* Formula Card */}
          <div style={{
            background: "#0f1f3d", borderRadius: 12, padding: 15,
            boxShadow: "0 2px 12px rgba(15,31,61,.18)",
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#7ea8d8", letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 11px" }}>
              📐 Key Formulas
            </p>
            {[
              { name: "Law of Demand", eq: "↑ Price → ↓ Qd", sub: "Inverse relationship" },
              { name: "Law of Supply", eq: "↑ Price → ↑ Qs", sub: "Direct relationship" },
              { name: "Equilibrium", eq: "Qd = Qs", sub: "Market-clearing point" },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < 2 ? "1px solid #ffffff18" : "none" }}>
                <p style={{ fontSize: 9.5, color: "#7ea8d8", margin: "0 0 2px", letterSpacing: ".06em", textTransform: "uppercase" }}>{f.name}</p>
                <p style={{ fontSize: 14, fontFamily: "'Space Mono',monospace", color: "#f8f4ee", margin: "0 0 1px", fontWeight: 700 }}>{f.eq}</p>
                <p style={{ fontSize: 9.5, color: "#5a7a9a", margin: 0 }}>{f.sub}</p>
              </div>
            ))}
          </div>

          {/* Glossary */}
          <div style={{
            background: C.surface, border: `1.5px solid ${C.border}`,
            borderRadius: 12, overflow: "hidden",
            boxShadow: "0 1px 8px rgba(0,0,0,.05)",
          }}>
            <button onClick={() => setShowGloss(!showGloss)} style={{
              width: "100%", padding: "12px 15px", background: "transparent",
              border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between",
              color: C.text, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13,
              borderBottom: showGloss ? `1px solid ${C.border}` : "none",
            }}>
              📖 Glossary
              <span style={{ fontSize: 11, color: C.faint, transition: "transform .2s", display: "inline-block", transform: showGloss ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
            </button>
            {showGloss && (
              <div style={{ padding: "4px 15px 12px", maxHeight: 320, overflowY: "auto" }}>
                {GLOSSARY.map(g => <GlossItem key={g.term} term={g.term} def={g.def} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
