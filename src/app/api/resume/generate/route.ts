import { NextRequest, NextResponse } from "next/server";
import { generateFullResume } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, currentSkills } = body;

    if (!jobTitle || jobTitle.trim().length < 2) {
      return NextResponse.json(
        { error: "Enter a job title and I'll build you an amazing resume, Laken! 💕" },
        { status: 400 }
      );
    }

    const resume = await generateFullResume(jobTitle, currentSkills || "");

    return NextResponse.json(resume);
  } catch (error: any) {
    console.error("Resume generate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate resume" },
      { status: 500 }
    );
  }
}
