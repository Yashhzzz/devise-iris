# Devise Dashboard

AI Tool Monitoring & Detection Platform

## Overview

Devise is an AI tool monitoring platform that helps organizations track, control, and secure AI tool usage across their workforce. It detects when employees use AI tools (ChatGPT, Claude, Copilot, etc.), categorizes them by risk level, and provides real-time visibility into AI adoption.

## Features

- **Real-time Detection** — Monitor AI tool usage as it happens
- **Risk Assessment** — Automatically categorize tools by risk level (low/medium/high)
- **Approval Workflow** — Track which tools are approved vs unapproved
- **Device Monitoring** — See which machines are running the agent
- **Alerting** — Get notified of security concerns (tampering, gaps, high-risk usage)
- **Analytics** — Visualize AI adoption trends across your organization

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| UI | shadcn-ui + Tailwind CSS |
| Charts | Recharts |
| Data Fetching | TanStack React Query |
| Backend | FastAPI (Python) |
| Database | SQLite (demo) / PostgreSQL (production) |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn

### Installation

```bash
# Install frontend dependencies
cd devise-dashboard
npm install

# Start frontend dev server
npm run dev
```

### Running the Backend

```bash
# Navigate to backend
cd ../backend

# Install Python dependencies
pip install fastapi uvicorn

# Start backend server
python -c "import uvicorn; uvicorn.run('server:app', host='0.0.0.0', port=8080, reload=True)"
```

### Access

- Frontend: http://localhost:8081
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/docs

## Project Structure

```
devise-dashboard/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service layer
│   ├── data/            # Type definitions
│   └── lib/             # Utilities and registry
├── public/              # Static assets
└── package.json

backend/
├── server.py            # FastAPI application
└── devise_dashboard.db  # SQLite database
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/event` | POST | Ingest detection events |
| `/api/events` | GET | Query detection events |
| `/api/heartbeats` | GET | Get device heartbeats |
| `/api/stats` | GET | Get aggregated stats |
| `/api/alerts` | GET | Get all alerts |
| `/api/analytics` | GET | Get analytics data |

## License

MIT
