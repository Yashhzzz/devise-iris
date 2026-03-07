import { useState } from "react";
import {
  AlertTriangle, Info, CheckCircle2,
  ChevronDown, Bell, ShieldAlert, Pencil, Plus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// ─── Types ─────────────────────────────────────────────────────────────────

type Severity = "critical" | "high" | "medium" | "resolved";

interface Alert {
  id: string;
  severity: Severity;
  unread: boolean;
  title: string;
  desc: string;
  user: string;
  tool: string;
  dept: string;
  time: string;
  resolvedBy?: string;
}

// ─── Alert data ────────────────────────────────────────────────────────────

const alertsData: Alert[] = [
  { id:"1",  severity:"critical", unread:true,  title:"Sensitive data pattern detected",      desc:"Large paste event detected before OpenAI API call",         user:"yashm",    tool:"OpenAI API",   dept:"Engineering", time:"2 min ago"  },
  { id:"2",  severity:"critical", unread:true,  title:"Unapproved tool in Finance department", desc:"Replicate.com accessed by finance team member",              user:"ramesh.k", tool:"Replicate",    dept:"Finance",     time:"8 min ago"  },
  { id:"3",  severity:"high",     unread:true,  title:"High-risk tool usage spike",            desc:"Midjourney accessed 12 times in 1 hour",                    user:"sarah.k",  tool:"Midjourney",   dept:"Design",      time:"24 min ago" },
  { id:"4",  severity:"high",     unread:true,  title:"New shadow AI tool detected",           desc:"Character.ai not on approved list — first detection",        user:"priya.m",  tool:"Character.ai", dept:"Marketing",   time:"1 hr ago"   },
  { id:"5",  severity:"high",     unread:false, title:"API key exposure signal",               desc:"OpenAI API called from personal Python script",              user:"arjun.r",  tool:"OpenAI API",   dept:"Engineering", time:"2 hr ago"   },
  { id:"6",  severity:"medium",   unread:true,  title:"After-hours AI usage detected",         desc:"Multiple AI tools used at 2:30 AM",                          user:"yashm",    tool:"ChatGPT",      dept:"Engineering", time:"6 hr ago"   },
  { id:"7",  severity:"medium",   unread:false, title:"Policy check: multiple tool switches",  desc:"5 different AI tools used in a single session",              user:"karan.m",  tool:"Perplexity",   dept:"Operations",  time:"8 hr ago"   },
  { id:"8",  severity:"medium",   unread:false, title:"Unusual download volume detected",      desc:"Large file pulled via GitHub Copilot suggestion",            user:"deepa.p",  tool:"GitHub Copilot",dept:"Engineering", time:"10 hr ago"  },
  { id:"9",  severity:"medium",   unread:false, title:"First-time tool access flagged",        desc:"Runway used for the first time by this user",                user:"ananya.g", tool:"Runway",       dept:"Design",      time:"12 hr ago"  },
  { id:"10", severity:"medium",   unread:false, title:"Elevated session duration",             desc:"Claude session active for 4+ continuous hours",              user:"rohit.j",  tool:"Claude",       dept:"Marketing",   time:"Yesterday"  },
  { id:"11", severity:"resolved", unread:false, title:"Unrecognized browser extension blocked",desc:"Extension removed and flagged successfully",                 user:"meera.r",  tool:"Browser",      dept:"Operations",  time:"2 days ago", resolvedBy:"Admin" },
  { id:"12", severity:"resolved", unread:false, title:"VPN policy compliance check passed",   desc:"All devices now compliant after policy push",                user:"System",   tool:"—",            dept:"All",         time:"3 days ago", resolvedBy:"System" },
];

// ─── Severity config ───────────────────────────────────────────────────────

const sevConf: Record<Severity, { border: string; badge: string; badgeText: string; badgeBorder: string; iconBg: string; iconColor: string; label: string }> = {
  critical: { border:"#DC2626", badge:"rgba(220,38,38,0.08)", badgeText:"#DC2626", badgeBorder:"rgba(220,38,38,0.2)", iconBg:"rgba(220,38,38,0.08)", iconColor:"#DC2626", label:"Critical" },
  high:     { border:"#FF5C1A", badge:"rgba(255,92,26,0.08)",  badgeText:"#FF5C1A", badgeBorder:"rgba(255,92,26,0.2)",  iconBg:"rgba(255,92,26,0.08)",  iconColor:"#FF5C1A", label:"High"     },
  medium:   { border:"#D97706", badge:"rgba(217,119,6,0.08)",  badgeText:"#D97706", badgeBorder:"rgba(217,119,6,0.2)",  iconBg:"rgba(217,119,6,0.08)",  iconColor:"#D97706", label:"Medium"   },
  resolved: { border:"#16A34A", badge:"rgba(22,163,74,0.08)",  badgeText:"#16A34A", badgeBorder:"rgba(22,163,74,0.2)",  iconBg:"rgba(22,163,74,0.08)",  iconColor:"#16A34A", label:"Resolved" },
};

function alertIcon(s: Severity) {
  if (s === "critical" || s === "high") return AlertTriangle;
  if (s === "resolved") return CheckCircle2;
  return Info;
}

// ─── Pill Toggle ───────────────────────────────────────────────────────────

function PillToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      style={{
        width: 44, height: 24, borderRadius: 9999,
        backgroundColor: on ? "#FF5C1A" : "#F0F2F5",
        border: "none", cursor: "pointer", position: "relative",
        flexShrink: 0, transition: "background-color 200ms ease",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: 9999,
        backgroundColor: "#ffffff",
        transition: "left 200ms ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.20)",
        display: "block",
      }} />
    </button>
  );
}

