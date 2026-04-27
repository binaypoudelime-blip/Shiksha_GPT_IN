"use client";
import { useState, useMemo } from "react";
import { ChevronLeft, Telescope } from "lucide-react";
import Link from "next/link";

/* ─── helpers ─────────────────────────────────────────────────────────── */
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const fmt = (n: number | string, d = 2) => (+n).toFixed(d);

/* ─── colour tokens (light theme) ────────────────────────────────────── */
const T = {
  bg: "var(--hd-bg, #eef2f7)",
  surface: "var(--hd-surface, #ffffff)",
  border: "var(--hd-border, #dde3ec)",
  borderAcc: "var(--hd-borderAcc, #c8d2e2)",
  text: "var(--hd-text, #1e293b)",
  muted: "var(--hd-muted, #64748b)",
  faint: "var(--hd-faint, #94a3b8)",
  A: "#10b981", // Angle
  C: "#3b82f6", // Base
  G: "#ef4444", // Height
  P: "#10b981", // Hypotenuse
  svgGround: "var(--hd-svgGround, #cbd5e1)",
};

/* ─── SVG Objects ─────────────────────────────────────────────────────── */
function SvgObject({ type, cx, groundY, sh }: { type: string, cx: number, groundY: number, sh: number }) {
  const h = clamp(sh, 14, 188);
  const top = groundY - h;

  if (type === "Tower")
    return (
      <g>
        <rect x={cx - 5} y={top} width={10} height={h} fill="#475569" stroke="#334155" strokeWidth={1.2} rx={1} />
        <rect x={cx - 9} y={top - 7} width={18} height={8} fill="#334155" stroke="#1e293b" strokeWidth={1} rx={1} />
        <line x1={cx} y1={top - 7} x2={cx} y2={top - 20} stroke="#64748b" strokeWidth={2} />
        <circle cx={cx} cy={top - 21} r={2.5} fill="#ef4444" />
        {[0.28, 0.52, 0.76].map((f, i) => (
          <line key={i} x1={cx - 5} y1={groundY - h * f} x2={cx + 5} y2={groundY - h * f} stroke="#64748b" strokeWidth={0.8} />
        ))}
      </g>
    );

  if (type === "Tree")
    return (
      <g>
        <rect x={cx - 4} y={groundY - h * 0.38} width={8} height={h * 0.38} fill="#92400e" rx={2} />
        <polygon points={`${cx},${top} ${cx - h * 0.28},${groundY - h * 0.44} ${cx + h * 0.28},${groundY - h * 0.44}`} fill="#15803d" />
        <polygon points={`${cx},${top + h * 0.17} ${cx - h * 0.23},${groundY - h * 0.34} ${cx + h * 0.23},${groundY - h * 0.34}`} fill="#16a34a" />
      </g>
    );

  if (type === "Kite")
    return (
      <g>
        <path d={`M ${cx} ${groundY} Q ${cx - 12} ${groundY - h * 0.5} ${cx} ${top}`} stroke="#94a3b8" strokeWidth={1} fill="none" strokeDasharray="4,3" />
        <polygon points={`${cx},${top - 12} ${cx + 12},${top} ${cx},${top + 10} ${cx - 12},${top}`} fill="#f59e0b" stroke="#d97706" strokeWidth={1.5} />
        <line x1={cx} y1={top + 10} x2={cx + 8} y2={top + 22} stroke="#ef4444" strokeWidth={1.5} strokeLinecap="round" />
      </g>
    );

  if (type === "Building") {
    const bw = h * 0.33;
    return (
      <g>
        <rect x={cx - bw} y={top} width={bw * 2} height={h} fill="#334155" stroke="#1e293b" strokeWidth={1.5} rx={1} />
        <rect x={cx - bw} y={top - 5} width={bw * 2} height={6} fill="#1e293b" stroke="#0f172a" strokeWidth={1} />
        {[0.12, 0.3, 0.5, 0.68, 0.86].map((f, i) => (
          <g key={i}>
            <rect x={cx - bw + 4} y={groundY - h * f - 4} width={6} height={7} fill="#fde68a" opacity={0.9} rx={1} />
            <rect x={cx + 4} y={groundY - h * f - 4} width={6} height={7} fill="#fde68a" opacity={0.65} rx={1} />
          </g>
        ))}
      </g>
    );
  }

  if (type === "Boat")
    return (
      <g>
        {/* water */}
        <ellipse cx={cx} cy={groundY + 3} rx={h * 0.3} ry={4} fill="#bae6fd" opacity={0.6} />
        <ellipse cx={cx} cy={groundY + 3} rx={h * 0.16} ry={2} fill="#7dd3fc" opacity={0.45} />
        {/* hull */}
        <path d={`M ${cx - h * 0.22} ${groundY - 3} Q ${cx} ${groundY + 10} ${cx + h * 0.22} ${groundY - 3} Z`}
          fill="#1e3a5f" stroke="#0c2340" strokeWidth={1.2} />
        <line x1={cx - h * 0.22} y1={groundY - 3} x2={cx + h * 0.22} y2={groundY - 3} stroke="#2563eb" strokeWidth={1.5} />
        {/* mast */}
        <line x1={cx} y1={groundY - 3} x2={cx} y2={top + 4} stroke="#475569" strokeWidth={2} strokeLinecap="round" />
        {/* main sail */}
        <polygon
          points={`${cx},${top + 4} ${cx},${groundY - 5} ${cx + h * 0.18},${groundY - h * 0.45}`}
          fill="#e0f2fe" stroke="#bae6fd" strokeWidth={1} opacity={0.95}
        />
        {/* fore sail */}
        <polygon
          points={`${cx},${top + 4} ${cx},${groundY - 5} ${cx - h * 0.11},${groundY - h * 0.52}`}
          fill="#f0f9ff" stroke="#bae6fd" strokeWidth={1} opacity={0.75}
        />
        {/* flag */}
        <polygon points={`${cx},${top + 4} ${cx + 10},${top + 9} ${cx},${top + 14}`} fill="#ef4444" />
      </g>
    );

  return null;
}

