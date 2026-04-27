"use client";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Target, Rocket, Zap } from "lucide-react";
import Link from "next/link";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const toRad = (d: number) => (d * Math.PI) / 180;
const fmt = (n: number | string, d = 2) => (+n).toFixed(d);

/* ─── colour tokens ────────────────────────────────────────────────────── */
const T = {
  bg: "var(--pm-bg, transparent)",
  surface: "var(--pm-surface, #ffffff)",
  border: "var(--pm-border, #dde3ec)",
  borderAcc: "var(--pm-borderAcc, #c8d2e2)",
  text: "var(--pm-text, #1e293b)",
  muted: "var(--pm-muted, #64748b)",
  faint: "var(--pm-faint, #94a3b8)",
  A: "#f97316", // Angle/Orange
  V: "#3b82f6", // Velocity/Blue
  G: "#8b5cf6", // Gravity/Purple
  H: "#10b981", // Height/Green
  R: "#ef4444", // Range/Red
  svgGround: "var(--pm-svgGround, #cbd5e1)",
};

/* ─── Slider ──────────────────────────────────────────────────────────── */
function Slider({ label, value, min, max, step = 1, onChange, unit, color }: any) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: T.muted, letterSpacing: ".06em", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color, fontFamily: "'DM Mono',monospace" }}>
          {fmt(value, step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: color, cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 1 }}>
        <span style={{ fontSize: 9, color: T.faint }}>{min}{unit}</span>
        <span style={{ fontSize: 9, color: T.faint }}>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ─── Toggle ──────────────────────────────────────────────────────────── */
function Toggle({ value, onChange, label, activeColor = T.G }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
      <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{
        width: 38, height: 21, borderRadius: 11,
        background: value ? activeColor : T.border,
        cursor: "pointer", position: "relative", transition: "background .2s",
        border: `1px solid ${value ? activeColor : T.borderAcc}`, flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 2.5, left: value ? 18 : 2.5,
          width: 14, height: 14, borderRadius: "50%",
          background: "#fff", transition: "left .2s",
          boxShadow: "0 1px 4px rgba(0,0,0,.18)",
        }} />
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

