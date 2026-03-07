import { Plus, AlertTriangle } from "lucide-react";

interface Sub {
  id: number;
  name: string;
  vendor: string;
  seats: number;
  active: number;
  util: number;
  cost: string;
  status: "Active" | "Zombie" | "Expiring soon";
  cycle: string;
  renewal: string;
  bg: string;
}

const subscriptions: Sub[] = [
  { id: 1, name: "ChatGPT Teams", vendor: "OpenAI", seats: 40, active: 28, util: 70, cost: "₹42,000/mo", status: "Active", cycle: "Annual contract", renewal: "Renews Jan 2027", bg: "#10A37F" },
  { id: 2, name: "GitHub Copilot", vendor: "Microsoft", seats: 50, active: 34, util: 68, cost: "₹51,000/mo", status: "Active", cycle: "Annual contract", renewal: "Renews Jan 2027", bg: "#181717" },
  { id: 3, name: "Midjourney", vendor: "Midjourney Inc.", seats: 20, active: 8, util: 40, cost: "₹16,000/mo", status: "Zombie", cycle: "Monthly", renewal: "Renews next month", bg: "#FF5C1A" },
  { id: 4, name: "Claude Pro", vendor: "Anthropic", seats: 15, active: 12, util: 80, cost: "₹18,000/mo", status: "Active", cycle: "Monthly", renewal: "Renews next month", bg: "#D97706" },
  { id: 5, name: "Perplexity Pro", vendor: "Perplexity AI", seats: 25, active: 6, util: 24, cost: "₹8,000/mo", status: "Zombie", cycle: "Monthly", renewal: "Renews next month", bg: "#0F172A" },
  { id: 6, name: "Notion AI", vendor: "Notion Labs", seats: 30, active: 28, util: 93, cost: "₹9,000/mo", status: "Active", cycle: "Annual contract", renewal: "Renews Jan 2027", bg: "#000000" },
  { id: 7, name: "Runway Gen-3", vendor: "Runway", seats: 10, active: 2, util: 20, cost: "₹12,000/mo", status: "Zombie", cycle: "Annual contract", renewal: "Renews Jan 2027", bg: "#8B5CF6" },
  { id: 8, name: "Cursor Pro", vendor: "Anysphere", seats: 20, active: 19, util: 95, cost: "₹14,000/mo", status: "Active", cycle: "Monthly", renewal: "Renews next month", bg: "#3B82F6" },
  { id: 9, name: "Jasper AI", vendor: "Jasper", seats: 15, active: 3, util: 20, cost: "₹11,000/mo", status: "Zombie", cycle: "Annual contract", renewal: "Renews Jan 2027", bg: "#EC4899" },
  { id: 10, name: "Grammarly Business", vendor: "Grammarly", seats: 40, active: 35, util: 87, cost: "₹7,000/mo", status: "Active", cycle: "Annual contract", renewal: "Renews Jan 2027", bg: "#10B981" },
  { id: 11, name: "Replicate", vendor: "Replicate", seats: 5, active: 1, util: 20, cost: "₹6,000/mo", status: "Zombie", cycle: "Monthly", renewal: "Renews next month", bg: "#000000" },
  { id: 12, name: "Gemini Advanced", vendor: "Google", seats: 20, active: 17, util: 85, cost: "₹8,000/mo", status: "Active", cycle: "Annual contract", renewal: "Renews Jan 2027", bg: "#4285F4" },
];

