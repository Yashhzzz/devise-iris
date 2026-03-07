import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { ChevronDown, ShieldAlert, Check } from "lucide-react";

// ─── Shared card shell ─────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex flex-col ${className}`}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #F0F2F5",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5">
      <p className="font-semibold" style={{ fontSize: 16, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>{title}</p>
      <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{sub}</p>
    </div>
  );
}

// ─── DATA ──────────────────────────────────────────────────────────────────

const deptData = [
  { dept: "Engineering", count: 89 },
  { dept: "Product",     count: 54 },
  { dept: "Marketing",   count: 41 },
  { dept: "Design",      count: 37 },
  { dept: "Operations",  count: 26 },
];

const initialRiskData = [
  { name: "High",   value: 32, color: "#DC2626" },
  { name: "Medium", value: 28, color: "#D97706" },
  { name: "Low",    value: 40, color: "#16A34A" },
];

// Heatmap: 5 rows (depts) × 7 cols (Mon-Sun)
const heatRows = ["Engineering", "Product", "Marketing", "Design", "Operations"];
const heatCols = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function heatColor(n: number): string {
  if (n === 0)   return "#F8FAFC";
  if (n <= 5)    return "rgba(255,92,26,0.15)";
  if (n <= 15)   return "rgba(255,92,26,0.35)";
  if (n <= 30)   return "rgba(255,92,26,0.60)";
  return "#FF5C1A";
}

function heatTextColor(n: number): string {
  return n > 30 ? "#ffffff" : n > 15 ? "#7A2200" : "#B45309";
}

const shadowTools = [
  { name:"Runway",        days:3,  risk:"high"   },
  { name:"Replicate",     days:7,  risk:"high"   },
  { name:"Poe",           days:12, risk:"medium" },
  { name:"Character.ai",  days:18, risk:"medium" },
  { name:"You.com",       days:22, risk:"medium" },
];

function generateMockData(multiplier: number) {
  const vary = (val: number, isPct = false) => {
    if (val === 0) return 0;
    const v = Math.round(val * multiplier * (0.8 + Math.random() * 0.4));
    return isPct ? Math.min(100, Math.max(1, v)) : Math.max(1, v);
  };
  
  const deptDataRaw = [
    { dept: "Engineering", count: vary(89) },
    { dept: "Product",     count: vary(54) },
    { dept: "Marketing",   count: vary(41) },
    { dept: "Design",      count: vary(37) },
    { dept: "Operations",  count: vary(26) },
  ];
  const total = deptDataRaw.reduce((sum, d) => sum + d.count, 0);

  // Normalize risk to 100%
  let r1 = vary(32), r2 = vary(28), r3 = vary(40);
  const rSum = r1 + r2 + r3;
  r1 = Math.round((r1 / rSum) * 100);
  r2 = Math.round((r2 / rSum) * 100);
  r3 = 100 - r1 - r2;
  
  const riskDataRaw = [
    { name: "High",   value: r1, color: "#DC2626" },
    { name: "Medium", value: r2, color: "#D97706" },
    { name: "Low",    value: r3, color: "#16A34A" },
  ];

  const heatDataRaw = [
    [vary(34), vary(41), vary(28), vary(55), vary(38), vary(12), vary(7)],
    [vary(18), vary(22), vary(15), vary(31), vary(20), vary(6),  vary(3)],
    [vary(10), vary(14), vary(19), vary(24), vary(15), vary(4),  vary(2)],
    [vary(12), vary(9),  vary(17), vary(28), vary(11), vary(8),  vary(1)],
    [vary(5),  vary(8),  vary(6),  vary(14), vary(9),  vary(2),  vary(0)],
  ];

  const toolsRaw = [
    { rank: 1, name: "ChatGPT",       uses: vary(89), pct: vary(90, true) },
    { rank: 2, name: "GitHub Copilot",uses: vary(67), pct: vary(67, true) },
    { rank: 3, name: "Claude",        uses: vary(54), pct: vary(54, true) },
    { rank: 4, name: "Gemini",        uses: vary(41), pct: vary(41, true) },
    { rank: 5, name: "Perplexity",    uses: vary(28), pct: vary(28, true) },
  ].sort((a,b) => b.uses - a.uses).map((t, i) => ({ ...t, rank: i + 1 }));

  const usersRaw = [
    { initials:"YM", name:"Yash M",  dept:"Engineering", events:vary(89) },
    { initials:"SK", name:"Sarah K", dept:"Design",       events:vary(67) },
    { initials:"AR", name:"Arjun R", dept:"Product",      events:vary(54) },
    { initials:"PM", name:"Priya M", dept:"Marketing",    events:vary(38) },
    { initials:"RT", name:"Rahul T", dept:"Engineering",  events:vary(31) },
  ].sort((a,b) => b.events - a.events);

  return { deptData: deptDataRaw, riskData: riskDataRaw, heatData: heatDataRaw, tools: toolsRaw, users: usersRaw, total };
}

