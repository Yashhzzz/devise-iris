import { useState } from "react";
import { Search, SlidersHorizontal, MoreHorizontal, ChevronLeft, ChevronRight, X, Activity, AlertTriangle, User, ExternalLink } from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────

type Status = "approved" | "high-risk" | "pending";

interface Detection {
  id: string;
  orderId: string;
  activityColor: string;
  activityLabel: string;
  process: string;
  department: string;
  status: Status;
  date: string;
  checked?: boolean;
}

const rows: Detection[] = [
  {
    id: "1",
    orderId: "DEV-00247",
    activityColor: "#3B82F6",
    activityLabel: "OpenAI API",
    process: "python.exe",
    department: "Engineering",
    status: "approved",
    date: "Apr 17, 2026 03:45 PM",
  },
  {
    id: "2",
    orderId: "DEV-00246",
    activityColor: "#8B5CF6",
    activityLabel: "Anthropic API",
    process: "node.exe",
    department: "Engineering",
    status: "high-risk",
    date: "Apr 17, 2026 02:31 PM",
  },
  {
    id: "3",
    orderId: "DEV-00245",
    activityColor: "#16A34A",
    activityLabel: "GitHub Copilot",
    process: "Code.exe",
    department: "Engineering",
    status: "approved",
    date: "Apr 17, 2026 01:14 PM",
    checked: true,
  },
  {
    id: "4",
    orderId: "DEV-00244",
    activityColor: "#FF5C1A",
    activityLabel: "Runway",
    process: "chrome.exe",
    department: "Marketing",
    status: "pending",
    date: "Apr 17, 2026 12:02 PM",
  },
  {
    id: "5",
    orderId: "DEV-00243",
    activityColor: "#DC2626",
    activityLabel: "Replicate",
    process: "python.exe",
    department: "Engineering",
    status: "high-risk",
    date: "Apr 17, 2026 10:58 AM",
  },
];

// ─── Status badge ──────────────────────────────────────────────────────────

const statusConfig: Record<Status, { dot: string; label: string; text: string }> = {
  "approved":  { dot: "#16A34A", label: "Approved",  text: "#16A34A" },
  "high-risk": { dot: "#DC2626", label: "High Risk", text: "#DC2626" },
  "pending":   { dot: "#D97706", label: "Pending",   text: "#D97706" },
};

