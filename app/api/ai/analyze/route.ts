import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { title, description, imageUrl } = await req.json();

    const messages: any[] = [
      {
        role: "system",
        content:
          "You are an AI system for civic issue detection. Return ONLY JSON.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Analyze this civic complaint:

Title: ${title}
Description: ${description}

Return:
{
  "category": "Pothole | Garbage | Water Leakage | Streetlight | Drainage | Other",
  "severity": "Low | Medium | High",
  "confidence": 0-1,
  "summary": "short explanation",
  "isDuplicate": false
}
            `,
          },
        ],
      },
    ];

    // 🖼️ If image exists, add vision input
    if (imageUrl) {
      messages[1].content.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
        },
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    });

    const content = response.choices[0].message.content;

    return NextResponse.json(JSON.parse(content || "{}"));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI vision failed" },
      { status: 500 }
    );
  }
}