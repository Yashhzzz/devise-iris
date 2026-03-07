# Devise AI Detection Hub — UI Documentation

## Overview

**Project:** AI Detection Hub Dashboard  
**Frontend:** React + Vite + shadcn-ui + Tailwind CSS  
**Backend:** FastAPI (Python) on port 8080  
**Frontend Dev Server:** Port 8081  
**Database:** SQLite (`devise_dashboard.db`)

---

## Pages

### 1. Live Feed (`/live-feed`)

**Purpose:** Real-time view of all AI tool detection events with filtering.

**Stats Cards:**
| Card | Data Source | Description |
|------|-------------|-------------|
| Total Detections | `stats.totalDetections` | Total AI tool detections (last 24h) |
| Unique Tools | `stats.uniqueTools` | Number of distinct AI tools detected |
| High Risk | `stats.highRiskCount` | Count of high-risk detections |
| Unapproved | `stats.unapprovedCount` | Count of unapproved tool usage |

**Filters:**
- Category dropdown: `chat`, `coding`, `api`, `image`, `audio`, `video`, `search`, `productivity`
- Risk Level dropdown: `low`, `medium`, `high`

**Table Columns (LiveFeedTable):**
| Column | Field | Description |
|--------|-------|-------------|
| Time | `timestamp` | When the detection occurred (relative time) |
| Tool | `tool_name` + `vendor` | AI tool name and vendor |
| Category | `category` | Tool category (badge) |
| Risk | `risk_level` | Risk level (low/medium/high badge) |
| Process | `process_name` | Process that triggered detection |
| Domain | `domain` | Domain/URL accessed |
| User | `user_id` | User who triggered detection |
| Approved | `is_approved` | Whether tool is sanctioned (checkmark/X) |

**API Endpoint:** `GET /api/events?category={}&risk_level={}&limit=200&offset=0`  
**Refresh Rate:** Every 5 seconds

---

### 2. Analytics (`/analytics`)

**Purpose:** Visual analytics and trends of AI tool usage.

**Stats Cards:** Same as Live Feed (4 cards)

**Charts (AnalyticsCharts):**

| Chart | Type | Data Source | Description |
|-------|------|-------------|-------------|
| Detections by Tool | Horizontal Bar | `analytics.byTool` | Top 8 AI tools by usage count |
| By Category | Pie | `analytics.byCategory` | Distribution of detections by category |
| Detections Over Time | Line | `analytics.overTime` | Hourly detection count (last 24h) |
| Top Processes | Bar | `analytics.topProcesses` | Top 10 processes generating detections |

**API Endpoint:** `GET /api/analytics`  
**Refresh Rate:** Every 30 seconds

---

### 3. Devices (`/devices`)

**Purpose:** Monitor all devices running the agent.

**Stats Cards:**
| Card | Data Source | Description |
|------|-------------|-------------|
| Total Devices | `stats.totalDevices` | Total devices reporting |
| Online | `stats.onlineDevices` | Devices with heartbeat in last 6 min |
| Offline | `totalDevices - onlineDevices` | Devices not reporting |
| Active Alerts | `stats.activeAlerts` | Total active alerts across devices |

**Table Columns (DevicesTable):**
| Column | Field | Description |
|--------|-------|-------------|
| Device ID | `device_id` | Unique device identifier (truncated) |
| OS | `os_version` | Operating system version |
| Agent | `agent_version` | Agent version installed |
| Last Heartbeat | `timestamp` | Time since last heartbeat |
| Status | computed | Online (green) if <6min, else Offline |
| Queue | `queue_depth` | Events queued for processing |
| Tamper | from alerts | Alert badge if tamper detected |

**API Endpoints:**
- `GET /api/heartbeats` — Device heartbeat data
- `GET /api/alerts` — For tamper detection
- `GET /api/stats` — For counts

**Refresh Rate:** Every 15 seconds (heartbeats), 15 seconds (alerts)

---

### 4. Alerts (`/alerts`)

**Purpose:** View all security and policy alerts.

**Stats Cards:**
| Card | Data Source | Description |
|------|-------------|-------------|
| Active Alerts | `stats.activeAlerts` | Total active alerts |
| Tamper Alerts | filtered from alerts | Count of tamper alerts |
| Agent Gaps | filtered from alerts | Count of agent gap alerts |
| High Risk Unapproved | `stats.highRiskCount` | High-risk unapproved tools |

**Alert List (AlertsList):**
Each alert card displays:
- **Icon:** Type-specific icon (AlertTriangle, Shield, Clock, Zap)
- **Title:** Alert title
- **Description:** Details about the alert
- **Timestamp:** When alert was triggered
- **Severity Badge:** Low (green), Medium (amber), High (red)
- **Action:** Dismiss button (UI only, not functional)

**Alert Types:**
| Type | Trigger | Severity |
|------|---------|----------|
| `high_risk` | High-risk tool used without approval | High |
| `unapproved` | Non-approved tool used | Medium |
| `tamper` | Agent binary hash mismatch | High |
| `agent_gap` | Device offline for extended period | High |
| `high_frequency` | Excessive connections to tool | Medium |

