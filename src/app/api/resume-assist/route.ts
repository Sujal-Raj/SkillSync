import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

interface RecommendationResponse {
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal } = body;

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal is required' },
        { status: 400 }
      );
    }

    const prompt = `
As a career counselor and resume expert, analyze the following career goal and provide recommendations:

Career Goal: "${goal}"

Please provide:
1. 6-8 most relevant technical and soft skills that would be valuable for this career path
2. 4-5 project ideas that would demonstrate these skills and be impressive on a resume

Format your response as a JSON object with this exact structure:
{
  "skills": [
    "skill1",
    "skill2",
    "skill3"
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "Brief description of what this project demonstrates and why it's valuable for the career goal"
    }
  ]
}

Focus on:
- Current industry trends and in-demand skills
- Projects that showcase practical application
- Skills that are both technical and transferable
- Projects that can be completed individually or in small teams
- Modern technologies and methodologies

Provide only the JSON response, no additional text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const responseText = response.text;
    // console.log('Raw AI Response:', responseText);

    // Parse the JSON response from AI
    let recommendations: RecommendationResponse;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = responseText!.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      recommendations = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!recommendations.skills || !Array.isArray(recommendations.skills)) {
        throw new Error('Invalid skills format');
      }
      if (!recommendations.projects || !Array.isArray(recommendations.projects)) {
        throw new Error('Invalid projects format');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', responseText);
      
      // Fallback response if parsing fails
      recommendations = {
        skills: [
          "Problem Solving",
          "Communication",
          "Teamwork",
          "Adaptability",
          "Critical Thinking",
          "Time Management",
          "Technical Proficiency",
          "Project Management"
        ],
        projects: [
          {
            title: "Portfolio Website",
            description: "Create a professional portfolio showcasing your skills and experience relevant to your career goal."
          },
          {
            title: "Industry Research Project",
            description: "Conduct comprehensive research on trends and challenges in your target industry."
          },
          {
            title: "Skill Development Project",
            description: "Build a project that demonstrates the key technical skills required for your career path."
          },
          {
            title: "Problem-Solving Case Study",
            description: "Document and present a real-world problem you solved, highlighting your analytical and technical skills."
          }
        ]
      };
    }

    return NextResponse.json({
      success: true,
      data: recommendations
    });

  } catch (error: unknown) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}