import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { month: "Jan", detections: 38, violations: 14 },
  { month: "Feb", detections: 52, violations: 20 },
  { month: "Mar", detections: 45, violations: 16 },
  { month: "Apr", detections: 70, violations: 28 },
  { month: "May", detections: 61, violations: 22 },
  { month: "Jun", detections: 83, violations: 34 },
  { month: "Jul", detections: 74, violations: 30 },
  { month: "Aug", detections: 95, violations: 38 },
];

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: "#1A1A2E",
        borderRadius: 10,
        padding: "8px 14px",
        fontSize: 12,
        color: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.name === "detections" ? "#FF5C1A" : "#94A3B8" }}>
          {p.name === "detections" ? "Detections" : "Violations"}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function UsageTrendChart() {
  return (
    <div
      className="flex-1 min-w-0 flex flex-col"
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #F0F2F5",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p
            className="font-semibold"
            style={{ fontSize: 16, color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}
          >
            AI Usage Trend
          </p>
          <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>
            Detection volume over last 8 weeks
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="rounded-full"
              style={{ width: 9, height: 9, backgroundColor: "#FF5C1A", display: "inline-block" }}
            />
            <span style={{ fontSize: 12, color: "#64748B" }}>Detections</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="rounded-full"
              style={{ width: 9, height: 9, backgroundColor: "#1A1A2E", display: "inline-block" }}
            />
            <span style={{ fontSize: 12, color: "#64748B" }}>Violations</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            barCategoryGap="28%"
            barGap={4}
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          >
            <defs>
              {/* Diagonal hatch pattern for violations bars */}
              <pattern
                id="hatch"
                patternUnits="userSpaceOnUse"
                width="5"
                height="5"
                patternTransform="rotate(45)"
              >
                <rect width="5" height="5" fill="#1A1A2E" />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeOpacity="0.18"
                />
              </pattern>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94A3B8", fontFamily: "Inter, sans-serif" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#CBD5E1", fontFamily: "Inter, sans-serif" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.03)", radius: 4 }}
            />

            {/* Detections — solid orange */}
            <Bar
              dataKey="detections"
              radius={[5, 5, 0, 0]}
              fill="#FF5C1A"
              maxBarSize={22}
            />

            {/* Violations — hatched dark */}
            <Bar
              dataKey="violations"
              radius={[5, 5, 0, 0]}
              maxBarSize={22}
            >
              {data.map((_, i) => (
                <Cell key={i} fill="url(#hatch)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
