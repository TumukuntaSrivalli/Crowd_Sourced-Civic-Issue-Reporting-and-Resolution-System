# 🏙️ Crowdsourced Civic Issue Reporting and Resolution System

A smart AI-powered civic issue management platform that enables citizens to report public problems, helps authorities efficiently manage complaints, and improves issue resolution using Artificial Intelligence, location intelligence, and real-time tracking.

---

# 📌 Project Overview

The **Crowdsourced Civic Issue Reporting and Resolution System** is a full-stack web application designed to bridge the communication gap between citizens and government authorities.

Citizens can report problems such as:

- Road damage
- Garbage accumulation
- Water leakage
- Streetlight failures
- Drainage issues
- Traffic-related problems

The system uses:

- AI-based complaint classification
- Severity prediction
- Duplicate detection
- Location tracking
- Officer assignment
- Real-time complaint monitoring

to provide a faster and smarter complaint resolution process.

---

# 🎯 Problem Statement

In traditional civic systems:

- Citizens do not have an easy reporting mechanism.
- Complaints are difficult to track.
- Authorities struggle to prioritize urgent issues.
- Duplicate complaints create unnecessary workload.
- Lack of location information delays resolution.

This platform solves these challenges by providing an intelligent digital solution.

---

# 🚀 Key Features

## 👤 Citizen Module

Citizens can:

✅ Register and Login  
✅ Submit civic complaints  
✅ Upload issue images  
✅ Provide location information  
✅ Track complaint status  
✅ View AI analysis results  
✅ Monitor resolution progress  


---

# 📝 Complaint Reporting

Users can submit:

- Complaint title
- Description
- Category
- Severity
- Image evidence
- GPS location


Example:

```
Title:
Large pothole near school

Category:
Road Damage

Location:
Latitude: 17.3850
Longitude: 78.4867
```

---

# 🤖 Artificial Intelligence Module

The system integrates AI to analyze complaints.

## AI Capabilities

### 1. Complaint Classification

Automatically identifies issue category:

Example:

```
Input:
"Garbage is overflowing near my street"

AI Output:
Category:
Garbage
```


---

### 2. Severity Detection

AI predicts urgency:

```
Low
Medium
High
```

Example:

```
Broken traffic signal:

Severity:
High
```

---

### 3. Duplicate Complaint Detection

Detects similar complaints to reduce repeated reports.

Example:

```
Complaint 1:
Road damage near school

Complaint 2:
Pothole near school entrance


AI:
Possible Duplicate
```

---

### 4. Priority Score

AI generates priority ranking:

Example:

```
Priority Score:
92/100
```

Higher score complaints are handled first.

---

# 👨‍💼 Admin Module

Admins manage the complete complaint workflow.

## Admin Features

### 📋 View All Complaints

Admin can view:

- All citizen complaints
- Complaint details
- Images
- Location
- Status


---

### 👮 Officer Assignment

Admin can assign complaints to officers.

Example:

```
Road Damage Complaint

Assigned Department:
Road Department

Officer:
Road Inspector
```

---

### 🤖 AI Insights Dashboard

Admin can view:

- AI Category
- AI Severity
- Confidence Score
- Priority Score
- Recommended Department
- Duplicate Detection


---

### Complaint Workflow
Citizen
   │
   ▼
Submit Complaint
   │
   ▼
Upload Image (Cloudinary)
   │
   ▼
Save Complaint (Firestore)
   │
   ▼
AI Analysis
(Category & Severity)
   │
   ▼
Admin Dashboard
   │
Assign Officer
   │
   ▼
Officer Notification
   │
   ▼
Officer Verifies Complaint
   │
   ▼
Status Update
(Pending → Assigned → In Progress → Resolved)
   │
   ▼
Citizen Tracks Progress

---

# 👮 Officer Module

Officers handle assigned complaints.

Features:

✅ View assigned complaints  
✅ Verify issue location  
✅ Update complaint status  
✅ Add resolution remarks  
✅ Complete complaint handling  


Workflow:

```
Assigned
   ↓
In Progress
   ↓
Resolved
```

---

