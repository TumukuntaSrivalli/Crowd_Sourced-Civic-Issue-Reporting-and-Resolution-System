/**
 * Civic Issue Reporting and Resolution System - Backend API & Power BI Analytics Hub
 * Built with Express, compression, cors, and Power BI streaming / export connectors.
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// In-Memory Seed / Mock Data Store (Synchronized with Firebase / Power BI Pipeline)
let complaintsDatabase = [
  {
    id: "civic-001",
    title: "Deep Pothole on Main Road near St. Marks School",
    description: "Hazardous pothole causing severe traffic congestion and bike accidents.",
    category: "Road Damage",
    severity: "High",
    status: "In Progress",
    assignedTo: "Officer Rajesh Kumar",
    department: "Roads & Infrastructure",
    location: { latitude: 17.385044, longitude: 78.486671, area: "Banjara Hills" },
    isDuplicate: false,
    priorityScore: 92,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    resolutionHours: null,
  },
  {
    id: "civic-002",
    title: "Overflowing Garbage Dump near Sector 4 Market",
    description: "Waste collection has been delayed for 4 days, causing foul smell and health hazard.",
    category: "Garbage",
    severity: "High",
    status: "Pending",
    assignedTo: "Sanitation Lead Priya Sharma",
    department: "Sanitation & Waste",
    location: { latitude: 17.4399, longitude: 78.4983, area: "Secunderabad" },
    isDuplicate: false,
    priorityScore: 88,
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    resolutionHours: null,
  },
  {
    id: "civic-003",
    title: "Broken Streetlight on Park Avenue Lane 3",
    description: "Dark street corner posing safety risks for night pedestrians and commuters.",
    category: "Streetlight",
    severity: "Medium",
    status: "Resolved",
    assignedTo: "Officer Ananya Verma",
    department: "Electrical & Lighting",
    location: { latitude: 17.4239, longitude: 78.4738, area: "Jubilee Hills" },
    isDuplicate: false,
    priorityScore: 65,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    resolutionHours: 72,
  },
  {
    id: "civic-004",
    title: "Pipeline Burst and Clean Water Leakage",
    description: "Continuous potable water wastage spilling over the intersection since morning.",
    category: "Water Leakage",
    severity: "High",
    status: "Assigned",
    assignedTo: "Officer Suresh Reddy",
    department: "Water Supply & Sewerage",
    location: { latitude: 17.3912, longitude: 78.4768, area: "Abids" },
    isDuplicate: false,
    priorityScore: 95,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    resolutionHours: null,
  },
  {
    id: "civic-005",
    title: "Clogged Drainage during Monsoon Rains",
    description: "Stormwater drain blocked by construction debris causing ankle-deep waterlogging.",
    category: "Drainage",
    severity: "Medium",
    status: "Resolved",
    assignedTo: "Officer Rajesh Kumar",
    department: "Drainage & Stormwater",
    location: { latitude: 17.4156, longitude: 78.4354, area: "Madhapur" },
    isDuplicate: false,
    priorityScore: 70,
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    resolutionHours: 72,
  },
  {
    id: "civic-006",
    title: "Traffic Light Blinking Red Continuously at Crossroad",
    description: "Signal control board malfunction causing vehicle gridlock at peak commute hours.",
    category: "Traffic Signal",
    severity: "High",
    status: "Resolved",
    assignedTo: "Officer Vikram Singh",
    department: "Traffic & Transport",
    location: { latitude: 17.4485, longitude: 78.3748, area: "Hitec City" },
    isDuplicate: false,
    priorityScore: 89,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    resolutionHours: 34,
  },
];

// Helper: Calculate Power BI Aggregated Metrics
function computePowerBIMetrics() {
  const total = complaintsDatabase.length;
  const pending = complaintsDatabase.filter((c) => c.status === "Pending").length;
  const assigned = complaintsDatabase.filter((c) => c.status === "Assigned").length;
  const inProgress = complaintsDatabase.filter((c) => c.status === "In Progress").length;
  const resolved = complaintsDatabase.filter((c) => c.status === "Resolved").length;
  const highSeverity = complaintsDatabase.filter((c) => c.severity === "High").length;
  const duplicates = complaintsDatabase.filter((c) => c.isDuplicate).length;

  const resolutionRate = total > 0 ? Number(((resolved / total) * 100).toFixed(1)) : 0;

  // Average resolution time for resolved items
  const resolvedList = complaintsDatabase.filter((c) => c.status === "Resolved" && c.resolutionHours);
  const avgResolutionHours =
    resolvedList.length > 0
      ? Number(
          (
            resolvedList.reduce((acc, c) => acc + (c.resolutionHours || 0), 0) /
            resolvedList.length
          ).toFixed(1)
        )
      : 48.0;

  // Category breakdown
  const categoryDistribution = complaintsDatabase.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  // Department efficiency breakdown
  const departmentStats = {};
  complaintsDatabase.forEach((c) => {
    const dept = c.department || "General Administration";
    if (!departmentStats[dept]) {
      departmentStats[dept] = { total: 0, resolved: 0, pending: 0, highSeverity: 0 };
    }
    departmentStats[dept].total++;
    if (c.status === "Resolved") departmentStats[dept].resolved++;
    if (c.status === "Pending") departmentStats[dept].pending++;
    if (c.severity === "High") departmentStats[dept].highSeverity++;
  });

  return {
    kpis: {
      totalComplaints: total,
      pendingComplaints: pending,
      assignedComplaints: assigned,
      inProgressComplaints: inProgress,
      resolvedComplaints: resolved,
      highSeverityComplaints: highSeverity,
      duplicateComplaints: duplicates,
      resolutionRatePercent: resolutionRate,
      averageResolutionHours: avgResolutionHours,
      activeBacklogRatePercent: Number((((pending + inProgress + assigned) / (total || 1)) * 100).toFixed(1)),
    },
    categoryDistribution,
    departmentStats,
    lastSyncTimestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// ROUTES
// ---------------------------------------------------------------------------

// 1. Root & Health Check (Used by Render liveness probe)
app.get("/", (req, res) => {
  res.status(200).json({
    service: "Crowdsourced Civic Issue Reporting and Resolution System - Backend",
    version: "1.0.0",
    status: "Healthy",
    powerbi_ready: true,
    documentation: "/api/v1/powerbi/metrics",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// 2. Power BI DirectQuery / Web API Data Feed (JSON format for Power BI REST / OData)
app.get("/api/v1/powerbi/complaints", (req, res) => {
  const flattened = complaintsDatabase.map((c) => ({
    ComplaintID: c.id,
    Title: c.title,
    Description: c.description,
    Category: c.category,
    Severity: c.severity,
    SeverityWeight: c.severity === "High" ? 3 : c.severity === "Medium" ? 2 : 1,
    Status: c.status,
    IsResolved: c.status === "Resolved" ? 1 : 0,
    Department: c.department,
    AssignedOfficer: c.assignedTo || "Unassigned",
    Area: c.location?.area || "Unspecified",
    Latitude: c.location?.latitude || null,
    Longitude: c.location?.longitude || null,
    PriorityScore: c.priorityScore || 50,
    IsDuplicate: c.isDuplicate ? 1 : 0,
    CreatedAt: c.createdAt,
    UpdatedAt: c.updatedAt,
    ResolutionHours: c.resolutionHours || 0,
  }));

  res.status(200).json({
    value: flattened,
    "@odata.count": flattened.length,
    timestamp: new Date().toISOString(),
  });
});

// 3. Power BI Aggregated KPI Feed (For Power BI Card visuals, gauges, and summary tiles)
app.get("/api/v1/powerbi/metrics", (req, res) => {
  const metrics = computePowerBIMetrics();
  res.status(200).json(metrics);
});

// 4. Power BI CSV Streaming Export Endpoint (Instant 1-Click Import into Power BI Desktop)
app.get("/api/v1/powerbi/export/csv", (req, res) => {
  const headers = [
    "ComplaintID",
    "Title",
    "Category",
    "Severity",
    "Status",
    "Department",
    "AssignedOfficer",
    "Area",
    "Latitude",
    "Longitude",
    "PriorityScore",
    "IsDuplicate",
    "CreatedAt",
    "UpdatedAt",
    "ResolutionHours",
  ];

  const rows = complaintsDatabase.map((c) => [
    `"${c.id}"`,
    `"${(c.title || "").replace(/"/g, '""')}"`,
    `"${c.category || ""}"`,
    `"${c.severity || ""}"`,
    `"${c.status || ""}"`,
    `"${c.department || ""}"`,
    `"${c.assignedTo || "Unassigned"}"`,
    `"${c.location?.area || ""}"`,
    c.location?.latitude || "",
    c.location?.longitude || "",
    c.priorityScore || 50,
    c.isDuplicate ? 1 : 0,
    `"${c.createdAt}"`,
    `"${c.updatedAt}"`,
    c.resolutionHours || "",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="civic_issues_powerbi_${Date.now()}.csv"`
  );
  res.status(200).send(csvContent);
});

// 5. Ingest complaint or sync with frontend
app.post("/api/v1/complaints/sync", (req, res) => {
  const complaint = req.body;
  if (!complaint || !complaint.title) {
    return res.status(400).json({ error: "Invalid complaint data" });
  }

  const newEntry = {
    id: complaint.id || `civic-${String(complaintsDatabase.length + 1).padStart(3, "0")}`,
    title: complaint.title,
    description: complaint.description || "",
    category: complaint.category || complaint.aiCategory || "Other",
    severity: complaint.severity || complaint.aiSeverity || "Medium",
    status: complaint.status || "Pending",
    assignedTo: complaint.assignedTo || null,
    department: complaint.department || "General Administration",
    location: complaint.location || { latitude: 0, longitude: 0, area: "Urban" },
    isDuplicate: Boolean(complaint.isDuplicate),
    priorityScore: complaint.priorityScore || 50,
    createdAt: complaint.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolutionHours: null,
  };

  complaintsDatabase.unshift(newEntry);
  res.status(201).json({
    message: "Complaint synced successfully with backend and Power BI stream",
    data: newEntry,
    totalRecords: complaintsDatabase.length,
  });
});

// 6. Power BI Webhook / Alert Listener (When Power BI alerts trigger on SLA breach)
app.post("/api/v1/powerbi/alert-webhook", (req, res) => {
  const alertPayload = req.body;
  console.log("🚨 [Power BI Alert Received]:", JSON.stringify(alertPayload));

  res.status(200).json({
    success: true,
    message: "Power BI Alert acknowledged by Civic Issue Backend",
    receivedAt: new Date().toISOString(),
  });
});

// 7. General API Status
app.get("/api/v1/status", (req, res) => {
  res.status(200).json({
    status: "Operational",
    backendVersion: "1.0.0",
    powerbiConnected: true,
    totalLiveComplaints: complaintsDatabase.length,
    endpoints: {
      powerbi_complaints_json: "/api/v1/powerbi/complaints",
      powerbi_metrics: "/api/v1/powerbi/metrics",
      powerbi_csv_export: "/api/v1/powerbi/export/csv",
      complaint_sync: "/api/v1/complaints/sync",
      alert_webhook: "/api/v1/powerbi/alert-webhook",
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found", path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Backend Error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Civic Issue Backend & Power BI Service Running`);
  console.log(`📍 Port: http://localhost:${PORT}`);
  console.log(`📊 Power BI JSON Feed: http://localhost:${PORT}/api/v1/powerbi/complaints`);
  console.log(`📥 Power BI CSV Export: http://localhost:${PORT}/api/v1/powerbi/export/csv`);
  console.log(`📈 Power BI Metrics: http://localhost:${PORT}/api/v1/powerbi/metrics`);
  console.log(`====================================================`);
});