/* ═══════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                         */
/* ═══════════════════════════════════════════════════════════════════════ */
export default function ProjectileMotionLab() {
  const [velocity, setVelocity] = useState(25);
  const [angle, setAngle] = useState(45);
  const [isMoon, setIsMoon] = useState(false);
  const [objType, setObjType] = useState("Football");
  const [showRef, setShowRef] = useState(false);

  const g = isMoon ? 1.62 : 9.81;
  const u = velocity;
  const thetaRad = toRad(angle);

  const ux = u * Math.cos(thetaRad);
  const uy = u * Math.sin(thetaRad);

  const timeOfFlight = (2 * uy) / g;
  const maxHeight = (uy * uy) / (2 * g);
  const range = (u * u * Math.sin(2 * thetaRad)) / g;

  const VW = 500, VH = 300, PAD_X = 50, PAD_Y = 50;

  const sc = useMemo(() => {
    return Math.min((VW - 2 * PAD_X) / Math.max(range, 1), (VH - 2 * PAD_Y) / Math.max(maxHeight, 1));
  }, [range, maxHeight]);

  const pathPoints = useMemo(() => {
    const pts = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = (timeOfFlight * i) / steps;
      const x = ux * t;
      const y = uy * t - 0.5 * g * t * t;
      pts.push(`${PAD_X + x * sc},${VH - PAD_Y - y * sc}`);
    }
    return pts;
  }, [ux, uy, g, timeOfFlight, sc, VH]);

  const pathD = `M ${pathPoints.join(" L ")}`;
  const endX = PAD_X + range * sc;
  const maxY = VH - PAD_Y - maxHeight * sc;
  const midX = PAD_X + (range / 2) * sc;

  // Visual Object
  const renderObject = () => {
    if (objType === "Cricketball") return <circle r="5" fill="#dc2626" />;
    if (objType === "Javelin") return <line x1="-12" y1="0" x2="12" y2="0" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />;
    if (objType === "Volleyball") return <circle r="6" fill="#facc15" stroke="#3b82f6" strokeWidth="1.5" />;
    // Football
    return (
      <g>
        <circle r="6" fill="#fff" stroke="#1e293b" strokeWidth="1" />
        <path d="M 0 -6 L 2 -2 L 6 -1 L 3 3 L 4 6 L 0 4 L -4 6 L -3 3 L -6 -1 L -2 -2 Z" fill="#1e293b" transform="scale(0.6)" />
      </g>
    );
  };

  const OBJECTS = ["Football", "Cricketball", "Javelin", "Volleyball"];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "radial-gradient(circle at 1.5px 1.5px, var(--pm-dots, rgba(249,115,22,.1)) 1.5px, transparent 0)",
      backgroundSize: "24px 24px",
      fontFamily: "'DM Mono','Courier New',monospace",
      color: T.text,
      padding: "2px 16px 18px 16px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Mono:wght@400;500;700&display=swap');
        :root {
          --pm-dots: rgba(249, 115, 22, 0.12);
          --pm-surface: #ffffff;
          --pm-border: #dde3ec;
          --pm-borderAcc: #fed7aa;
          --pm-text: #1e293b;
          --pm-muted: #64748b;
          --pm-faint: #94a3b8;
          --pm-svgGround: #cbd5e1;
          --pm-bg-canvas: #fffbf5;
        }
        :root.dark, .dark {
          --pm-dots: rgba(251, 146, 60, 0.08);
          --pm-surface: #1e293b;
          --pm-border: #334155;
          --pm-borderAcc: #7c2d12;
          --pm-text: #f8fafc;
          --pm-muted: #94a3b8;
          --pm-faint: #64748b;
          --pm-svgGround: #334155;
          --pm-bg-canvas: #0f172a;
        }
        * { box-sizing: border-box; }
        input[type=range] { height: 4px; border-radius: 2px; outline: none; border: none; }
        button { transition: all .15s; font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Header */}
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
        <h1 className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 m-0" style={{ textShadow: "0 2px 8px rgba(249,115,22,.12)" }}>
          <span style={{ fontFamily: "'Caveat',cursive", fontSize: 36, fontWeight: 700 }} className="text-orange-600 dark:text-orange-400">
            Projectile Motion
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-[15px] mx-1 mt-2 tracking-wide font-sans lowercase">
            lab
          </span>
        </h1>
      </div>

      {/* Layout */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 960, margin: "0 auto" }}>

        {/* ── LEFT ── */}
        <div style={{ flex: "0 0 214px", display: "flex", flexDirection: "column", gap: 10 }}>

          <Card>
            <CardTitle>Launch Parameters</CardTitle>
            <Slider label="VELOCITY (u)" value={velocity} min={5} max={50} onChange={setVelocity} unit=" m/s" color={T.V} />
            <Slider label="ANGLE (θ)" value={angle} min={5} max={85} onChange={setAngle} unit="°" color={T.A} />
          </Card>

          <Card>
            <CardTitle>Environment</CardTitle>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: ".05em" }}>GRAVITY</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 16 }}>
              <button onClick={() => setIsMoon(false)} style={{
                padding: "6px 4px", fontSize: 10.5, borderRadius: 7,
                border: `1.5px solid ${!isMoon ? T.G : T.border}`,
                background: !isMoon ? "#f5f3ff" : T.surface,
                color: !isMoon ? T.G : T.muted,
                cursor: "pointer",
                fontWeight: !isMoon ? 600 : 400,
              }}>
                Earth (9.81)
              </button>
              <button onClick={() => setIsMoon(true)} style={{
                padding: "6px 4px", fontSize: 10.5, borderRadius: 7,
                border: `1.5px solid ${isMoon ? T.G : T.border}`,
                background: isMoon ? "#f5f3ff" : T.surface,
                color: isMoon ? T.G : T.muted,
                cursor: "pointer",
                fontWeight: isMoon ? 600 : 400,
              }}>
                Moon (1.62)
              </button>
            </div>
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: ".05em" }}>OBJECT</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
              {OBJECTS.map(o => (
                <button key={o} onClick={() => setObjType(o)} style={{
                  padding: "6px 4px", fontSize: 10.5, borderRadius: 7,
                  border: `1.5px solid ${objType === o ? T.V : T.border}`,
                  background: objType === o ? "#eff6ff" : T.surface,
                  color: objType === o ? T.V : T.muted,
                  cursor: "pointer",
                  fontWeight: objType === o ? 600 : 400,
                }}>
                  {o}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Live Calculations</CardTitle>
            {[
              { lbl: "X-Velocity (ux)", val: `${fmt(ux)} m/s`, c: T.muted },
              { lbl: "Y-Velocity (uy)", val: `${fmt(uy)} m/s`, c: T.muted },
              { lbl: "Time of Flight", val: `${fmt(timeOfFlight)} s`, c: T.text },
              { lbl: "Max Height", val: `${fmt(maxHeight)} m`, c: T.H },
              { lbl: "Range", val: `${fmt(range)} m`, c: T.R },
            ].map((r, i) => (
              <div key={i} style={{
                marginBottom: 9, paddingBottom: 9,
                borderBottom: i < 4 ? `1px solid ${T.border}` : "none",
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
                  ["Time of Flight", `T = (2u·sinθ)/g`, T.text],
                  ["Max Height", `H = (u²·sin²θ)/2g`, T.H],
                  ["Range", `R = (u²·sin(2θ))/g`, T.R]
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
          <div className="relative overflow-hidden rounded-[14px] p-[12px_12px_8px] shadow-[0_2px_14px_rgba(249,115,22,.08)] dark:shadow-none" style={{
            background: "var(--pm-bg-canvas)",
            border: `1.5px solid ${T.borderAcc}`,
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
              backgroundImage: "radial-gradient(circle at 1px 1px,rgba(249,115,22,.08) 1px,transparent 0)",
              backgroundSize: "22px 22px",
            }} />

            <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", display: "block", position: "relative", zIndex: 1 }}>
              {/* Ground */}
              <line x1={0} y1={VH - PAD_Y} x2={VW} y2={VH - PAD_Y} stroke={T.svgGround} strokeWidth={2} />

              {/* Max Height Line */}
              <line x1={midX} y1={VH - PAD_Y} x2={midX} y2={maxY} stroke={T.H} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.6} />
              <text x={midX + 5} y={maxY + (VH - PAD_Y - maxY) / 2} fill={T.H} fontSize={10} fontFamily="DM Mono">H = {fmt(maxHeight, 1)}m</text>
              <text x={midX} y={maxY - 17} textAnchor="middle" fill="#8b5cf6" fontSize={10} fontWeight="bold" fontFamily="DM Mono">Potential Energy = max</text>
              <text x={midX} y={maxY - 6} textAnchor="middle" fill="#3b82f6" fontSize={10} fontWeight="bold" fontFamily="DM Mono">Kinetic Energy = min</text>

              {/* Range Line */}
              <line x1={PAD_X} y1={VH - PAD_Y + 15} x2={endX} y2={VH - PAD_Y + 15} stroke={T.R} strokeWidth={1.5} />
              <line x1={PAD_X} y1={VH - PAD_Y + 10} x2={PAD_X} y2={VH - PAD_Y + 20} stroke={T.R} strokeWidth={1.5} />
              <line x1={endX} y1={VH - PAD_Y + 10} x2={endX} y2={VH - PAD_Y + 20} stroke={T.R} strokeWidth={1.5} />
              <text x={PAD_X + (endX - PAD_X) / 2} y={VH - PAD_Y + 28} textAnchor="middle" fill={T.R} fontSize={10} fontFamily="DM Mono">Range = {fmt(range, 1)}m</text>
              {angle === 45 && (
                <text x={PAD_X + (endX - PAD_X) / 2} y={VH - PAD_Y + 40} textAnchor="middle" fill={T.R} fontSize={9} fontFamily="DM Mono" fontWeight="bold">(Maximum Range)</text>
              )}

              {/* Time of flight text */}
              <text x={endX} y={VH - PAD_Y - 8} textAnchor="middle" fill={T.text} fontSize={10} fontFamily="DM Mono">T = {fmt(timeOfFlight, 2)}s</text>

              {/* Trajectory */}
              <path d={pathD} fill="none" stroke={T.A} strokeWidth={2} strokeDasharray="5,4" />

              {/* Launch Angle Arc */}
              <path
                d={`M ${PAD_X + 25} ${VH - PAD_Y} A 25 25 0 0 0 ${PAD_X + 25 * Math.cos(thetaRad)} ${VH - PAD_Y - 25 * Math.sin(thetaRad)}`}
                fill="none" stroke={T.V} strokeWidth={1.5}
              />
              <text x={PAD_X + 30} y={VH - PAD_Y - 10} fill={T.V} fontSize={10} fontFamily="DM Mono" fontWeight="bold">{angle}°</text>

              {/* Vector arrow for velocity */}
              <g transform={`translate(${PAD_X}, ${VH - PAD_Y}) rotate(${-angle})`}>
                <line x1={0} y1={0} x2={40} y2={0} stroke={T.V} strokeWidth={2} />
                <polygon points="40,-3 46,0 40,3" fill={T.V} />
              </g>

              {/* Animated Object */}
              <g>
                <animateMotion
                  dur={`${Math.max(1, timeOfFlight / 2)}s`}
                  repeatCount="indefinite"
                  path={pathD}
                  rotate={objType === "Javelin" ? "auto" : "0"}
                />
                {renderObject()}
              </g>

            </svg>
          </div>

          {/* Tips / Real World Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 dark:bg-orange-900/10 dark:border-orange-900/30">
              <h4 className="text-orange-800 dark:text-orange-300 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target size={14} /> 45° Rule</h4>
              <p className="text-[11px] leading-relaxed text-orange-900/80 dark:text-orange-200/80 m-0">
                Notice how setting the angle to <strong>45°</strong> gives the maximum possible range on a flat surface! This is why javelin throwers aim for around 45° to get the longest throw.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30">
              <h4 className="text-blue-800 dark:text-blue-300 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Rocket size={14} /> Complementary Angles</h4>
              <p className="text-[11px] leading-relaxed text-blue-900/80 dark:text-blue-200/80 m-0">
                Try <strong>30°</strong> and <strong>60°</strong> with the same velocity. They land in exactly the same spot! Angles that add up to 90° (complementary) have the same range.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-900/10 dark:border-purple-900/30 md:col-span-2">
              <h4 className="text-purple-800 dark:text-purple-300 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap size={14} /> Energy Conservation</h4>
              <p className="text-[11px] leading-relaxed text-purple-900/80 dark:text-purple-200/80 m-0">
                As the {objType.toLowerCase()} rises, it slows down (loses <strong>Kinetic Energy</strong>) and gains height (gains <strong>Potential Energy</strong>). At the very top (Max Height), its vertical velocity is zero, meaning Potential Energy is at its maximum! Then, it falls back down, trading Potential Energy back into Kinetic Energy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30 md:col-span-2">
              <h4 className="text-emerald-800 dark:text-emerald-300 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5"><Rocket size={14} /> Proof of Parabolic Path</h4>
              <p className="text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-200/80 m-0 mb-2">
                The equation of the trajectory is:
              </p>
              <div className="flex justify-center items-center bg-white dark:bg-emerald-950/50 py-3 rounded border border-emerald-100 dark:border-emerald-800/50 mb-2 text-emerald-900 dark:text-emerald-100 text-[15px]" style={{ fontFamily: "math, 'Times New Roman', serif" }}>
                <i>y</i> <span className="mx-1.5">=</span> <i>x</i> <span style={{ fontStyle: "normal", marginLeft: "2px" }}>tan</span> <i className="ml-1">θ</i> <span className="mx-1.5">−</span>
                <div className="flex flex-col items-center mx-1 text-[13px]" style={{ transform: "translateY(2px)" }}>
                  <span className="border-b border-emerald-900/80 dark:border-emerald-100/80 px-2 pb-[1px] leading-none inline-flex items-center">
                    <i>gx</i><sup className="text-[9px] ml-[1px]">2</sup>
                  </span>
                  <span className="pt-[3px] leading-none inline-flex items-center">
                    2<i>u</i><sup className="text-[9px] ml-[1px] mr-[2px]">2</sup> <span style={{ fontStyle: "normal" }}>cos</span><sup className="text-[9px] ml-[1px] mr-[2px]">2</sup> <i>θ</i>
                  </span>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-200/80 m-0">
                Since this is in the form <span style={{ fontFamily: "math, 'Times New Roman', serif", fontSize: "12px" }}><i>y = ax + bx²</i></span>, it mathematically proves the path is parabolic.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
