import { useState } from "react";
import {
  Plus, Search, ChevronDown, Monitor,
  CheckCircle2, XCircle, MoreHorizontal,
  RefreshCw, Trash2, Eye, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { useToast } from "@/components/ui/use-toast";

// ─── Types ─────────────────────────────────────────────────────────────────

type DeviceStatus = "healthy" | "outdated" | "offline";
type OS = "macos" | "windows";
type LastSeenStatus = "online" | "recent" | "offline";

interface Device {
  id: string;
  name: string;
  hostname: string;
  userInitials: string;
  userName: string;
  userDept: string;
  os: OS;
  osVersion: string;
  browserAgent: boolean;
  desktopAgent: boolean;
  lastSeen: string;
  lastSeenStatus: LastSeenStatus;
  version: string;
  status: DeviceStatus;
}

// ─── 20 device rows ────────────────────────────────────────────────────────

const devices: Device[] = [
  { id:"1",  name:"MacBook Pro 16\"",   hostname:"macbook-yash.local",      userInitials:"YM", userName:"Yash M",    userDept:"Engineering", os:"macos",   osVersion:"macOS 14.2",  browserAgent:true,  desktopAgent:true,  lastSeen:"2 min ago",   lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"2",  name:"Dell XPS 15",        hostname:"dell-sarah.corp",           userInitials:"SK", userName:"Sarah K",   userDept:"Design",       os:"windows", osVersion:"Windows 11",  browserAgent:true,  desktopAgent:true,  lastSeen:"5 min ago",   lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"3",  name:"MacBook Air M2",     hostname:"macbook-arjun.local",      userInitials:"AR", userName:"Arjun R",   userDept:"Product",      os:"macos",   osVersion:"macOS 14.1",  browserAgent:true,  desktopAgent:true,  lastSeen:"12 min ago",  lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"4",  name:"Surface Laptop 5",   hostname:"surface-priya.corp",        userInitials:"PM", userName:"Priya M",   userDept:"Marketing",    os:"windows", osVersion:"Windows 11",  browserAgent:true,  desktopAgent:false, lastSeen:"1 hr ago",    lastSeenStatus:"recent",  version:"v1.2.1", status:"outdated" },
  { id:"5",  name:"MacBook Pro 14\"",   hostname:"macbook-rahul.local",      userInitials:"RT", userName:"Rahul T",   userDept:"Engineering",  os:"macos",   osVersion:"macOS 14.2",  browserAgent:true,  desktopAgent:true,  lastSeen:"20 min ago",  lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"6",  name:"Lenovo ThinkPad",    hostname:"thinkpad-neha.corp",        userInitials:"NA", userName:"Neha A",    userDept:"Operations",   os:"windows", osVersion:"Windows 11",  browserAgent:true,  desktopAgent:true,  lastSeen:"45 min ago",  lastSeenStatus:"recent",  version:"v1.2.3", status:"healthy"  },
  { id:"7",  name:"iMac 27\"",          hostname:"imac-vikram.local",         userInitials:"VK", userName:"Vikram K",  userDept:"Design",       os:"macos",   osVersion:"macOS 13.6",  browserAgent:true,  desktopAgent:true,  lastSeen:"3 hr ago",    lastSeenStatus:"recent",  version:"v1.2.1", status:"outdated" },
  { id:"8",  name:"HP EliteBook 840",   hostname:"hp-amit.corp",              userInitials:"AS", userName:"Amit S",    userDept:"Product",      os:"windows", osVersion:"Windows 10",  browserAgent:false, desktopAgent:true,  lastSeen:"2 days ago",  lastSeenStatus:"offline", version:"v1.1.0", status:"offline"  },
  { id:"9",  name:"MacBook Pro 16\"",   hostname:"macbook-deepa.local",      userInitials:"DP", userName:"Deepa P",   userDept:"Engineering",  os:"macos",   osVersion:"macOS 14.2",  browserAgent:true,  desktopAgent:true,  lastSeen:"8 min ago",   lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"10", name:"Dell Inspiron 15",   hostname:"dell-rohit.corp",           userInitials:"RJ", userName:"Rohit J",   userDept:"Marketing",    os:"windows", osVersion:"Windows 11",  browserAgent:true,  desktopAgent:true,  lastSeen:"30 min ago",  lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"11", name:"MacBook Air M1",     hostname:"macbook-ananya.local",     userInitials:"AG", userName:"Ananya G",  userDept:"Design",       os:"macos",   osVersion:"macOS 14.0",  browserAgent:true,  desktopAgent:false, lastSeen:"2 hr ago",    lastSeenStatus:"recent",  version:"v1.2.1", status:"outdated" },
  { id:"12", name:"Surface Pro 9",      hostname:"surface-karan.corp",        userInitials:"KM", userName:"Karan M",   userDept:"Operations",   os:"windows", osVersion:"Windows 11",  browserAgent:true,  desktopAgent:true,  lastSeen:"15 min ago",  lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"13", name:"Mac Studio",         hostname:"macstudio-lead.local",     userInitials:"SB", userName:"Sanjay B",  userDept:"Engineering",  os:"macos",   osVersion:"macOS 14.2",  browserAgent:true,  desktopAgent:true,  lastSeen:"4 min ago",   lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"14", name:"HP Spectre 360",     hostname:"hp-pooja.corp",             userInitials:"PC", userName:"Pooja C",   userDept:"Marketing",    os:"windows", osVersion:"Windows 11",  browserAgent:true,  desktopAgent:true,  lastSeen:"55 min ago",  lastSeenStatus:"recent",  version:"v1.2.3", status:"healthy"  },
  { id:"15", name:"MacBook Pro 13\"",   hostname:"macbook-ishaan.local",     userInitials:"IV", userName:"Ishaan V",  userDept:"Product",      os:"macos",   osVersion:"macOS 14.1",  browserAgent:true,  desktopAgent:true,  lastSeen:"18 min ago",  lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"16", name:"Lenovo IdeaPad",     hostname:"lenovo-meera.corp",         userInitials:"MR", userName:"Meera R",   userDept:"Operations",   os:"windows", osVersion:"Windows 10",  browserAgent:false, desktopAgent:false, lastSeen:"3 days ago",  lastSeenStatus:"offline", version:"v1.1.0", status:"offline"  },
  { id:"17", name:"MacBook Air M2",     hostname:"macbook-tarun.local",      userInitials:"TN", userName:"Tarun N",   userDept:"Engineering",  os:"macos",   osVersion:"macOS 14.2",  browserAgent:true,  desktopAgent:true,  lastSeen:"10 min ago",  lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"18", name:"ASUS ZenBook",       hostname:"asus-kavita.corp",          userInitials:"KS", userName:"Kavita S",  userDept:"Design",       os:"windows", osVersion:"Windows 11",  browserAgent:true,  desktopAgent:true,  lastSeen:"22 min ago",  lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"19", name:"Mac Mini M2",        hostname:"macmini-ops.local",        userInitials:"OT", userName:"Ops Team",  userDept:"Operations",   os:"macos",   osVersion:"macOS 14.2",  browserAgent:true,  desktopAgent:true,  lastSeen:"6 min ago",   lastSeenStatus:"online",  version:"v1.2.3", status:"healthy"  },
  { id:"20", name:"Dell Latitude 14",   hostname:"dell-sales.corp",           userInitials:"SL", userName:"Sales Lead",userDept:"Marketing",    os:"windows", osVersion:"Windows 11",  browserAgent:false, desktopAgent:false, lastSeen:"5 days ago",  lastSeenStatus:"offline", version:"v1.1.0", status:"offline"  },
];

const allDevices: Device[] = [...devices];
for (let i = 21; i <= 24; i++) {
  const seed = devices[(i - 1) % devices.length];
  allDevices.push({
    ...seed,
    id: i.toString(),
    name: `${seed.name} (Clone)`,
    hostname: `clone-${seed.hostname}`,
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function rowShadow(s: DeviceStatus): string {
  if (s === "offline")  return "inset 3px 0 0 #DC2626";
  if (s === "outdated") return "inset 3px 0 0 #D97706";
  return "none";
}

const dotColor: Record<LastSeenStatus, string> = {
  online:  "#16A34A",
  recent:  "#D97706",
  offline: "#DC2626",
};

// ─── OS icon SVGs ───────────────────────────────────────────────────────────

function AppleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function WindowsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12V6.75l6-1.32v6.57H3zm17 0V3.43l-9 1.98V12h9zm-17 1h6v6.57l-6-1.32V13zm17 0h-9v6.58l9 1.99V13z"/>
    </svg>
  );
}

// ─── Shared card ────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: "#ffffff",
      border: "1px solid #F0F2F5",
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

export function DevicesTab() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [devicesList, setDevicesList] = useState<Device[]>(allDevices);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 10;
  const totalItems = devicesList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (p: number) => {
    if (p === page || p < 1 || p > totalPages) return;
    setIsFading(true);
    setTimeout(() => {
      setPage(p);
      setIsFading(false);
    }, 200);
  };

  const handleForceSync = (id: string, name: string) => {
    setDevicesList(prev => prev.map(d => 
      d.id === id ? { ...d, lastSeen: "Just now", lastSeenStatus: "online", status: "healthy" } : d
    ));
    toast({
      title: "Sync Command Sent",
      description: `Requested state refresh from ${name}.`,
      duration: 3000,
    });
  };

  const handleRemoveAgent = (id: string, name: string) => {
    setDevicesList(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Agent Removed",
      description: `Successfully unlinked ${name} from governance.`,
      duration: 3000,
    });
  };

  const paginatedDevices = devicesList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const coverageData = [
    { name: "Active",   value: 21, color: "#FF5C1A" },
    { name: "Inactive", value: 3,  color: "#E2E8F0" },
  ];

  const versionData = [
    { version: "v1.2.3 (latest)", count: 18, pct: 75, color: "#16A34A" },
    { version: "v1.2.1",          count: 4,  pct: 17, color: "#D97706" },
    { version: "v1.1.0",          count: 2,  pct: 8,  color: "#DC2626" },
  ];

  const cols = ["DEVICE", "USER", "OS", "AGENT STATUS", "LAST SEEN", "VERSION", "ACTIONS"];

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold" style={{ fontSize: 22, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>Devices</h1>
          <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 3 }}>Monitor agent status across all managed devices</p>
        </div>
        <button
          className="flex items-center gap-2 font-semibold"
          style={{ backgroundColor: "#FF5C1A", color: "#ffffff", border: "none", borderRadius: 12, padding: "9px 18px", fontSize: 14, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "background-color 200ms ease" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E5521A"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FF5C1A"; }}
        >
          <Plus size={15} strokeWidth={2.5} /> Deploy Agent
        </button>
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Card 1 orange */}
        <div className="flex-1" style={{ backgroundColor: "#FF5C1A", border: "1px solid #FDDCC8", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "transform 200ms, box-shadow 200ms" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
        >
          <p className="font-semibold tracking-widest uppercase" style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", letterSpacing: "0.08em" }}>Total Devices</p>
          <p className="font-bold mt-2" style={{ fontSize: 36, color: "#ffffff", lineHeight: 1 }}>24</p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.80)", marginTop: 6 }}>↑ 2 added this week</p>
        </div>

        {/* Card 2 white */}
        <div className="flex-1" style={{ backgroundColor: "#ffffff", border: "1px solid #F0F2F5", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "transform 200ms, box-shadow 200ms" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
        >
          <p className="font-semibold tracking-widest uppercase" style={{ fontSize: 10, color: "#94A3B8", letterSpacing: "0.08em" }}>Agents Active</p>
          <p className="font-bold mt-2" style={{ fontSize: 36, color: "#1A1A2E", lineHeight: 1 }}>21</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#16A34A", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#64748B" }}>Browser + Desktop running</span>
          </div>
        </div>

        {/* Card 3 white */}
        <div className="flex-1" style={{ backgroundColor: "#ffffff", border: "1px solid #F0F2F5", borderRadius: 16, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "transform 200ms, box-shadow 200ms" }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
        >
          <p className="font-semibold tracking-widest uppercase" style={{ fontSize: 10, color: "#94A3B8", letterSpacing: "0.08em" }}>Needs Attention</p>
          <p className="font-bold mt-2" style={{ fontSize: 36, color: "#1A1A2E", lineHeight: 1 }}>3</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="rounded-full" style={{ width: 7, height: 7, backgroundColor: "#DC2626", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#DC2626" }}>Offline or outdated</span>
          </div>
        </div>
      </div>

      {/* ── Device Table ────────────────────────────────────────────── */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {/* Table header controls */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #F8FAFC" }}>
          <p className="font-semibold" style={{ fontSize: 16, color: "#1A1A2E" }}>All Devices</p>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex items-center">
              <Search size={13} color="#94A3B8" className="absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search devices..."
                className="outline-none"
                style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, fontSize: 13, color: "#1A1A2E", width: 180, fontFamily: "Inter, sans-serif" }}
              />
            </div>
            {/* Status filter */}
            <div className="relative flex items-center">
              <select className="appearance-none outline-none cursor-pointer pr-8 font-medium"
                style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "7px 14px", fontSize: 13, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>
                <option>All Status</option>
                <option>Healthy</option>
                <option>Outdated</option>
                <option>Offline</option>
              </select>
              <ChevronDown size={13} color="#94A3B8" className="absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F8FAFC" }}>
                {cols.map((col, i) => (
                  <th key={i} className="text-left font-semibold"
                    style={{ padding: i === 0 ? "10px 12px 10px 24px" : i === cols.length - 1 ? "10px 24px 10px 12px" : "10px 12px", fontSize: 11, color: "#94A3B8", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ opacity: isFading ? 0 : 1, transition: "opacity 200ms ease" }}>
              {paginatedDevices.map((d, idx) => {
                const isLast = idx === paginatedDevices.length - 1;
                return (
                  <tr key={d.id}
                    style={{ boxShadow: rowShadow(d.status), borderBottom: isLast ? "none" : "1px solid #F8FAFC", transition: "background-color 150ms" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#FAFAFA"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  >
                    {/* DEVICE */}
                    <td style={{ padding: "14px 12px 14px 24px", minWidth: 180 }}>
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                          style={{ width: 34, height: 34, backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                          <Monitor size={16} strokeWidth={1.8} color="#64748B" />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ fontSize: 13, color: "#1A1A2E", lineHeight: 1.3 }}>{d.name}</p>
                          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94A3B8", lineHeight: 1.3 }}>{d.hostname}</p>
                        </div>
                      </div>
                    </td>

                    {/* USER */}
                    <td style={{ padding: "14px 12px", minWidth: 150 }}>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
                          style={{ width: 28, height: 28, backgroundColor: "#FF5C1A", color: "#ffffff", fontSize: 10 }}>
                          {d.userInitials}
                        </div>
                        <div>
                          <p className="font-medium" style={{ fontSize: 13, color: "#1A1A2E", lineHeight: 1.3 }}>{d.userName}</p>
                          <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.3 }}>{d.userDept}</p>
                        </div>
                      </div>
                    </td>

                    {/* OS */}
                    <td style={{ padding: "14px 12px", minWidth: 140 }}>
                      <div className="flex items-center gap-1.5">
                        <span style={{ color: d.os === "macos" ? "#1A1A2E" : "#0078D4", flexShrink: 0 }}>
                          {d.os === "macos" ? <AppleIcon size={14} /> : <WindowsIcon size={14} />}
                        </span>
                        <span style={{ fontSize: 13, color: "#1A1A2E" }}>{d.osVersion}</span>
                      </div>
                    </td>

                    {/* AGENT STATUS */}
                    <td style={{ padding: "14px 12px", minWidth: 155 }}>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1">
                          {d.browserAgent
                            ? <CheckCircle2 size={13} strokeWidth={2} color="#16A34A" />
                            : <XCircle      size={13} strokeWidth={2} color="#DC2626" />}
                          <span style={{ fontSize: 12, color: d.browserAgent ? "#16A34A" : "#DC2626" }}>
                            Browser {d.browserAgent ? "Active" : "Not installed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {d.desktopAgent
                            ? <CheckCircle2 size={13} strokeWidth={2} color="#16A34A" />
                            : <XCircle      size={13} strokeWidth={2} color="#DC2626" />}
                          <span style={{ fontSize: 12, color: d.desktopAgent ? "#16A34A" : "#DC2626" }}>
                            Desktop {d.desktopAgent ? "Active" : "Not installed"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* LAST SEEN */}
                    <td style={{ padding: "14px 12px", whiteSpace: "nowrap" }}>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, backgroundColor: dotColor[d.lastSeenStatus], display: "inline-block" }} />
                        <span style={{ fontSize: 13, color: "#64748B" }}>{d.lastSeen}</span>
                      </div>
                    </td>

                    {/* VERSION */}
                    <td style={{ padding: "14px 12px" }}>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8" }}>{d.version}</p>
                      {d.status === "outdated" && (
                        <span style={{ fontSize: 11, backgroundColor: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.2)", color: "#D97706", borderRadius: 9999, padding: "1px 7px", marginTop: 3, display: "inline-block" }}>
                          Update available
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td style={{ padding: "14px 24px 14px 12px" }}>
                      <div className="relative">
                        <button
                          className="flex items-center justify-center rounded-lg transition-colors"
                          style={{ width: 30, height: 30, border: "1px solid #E2E8F0", backgroundColor: openMenu === d.id ? "#F8FAFC" : "transparent", cursor: "pointer" }}
                          onClick={() => setOpenMenu(openMenu === d.id ? null : d.id)}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
                          onMouseLeave={e => { if (openMenu !== d.id) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                        >
                          <MoreHorizontal size={15} color="#64748B" />
                        </button>
                        {openMenu === d.id && (
                          <div className="absolute right-0 z-50"
                            style={{ top: 34, backgroundColor: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 155, overflow: "hidden" }}>
                            <button className="flex items-center gap-2.5 w-full font-medium"
                              style={{ padding: "9px 14px", fontSize: 13, color: "#1A1A2E", backgroundColor: "transparent", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", textAlign: "left" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                              onClick={() => { setOpenMenu(null); toast({ title: "View Details", description: "Opening device profile..." }); }}
                            >
                              <Eye size={13} strokeWidth={2} /> View Details
                            </button>

                            <button className="flex items-center gap-2.5 w-full font-medium"
                              style={{ padding: "9px 14px", fontSize: 13, color: "#1A1A2E", backgroundColor: "transparent", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", textAlign: "left" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                              onClick={() => { setOpenMenu(null); handleForceSync(d.id, d.name); }}
                            >
                              <RefreshCw size={13} strokeWidth={2} /> Force Sync
                            </button>

                            <button className="flex items-center gap-2.5 w-full font-medium"
                              style={{ padding: "9px 14px", fontSize: 13, color: "#DC2626", backgroundColor: "transparent", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", textAlign: "left" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FEF2F2"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                              onClick={() => { setOpenMenu(null); handleRemoveAgent(d.id, d.name); }}
                            >
                              <Trash2 size={13} strokeWidth={2} /> Remove Agent
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Table footer / pagination */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid #F8FAFC" }}
        >
          <span style={{ fontSize: 13, color: "#94A3B8" }}>
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, totalItems)} of {totalItems} devices
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              className="flex items-center gap-1 font-medium transition-colors"
              style={{ fontSize: 13, color: page === 1 ? "#CBD5E1" : "#64748B", padding: "5px 10px", borderRadius: 8, border: "1px solid #E2E8F0", backgroundColor: "transparent", cursor: page === 1 ? "not-allowed" : "pointer" }}
              onMouseEnter={e => { if (page !== 1) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft size={13} strokeWidth={2} /> Prev
            </button>

            {getPages().map((p, idx) => (
              p === "..." ? (
                <span key={`dots-${idx}`} style={{ fontSize: 13, color: "#CBD5E1", padding: "0 4px" }}>…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePageChange(p as number)}
                  style={{
                    width: 30, height: 30, borderRadius: 8, fontSize: 13, cursor: "pointer",
                    border: p === page ? "1px solid #1A1A2E" : "1px solid #E2E8F0",
                    backgroundColor: p === page ? "#1A1A2E" : "transparent",
                    color: p === page ? "#ffffff" : "#64748B",
                    fontWeight: p === page ? 600 : 400,
                    transition: "all 150ms ease",
                  }}
                  onMouseEnter={e => { if (p !== page) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
                  onMouseLeave={e => { if (p !== page) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                >
                  {p}
                </button>
              )
            ))}

            <button
              disabled={page === totalPages}
              className="flex items-center gap-1 font-medium transition-colors"
              style={{ fontSize: 13, color: page === totalPages ? "#CBD5E1" : "#64748B", padding: "5px 10px", borderRadius: 8, border: "1px solid #E2E8F0", backgroundColor: "transparent", cursor: page === totalPages ? "not-allowed" : "pointer" }}
              onMouseEnter={e => { if (page !== totalPages) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              onClick={() => handlePageChange(page + 1)}
            >
              Next <ChevronRight size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      </Card>

      {/* ── Bottom section ──────────────────────────────────────────── */}
      <div className="flex gap-4">

        {/* Left — Deployment Coverage donut */}
        <Card style={{ flex: "0 0 320px" }}>
          <p className="font-semibold mb-1" style={{ fontSize: 15, color: "#1A1A2E" }}>Deployment Coverage</p>
          <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>Active agents across all devices</p>
          <div className="flex flex-col items-center">
            <div className="relative inline-block">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={coverageData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                    paddingAngle={3} dataKey="value" labelLine={false} strokeWidth={0}>
                    {coverageData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-bold" style={{ fontSize: 22, color: "#1A1A2E", lineHeight: 1.1 }}>87.5%</span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>coverage</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: "#FF5C1A", display: "inline-block" }} />
                <span style={{ fontSize: 12, color: "#64748B" }}>macOS: 14</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: "#E2E8F0", display: "inline-block", border: "1px solid #CBD5E1" }} />
                <span style={{ fontSize: 12, color: "#64748B" }}>Windows: 10</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right — Agent Version Distribution */}
        <Card style={{ flex: 1 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold" style={{ fontSize: 15, color: "#1A1A2E" }}>Agent Version Distribution</p>
              <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Across all 24 managed devices</p>
            </div>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#FF5C1A", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
              Update all outdated →
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {versionData.map(v => (
              <div key={v.version}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#1A1A2E" }}>{v.version}</span>
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>{v.count} devices</span>
                </div>
                <div className="w-full rounded-full" style={{ height: 8, backgroundColor: "#F8FAFC" }}>
                  <div className="rounded-full" style={{ height: 8, width: `${v.pct}%`, backgroundColor: v.color, transition: "width 600ms ease" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
