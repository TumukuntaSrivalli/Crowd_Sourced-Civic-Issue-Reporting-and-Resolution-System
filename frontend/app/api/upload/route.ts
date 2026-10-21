import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided", url: "" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ordpnpis").trim();
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const form = new FormData();
      form.append("file", new Blob([buffer], { type: file.type || "image/jpeg" }));
      form.append("upload_preset", "civic_upload");

      const res = await fetch(uploadUrl, {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          return NextResponse.json({ url: data.secure_url });
        }
      }
      console.warn("Cloudinary responded with status:", res.status);
    } catch (cloudErr) {
      console.warn("Server-side Cloudinary upload error:", cloudErr);
    }

    // Fallback: If image is under 400KB, convert to base64 Data URL so it is preserved in Firestore
    if (buffer.length < 400 * 1024) {
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      return NextResponse.json({ url: `data:${mimeType};base64,${base64}` });
    }

    // Graceful fallback: return empty url rather than failing the whole complaint submission
    return NextResponse.json({ url: "" });
  } catch (error) {
    console.error("Upload route general error:", error);
    return NextResponse.json({ url: "" });
  }
}