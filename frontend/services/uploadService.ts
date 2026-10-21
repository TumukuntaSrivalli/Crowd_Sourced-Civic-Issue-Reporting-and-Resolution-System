/**
 * Upload image via Next.js internal API route (/api/upload).
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
      return { url: "" };
    }

    const data = await res.json();
    return {
      url: data.url || "",
    };
  } catch (err) {
    console.warn("Upload service error:", err);
    return { url: "" };
  }
};