# 💻 CivicSense Frontend Application

This folder contains the **Next.js 16** front-end application for the Crowdsourced Civic Issue Reporting and Resolution System.

For the full project documentation, backend Power BI analytics, and deployment instructions, refer to the root [README.md](../README.md).

---

## 🚀 Running Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` and add your credentials:

- Firebase Config (`NEXT_PUBLIC_FIREBASE_*`)
- Cloudinary Uploads (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
- OpenAI API Key (`OPENAI_API_KEY`)
- Backend API URL (`NEXT_PUBLIC_BACKEND_API_URL`)