// ─── Horizontal bar custom tooltip ────────────────────────────────────────
function BarTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1A1A2E", color:"#fff", padding:"6px 12px", borderRadius:8, fontSize:12 }}>
      <b>{label}</b>: {payload[0].value}
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export function AnalyticsTab() {
  const [dateFilter, setDateFilter] = useState("Last 30 days");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [dataState, setDataState] = useState(() => generateMockData(1));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = (range: string) => {
    setDateFilter(range);
    setIsDateOpen(false);
    
    let mult = 1;
    if (range === "Last 7 days") mult = 0.25;
    if (range === "Last 3 months") mult = 3;
    if (range === "Last 12 months") mult = 12;
    setDataState(generateMockData(mult));
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold" style={{ fontSize:22, color:"#1A1A2E", fontFamily:"Inter, sans-serif" }}>Analytics</h1>
          <p style={{ fontSize:14, color:"#94A3B8", marginTop:3 }}>AI adoption and usage insights across your organization</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDateOpen(!isDateOpen)}
            className="flex items-center gap-2 font-medium"
            style={{ backgroundColor:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:12, padding:"8px 14px", fontSize:14, color:"#1A1A2E", cursor:"pointer", fontFamily:"Inter, sans-serif" }}
          >
            {dateFilter} <ChevronDown size={14} color="#94A3B8" strokeWidth={2} />
          </button>
          {isDateOpen && (
            <div 
              className="absolute top-full right-0 mt-2 bg-white flex flex-col z-10"
              style={{ width: 160, border: "1px solid #F0F2F5", borderRadius: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.08)", padding: 6 }}
            >
              {["Last 7 days", "Last 30 days", "Last 3 months", "Last 12 months"].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleDateChange(opt)}
                  className="flex items-center justify-between w-full text-left transition-colors"
                  style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, color: dateFilter === opt ? "#FF5C1A" : "#1A1A2E", fontFamily: "Inter, sans-serif", backgroundColor: dateFilter === opt ? "#FFF3EE" : "transparent" }}
                  onMouseEnter={e => { if (dateFilter !== opt) e.currentTarget.style.backgroundColor = "#F8FAFC"; }}
                  onMouseLeave={e => { if (dateFilter !== opt) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {opt}
                  {dateFilter === opt && <Check size={14} color="#FF5C1A" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 1 — Charts */}
      <div className="flex gap-4">

        {/* Left: Horizontal bar chart */}
        <Card className="flex-1">
          <CardHeader title="Usage by Department" sub={`Total detections per team (${dateFilter.toLowerCase()})`} />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataState.deptData} layout="vertical" margin={{ top:0, right:16, left:0, bottom:0 }} barCategoryGap="28%">
              <XAxis type="number" axisLine={false} tickLine={false}
                tick={{ fontSize:11, fill:"#CBD5E1" }} />
              <YAxis type="category" dataKey="dept" axisLine={false} tickLine={false}
                tick={{ fontSize:13, fill:"#94A3B8", fontFamily:"Inter, sans-serif" }} width={90} />
              <RTooltip content={<BarTip />} cursor={{ fill:"rgba(0,0,0,0.03)" }} />
              <Bar dataKey="count" fill="#FF5C1A" radius={[0, 6, 6, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Right: Donut chart */}
        <div style={{ flex:"0 0 320px" }}>
          <Card>
          <CardHeader title="Risk Distribution" sub={`Detections by risk level (${dateFilter.toLowerCase()})`} />
          <div className="flex flex-col items-center">
              {/* Donut chart with center overlay */}
              <div className="relative inline-block">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={dataState.riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                      strokeWidth={0}
                    >
                      {dataState.riskData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label as absolute overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                >
                  <span className="font-bold" style={{ fontSize: 24, color: "#1A1A2E", lineHeight: 1.1 }}>{dataState.total}</span>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>Total</span>
                </div>
              </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-1">
              {dataState.riskData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="rounded-full" style={{ width:9, height:9, backgroundColor:d.color, display:"inline-block" }} />
                  <span style={{ fontSize:13, color:"#64748B" }}>{d.name}</span>
                  <span className="font-semibold" style={{ fontSize:13, color:"#1A1A2E" }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        </div>{/* end 320px wrapper */}
      </div>{/* end Row 1 flex */}

      {/* Row 2 — Heatmap */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <CardHeader title="AI Tool Adoption Heatmap" sub="Weekly adoption by department" />
          {/* Legend */}
          <div className="flex items-center gap-2 flex-shrink-0 mt-1">
            <span style={{ fontSize:11, color:"#94A3B8" }}>Low</span>
            <div
              style={{
                width: 80, height: 10, borderRadius: 9999,
                background: "linear-gradient(to right, rgba(255,92,26,0.12), #FF5C1A)",
              }}
            />
            <span style={{ fontSize:11, color:"#94A3B8" }}>High</span>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table style={{ borderCollapse:"separate", borderSpacing:"6px" }}>
            <thead>
              <tr>
                <th style={{ width:100 }} />
                {heatCols.map(col => (
                  <th key={col} style={{ width:48, fontSize:11, color:"#94A3B8", fontWeight:500, textAlign:"center", paddingBottom:4 }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatRows.map((row, ri) => (
                <tr key={row}>
                  <td style={{ fontSize:13, color:"#64748B", paddingRight:8, whiteSpace:"nowrap", fontFamily:"Inter, sans-serif" }}>{row}</td>
                  {dataState.heatData[ri].map((n, ci) => (
                    <td key={ci} title={`${row} · ${heatCols[ci]}: ${n} events`}
                      style={{
                        width:48, height:48,
                        backgroundColor: heatColor(n),
                        borderRadius: 10,
                        textAlign:"center",
                        verticalAlign:"middle",
                        fontSize:12,
                        fontWeight:600,
                        color: n === 0 ? "#CBD5E1" : heatTextColor(n),
                        cursor:"default",
                        transition:"opacity 150ms",
                        userSelect:"none",
                      }}
                    >
                      {n > 0 ? n : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Row 3 — Three cards */}
      <div className="flex gap-4">

        {/* Top Tools */}
        <Card className="flex-1">
          <CardHeader title={`Top Tools (${dateFilter})`} sub="By detection volume" />
          <div className="flex flex-col gap-3">
            {dataState.tools.map(t => (
              <div key={t.rank} className="flex items-center gap-3">
                {/* Rank circle */}
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0 font-bold"
                  style={{ width:26, height:26, backgroundColor: t.rank === 1 ? "#FFF3EE" : "#F8FAFC", fontSize:12, color: t.rank === 1 ? "#FF5C1A" : "#94A3B8" }}
                >
                  {t.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold truncate" style={{ fontSize:13, color:"#1A1A2E" }}>{t.name}</span>
                    <span style={{ fontSize:12, color:"#94A3B8", flexShrink:0, marginLeft:8 }}>{t.uses} uses</span>
                  </div>
                  <div className="w-full rounded-full" style={{ height:6, backgroundColor:"#FFF3EE" }}>
                    <div className="rounded-full" style={{ height:6, width:`${t.pct}%`, backgroundColor:"#FF5C1A", transition:"width 600ms ease" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Power Users */}
        <Card className="flex-1">
          <CardHeader title="Most Active Users" sub={`Top 5 by event count (${dateFilter.toLowerCase()})`} />
          <div className="flex flex-col gap-3">
            {dataState.users.map((u, i) => (
              <div key={u.initials}
                className="flex items-center gap-3 cursor-pointer rounded-xl px-2 py-1.5 transition-colors"
                style={{ margin:"0 -8px" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#FAFAFA"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
              >
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
                  style={{ width:36, height:36, backgroundColor: i === 0 ? "#FF5C1A" : "#F0F2F5", color: i === 0 ? "#ffffff" : "#64748B", fontSize:12 }}
                >
                  {u.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ fontSize:13, color:"#1A1A2E" }}>{u.name}</p>
                  <p style={{ fontSize:12, color:"#94A3B8" }}>{u.dept}</p>
                </div>
                <span
                  className="font-semibold flex-shrink-0"
                  style={{ fontSize:12, backgroundColor:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:9999, padding:"2px 10px", color:"#1A1A2E" }}
                >
                  {u.events}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Shadow AI Detected */}
        <Card className="flex-1">
          <div className="mb-4">
            <p className="font-semibold" style={{ fontSize:16, color:"#1A1A2E" }}>Shadow AI Detected</p>
            <p style={{ fontSize:13, color:"#94A3B8", marginTop:2 }}>Tools not on approved list</p>
          </div>
          <div className="flex flex-col gap-3">
            {shadowTools.map((t, i) => (
              <div key={t.name}
                className="flex items-center gap-3 cursor-pointer rounded-xl px-2 py-2 transition-colors"
                style={{ borderBottom: i < shadowTools.length - 1 ? "1px solid #F8FAFC" : "none", margin:"0 -8px", paddingBottom: i < shadowTools.length - 1 ? 12 : 8 }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#FAFAFA"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
              >
                <ShieldAlert size={16} strokeWidth={2} color="#DC2626" style={{ flexShrink:0 }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ fontSize:13, color:"#1A1A2E" }}>{t.name}</p>
                  <p style={{ fontSize:11, color:"#94A3B8" }}>First seen {t.days} days ago</p>
                </div>
                <span
                  className="font-semibold flex-shrink-0"
                  style={{
                    fontSize:11,
                    backgroundColor: t.risk === "high" ? "rgba(220,38,38,0.08)" : "rgba(217,119,6,0.08)",
                    border: `1px solid ${t.risk === "high" ? "rgba(220,38,38,0.2)" : "rgba(217,119,6,0.2)"}`,
                    color: t.risk === "high" ? "#DC2626" : "#D97706",
                    borderRadius:9999,
                    padding:"2px 8px",
                    textTransform:"uppercase",
                    letterSpacing:"0.04em",
                  }}
                >
                  {t.risk === "high" ? "HIGH" : "MED"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
