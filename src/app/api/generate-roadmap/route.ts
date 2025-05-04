// /app/api/generate-roadmap/route.ts (if using App Router)
import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, experience } = body;

    const prompt = `Create a weekly learning roadmap for someone with ${experience} experience who wants to ${goal}. Include week numbers and specific tasks.`;

    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a helpful AI that generates structured learning roadmaps.",
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    //   temperature: 0.7,
    // });


    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        // contents: prompt,
        contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
      });
    //   console.log(response.text);
    // const roadmap = response.choices[0]?.message?.content;

    return NextResponse.json({ response: response.text });
  } catch (error:unknown) {
    console.error("Error from OpenAI:", error);
    return NextResponse.json({ error: "Failed to generate roadmap." }, { status: 500 });
  }
}