**API Endpoint:** `GET /api/alerts`  
**Refresh Rate:** Every 15 seconds

---

## API Endpoints Summary

### Query Endpoints (Dashboard → Backend)

| Endpoint | Returns | Used By |
|----------|---------|---------|
| `GET /api/events?category=&risk_level=&limit=200&offset=0` | `{ total, events: [...] }` | LiveFeed |
| `GET /api/heartbeats` | `[...]` | Devices |
| `GET /api/stats` | `{ totalDetections, uniqueTools, highRiskCount, unapprovedCount, onlineDevices, totalDevices, activeAlerts }` | All pages |
| `GET /api/alerts` | `[...]` | Devices, Alerts |
| `GET /api/analytics` | `{ byTool, byCategory, overTime, topProcesses }` | Analytics |

### Ingest Endpoints (Agent → Backend)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /api/event` | 202 Accepted | Receive detection events, heartbeats, agent gaps |
| `POST /api/tamper-alert` | 202 Accepted | Receive tamper alerts |

---

## Data Models

### DetectionEvent
```typescript
interface DetectionEvent {
  event_id: string;
  user_id: string;
  user_email: string;
  department: string;
  device_id: string;
  tool_name: string;
  domain: string;
  category: "chat" | "coding" | "api" | "image" | "audio" | "video" | "search" | "productivity";
  vendor: string;
  risk_level: "low" | "medium" | "high";
  source: string;
  process_name: string;
  process_path: string;
  is_approved: boolean;
  timestamp: string;
  connection_frequency?: number;
  high_frequency?: boolean;
  bytes_read?: number;
  bytes_write?: number;
}
```

### HeartbeatEvent
```typescript
interface HeartbeatEvent {
  event_type: "heartbeat";
  device_id: string;
  agent_version: string;
  queue_depth: number;
  last_detection_time: string | null;
  os_version: string;
  restart_detected: boolean;
  timestamp: string;
}
```

### AlertItem
```typescript
interface AlertItem {
  id: string;
  type: "high_risk" | "unapproved" | "tamper" | "agent_gap" | "high_frequency";
  title: string;
  description: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}
```

---

## Supported AI Tools (Registry)

The dashboard recognizes 70+ AI tools across 8 categories:

| Category | Tools |
|----------|-------|
| **Chat** | ChatGPT, Claude, Gemini, Meta AI, Poe, Character.AI, DeepSeek, etc. |
| **Coding** | GitHub Copilot, Microsoft Copilot, Cursor, Codeium, Tabnine, Lovable, Bolt, v0, Replit AI |
| **API** | OpenAI API, Anthropic API, Google AI API, AWS Bedrock, Azure OpenAI, Hugging Face, etc. |
| **Image** | Midjourney, DALL-E, Stability AI, Leonardo AI, Ideogram |
| **Audio** | ElevenLabs, Whisper API, Suno AI, Udio, Descript |
| **Video** | Runway, Synthesia |
| **Search** | Perplexity, You.com, Phind |
| **Productivity** | Notion AI, Grammarly, Jasper, Copy.ai, Writesonic |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite |
| UI Components | shadcn-ui |
| Styling | Tailwind CSS |
| Data Fetching | TanStack React Query v5 |
| Charts | Recharts |
| Icons | Lucide React |
| Date Formatting | date-fns |
| Backend | FastAPI (Python) |
| Database | SQLite |
| Agent Communication | HTTP REST |

---

## File Structure

```
devise-dashboard/
├── src/
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # Entry point
│   ├── services/
│   │   └── api.ts                 # API fetch functions
│   ├── hooks/
│   │   └── useDashboard.ts       # React Query hooks
│   ├── pages/
│   │   ├── LiveFeed.tsx           # Live feed page
│   │   ├── Analytics.tsx         # Analytics page
│   │   ├── Devices.tsx           # Devices page
│   │   ├── Alerts.tsx            # Alerts page
│   │   └── Index.tsx             # Overview/redirect
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   └── dashboard/
│   │       ├── StatsCard.tsx
│   │       ├── LiveFeedTable.tsx
│   │       ├── AnalyticsCharts.tsx
│   │       ├── DevicesTable.tsx
│   │       ├── AlertsList.tsx
│   │       ├── RiskBadge.tsx
│   │       └── CategoryBadge.tsx
│   ├── data/
│   │   └── mockData.ts           # Type definitions (kept for interfaces)
│   └── lib/
│       └── aiToolsRegistry.ts    # AI tool registry
└── package.json
```

---

## Running the Application

**Backend (Terminal 1):**
```bash
cd D:\Oximy\backend
python -c "import uvicorn; uvicorn.run('server:app', host='0.0.0.0', port=8080, reload=True)"
```

**Frontend (Terminal 2):**
```bash
cd D:\Oximy\Oximyai-detection-hub
npm run dev
```

Access: `http://localhost:8081`
