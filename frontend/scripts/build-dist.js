const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const nextAppDir = path.join(__dirname, "..", ".next", "server", "app");
const publicDir = path.join(__dirname, "..", "public");

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy public assets into dist
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, distDir);
}

// 2. Copy generated HTML pages from .next/server/app to dist (for static site fallbacks)
if (fs.existsSync(nextAppDir)) {
  copyDir(nextAppDir, distDir);
}

// 3. Ensure an index.html exists in dist
const indexHtml = path.join(distDir, "index.html");
if (!fs.existsSync(indexHtml)) {
  const fallbackHtml = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/" /><title>CivicSense</title></head><body>Redirecting...</body></html>`;
  fs.writeFileSync(indexHtml, fallbackHtml);
}

console.log("✅ Successfully prepared 'dist' directory for Render static site compatibility.");