export function SubscriptionsTab() {
  const CardInfo = ({ title, value, sub }: { title: string; value: string; sub: React.ReactNode }) => (
    <div
      className="flex-1 flex flex-col justify-center"
      style={{
        backgroundColor: title === "MONTHLY SPEND" ? "#FF5C1A" : "#ffffff",
        borderRadius: 20,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: title === "MONTHLY SPEND" ? "none" : "1px solid #F0F2F5",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: title === "MONTHLY SPEND" ? "rgba(255,255,255,0.9)" : "#94A3B8",
          letterSpacing: "0.5px",
          fontFamily: "Inter, sans-serif",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
      <span
        className="mt-2"
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: title === "MONTHLY SPEND" ? "#ffffff" : "#1A1A2E",
          fontFamily: "Inter, sans-serif",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <div
        className="mt-3 flex items-center gap-1.5"
        style={{
          fontSize: 13,
          color: title === "MONTHLY SPEND" ? "rgba(255,255,255,0.8)" : "#64748B",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {sub}
      </div>
    </div>
  );

  const getBarColor = (util: number) => {
    if (util > 70) return "#16A34A";
    if (util >= 40) return "#D97706";
    return "#DC2626";
  };

  const getActiveUsersColor = (util: number) => {
    if (util > 70) return "#16A34A";
    if (util < 40) return "#DC2626";
    return "#1A1A2E";
  };

  const getStatusBadge = (status: Sub["status"]) => {
    switch (status) {
      case "Active":
        return { bg: "#ECFDF5", text: "#10B981" };
      case "Zombie":
        return { bg: "#FEF2F2", text: "#DC2626" };
      case "Expiring soon":
        return { bg: "#FFFBEB", text: "#D97706" };
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1A2E",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Subscriptions
          </h1>
          <p
            className="mt-1"
            style={{ fontSize: 14, color: "#94A3B8", fontFamily: "Inter, sans-serif" }}
          >
            Manage all AI tool licenses and spending
          </p>
        </div>
        <button
          className="flex items-center gap-2 hover:-translate-y-[1px] transition-all duration-200"
          style={{
            backgroundColor: "#FF5C1A",
            color: "#ffffff",
            padding: "8px 16px",
            borderRadius: 12,
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: 14,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E5521A")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF5C1A")}
        >
          <Plus size={16} strokeWidth={2} />
          Add Subscription
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4">
        <CardInfo title="MONTHLY SPEND" value="₹1,49,000" sub={<>↑ 8% vs last month</>} />
        <CardInfo
          title="TOTAL TOOLS"
          value="12"
          sub={
            <>
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              Active subscriptions
            </>
          }
        />
        <CardInfo
          title="WASTED SPEND"
          value="₹48,000"
          sub={
            <>
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              6 zombie licenses
            </>
          }
        />
      </div>

      {/* Zombie Alert Banner */}
      <div
        className="flex items-center justify-between"
        style={{
          backgroundColor: "#FFF3EE",
          border: "1px solid #FDDCC8",
          borderRadius: 16,
          padding: "16px 20px",
        }}
      >
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} color="#FF5C1A" strokeWidth={2} />
          <span
            style={{
              color: "#1A1A2E",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <span style={{ fontWeight: 700 }}>6 zombie licenses detected</span> — potential savings of ₹48,000/month
          </span>
        </div>
        <button
          style={{
            color: "#FF5C1A",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Review Now &rarr;
        </button>
      </div>

      {/* Grid of Subscriptions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        {subscriptions.map((sub) => {
          const badge = getStatusBadge(sub.status);
          return (
            <div
              key={sub.id}
              className="flex items-center transition-all duration-200 cursor-pointer hover:-translate-y-[1px]"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #F0F2F5",
                borderRadius: 20,
                padding: "20px 24px",
                gap: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
              }}
            >
              {/* Left Column (Icon + Name) */}
              <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                <div
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: sub.bg,
                    color: "#ffffff",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  {sub.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: 16,
                      color: "#1A1A2E",
                      lineHeight: 1.2,
                    }}
                  >
                    {sub.name}
                  </span>
                  <span
                    className="mt-1"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      color: "#94A3B8",
                      lineHeight: 1.2,
                    }}
                  >
                    {sub.vendor}
                  </span>
                </div>
              </div>

              {/* Middle Section (3 Cols) */}
              <div className="flex items-start flex-1" style={{ gap: 24 }}>
                <div className="flex flex-col gap-1 w-[80px]">
                  <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
                    Seats Paid
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>
                    {sub.seats}
                  </span>
                </div>
                <div className="flex flex-col gap-1 w-[80px]">
                  <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
                    Active Users
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: getActiveUsersColor(sub.util), fontFamily: "Inter, sans-serif" }}>
                    {sub.active}
                  </span>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
                      Utilization
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>
                      {sub.util}%
                    </span>
                  </div>
                  {/* Utilization Bar */}
                  <div
                    className="mt-1.5 w-full overflow-hidden"
                    style={{ height: 6, backgroundColor: "#F0F2F5", borderRadius: 999 }}
                  >
                    <div
                      style={{
                        width: `${sub.util}%`,
                        height: "100%",
                        backgroundColor: getBarColor(sub.util),
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (Cost + Badges) */}
              <div className="flex flex-col items-end text-right justify-center" style={{ minWidth: 140 }}>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    style={{
                      backgroundColor: badge.bg,
                      color: badge.text,
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {sub.status}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#1A1A2E",
                    lineHeight: 1.2,
                  }}
                >
                  {sub.cost}
                </span>
                <span
                  className="mt-0.5"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: "#94A3B8",
                  }}
                >
                  {sub.cycle}
                </span>
                <span
                  className="mt-0.5"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    color: "#94A3B8",
                  }}
                >
                  {sub.renewal}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