# 🔄 System Workflow


```
Citizen

   |
   |
Submit Complaint

   |
   |
AI Analysis

   |
   |
Firestore Database

   |
   |
Admin Review

   |
   |
Officer Assignment

   |
   |
Issue Verification

   |
   |
Resolution

```

---

# 🏗️ System Architecture

                           ┌────────────────────────────┐
                           │         Citizen            │
                           └─────────────┬──────────────┘
                                         │
                                         │ Report Complaint
                                         ▼
                   ┌──────────────────────────────────────────┐
                   │      Next.js Frontend (React + TS)       │
                   │                                          │
                   │ • Home Page                              │
                   │ • Login / Register                       │
                   │ • Dashboard                              │
                   │ • Complaint Management                   │
                   │ • Admin Dashboard                        │
                   │ • Officer Dashboard                      │
                   └──────────────┬───────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────────┐
          │                       │                           │
          ▼                       ▼                           ▼
 ┌────────────────┐     ┌───────────────────┐      ┌──────────────────┐
 │ Firebase Auth  │     │ Firestore Database│      │    Cloudinary    │
 │                │     │                   │      │                  │
 │ User Login     │     │ Users            │      │ Complaint Images │
 │ Registration   │     │ Complaints       │      │ Image Storage    │
 │ Authentication │     │ Notifications    │      │                  │
 └────────────────┘     │ Analytics        │      └──────────────────┘
                        └─────────┬─────────┘
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │      AI Services        │
                     │                         │
                     │ • Category Prediction   │
                     │ • Severity Detection    │
                     │ • Duplicate Detection   │
                     │ • Analytics            │
                     └─────────┬──────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
 ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
 │   Citizen      │   │     Admin      │   │    Officer     │
 ├────────────────┤   ├────────────────┤   ├────────────────┤
 │ Report Issue   │   │ View All Cases │   │ Assigned Cases │
 │ Track Status   │   │ Assign Officer │   │ Update Status  │
 │ View History   │   │ View Analytics │   │ Add Remarks    │
 │ Notifications  │   │ Notifications  │   │ Notifications  │
 └────────────────┘   └────────────────┘   └────────────────┘

###Technology Architecture
                    ┌───────────────────────┐
                    │        User           │
                    └───────────┬───────────┘
                                │
                                ▼
                 ┌────────────────────────────┐
                 │ Next.js + React + TypeScript│
                 └───────────┬────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
 Firebase Auth         Firestore DB         Cloudinary
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                      AI Processing
                             │
                             ▼
                 Admin / Officer / Citizen
```
---
```

# 🛠️ Technology Stack


## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS


## Backend

- Firebase Authentication
- Firebase Firestore


## Artificial Intelligence

- OpenAI API
- NLP based complaint analysis


## Image Storage

- Cloudinary


## Maps

- React Leaflet
- OpenStreetMap


## Development Tools

- VS Code
- Git
- GitHub

---

