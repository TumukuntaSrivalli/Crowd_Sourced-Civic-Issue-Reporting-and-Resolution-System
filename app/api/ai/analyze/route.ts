import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    // If API key is not available
    if (!apiKey) {
      return NextResponse.json({
        category: "Unknown",
        severity: "Low",
        confidence: 0,
        summary: "AI service unavailable",
        isDuplicate: false,
      });
    }

    // Create OpenAI client only when API is called
    const openai = new OpenAI({
      apiKey,
    });

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

Return JSON only:

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

    // Add image analysis if image exists
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

    return NextResponse.json(
      JSON.parse(content || "{}")
    );

  } catch (error) {
    console.error("AI Error:", error);

    return NextResponse.json(
      {
        category: "Unknown",
        severity: "Low",
        confidence: 0,
        summary: "AI analysis failed",
        isDuplicate: false,
      },
      {
        status: 500,
      }
    );
  }
}