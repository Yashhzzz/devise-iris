import { Activity, Layers, AlertTriangle, ShieldOff, ArrowUpRight } from "lucide-react";

// ─── Shared card shell ────────────────────────────────────────────────────────

interface CardShellProps {
  children: React.ReactNode;
  orange?: boolean;
  onClick?: () => void;
}

function CardShell({ children, orange = false, onClick }: CardShellProps) {
  return (
    <div
      onClick={onClick}
      className="flex-1 min-w-0 relative cursor-pointer select-none"
      style={{
        backgroundColor: orange ? "#FF5C1A" : "#ffffff",
        border: `1px solid ${orange ? "#FDDCC8" : "#F0F2F5"}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        transition: "transform 200ms ease, box-shadow 200ms ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-1px)";
        el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
      }}
    >
      {children}
    </div>
  );
}

// ─── Card 1 — Total Detections (orange hero) ─────────────────────────────────

function TotalDetectionsCard({ onClick }: { onClick?: () => void }) {
  return (
    <CardShell orange onClick={onClick}>
      {/* Top-right icon */}
      <div
        className="absolute top-5 right-5 flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, backgroundColor: "rgba(255,255,255,0.25)" }}
      >
        <Activity size={16} strokeWidth={2} color="#ffffff" />
      </div>

      <p
        className="font-semibold tracking-widest uppercase"
        style={{ fontSize: 11, color: "rgba(255,255,255,0.80)", letterSpacing: "0.08em" }}
      >
        Total Detections
      </p>

      <p
        className="font-bold mt-2 leading-none"
        style={{ fontSize: 40, color: "#ffffff", fontFamily: "Inter, sans-serif" }}
      >
        247
      </p>

      <div className="flex items-center gap-1 mt-3">
        <ArrowUpRight size={14} color="rgba(255,255,255,0.80)" strokeWidth={2.5} />
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.80)" }}>
          12% vs yesterday
        </span>
      </div>
    </CardShell>
  );
}

// ─── Card 2 — Unique Tools ────────────────────────────────────────────────────

function UniqueToolsCard({ onClick }: { onClick?: () => void }) {
  return (
    <CardShell onClick={onClick}>
      {/* Top-right icon */}
      <div
        className="absolute top-5 right-5 flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, backgroundColor: "#EFF6FF" }}
      >
        <Layers size={16} strokeWidth={2} color="#3B82F6" />
      </div>

      <p
        className="font-semibold tracking-widest uppercase"
        style={{ fontSize: 11, color: "#94A3B8", letterSpacing: "0.08em" }}
      >
        Unique Tools
      </p>

      <p
        className="font-bold mt-2 leading-none"
        style={{ fontSize: 36, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}
      >
        34
      </p>

      <div className="flex items-center gap-1 mt-3">
        <ArrowUpRight size={14} color="#16A34A" strokeWidth={2.5} />
        <span style={{ fontSize: 13, color: "#16A34A" }}>
          3 new this week
        </span>
      </div>
    </CardShell>
  );
}

// ─── Card 3 — High Risk Events ────────────────────────────────────────────────

function HighRiskCard({ onClick }: { onClick?: () => void }) {
  return (
    <CardShell onClick={onClick}>
      {/* Top-right icon */}
      <div
        className="absolute top-5 right-5 flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, backgroundColor: "#FEF2F2" }}
      >
        <AlertTriangle size={16} strokeWidth={2} color="#DC2626" />
      </div>

      <p
        className="font-semibold tracking-widest uppercase"
        style={{ fontSize: 11, color: "#94A3B8", letterSpacing: "0.08em" }}
      >
        High Risk
      </p>

      <p
        className="font-bold mt-2 leading-none"
        style={{ fontSize: 36, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}
      >
        5
      </p>

      <div className="flex items-center gap-1 mt-3">
        <ArrowUpRight size={14} color="#DC2626" strokeWidth={2.5} />
        <span style={{ fontSize: 13, color: "#DC2626" }}>
          Needs review
        </span>
      </div>
    </CardShell>
  );
}

// ─── Card 4 — Unapproved Tools ────────────────────────────────────────────────

function UnapprovedCard({ onClick }: { onClick?: () => void }) {
  return (
    <CardShell onClick={onClick}>
      {/* Top-right icon */}
      <div
        className="absolute top-5 right-5 flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, backgroundColor: "#FFFBEB" }}
      >
        <ShieldOff size={16} strokeWidth={2} color="#D97706" />
      </div>

      <p
        className="font-semibold tracking-widest uppercase"
        style={{ fontSize: 11, color: "#94A3B8", letterSpacing: "0.08em" }}
      >
        Unapproved
      </p>

      <p
        className="font-bold mt-2 leading-none"
        style={{ fontSize: 36, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}
      >
        13
      </p>

      <div className="flex items-center gap-1 mt-3">
        {/* Amber dot instead of arrow */}
        <span
          className="rounded-full flex-shrink-0"
          style={{ width: 7, height: 7, backgroundColor: "#D97706" }}
        />
        <span style={{ fontSize: 13, color: "#D97706" }}>
          Not sanctioned
        </span>
      </div>
    </CardShell>
  );
}

// ─── Exported row ─────────────────────────────────────────────────────────────

interface KpiCardsProps {
  onNavigate?: (tab: string) => void;
}

export function KpiCards({ onNavigate }: KpiCardsProps) {
  return (
    <div className="flex gap-4 w-full">
      <TotalDetectionsCard onClick={() => onNavigate?.("live-feed")} />
      <UniqueToolsCard onClick={() => onNavigate?.("subscriptions")} />
      <HighRiskCard onClick={() => onNavigate?.("alerts")} />
      <UnapprovedCard onClick={() => onNavigate?.("alerts")} />
    </div>
  );
}
