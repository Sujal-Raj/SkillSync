import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import User from "@/models/usermodel";
import dbConnect from "@/db/dbConfig";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, experience, userId } = body;

    await dbConnect();

    const prompt = `Create a weekly learning roadmap for someone with ${experience} experience who wants to ${goal}. Return the result as a JSON array where each item includes:
- "week": week number (e.g., 1, 2, 3...)
- "goal": the learning objective for that week
- "tasks": an array of specific tasks to complete that week.

Do not include any text outside of the JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    let rawText = response.text;

    // Remove Markdown code block markers
    if (rawText && rawText.startsWith("```")) {
      const firstNewline = rawText.indexOf("\n");
      const lastTripleBacktick = rawText.lastIndexOf("```");
      rawText = rawText.substring(firstNewline + 1, lastTripleBacktick).trim();
    }

    // Parse the JSON string safely
    let parsedRoadmap;
    try {
      if (typeof rawText === "string") {
        parsedRoadmap = JSON.parse(rawText);
      } else {
        console.error("AI response is undefined or not a string:", rawText);
        return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
      }
    } catch (err) {
      console.error("Failed to parse AI response:", rawText);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    // Save to user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.roadmaps.push({
      goal,
      experience,
      content: parsedRoadmap, // Save the structured roadmap
    });

    await user.save();

    return NextResponse.json({ response: parsedRoadmap });
  } catch (error: unknown) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json({ error: "Failed to generate roadmap." }, { status: 500 });
  }
}