function StatusBadge({ status }: { status: Status }) {
  const { dot, label, text } = statusConfig[status];
  return (
    <div className="flex items-center gap-1.5">
      <span className="rounded-full flex-shrink-0" style={{ width: 7, height: 7, backgroundColor: dot }} />
      <span style={{ fontSize: 13, color: text, fontFamily: "Inter, sans-serif" }}>{label}</span>
    </div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────

function Checkbox({ checked, onChange }: { checked: boolean; onChange: (e: React.MouseEvent) => void }) {
  return (
    <div
      onClick={onChange}
      className="flex items-center justify-center rounded flex-shrink-0 cursor-pointer transition-colors"
      style={{
        width: 16,
        height: 16,
        border: checked ? "none" : "1.5px solid #D1D5DB",
        backgroundColor: checked ? "#FF5C1A" : "transparent",
        borderRadius: 4,
      }}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

// ─── Extended Mock Data ─────────────────────────────────────────────────────
const baseRows = rows;
const extendedRows = Array.from({ length: 45 }, (_, i) => {
  const base = baseRows[i % baseRows.length];
  return { ...base, id: `${base.id}-${i}`, orderId: `DEV-${247 - i}` };
});

export function RecentDetectionsTable() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Detection | null>(null);

  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Filter & Search Logic
  const filteredRows = extendedRows.filter(r => 
    r.activityLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.process.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredRows.length / 5) || 1;
  const currentRows = filteredRows.slice((currentPage - 1) * 5, currentPage * 5);

  const cols = ["", "ORDER ID", "ACTIVITY", "DEPARTMENT", "STATUS", "DATE", ""];

  return (
    <div
      className="flex-1 min-w-0 flex flex-col"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #F0F2F5",
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* ── Card header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4"
           style={{ borderBottom: "1px solid #F8FAFC" }}>
        <div>
          <p className="font-semibold" style={{ fontSize: 16, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>
            Recent Detections
          </p>
          <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>
            Live AI tool usage across all devices
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex items-center">
            <Search size={14} strokeWidth={2} color="#94A3B8"
              style={{ position: "absolute", left: 10, pointerEvents: "none" }} />
              <input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="outline-none text-sm transition-colors"
              style={{
                paddingLeft: 32,
                paddingRight: 12,
                paddingTop: 7,
                paddingBottom: 7,
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                fontSize: 13,
                color: "#1A1A2E",
                width: 190,
                fontFamily: "Inter, sans-serif",
              }}
              onFocus={(e) => e.target.style.backgroundColor = "#FFFFFF"}
              onBlur={(e) => {
                if(!searchQuery) e.target.style.backgroundColor = "#F8FAFC";
              }}
            />
          </div>

          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1.5 transition-colors relative"
              style={{
                padding: "7px 14px",
                backgroundColor: isFilterOpen ? "#F0F2F5" : "#F8FAFC",
                border: isFilterOpen ? "1px solid #CBD5E1" : "1px solid #E2E8F0",
                borderRadius: 10,
                fontSize: 13,
                color: isFilterOpen ? "#1A1A2E" : "#64748B",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0F2F5"; }}
              onMouseLeave={e => { 
                if(!isFilterOpen) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; 
              }}
            >
              <SlidersHorizontal size={13} strokeWidth={2} />
              Filter
            </button>
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-10 right-0 w-48 bg-white border border-[#E2E8F0] shadow-lg rounded-xl flex flex-col p-2 z-20 animate-in fade-in slide-in-from-top-2">
                  <span className="text-xs font-semibold text-[#94A3B8] uppercase px-3 py-1 mb-1">Status</span>
                  <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#F8FAFC] rounded-lg cursor-pointer text-sm">
                    <input type="checkbox" className="accent-[#FF5C1A]" /> High Risk
                  </label>
                  <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#F8FAFC] rounded-lg cursor-pointer text-sm">
                    <input type="checkbox" className="accent-[#FF5C1A]" /> Approved
                  </label>
                  <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#F8FAFC] rounded-lg cursor-pointer text-sm mb-1 border-b border-[#F0F2F5] pb-2">
                    <input type="checkbox" className="accent-[#FF5C1A]" /> Pending
                  </label>
                  <button className="text-[13px] text-[#FF5C1A] text-left px-3 py-1.5 hover:bg-[#FFF3EE] rounded-lg mt-1 font-medium transition-colors">
                    Clear filters
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          {/* Header */}
          <thead>
            <tr style={{ backgroundColor: "#F8FAFC" }}>
              {cols.map((col, i) => (
                <th
                  key={i}
                  className="text-left font-semibold tracking-widest"
                  style={{
                    padding: i === 0 ? "10px 0 10px 20px" : i === cols.length - 1 ? "10px 20px 10px 12px" : "10px 12px",
                    fontSize: 11,
                    color: "#94A3B8",
                    letterSpacing: "0.07em",
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="animate-in fade-in duration-300" key={currentPage}>
            {currentRows.map((row, idx) => {
              const isChecked = checkedIds.has(row.id);
              const isLast = idx === currentRows.length - 1;
              return (
                <tr
                  key={row.id}
                  onClick={() => setSelectedEvent(row)}
                  className="cursor-pointer transition-colors"
                  style={{
                    backgroundColor: isChecked ? "#FFF8F5" : "transparent",
                    borderBottom: isLast ? "none" : "1px solid #F8FAFC",
                    minHeight: 56,
                    transition: "background-color 150ms ease",
                  }}
                  onMouseEnter={e => {
                    if (!isChecked)
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#FAFAFA";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                      isChecked ? "#FFF8F5" : "transparent";
                  }}
                >
                  {/* Checkbox */}
                  <td style={{ padding: "14px 0 14px 20px", width: 36 }}>
                    <Checkbox checked={isChecked} onChange={(e) => toggle(row.id, e as any)} />
                  </td>

                  {/* Order ID */}
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{ fontSize: 13, color: "#94A3B8", fontFamily: "monospace" }}>
                      {row.orderId}
                    </span>
                  </td>

                  {/* Activity */}
                  <td style={{ padding: "14px 12px" }}>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="rounded-lg flex-shrink-0"
                        style={{ width: 30, height: 30, backgroundColor: row.activityColor + "18" }}
                      >
                        <svg width="30" height="30" viewBox="0 0 30 30">
                          <circle cx="15" cy="15" r="5" fill={row.activityColor} />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold" style={{ fontSize: 14, color: "#1A1A2E", lineHeight: 1.3 }}>
                          {row.activityLabel}
                        </p>
                        <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.3 }}>
                          {row.process}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{ fontSize: 14, color: "#1A1A2E" }}>{row.department}</span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 12px" }}>
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Date */}
                  <td style={{ padding: "14px 12px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 13, color: "#94A3B8" }}>{row.date}</span>
                  </td>

                  {/* Menu */}
                  <td style={{ padding: "14px 20px 14px 12px" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); /* Open Action Menu Context */ }}
                      className="flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: "#C0C8D4", backgroundColor: "transparent", width: 28, height: 28 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#1A1A2E"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#C0C8D4"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                    >
                      <MoreHorizontal size={15} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid #F8FAFC" }}
      >
        <span style={{ fontSize: 13, color: "#94A3B8" }}>
          Showing {currentRows.length > 0 ? (currentPage - 1) * 5 + 1 : 0} of {filteredRows.length} events
        </span>

        <div className="flex items-center gap-1">
          {/* Prev */}
          <button
            className="flex items-center gap-1 font-medium transition-colors"
            style={{ fontSize: 13, color: "#64748B", padding: "5px 10px", borderRadius: 8,
              border: "1px solid #E2E8F0", backgroundColor: "transparent", cursor: "pointer" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <ChevronLeft size={13} strokeWidth={2} /> Prev
          </button>

          {/* Pages */}
          {[1, 2, 3].map(p => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className="font-medium transition-colors"
              style={{
                width: 30, height: 30,
                borderRadius: 8,
                fontSize: 13,
                border: p === currentPage ? "1px solid #FF5C1A" : "1px solid #E2E8F0",
                backgroundColor: p === currentPage ? "#FFF3EE" : "transparent",
                color: p === currentPage ? "#FF5C1A" : "#64748B",
                cursor: "pointer",
              }}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            className="flex items-center gap-1 font-medium transition-colors"
            style={{ fontSize: 13, color: currentPage >= totalPages ? "#CBD5E1" : "#64748B", padding: "5px 10px", borderRadius: 8,
              border: "1px solid #E2E8F0", backgroundColor: "transparent", cursor: currentPage >= totalPages ? "not-allowed" : "pointer" }}
            onMouseEnter={e => { if(currentPage < totalPages) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F8FAFC"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            Next <ChevronRight size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
      
      <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}

// ─── EVENT DETAIL PANEL ───────────────────────────────────────────────────

function EventDetailPanel({ event, onClose }: { event: Detection | null; onClose: () => void }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-[440px] bg-white border-l border-[#F0F2F5] shadow-[0_0_64px_rgba(0,0,0,0.1)] animate-in slide-in-from-right duration-300 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F0F2F5]">
          <h2 className="text-lg font-bold text-[#1A1A2E] flex items-center gap-2">
            Event Context
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F0F2F5] text-[#64748B]">
              {event.orderId}
            </span>
          </h2>
          <button onClick={onClose} className="p-2 text-[#94A3B8] hover:bg-[#F0F2F5] hover:text-[#1A1A2E] rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Banner */}
        <div className="p-6 bg-[#FAFAFA] border-b border-[#F0F2F5] flex flex-col items-center gap-4 text-center">
          <div 
            className="w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm"
            style={{ backgroundColor: event.activityColor + "15" }}
          >
            <Activity size={32} color={event.activityColor} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1A1A2E] leading-tight mb-1">{event.activityLabel}</h3>
            <p className="text-[13px] text-[#64748B] flex justify-center items-center gap-2">
              <span className="font-mono bg-[#F0F2F5] px-1.5 py-0.5 rounded">{event.process}</span>
            </p>
          </div>
          <div className="mt-2 text-sm justify-center flex items-center">
             <StatusBadge status={event.status} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <section>
            <h4 className="text-[12px] font-bold text-[#94A3B8] tracking-widest uppercase mb-3">Event Details</h4>
            <div className="flex flex-col gap-0 border border-[#F0F2F5] rounded-xl overflow-hidden bg-white">
              <div className="flex justify-between items-center p-3 border-b border-[#F0F2F5]">
                <span className="text-[#64748B] text-[13px]">Time Detected</span>
                <span className="text-[#1A1A2E] text-[13px] font-medium">{event.date}</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-[#F0F2F5]">
                <span className="text-[#64748B] text-[13px]">Duration</span>
                <span className="text-[#1A1A2E] text-[13px] font-medium">4m 12s active window</span>
              </div>
              <div className="flex justify-between items-center p-3">
                <span className="text-[#64748B] text-[13px]">Data Volume</span>
                <span className="text-[#1A1A2E] text-[13px] font-medium">1.4 MB Sent / 800 KB Received</span>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-[12px] font-bold text-[#94A3B8] tracking-widest uppercase mb-3">User Context</h4>
            <div className="flex items-center gap-3 p-4 bg-white border border-[#F0F2F5] rounded-xl cursor-pointer hover:border-[#CBD5E1] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#FF5C1A] flex items-center justify-center text-white font-bold text-sm">
                JS
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1A1A2E] text-sm">John Smith</p>
                <p className="text-[#64748B] text-xs">john.smith@devise.ai</p>
              </div>
              <div className="text-right">
                <span className="text-[#1A1A2E] text-sm font-semibold">{event.department}</span>
                <ExternalLink size={14} className="text-[#94A3B8] inline ml-2 mb-0.5" />
              </div>
            </div>
          </section>

          {event.status === "high-risk" && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 flex gap-3 text-left">
              <AlertTriangle size={18} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-[#DC2626] text-[14px] mb-1">Policy Violation Detected</p>
                <p className="text-[13px] text-[#DC2626] opacity-90 leading-relaxed">
                  Usage of {event.activityLabel} is explicitly restricted for the {event.department} department. This incident has been escalated.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-[#F0F2F5] flex gap-3 bg-white">
          <button className="flex-1 px-4 py-2.5 bg-white border border-[#E2E8F0] shadow-sm text-[13px] font-semibold text-[#1A1A2E] rounded-xl hover:bg-[#F8FAFC] transition-colors">
            Force Kill App
          </button>
          <button className="flex-1 px-4 py-2.5 bg-[#FF5C1A] text-white text-[13px] font-semibold rounded-xl hover:bg-[#E65318] active:scale-[0.98] transition-all shadow-sm">
            Resolve Incident
          </button>
        </div>
      </div>
    </div>
  );
}
