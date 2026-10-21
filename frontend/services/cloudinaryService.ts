/**
 * Upload image via Next.js server-side proxy (/api/upload).
 * This prevents client-side CORS issues and firewall blocking on institutional/public networks.
 */
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.warn("Upload returned status:", res.status);
      return { url: "" };
    }

    const data = await res.json();
    return {
      url: data.url || "",
    };
  } catch (err) {
    console.warn("Image upload request error (handled gracefully):", err);
    return { url: "" };
  }
};