// ─── Select Dropdown ───────────────────────────────────────────────────────

function FilterSelect({ label }: { label: string }) {
  return (
    <div className="relative flex items-center">
      <select className="appearance-none outline-none cursor-pointer pr-8 font-medium"
        style={{ backgroundColor:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:12, padding:"7px 14px", fontSize:13, color:"#1A1A2E", fontFamily:"Inter, sans-serif" }}>
        <option>{label}</option>
      </select>
      <ChevronDown size={13} color="#94A3B8" className="absolute right-3 pointer-events-none" />
    </div>
  );
}

// ─── Single Alert Row ──────────────────────────────────────────────────────

function AlertRow({ alert, onResolve }: { alert: Alert; onResolve: (id: string) => void }) {
  const cf = sevConf[alert.severity];
  const Icon = alertIcon(alert.severity);
  const isResolved = alert.severity === "resolved";

  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: 16,
        padding: "18px 20px",
        borderLeft: `3px solid ${cf.border}`,
        borderBottom: "1px solid #F8FAFC",
        position: "relative",
        opacity: isResolved ? 0.75 : 1,
        transition: "background-color 150ms",
        backgroundColor: "transparent",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "#FAFAFA"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent"; }}
    >
      {/* Icon */}
      <div className="flex items-center justify-center rounded-xl flex-shrink-0"
        style={{ width: 38, height: 38, backgroundColor: cf.iconBg, marginTop: 2 }}>
        <Icon size={17} strokeWidth={2} color={cf.iconColor} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Severity badge */}
          <span className="font-semibold" style={{ fontSize: 11, backgroundColor: cf.badge, color: cf.badgeText, border: `1px solid ${cf.badgeBorder}`, borderRadius: 9999, padding: "2px 8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {cf.label}
          </span>
          <span className="font-semibold" style={{ fontSize: 14, color: "#1A1A2E" }}>{alert.title}</span>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4, lineHeight: 1.4 }}>{alert.desc}</p>

        {/* Meta row */}
        <div className="flex items-center flex-wrap gap-1 mt-2" style={{ fontSize: 12, color: "#94A3B8" }}>
          <span>User: <span style={{ color: "#64748B" }}>{alert.user}</span></span>
          <span style={{ color: "#CBD5E1" }}>•</span>
          <span>Tool: <span style={{ color: "#64748B" }}>{alert.tool}</span></span>
          <span style={{ color: "#CBD5E1" }}>•</span>
          <span>Dept: <span style={{ color: "#64748B" }}>{alert.dept}</span></span>
          <span style={{ color: "#CBD5E1" }}>•</span>
          <span>{alert.time}</span>
          {alert.resolvedBy && (
            <>
              <span style={{ color: "#CBD5E1" }}>•</span>
              <span>Resolved by <span style={{ color: "#16A34A" }}>{alert.resolvedBy}</span></span>
            </>
          )}
        </div>
      </div>

      {/* Right: unread dot + actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {/* Unread dot */}
        {alert.unread && (
          <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: "#FF5C1A", display: "block", marginBottom: 4 }} />
        )}

        {isResolved ? (
          <span className="font-semibold" style={{ fontSize: 12, backgroundColor: "rgba(22,163,74,0.08)", color: "#16A34A", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 9999, padding: "3px 10px" }}>
            Resolved ✓
          </span>
        ) : (
          <div className="flex items-center gap-3">
            <button className="font-semibold" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#FF5C1A", fontFamily: "Inter, sans-serif", padding: 0 }}>
              View Details
            </button>
            <button className="font-medium" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#94A3B8", fontFamily: "Inter, sans-serif", padding: 0 }}
              onClick={() => onResolve(alert.id)}>
              Resolve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function AlertsTab() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(alertsData);
  const [rules, setRules] = useState([true, true, false]);
  const [hoverRule, setHoverRule] = useState<number | null>(null);
  const { toast } = useToast();

  const displayed = unreadOnly ? alerts.filter(a => a.unread) : alerts;

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, severity: "resolved" as Severity, unread: false, resolvedBy: "Admin" } : a));
    toast({
      title: "Alert Resolved",
      description: "Policy violation marked as cleared successfully.",
      duration: 3000,
    });
  };

  const ruleConf = [
    { Icon: ShieldAlert, color: "#FF5C1A", label: "Finance dept uses unapproved tool", action: "Block + Alert", actionColor: "#DC2626", actionBg: "rgba(220,38,38,0.08)", actionBorder: "rgba(220,38,38,0.2)" },
    { Icon: AlertTriangle, color: "#DC2626", label: "HIGH risk tool detected",          action: "Alert only",   actionColor: "#D97706", actionBg: "rgba(217,119,6,0.08)",  actionBorder: "rgba(217,119,6,0.2)"  },
    { Icon: Bell,          color: "#D97706", label: "After-hours usage",                action: "Log only",     actionColor: "#64748B", actionBg: "#F8FAFC",               actionBorder: "#E2E8F0"              },
  ];

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold" style={{ fontSize: 22, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>Alerts</h1>
          <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 3 }}>Policy violations and high-risk activity notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="font-semibold" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#FF5C1A", fontFamily: "Inter, sans-serif" }}>
            Mark all read
          </button>
          <button className="flex items-center gap-2 font-medium"
            style={{ backgroundColor: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "8px 14px", fontSize: 13, color: "#1A1A2E", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff"; }}>
            Configure Alerts
          </button>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Critical — orange */}
        {[
          { label: "Critical",       value: "2",  sub: "Immediate action",       orange: true,  dotColor: "", subColor: "rgba(255,255,255,0.80)" },
          { label: "High",           value: "5",  sub: "Needs review",           orange: false, dotColor: "#DC2626", subColor: "#DC2626" },
          { label: "Medium",         value: "11", sub: "Monitor closely",        orange: false, dotColor: "#D97706", subColor: "#D97706" },
          { label: "Resolved Today", value: "8",  sub: "Closed successfully",    orange: false, dotColor: "#16A34A", subColor: "#16A34A" },
        ].map(card => (
          <div key={card.label} className="flex-1"
            style={{ backgroundColor: card.orange ? "#FF5C1A" : "#ffffff", border: `1px solid ${card.orange ? "#FDDCC8" : "#F0F2F5"}`, borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "transform 200ms, box-shadow 200ms", cursor: "default" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
          >
            <p className="font-semibold tracking-widest uppercase" style={{ fontSize: 10, color: card.orange ? "rgba(255,255,255,0.75)" : "#94A3B8", letterSpacing: "0.08em" }}>{card.label}</p>
            <p className="font-bold mt-2" style={{ fontSize: 36, color: card.orange ? "#ffffff" : "#1A1A2E", lineHeight: 1 }}>{card.value}</p>
            <div className="flex items-center gap-1.5 mt-2">
              {card.dotColor && <span className="rounded-full" style={{ width: 7, height: 7, backgroundColor: card.dotColor, display: "inline-block", flexShrink: 0 }} />}
              <span style={{ fontSize: 12, color: card.subColor }}>{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Row ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilterSelect label="All Severity" />
          <FilterSelect label="All Types"    />
        </div>
        <div className="flex items-center gap-2.5">
          <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>Unread only</span>
          <PillToggle on={unreadOnly} onToggle={() => setUnreadOnly(v => !v)} />
        </div>
      </div>

      {/* ── Alerts List ─────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #F0F2F5", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {/* List header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F8FAFC" }}>
          <p className="font-semibold" style={{ fontSize: 15, color: "#1A1A2E" }}>
            All Alerts
            <span className="font-normal ml-2" style={{ fontSize: 13, color: "#94A3B8" }}>
              ({displayed.length} showing)
            </span>
          </p>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>
            {alerts.filter(a => a.unread).length} unread
          </span>
        </div>

        {/* Alert rows */}
        {displayed.length > 0 ? (
          displayed.map((alert, idx) => (
            <AlertRow
              key={alert.id}
              alert={{ ...alert, ...(idx === displayed.length - 1 ? {} : {}) }}
              onResolve={handleResolve}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 size={32} strokeWidth={1.5} color="#CBD5E1" />
            <p className="mt-3 font-medium" style={{ fontSize: 14, color: "#94A3B8" }}>No unread alerts</p>
          </div>
        )}
      </div>

      {/* ── Alert Rules ─────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #F0F2F5", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-semibold" style={{ fontSize: 15, color: "#1A1A2E" }}>Active Alert Rules</p>
            <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Automation policies governing alert behavior</p>
          </div>
          <button className="flex items-center gap-1.5 font-semibold"
            style={{ backgroundColor: "#FF5C1A", color: "#ffffff", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "background-color 200ms" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E5521A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FF5C1A"; }}>
            <Plus size={13} strokeWidth={2.5} /> Add Rule
          </button>
        </div>

        {/* Rules */}
        <div className="flex flex-col gap-3">
          {ruleConf.map((rule, i) => (
            <div key={i}
              className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors"
              style={{ border: "1px solid #F0F2F5", cursor: "default", position: "relative" }}
              onMouseEnter={() => setHoverRule(i)}
              onMouseLeave={() => setHoverRule(null)}
            >
              {/* Icon */}
              <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 36, height: 36, backgroundColor: `${rule.color}14` }}>
                <rule.Icon size={16} strokeWidth={2} color={rule.color} />
              </div>

              {/* Label */}
              <span className="font-medium flex-1" style={{ fontSize: 14, color: "#1A1A2E" }}>{rule.label}</span>

              {/* Action badge */}
              <span className="font-semibold flex-shrink-0" style={{ fontSize: 12, backgroundColor: rule.actionBg, color: rule.actionColor, border: `1px solid ${rule.actionBorder}`, borderRadius: 9999, padding: "3px 10px" }}>
                {rule.action}
              </span>

              {/* Edit icon (hover) */}
              {hoverRule === i && (
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                  <Pencil size={14} strokeWidth={2} color="#94A3B8" />
                </button>
              )}

              {/* Toggle */}
              <PillToggle on={rules[i]} onToggle={() => setRules(prev => prev.map((v, j) => j === i ? !v : v))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