/* ─── Observer ────────────────────────────────────────────────────────── */
function Observer({ x, y }: { x: number, y: number }) {
  return (
    <g>
      <circle cx={x} cy={y - 22} r={4.5} fill="#10b981" stroke="#059669" strokeWidth={1.5} />
      <line x1={x} y1={y - 17.5} x2={x} y2={y - 5} stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={x} y1={y - 13} x2={x + 7} y2={y - 8} stroke="#10b981" strokeWidth={2} strokeLinecap="round" />
      <line x1={x} y1={y - 13} x2={x - 7} y2={y - 8} stroke="#10b981" strokeWidth={2} strokeLinecap="round" />
      <line x1={x} y1={y - 5} x2={x + 5} y2={y + 5} stroke="#10b981" strokeWidth={2} strokeLinecap="round" />
      <line x1={x} y1={y - 5} x2={x - 5} y2={y + 5} stroke="#10b981" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

/* ─── Slider ──────────────────────────────────────────────────────────── */
function Slider({ label, value, min, max, step = 1, onChange, unit, color }: any) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: T.muted, letterSpacing: ".06em" }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color, fontFamily: "'DM Mono',monospace" }}>
          {fmt(value)}{unit}
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

/* ─── Solution Step ───────────────────────────────────────────────────── */
function SolStep({ num, title, color, children }: any) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: color, color: "#fff",
        fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1, boxShadow: `0 2px 6px ${color}55`,
      }}>{num}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, color, letterSpacing: ".12em", marginBottom: 3, fontWeight: 600 }}>{title}</div>
        {children}
      </div>
    </div>
  );
}

