/**
 * Power BI Synchronization & Streaming Connector
 * Automatically synchronizes civic issue reports to Power BI Service REST API
 */

require("dotenv").config();

const POWERBI_PUSH_URL = process.env.POWERBI_STREAMING_PUSH_URL || "";

/**
 * Push an array of complaints directly into Power BI streaming dataset
 */
async function pushToPowerBI(rows) {
  if (!POWERBI_PUSH_URL) {
    console.warn("⚠️  POWERBI_STREAMING_PUSH_URL not configured in environment variables.");
    console.log("ℹ️  To push data in real time, create a Streaming Dataset in Power BI and paste the Push URL in .env");
    return false;
  }

  try {
    const response = await fetch(POWERBI_PUSH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows),
    });

    if (response.ok) {
      console.log(`✅ Successfully pushed ${rows.length} records to Power BI.`);
      return true;
    } else {
      console.error(`❌ Power BI push failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Power BI sync network error:", error.message);
    return false;
  }
}

// Standalone execution test
if (require.main === module) {
  const sampleData = [
    {
      ComplaintID: "DEMO-001",
      Title: "Water Pipeline Breach",
      Category: "Water Leakage",
      Severity: "High",
      Status: "Pending",
      Department: "Water Supply & Sewerage",
      AssignedOfficer: "Officer Suresh Reddy",
      Area: "Abids",
      Latitude: 17.3912,
      Longitude: 78.4768,
      PriorityScore: 95,
      IsDuplicate: 0,
      CreatedAt: new Date().toISOString(),
      ResolutionHours: 0,
    },
  ];

  console.log("🔄 Testing Power BI Sync Service...");
  pushToPowerBI(sampleData).then(() => {
    console.log("Sync script completed.");
  });
}

module.exports = { pushToPowerBI };
