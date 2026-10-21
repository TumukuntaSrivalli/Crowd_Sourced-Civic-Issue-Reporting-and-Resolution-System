# 🏙️ CivicSense: Crowdsourced Civic Issue Reporting and Resolution System

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-blue?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-cyan?logo=react)](https://react.dev/)
[![Node.js Backend](https://img.shields.io/badge/Backend-Node%20Express-green?logo=node.js)](https://nodejs.org/)
[![Power BI](https://img.shields.io/badge/Analytics-Microsoft%20Power%20BI-F2C811?logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![Render Deploy](https://img.shields.io/badge/Deploy-Render%20Blueprint-46E3B7?logo=render)](https://render.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **CivicSense** is an enterprise-grade, crowdsourced civic issue reporting, automated triage, and municipal resolution platform. It bridges citizens and local government authorities through real-time geo-tracking, OpenAI-powered hazard classification, dual Light/Dark mode UI, and **Microsoft Power BI** backend analytics.

---

## 📑 Table of Contents

- [🏛️ System Architecture](#️-system-architecture)
- [✨ Key Features](#-key-features)
- [📊 Power BI Backend & Municipal Analytics](#-power-bi-backend--municipal-analytics)
- [🌓 Dual Mode UI: Light & Dark](#-dual-mode-ui-light--dark)
- [📁 Project Folder Structure](#-project-folder-structure)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [🌐 Deployment on Render](#-deployment-on-render)
- [📡 API Reference](#-api-reference)
- [🛡️ Security & Privacy](#️-security--privacy)
- [👥 Contributing & License](#-contributing--license)

---

## 🏛️ System Architecture

```
                    ┌────────────────────────────────────────┐
                    │      Citizen & Municipal Web App       │
                    │   Next.js 16 • React 19 • Leaflet Maps │
                    │        Light / Dark Mode Toggle        │
                    └───────────────────┬────────────────────┘
                                        │
                         HTTP REST / WebSockets / Cloudinary
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           ▼                            ▼                            ▼
┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
│   Firebase Auth &  │       │  OpenAI Vision AI  │       │   Civic Backend    │
│  Firestore DB      │       │  Triage & Priority │       │   Express Service  │
│  Realtime Storage  │       │  Duplicate Filter  │       │   Port 5000 / 10000│
└────────────────────┘       └────────────────────┘       └─────────┬──────────┘
                                                                    │
                                                     REST / Push Dataset / CSV
                                                                    │
                                                                    ▼
                                                  ┌──────────────────────────────────┐
                                                  │       Microsoft Power BI         │
                                                  │   Executive Municipal Dashboards │
                                                  │    SLA Gauges • Geo Heatmaps     │
                                                  └──────────────────────────────────┘
```

---

## ✨ Key Features

### 👤 1. Citizen Experience
- **1-Click Issue Filing**: Upload photographic evidence, describe the problem, and auto-detect GPS location.
- **AI Automated Triage**: OpenAI model automatically inspects submissions to determine category, hazard severity, and AI confidence score.
- **Duplicate Detection**: AI flags redundant submissions across the same vicinity to avoid municipal clutter.
- **Real-Time Tracking**: Monitor status transitions (`Pending` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved`).

### 👮 2. Field Officer Portal
- **Direct Dispatch Queue**: View issues assigned directly to the officer's department (Roads, Sanitation, Electrical, Water).
- **Interactive Geo-Location**: Exact latitude/longitude with map routing to issue sites.
- **Status Lifecycle Control**: Mark tickets as *In Progress* or *Resolved* directly from mobile or desktop.

### 🏛️ 3. Municipal Admin Command Center
- **Live OpenStreetMap Cluster**: Visualize complaints across city wards on an interactive Leaflet map.
- **Officer Assignment**: Seamlessly assign unassigned complaints to municipal personnel.
- **Search & Multi-Filter**: Filter by category, status, severity, and search keywords.

---

## 📊 Power BI Backend & Municipal Analytics

The backend contains a dedicated **Microsoft Power BI Analytics Pipeline** enabling city councils and municipal commissioners to visualize civic trends, track SLA compliance, and monitor department performance.

### 🔗 Integration Methods

1. **Power BI Web Feed (REST API)**:
   - Endpoint: `GET /api/v1/powerbi/complaints`
   - Returns clean, normalized JSON records tailored for Power BI Web Data Connector and DirectQuery.
2. **Instant 1-Click CSV Stream**:
   - Endpoint: `GET /api/v1/powerbi/export/csv`
   - Ingest into Power BI Desktop via `Get Data` ➔ `Web` ➔ Paste URL. Supports automated scheduled refreshes.
3. **Real-Time Streaming Push Dataset**:
   - Webhook: `POST /api/v1/powerbi/push-dataset`
   - Feeds live tiles on Power BI Service dashboards as complaints are registered.

### 📐 Pre-Calculated DAX Measures

The project includes pre-built production DAX measures located in [`backend/powerbi/PowerBI_Measures_and_DAX.dax`](./backend/powerbi/PowerBI_Measures_and_DAX.dax):

| DAX Measure | Description |
|---|---|
| `[Total Complaints]` | Aggregate count of all filed complaints |
| `[Resolution Rate %]` | `DIVIDE([Total Resolved], [Total Complaints], 0) * 100` |
| `[Active Backlog]` | Count of unresolved issues (`Pending + Assigned + In Progress`) |
| `[High Severity Share %]` | Percentage of complaints posing immediate public hazard |
| `[Average Resolution Hours]` | Mean time taken from filing to resolution |
| `[SLA Compliance Rate %]` | Complaints resolved within the municipal 48-hour SLA window |
| `[Civic Hazard Index]` | Weighted priority index based on severity and score |

For step-by-step setup instructions, refer to the [Power BI Integration Guide](./backend/powerbi/POWERBI_INTEGRATION_GUIDE.md).

---

## 🌓 Dual Mode UI: Light & Dark

CivicSense provides an adaptive theme engine:
- **Dark Mode**: High-contrast, sleek slate aesthetics (`#07090e`), glowing status accents, and glassmorphism.
- **Light Mode**: Crisp, high-readability civic design with clean borders, vibrant badges, and subtle drop shadows.
- **Instant Toggle**: Click the Sun/Moon toggle in the navigation bar. Preference persists in `localStorage` across sessions.

---

## 📁 Project Folder Structure

```
Crowdsourced-Civic-Issue-Reporting-and-Resolution-System/
├── backend/                              # Express REST API & Power BI Hub
│   ├── powerbi/                          # Power BI Assets & Connectors
│   │   ├── Civic_Issue_Analytics_Schema.json  # Push dataset schema
│   │   ├── PowerBI_Measures_and_DAX.dax       # 15+ production DAX formulas
│   │   ├── powerbi_sync_service.js            # Live streaming sync script
│   │   └── POWERBI_INTEGRATION_GUIDE.md       # Integration instructions
│   ├── server.js                         # High-performance Express API
│   ├── package.json                      # Backend dependencies
│   └── .env.example                      # Backend environment template
│
├── frontend/                             # Next.js 16 Web Application
│   ├── app/                              # Next.js App Router
│   │   ├── admin/                        # Admin dashboard & analytics
│   │   │   ├── analytics/page.tsx        # Power BI Hub page
│   │   │   └── dashboard/page.tsx        # Command center & map
│   │   ├── api/                          # Serverless routes (AI, Cloudinary)
│   │   ├── complaints/                   # Citizen complaint views
│   │   │   ├── [id]/page.tsx             # Detail view
│   │   │   ├── [id]/edit/page.tsx        # Edit view
│   │   │   ├── new/page.tsx              # Submission view
│   │   │   └── page.tsx                  # My complaints listing
│   │   ├── dashboard/page.tsx            # Citizen portal
│   │   ├── login/page.tsx                # Authentication
│   │   ├── register/page.tsx             # Registration
│   │   ├── layout.tsx                    # Root layout with ThemeProvider
│   │   └── globals.css                   # Tailwind v4 theme variables
│   ├── components/                       # Reusable UI components
│   │   ├── complaint/                    # Complaint cards, forms, badges
│   │   ├── map/ComplaintMap.tsx          # Leaflet OpenStreetMap component
│   │   ├── Navbar.tsx                    # Header with role links & theme switch
│   │   └── ThemeToggle.tsx               # Sun/Moon mode switcher
│   ├── context/                          # React context providers
│   │   ├── AuthContext.tsx               # Firebase auth state
│   │   └── ThemeContext.tsx              # Light / Dark mode state
│   ├── services/                         # Firebase & REST service layers
│   ├── package.json                      # Frontend dependencies
│   └── .env.example                      # Frontend environment template
│
├── render.yaml                           # Render Blueprint Infrastructure-as-Code
├── .gitignore                            # Unified git ignore rules
└── README.md                             # Project documentation
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18+ installed
- Firebase Project created with Firestore & Authentication enabled
- Cloudinary Account (for image evidence storage)
- OpenAI API Key (optional, for automated AI triage)

### 1. Clone the Repository
```bash
git clone https://github.com/TumukuntaSrivalli/Crowd_Sourced-Civic-Issue-Reporting-and-Resolution-System.git
cd Crowd_Sourced-Civic-Issue-Reporting-and-Resolution-System
```

### 2. Configure Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```
The backend API and Power BI feeds will start on `http://localhost:5000`.

### 3. Configure Frontend
In a new terminal window:
```bash
cd frontend
npm install
cp .env.example .env.local
```
Fill in your Firebase, OpenAI, and Cloudinary keys in `.env.local`, then launch the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment on Render

This repository includes a ready-to-use [`render.yaml`](./render.yaml) blueprint specification for 1-click deployment on [Render](https://render.com).

### Deployment Steps:
1. Push your repository to GitHub.
2. Log into your **Render Dashboard** ([dashboard.render.com](https://dashboard.render.com)).
3. Click **New +** ➔ **Blueprint**.
4. Select your GitHub repository: `Crowd_Sourced-Civic-Issue-Reporting-and-Resolution-System`.
5. Render will automatically parse `render.yaml` and provision both:
   - **`civic-issue-backend`**: Web service running the Express API & Power BI feeds.
   - **`civic-issue-frontend`**: Web service running Next.js.
6. Populate the environment variables in the Render dashboard:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY` & `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_FIREBASE_*` credentials
7. Click **Apply**. Render will build and deploy both services with automatic HTTPS!

---

## 📡 API Reference

### Health & Status
- `GET /` — Backend status & service information
- `GET /health` — Liveness probe (uptime & status)

### Power BI Analytics
- `GET /api/v1/powerbi/complaints` — Formatted JSON records for Power BI Web/DirectQuery
- `GET /api/v1/powerbi/metrics` — Aggregated KPI metrics (Total, Resolved, SLA %, Hazard Index)
- `GET /api/v1/powerbi/export/csv` — CSV stream for 1-click Power BI Desktop import
- `POST /api/v1/complaints/sync` — Synchronize new complaint events to the analytics stream
- `POST /api/v1/powerbi/alert-webhook` — Inbound webhook for Power BI data-driven alert triggers

---

## 👥 Authors & Acknowledgments

- **Lead Developer**: Tumukunta Srivalli ([@TumukuntaSrivalli](https://github.com/TumukuntaSrivalli))
- **Technologies**: Next.js, React, Tailwind CSS, Firebase, Express, Microsoft Power BI, Leaflet, OpenAI.

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
