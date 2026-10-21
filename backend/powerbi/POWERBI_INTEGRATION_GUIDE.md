# 📊 Power BI Backend Integration Guide

This guide details how the **Crowdsourced Civic Issue Reporting and Resolution System** connects with **Microsoft Power BI** for backend analytics, executive civic dashboards, real-time alerting, and automated KPI reporting.

---

## 🏛️ Architecture Overview

```
[Citizens / Web App]
        │
        ▼
[Firebase / Firestore & Backend REST API]
        │
        ├──▶ 1. Web Data Connector / REST API (/api/v1/powerbi/complaints)
        ├──▶ 2. Scheduled CSV Feed (/api/v1/powerbi/export/csv)
        └──▶ 3. Real-Time Streaming Push Dataset (/api/v1/powerbi/push-dataset)
        │
        ▼
[Microsoft Power BI Service / Desktop]
        │
        ├──▶ Executive Governance Dashboard
        ├──▶ Departmental Resolution SLA Gauge
        ├──▶ Real-time Geo-Map Heatmap
        └──▶ Automated High-Severity Alerts (Webhooks)
```

---

## 🔌 Method 1: Connect Power BI Desktop to Live Backend API (Web Feed)

1. Open **Microsoft Power BI Desktop**.
2. Click **Get Data** > **Web**.
3. In the URL dialog, paste the Backend Complaints Feed endpoint:
   - **Local Development:** `http://localhost:5000/api/v1/powerbi/complaints`
   - **Production (Render):** `https://your-civic-backend.onrender.com/api/v1/powerbi/complaints`
4. Click **OK**.
5. In Power Query Editor:
   - Expand the `value` list to records.
   - Click **Close & Apply**.
6. Set up **Scheduled Refresh** (daily or hourly) in Power BI Service.

---

## 📥 Method 2: Direct 1-Click CSV Streaming (Fastest)

Power BI can ingest the automatically formatted CSV endpoint:

```
https://your-civic-backend.onrender.com/api/v1/powerbi/export/csv
```

1. Select **Get Data** > **Web** > enter the CSV export URL.
2. Power BI auto-detects column data types:
   - `ComplaintID` (Text)
   - `Title` (Text)
   - `Category` (Text)
   - `Severity` (Text)
   - `Status` (Text)
   - `Latitude` / `Longitude` (Set Data Category to **Latitude** / **Longitude** for Map visual)
   - `PriorityScore` (Whole Number)
   - `CreatedAt` (Date/Time)

---

## ⚡ Method 3: Real-Time Streaming Dataset (Power BI Service)

For live monitoring center displays:

1. Go to **Power BI Service** (https://app.powerbi.com).
2. Open your Workspace > **New** > **Streaming dataset**.
3. Select **API** > click **Next**.
4. Dataset Name: `Civic Realtime Complaints`.
5. Add the fields defined in `Civic_Issue_Analytics_Schema.json`.
6. Enable **Historic data analysis** (optional).
7. Copy the generated **Push URL** and paste it into your `backend/.env`:
   ```env
   POWERBI_STREAMING_PUSH_URL=https://api.powerbi.com/beta/.../datasets/.../rows?key=...
   ```
8. Every time a complaint is filed or updated, it will instantly render on Power BI live dashboard tiles!

---

## 📐 Included DAX Measures

The project includes pre-built production DAX formulas in [`PowerBI_Measures_and_DAX.dax`](./PowerBI_Measures_and_DAX.dax):
- `[Total Complaints]`
- `[Resolution Rate %]`
- `[Active Backlog]`
- `[High Severity Share %]`
- `[Average Resolution Hours]`
- `[SLA Compliance Rate %]`
- `[Civic Hazard Index]`

---

## 🚨 Power BI Data-Driven Alerts

You can configure Power BI Service to notify municipal authorities when high-severity complaints exceed tolerance:
1. Create a card tile for `[High Severity Count]`.
2. Click **...** on the tile > **Manage alerts**.
3. Set rule: Alert when value is greater than `5`.
4. Trigger the webhook endpoint:
   ```
   POST https://your-civic-backend.onrender.com/api/v1/powerbi/alert-webhook
   ```
