import { NextRequest, NextResponse } from "next/server";
import { suggestSkills } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, jobDescription, currentSkills } = body;

    if (!jobTitle || jobTitle.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter the job title you're interested in, Laken! 💕" },
        { status: 400 }
      );
    }

    const result = await suggestSkills(
      jobTitle,
      jobDescription || "",
      currentSkills || ""
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Skill suggest error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze skills" },
      { status: 500 }
    );
  }
}
