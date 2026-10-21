export const analyzeComplaintAI = async (
  title: string,
  description: string,
  imageUrl?: string
) => {
  const res = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      imageUrl,
    }),
  });

  if (!res.ok) {
    throw new Error("AI request failed");
  }

  return await res.json();
};