# 📂 Project Structure
```
Crowdsourced-Civic-Issue-Reporting-and-Resolution-System/
│
└── frontend/
    │
    ├── .next/                         # Auto-generated Next.js build files
    │
    ├── .vscode/
    │
    ├── app/
    │   │
    │   ├── admin/
    │   │   ├── dashboard/
    │   │   │   └── page.tsx
    │   │   │
    │   │   ├── AnalyticsCards.tsx
    │   │   ├── CategoryChart.tsx
    │   │   ├── MonthlyChart.tsx
    │   │   ├── OfficerChart.tsx
    │   │   └── StatusChart.tsx
    │   │
    │   ├── complaints/
    │   │   ├── new/
    │   │   │   └── page.tsx
    │   │   │
    │   │   ├── [id]/
    │   │   │   ├── page.tsx
    │   │   │   └── edit/
    │   │   │       └── page.tsx
    │   │   │
    │   │   └── page.tsx
    │   │
    │   ├── dashboard/
    │   │   └── page.tsx
    │   │
    │   ├── login/
    │   │   └── page.tsx
    │   │
    │   ├── officer/
    │   │   └── dashboard/
    │   │       └── page.tsx
    │   │
    │   ├── register/
    │   │   └── page.tsx
    │   │
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── components/
    │   │
    │   ├── complaint/
    │   │   ├── ComplaintCard.tsx
    │   │   ├── ComplaintForm.tsx
    │   │   ├── ComplaintList.tsx
    │   │   ├── ComplaintStatusBadge.tsx
    │   │   └── LocationPicker.tsx
    │   │
    │   ├── Footer.tsx
    │   ├── Navbar.tsx
    │   ├── ProtectedRoute.tsx
    │   └── SignOutButton.tsx
    │
    ├── constants/
    │   ├── departments.ts
    │   └── officers.ts
    │
    ├── context/
    │   └── AuthContext.tsx
    │
    ├── firebase/
    │   ├── auth.ts
    │   ├── firebaseConfig.ts
    │   └── firestore.ts
    │
    ├── hooks/
    │
    ├── lib/
    │
    ├── middleware/
    │
    ├── public/
    │
    ├── services/
    │   ├── aiService.ts
    │   ├── analyticsService.ts
    │   ├── authService.ts
    │   ├── cloudinaryService.ts
    │   ├── complaintService.ts
    │   ├── notificationService.ts
    │   ├── uploadService.ts
    │   └── userService.ts
    │
    ├── styles/
    │
    ├── types/
    │   ├── complaint.ts
    │   ├── notification.ts
    │   └── user.ts
    │
    ├── utils/
    │   ├── complaintValidation.ts
    │   ├── roleGuard.ts
    │   └── helper.ts
    │
    ├── node_modules/                 # Installed packages (auto-generated)
    │
    ├── .env.local
    ├── .gitignore
    ├── AGENTS.md
    ├── CLAUDE.md
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.mjs
    ├── README.md
    └── tsconfig.json
```
---


## 🔥 Firebase Setup

1. Create a Firebase Project

2. Enable Firebase Services
   ├── Authentication
   │     └── Email/Password
   ├── Firestore Database
   └── Storage (Optional)

3. Create Firestore Collections
   ├── users
   ├── complaints
   ├── notifications
   ├── feedback
   ├── departments
   ├── officers
   ├── analytics
   └── ai_predictions

4. Register the Web App

5. Connect Firebase to the Next.js Application

```

---
```
# ☁️ Cloudinary Setup

Used for storing complaint images.

Steps:

1. Create Cloudinary account

2. Create upload preset

3. Add credentials:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

NEXT_PUBLIC_UPLOAD_PRESET=

```

---

# 🔑 Environment Variables

Create:

```
.env.local
```


Add:


```
NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

NEXT_PUBLIC_UPLOAD_PRESET=

OPENAI_API_KEY=

```

---

# ▶️ Installation


Clone repository:

```bash
git clone <repository-url>
```


Move into project:

```bash
cd frontend
```


Install dependencies:

```bash
npm install
```


Run development server:


```bash
npm run dev
```


Application runs at:


```
http://localhost:3000
```

---

# 📊 Database Structure


## Users Collection


```
users

uid

name

email

role

```

Roles:

```
citizen
admin
officer
```


---

## Complaints Collection


```
complaints

title

description

category

severity

status

imageUrl

location

userId


AI Fields:

aiCategory

aiSeverity

aiConfidence

aiSummary

priorityScore

department

recommendedOfficer

isDuplicate

```

---

# 🔮 Future Enhancements


## Advanced AI

- Image-based issue detection
- Predictive complaint analysis


## Smart City Features

- Complaint heatmaps
- Area risk prediction
- Automated department routing


## Communication

- SMS notifications
- Email alerts
- Mobile application


## Analytics

- Resolution statistics
- Department performance
- Complaint trends


---

# 🌟 Project Impact

This platform helps create:

✅ Faster complaint resolution  
✅ Better citizen-government communication  
✅ Data-driven decision making  
✅ Efficient resource allocation  
✅ Transparent civic management  


---

# 👨‍💻 Developed By

**Tumukunta Srivalli**

Computer Science Engineering - Data Science

---

# 📜 License

This project is developed for educational and innovation purposes.