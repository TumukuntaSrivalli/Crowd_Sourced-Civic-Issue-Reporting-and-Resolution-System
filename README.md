# 🏙️ CivicSense: Crowdsourced Civic Issue Reporting and Resolution System

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-blue?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-cyan?logo=react)](https://react.dev/)
[![Firebase Backend](https://img.shields.io/badge/Backend-Firebase%20Cloud%20Firestore-orange?logo=firebase)](https://firebase.google.com/)
[![Node.js Express](https://img.shields.io/badge/API-Node%20Express-green?logo=node.js)](https://nodejs.org/)
[![Render Deploy](https://img.shields.io/badge/Deploy-Render%20Blueprint-46E3B7?logo=render)](https://render.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **CivicSense** is an intelligent, crowdsourced civic issue reporting, automated triage, and municipal resolution platform. It bridges citizens and local government authorities through real-time geo-tracking, OpenAI-powered hazard classification, dual Light/Dark mode UI, and a real-time **Firebase Cloud Firestore** backend.

---

## 📑 Table of Contents

- [🏛️ System Architecture](#️-system-architecture)
- [✨ Key Features](#-key-features)
- [🔥 Firebase Backend & Cloud Architecture](#-firebase-backend--cloud-architecture)
- [🌓 Dual Mode UI: Light & Dark](#-dual-mode-ui-light--dark)
- [📁 Project Folder Structure](#-project-folder-structure)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [📡 API Reference](#-api-reference)
- [🛡️ Security & Role Guards](#️-security--role-guards)
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
│   Firebase Auth    │       │  OpenAI Vision AI  │       │   Civic Backend    │
│  User Roles & JWT  │       │  Triage & Priority │       │   Express Service  │
│  State Management  │       │  Duplicate Filter  │       │   Admin SDK Port   │
└──────────┬─────────┘       └────────────────────┘       └─────────┬──────────┘
           │                                                        │
           └────────────────────────────┬───────────────────────────┘
                                        ▼
                        ┌────────────────────────────────┐
                        │     Firebase Cloud Firestore   │
                        │   Collections: complaints,     │
                        │   users, notifications         │
                        └────────────────────────────────┘
```

---

## ✨ Key Features

### 👤 1. Citizen Experience
- **1-Click Issue Filing**: Upload photographic evidence, describe the problem, and auto-detect GPS location.
- **AI Automated Triage**: OpenAI inspects submissions to automatically evaluate category, hazard severity, and confidence score.
- **Duplicate Detection**: AI flags redundant submissions across the same vicinity to reduce municipal backlog.
- **Real-Time Tracking**: Monitor status transitions in real time (`Pending` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved`).

### 👮 2. Field Officer Portal
- **Direct Dispatch Queue**: View issues assigned directly to the officer's department (Roads, Sanitation, Electrical, Water).
- **Interactive Geo-Location**: Exact latitude/longitude with map routing to issue sites.
- **Status Lifecycle Control**: Mark tickets as *In Progress* or *Resolved* directly from mobile or desktop.

### 🏛️ 3. Municipal Admin Command Center
- **Live OpenStreetMap Cluster**: Visualize complaints across city wards on an interactive Leaflet map.
- **Officer Assignment**: Seamlessly assign unassigned complaints to municipal personnel with automatic notifications.
- **Search & Multi-Filter**: Filter by category, status, severity, and search keywords.

---

## 🔥 Firebase Backend & Cloud Architecture

The backend is built around **Firebase Cloud Firestore** and **Firebase Authentication**:

### 📦 Firestore Data Schema

#### 1. `complaints` Collection
```typescript
interface Complaint {
  id: string;
  title: string;
  description: string;
  category: "Road Damage" | "Garbage" | "Streetlight" | "Water Leakage" | "Drainage" | "Traffic Signal" | "Other";
  severity: "Low" | "Medium" | "High";
  status: "Pending" | "Assigned" | "In Progress" | "Resolved" | "Rejected";
  imageUrl?: string;
  userId: string;
  assignedTo?: string;
  department?: string;
  priorityScore?: number;
  isDuplicate?: boolean;
  location: {
    latitude: number;
    longitude: number;
    area?: string;
  };
  aiCategory?: string;
  aiSeverity?: string;
  aiConfidence?: number;
  aiSummary?: string;
  createdAt: any;
  updatedAt?: any;
}
```

#### 2. `users` Collection
```typescript
interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: "citizen" | "officer" | "admin";
  department?: string;
  createdAt?: any;
}
```

#### 3. `notifications` Collection
```typescript
interface Notification {
  id: string;
  userId: string; // Target officer or citizen
  complaintId: string;
  message: string;
  read: boolean;
  createdAt: any;
}
```

### ⚡ Firebase Admin SDK Backend
The `backend/server.js` service leverages `firebase-admin` to provide verified server-side endpoints, aggregate analytics across wards, and manage officer dispatch with high concurrency.

---

## 🌓 Dual Mode UI: Light & Dark

CivicSense includes a responsive theme engine:
- **Dark Mode**: High-contrast, sleek slate aesthetics (`#07090e`), glowing status accents, and glassmorphism.
- **Light Mode**: Crisp, high-readability civic design with clean borders, vibrant badges, and subtle drop shadows.
- **Instant Toggle**: Click the Sun/Moon toggle in the navigation bar. Preference persists in `localStorage` across sessions.

---

## 📁 Project Folder Structure

```
Crowdsourced-Civic-Issue-Reporting-and-Resolution-System/
├── backend/                              # Express REST API & Firebase Admin Hub
│   ├── firebaseAdmin.js                  # Firebase Admin SDK initialization
│   ├── server.js                         # High-performance Express API
│   ├── package.json                      # Backend dependencies
│   └── .env.example                      # Backend environment template
│
├── frontend/                             # Next.js 16 Web Application
│   ├── app/                              # Next.js App Router (14 verified routes)
│   │   ├── admin/                        # Admin dashboard & analytics
│   │   │   ├── analytics/page.tsx        # Firebase Live Analytics hub
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
│   │   ├── AuthContext.tsx               # Firebase auth state & user role
│   │   └── ThemeContext.tsx              # Light / Dark mode state
│   ├── firebase/                         # Firebase client SDK initialization
│   │   ├── auth.ts                       # Auth exports
│   │   ├── firestore.ts                  # Firestore DB exports
│   │   └── firebaseConfig.ts             # Client configuration
│   ├── services/                         # Firestore CRUD & AI service layers
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
- Firebase Project created with Firestore & Authentication enabled (`civic-ai-97ef1`)
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
The backend API starts on `http://localhost:5000`.

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

## 📡 API Reference

### Health & Status
- `GET /` — Backend status & service information
- `GET /health` — Liveness probe (uptime & Firebase connection)

### Complaints API
- `GET /api/v1/complaints` — Retrieve complaints from Cloud Firestore
- `POST /api/v1/complaints` — Create a new civic complaint
- `PATCH /api/v1/complaints/:id/status` — Update resolution status (`Pending`, `In Progress`, `Resolved`)
- `PATCH /api/v1/complaints/:id/assign` — Assign complaint to an officer

### Analytics API
- `GET /api/v1/analytics/stats` — Live analytics aggregated from Firestore

---

## 👥 Authors & Acknowledgments

- **Lead Developer**: Tumukunta Srivalli ([@TumukuntaSrivalli](https://github.com/TumukuntaSrivalli))
- **Technologies**: Next.js, React, Tailwind CSS, Firebase (Firestore & Auth), Express, Leaflet, OpenAI.

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