/* ─── Toggle ──────────────────────────────────────────────────────────── */
function Toggle({ value, onChange, label }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
      <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{
        width: 38, height: 21, borderRadius: 11,
        background: value ? T.G : T.border,
        cursor: "pointer", position: "relative", transition: "background .2s",
        border: `1px solid ${value ? T.G : T.borderAcc}`, flexShrink: 0,
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
export default function HeightDistanceLab() {
  const [mode, setMode] = useState("Free");
  const [angle, setAngle] = useState(45);
  const [dist, setDist] = useState(80);
  const [invH, setInvH] = useState(80);
  const [invB, setInvB] = useState(80);
  const [dep, setDep] = useState(false);
  const [obj, setObj] = useState("Tower");
  const [showRef, setShowRef] = useState(false);

  const compH = dist * Math.tan(toRad(angle));
  const compA = clamp(toDeg(Math.atan(invH / invB)), 0.1, 89.9);
  const dAngle = mode === "Inverse" ? compA : angle;
  const dBase = mode === "Inverse" ? invB : dist;
  const dH = mode === "Inverse" ? invH : compH;
  const hyp = Math.sqrt(dBase ** 2 + dH ** 2);

  const VW = 460, VH = 295, PAD = 55;
  const sc = Math.min(
    (VW - 2 * PAD - 20) / Math.max(dBase, 1),
    (VH - 2 * PAD - 18) / Math.max(dH, 1),
  );
  const SB = clamp(dBase * sc, 18, VW - 2 * PAD - 20);
  const SH = clamp(dH * sc, 9, VH - 2 * PAD - 18);

  const [obsP, footP, tipP] = useMemo(() => {
    if (!dep) return [
      [PAD, VH - PAD],
      [PAD + SB, VH - PAD],
      [PAD + SB, VH - PAD - SH],
    ];
    return [
      [PAD, PAD + 14],
      [PAD, PAD + 14 + SH],
      [PAD + SB, PAD + 14 + SH],
    ];
  }, [dep, SB, SH]);

  const arcR = 28;
  const arcPath = useMemo(() => {
    const a = toRad(dAngle);
    if (!dep) return `M ${obsP[0] + arcR} ${obsP[1]} A ${arcR} ${arcR} 0 0 0 ${obsP[0] + arcR * Math.cos(a)} ${obsP[1] - arcR * Math.sin(a)}`;
    return `M ${obsP[0] + arcR} ${obsP[1]} A ${arcR} ${arcR} 0 0 1 ${obsP[0] + arcR * Math.cos(a)} ${obsP[1] + arcR * Math.sin(a)}`;
  }, [obsP, dAngle, dep]);

  const R = 8;
  const raMark = dep
    ? `M ${footP[0]} ${footP[1] - R} L ${footP[0] + R} ${footP[1] - R} L ${footP[0] + R} ${footP[1]}`
    : `M ${footP[0] - R} ${footP[1]} L ${footP[0] - R} ${footP[1] - R} L ${footP[0]} ${footP[1] - R}`;

  const lblBase = { x: dep ? (footP[0] + tipP[0]) / 2 : (obsP[0] + footP[0]) / 2, y: footP[1] + 16 };
  const lblH = { x: (dep ? obsP[0] : footP[0]) + 13, y: dep ? (obsP[1] + footP[1]) / 2 : (footP[1] + tipP[1]) / 2 };
  const lblHyp = { x: (obsP[0] + tipP[0]) / 2 - 10, y: (obsP[1] + tipP[1]) / 2 - 9 };
  const lblAng = { x: obsP[0] + arcR + 10, y: dep ? obsP[1] + arcR * 0.65 : obsP[1] - arcR * 0.58 };

  const objCX = dep ? tipP[0] : footP[0];
  const objGY = dep ? tipP[1] : footP[1];

  const see = useMemo(() => {
    const tv = Math.tan(toRad(angle));
    const lbl = dep ? "depression" : "elevation";
    return {
      g1: `Angle of ${lbl} (θ) = ${angle}°`,
      g2: `Horizontal distance (d) = ${dist} m`,
      formula: "tan θ  =  opposite / adjacent  =  h / d",
      sub1: `tan ${angle}°  =  h / ${dist}`,
      sub2: `h  =  ${dist} × tan(${angle}°)`,
      sub3: `h  =  ${dist} × ${fmt(tv, 4)}`,
      result: `∴  Height (h)  =  ${fmt(compH)} metres`,
    };
  }, [angle, dist, dep, compH]);

  const { A, C, G, P } = T;
  const OBJECTS = [
    { id: "Tower", icon: "🗼" },
    { id: "Tree", icon: "🌲" },
    { id: "Kite", icon: "🪁" },
    { id: "Building", icon: "🏢" },
    { id: "Boat", icon: "⛵" },
  ];

  const waterBg = dep && obj === "Boat";

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundImage: "radial-gradient(circle at 1.5px 1.5px, var(--hd-dots, rgba(100,116,139,.15)) 1.5px, transparent 0)",
      backgroundSize: "24px 24px",
      fontFamily: "'DM Mono','Courier New',monospace", 
      color: T.text, 
      padding: "18px 16px" 
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Mono:wght@400;500&display=swap');
        :root {
          --hd-bg: #eef2f7;
          --hd-dots: rgba(100, 116, 139, 0.15);
          --hd-surface: #ffffff;
          --hd-border: #dde3ec;
          --hd-borderAcc: #c8d2e2;
          --hd-text: #1e293b;
          --hd-muted: #64748b;
          --hd-faint: #94a3b8;
          --hd-svgGround: #cbd5e1;
          --hd-bg-water: #f0f9ff;
          --hd-bg-canvas: #f8faff;
        }
        :root.dark, .dark {
          --hd-bg: #0f172a;
          --hd-dots: rgba(148, 163, 184, 0.12);
          --hd-surface: #1e293b;
          --hd-border: #334155;
          --hd-borderAcc: #475569;
          --hd-text: #f8fafc;
          --hd-muted: #94a3b8;
          --hd-faint: #64748b;
          --hd-svgGround: #334155;
          --hd-bg-water: #0c4a6e;
          --hd-bg-canvas: #0f172a;
        }
        * { box-sizing: border-box; }
        input[type=range] { height: 4px; border-radius: 2px; outline: none; border: none; }
        button { transition: all .15s; font-family: 'DM Mono', monospace; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 18, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
        <h1 className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 m-0" style={{
          textShadow: "0 2px 8px rgba(30,58,95,.12)",
        }}>
          <span style={{ fontFamily: "'Caveat',cursive", fontSize: 36, fontWeight: 700 }} className="text-[#1e3a5f] dark:text-slate-100">
            Height &amp; Distance
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-[15px] mx-1 mt-2 tracking-wide font-sans lowercase">
            from
          </span>
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200/60 dark:border-blue-500/20 rounded-full shadow-sm mt-1.5 transition-transform hover:scale-105 cursor-default">
            <Telescope size={16} className="text-blue-600 dark:text-blue-400" />
            <span style={{ fontFamily: "'Caveat',cursive", fontSize: 26, fontWeight: 700 }} className="text-blue-700 dark:text-blue-300">
              ShikshaLens
            </span>
          </div>
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 18, flexWrap: "wrap" }}>
        {[
          { id: "Free", icon: "🎯", lbl: "Free Slide" },
          { id: "Regular", icon: "📐", lbl: "Exam Prep" },
          { id: "Inverse", icon: "🔄", lbl: "Inverse" },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            padding: "7px 18px", borderRadius: 8,
            border: `1.5px solid ${mode === m.id ? "#1e3a5f" : T.border}`,
            background: mode === m.id ? "#1e3a5f" : T.surface,
            color: mode === m.id ? "#ffffff" : T.muted,
            fontSize: 12, cursor: "pointer",
            boxShadow: mode === m.id ? "0 2px 10px rgba(30,58,95,.22)" : "0 1px 3px rgba(0,0,0,.05)",
          }}>{m.icon} {m.lbl}</button>
        ))}
      </div>

      {/* Layout */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", maxWidth: 960, margin: "0 auto" }}>

        {/* ── LEFT ── */}
        <div style={{ flex: "0 0 214px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Sliders */}
          <Card>
            <CardTitle>{mode === "Inverse" ? "Adjust Sides" : "Parameters"}</CardTitle>
            {mode !== "Inverse" ? (
              <>
                <Slider label="ANGLE θ" value={angle} min={1} max={89} onChange={setAngle} unit="°" color={A} />
                <Slider label="BASE DISTANCE d" value={dist} min={10} max={200} onChange={setDist} unit=" m" color={C} />
              </>
            ) : (
              <>
                <Slider label="HEIGHT h (opposite)" value={invH} min={5} max={200} onChange={setInvH} unit=" m" color={G} />
                <Slider label="BASE d (adjacent)" value={invB} min={5} max={200} onChange={setInvB} unit=" m" color={C} />
                <div className="mt-2 p-[10px_12px] rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20">
                  <div style={{ fontSize: 9, color: T.muted, marginBottom: 2, letterSpacing: ".08em" }}>COMPUTED θ</div>
                  <div style={{ fontFamily: "'Caveat',cursive", fontSize: 28, color: A, lineHeight: 1 }}>{fmt(compA, 1)}°</div>
                  <div style={{ fontSize: 9, color: T.faint, marginTop: 3 }}>= arctan({invH} / {invB})</div>
                </div>
              </>
            )}
          </Card>

          {/* Options */}
          <Card>
            <CardTitle>Options</CardTitle>
            <Toggle
              value={dep}
              onChange={(v: boolean) => {
                setDep(v);
                if (v && obj === "Kite") setObj("Boat");
              }}
              label="Depression Mode"
            />
            <div style={{ fontSize: 10, color: T.muted, marginBottom: 8, letterSpacing: ".05em" }}>OBJECT</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
              {OBJECTS.map(o => (
                <button key={o.id} onClick={() => setObj(o.id)} style={{
                  padding: "6px 4px", fontSize: 10.5, borderRadius: 7,
                  border: `1.5px solid ${obj === o.id ? C : T.border}`,
                  background: obj === o.id ? "#e0f2fe" : T.surface,
                  color: obj === o.id ? C : T.muted,
                  cursor: "pointer",
                  gridColumn: o.id === "Boat" ? "1 / -1" : "auto",
                  fontWeight: obj === o.id ? 600 : 400,
                }}>
                  {o.icon} {o.id}
                  {o.id === "Boat" && !dep && (
                    <span style={{ fontSize: 8, marginLeft: 6, color: "#b45309", background: "#fef3c7", padding: "1px 5px", borderRadius: 4 }}>
                      great with depression ↑
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Live Values */}
          <Card>
            <CardTitle>Live Values</CardTitle>
            {[
              { lbl: dep ? "Angle of Depression" : "Angle of Elevation", val: `${fmt(dAngle, 1)}°`, c: A },
              { lbl: "Base Distance", val: `${fmt(dBase, 1)} m`, c: C },
              { lbl: "Height", val: `${fmt(dH, 2)} m`, c: G },
              { lbl: "Hypotenuse", val: `${fmt(hyp, 2)} m`, c: P },
            ].map((r, i) => (
              <div key={i} style={{
                marginBottom: 9, paddingBottom: 9,
                borderBottom: i < 3 ? `1px solid ${T.border}` : "none",
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
              📌 Ratio Reference
              <span style={{ fontSize: 11, color: T.muted }}>{showRef ? "▲" : "▼"}</span>
            </button>
            {showRef && (
              <div style={{ padding: "2px 15px 13px", borderTop: `1px solid ${T.border}` }}>
                {[[`sin θ`, "Opp / Hyp", P], [`cos θ`, "Adj / Hyp", C], [`tan θ`, "Opp / Adj", A]].map(([n, r, c]) => (
                  <div key={n} style={{ display: "flex", justifyContent: "space-between", lineHeight: 2.1 }}>
                    <span style={{ color: c, fontFamily: "'Caveat',cursive", fontSize: 17, fontWeight: 700 }}>{n}</span>
                    <span style={{ color: T.muted, fontSize: 10 }}>{r}</span>
                  </div>
                ))}
                <div style={{ marginTop: 5, paddingTop: 5, borderTop: `1px solid ${T.border}`, fontSize: 10, color: T.faint }}>
                  θ = arctan(h/d) for inverse problems
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 10 }}>

          {/* SVG Canvas */}
          <div className="relative overflow-hidden rounded-[14px] p-[12px_12px_8px] shadow-[0_2px_14px_rgba(30,58,95,.08)] dark:shadow-none" style={{
            background: waterBg ? "var(--hd-bg-water, #f0f9ff)" : "var(--hd-bg-canvas, #f8faff)",
            border: `1.5px solid ${T.borderAcc}`,
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 14,
              backgroundImage: "radial-gradient(circle at 1px 1px,rgba(100,116,139,.1) 1px,transparent 0)",
              backgroundSize: "22px 22px",
            }} />
            <div className="group absolute top-2.5 right-3.5 z-20 cursor-help flex flex-col items-end">
              <div style={{ fontSize: 9, color: T.faint, letterSpacing: ".12em", fontWeight: 600 }}>
                {dep ? "ANGLE OF DEPRESSION" : "ANGLE OF ELEVATION"}
              </div>

              {/* Tooltip */}
              <div className="pointer-events-none absolute right-0 top-full mt-2 w-52 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="bg-slate-800 dark:bg-slate-700 text-white text-[10.5px] leading-relaxed p-2.5 rounded-lg shadow-xl border border-slate-700 dark:border-slate-600 relative z-20 font-sans tracking-wide">
                  <div className="font-bold mb-1 text-slate-200 tracking-wider text-[9px] uppercase">
                    {dep ? "Angle of Depression" : "Angle of Elevation"}
                  </div>
                  {dep
                    ? "The angle formed by the line of sight with the horizontal when an observer looks at an object below them."
                    : "The angle formed by the line of sight with the horizontal when an observer looks at an object above them."
                  }
                  <div className="absolute -top-1.5 right-8 w-3 h-3 bg-slate-800 dark:bg-slate-700 border-l border-t border-slate-700 dark:border-slate-600 rotate-45"></div>
                </div>
              </div>
            </div>

            <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: "100%", display: "block", position: "relative", zIndex: 1 }}>

              {/* Water or Ground */}
              {waterBg ? (
                <>
                  <rect x={0} y={tipP[1]} width={VW} height={VH - tipP[1]} fill="#bae6fd" opacity={0.4} />
                  <line x1={0} y1={tipP[1]} x2={VW} y2={tipP[1]} stroke="#7dd3fc" strokeWidth={2} />
                </>
              ) : (
                <line x1={0} y1={dep ? tipP[1] : obsP[1]} x2={VW} y2={dep ? tipP[1] : obsP[1]} stroke={T.svgGround} strokeWidth={1.5} />
              )}

              {/* Cliff */}
              {dep && (
                <>
                  <rect x={0} y={obsP[1]} width={PAD + 3} height={footP[1] - obsP[1]} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={1} rx={2} />
                  <line x1={0} y1={obsP[1]} x2={PAD + 4} y2={obsP[1]} stroke="#94a3b8" strokeWidth={2.5} />
                </>
              )}

              {/* Horizontal reference dashed */}
              {dep && (
                <line x1={obsP[0]} y1={obsP[1]} x2={VW - 15} y2={obsP[1]} stroke={A} strokeWidth={1.2} strokeDasharray="6,4" opacity={0.38} />
              )}

              {/* Triangle fill */}
              <polygon points={`${obsP[0]},${obsP[1]} ${footP[0]},${footP[1]} ${tipP[0]},${tipP[1]}`} fill="rgba(3,105,161,.04)" />

              {/* Base (blue) */}
              <line x1={dep ? footP[0] : obsP[0]} y1={dep ? footP[1] : obsP[1]} x2={dep ? tipP[0] : footP[0]} y2={dep ? tipP[1] : footP[1]} stroke={C} strokeWidth={2.5} />

              {/* Height (green) */}
              <line x1={dep ? obsP[0] : footP[0]} y1={dep ? obsP[1] : footP[1]} x2={dep ? footP[0] : tipP[0]} y2={dep ? footP[1] : tipP[1]} stroke={G} strokeWidth={2.5} />

              {/* Hypotenuse / LoS (violet) */}
              <line x1={obsP[0]} y1={obsP[1]} x2={tipP[0]} y2={tipP[1]} stroke={P} strokeWidth={2} strokeDasharray={dep ? "7,4" : "0"} />

              {/* Right-angle */}
              <path d={raMark} stroke="#94a3b8" strokeWidth={1.5} fill="none" />

              {/* Angle arc */}
              <path d={arcPath} stroke={A} strokeWidth={1.6} fill={`${A}18`} />

              {/* Object */}
              <SvgObject type={obj} cx={objCX} groundY={objGY} sh={SH} />

              {/* Observer */}
              <Observer x={obsP[0]} y={obsP[1]} />

              {/* Labels */}
              <text x={lblBase.x} y={lblBase.y} textAnchor="middle" fill={C} fontSize={11} fontFamily="DM Mono,monospace" fontWeight="500">d = {fmt(dBase, 0)} m</text>
              <text x={lblH.x} y={lblH.y} textAnchor="start" fill={G} fontSize={11} fontFamily="DM Mono,monospace" fontWeight="500">h = {fmt(dH, 1)} m</text>
              <text x={lblHyp.x} y={lblHyp.y} textAnchor="end" fill={P} fontSize={10} fontFamily="DM Mono,monospace">{fmt(hyp, 1)} m</text>
              <text x={lblAng.x} y={lblAng.y} textAnchor="start" fill={A} fontSize={11.5} fontFamily="DM Mono,monospace" fontWeight="700">θ = {fmt(dAngle, 1)}°</text>

              {/* Vertex labels */}
              <text x={obsP[0] - 13} y={obsP[1] + (dep ? -5 : 5)} textAnchor="middle" fill={T.faint} fontSize={10} fontFamily="DM Mono,monospace">A</text>
              <text x={footP[0] + (dep ? -14 : 6)} y={footP[1] + (dep ? 0 : 15)} textAnchor="middle" fill={T.faint} fontSize={10} fontFamily="DM Mono,monospace">B</text>
              <text x={tipP[0] + 13} y={tipP[1] + (dep ? 5 : 0)} textAnchor="start" fill={T.faint} fontSize={10} fontFamily="DM Mono,monospace">C</text>
            </svg>
          </div>

          {/* Exam Prep Panel */}
          {mode === "Regular" && (
            <div style={{ background: T.surface, border: `1.5px solid ${T.borderAcc}`, borderRadius: 14, padding: 18, boxShadow: "0 2px 12px rgba(30,58,95,.07)" }}>
              <div style={{ fontFamily: "'Caveat',cursive", fontSize: 22, color: "#1e3a5f", marginBottom: 16, fontWeight: 700 }}>
                📝 Exam Answer Format
              </div>
              <SolStep num="1" title="GIVEN" color={C}>
                <div style={{ fontSize: 12, lineHeight: 1.8, color: T.text }}>{see.g1}<br />{see.g2}</div>
              </SolStep>
              <SolStep num="2" title="TO FIND" color={G}>
                <div style={{ fontSize: 12, color: T.text }}>Height of the object (h = BC)</div>
              </SolStep>
              <SolStep num="3" title="FORMULA" color={P}>
                <div className="rounded-md p-[7px_11px] bg-violet-50 dark:bg-violet-500/10" style={{ fontFamily: "'Caveat',cursive", fontSize: 18, color: T.text }}>
                  {see.formula}
                </div>
              </SolStep>
              <SolStep num="4" title="SUBSTITUTION & CALCULATION" color={A}>
                <div className="rounded-md p-[7px_11px] bg-amber-50 dark:bg-amber-500/10" style={{ fontFamily: "'Caveat',cursive", fontSize: 16, lineHeight: 2, color: T.text }}>
                  {see.sub1}<br />{see.sub2}<br />
                  <span style={{ color: T.muted }}>{see.sub3}</span>
                </div>
              </SolStep>
              <div className="mt-2.5 p-[13px_17px] rounded-lg bg-green-50 border-[1.5px] border-green-300 dark:bg-green-500/10 dark:border-green-500/20">
                <div style={{ fontFamily: "'Caveat',cursive", fontSize: 22, color: G, fontWeight: 700 }}>{see.result}</div>
              </div>
            </div>
          )}

          {/* Free hint */}
          {mode === "Free" && (
            <div className="p-[11px_15px] rounded-[10px] bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20">
              <span className="text-[11px] leading-[1.7] text-amber-900 dark:text-amber-200">
                💡 <strong>Build intuition:</strong> Compare θ = 30° vs θ = 60° — the height nearly doubles. Notice how height skyrockets as θ approaches 90°. That's the tan function going to infinity!
              </span>
            </div>
          )}

          {/* Inverse hint */}
          {mode === "Inverse" && (
            <div className="p-[13px_15px] rounded-[10px] bg-violet-50 border border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20">
              <div style={{ fontFamily: "'Caveat',cursive", fontSize: 18, color: P, marginBottom: 6, fontWeight: 700 }}>Using arctan (tan⁻¹)</div>
              <div className="text-[11px] leading-[1.8] text-violet-900 dark:text-violet-200">
                When you know both sides, find the angle:<br />
                <strong>θ = arctan(h / d)</strong><br />
                = arctan({invH} / {invB}) = <strong style={{ fontSize: 13 }}>{fmt(compA, 2)}°</strong>
              </div>
            </div>
          )}

          {/* Depression hint */}
          {dep && (
            <div className="p-[11px_15px] rounded-[10px] bg-sky-50 border border-sky-200 dark:bg-sky-500/10 dark:border-sky-500/20">
              <span className="text-[11px] leading-[1.7] text-sky-900 dark:text-sky-200">
                🌊 <strong>Depression mode:</strong> An observer on a cliff of height <strong style={{ color: G }}>{fmt(dH, 1)} m</strong> looks <em>down</em> at an object <strong style={{ color: C }}>{fmt(dBase, 1)} m</strong> away. Angle of depression = <strong style={{ color: A }}>{fmt(dAngle, 1)}°</strong>.
                {obj === "Boat" && <> The boat at sea is a classic exam question — the angle is measured from the horizontal down to the boat.</>}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
