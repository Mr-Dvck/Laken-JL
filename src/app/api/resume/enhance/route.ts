import { NextRequest, NextResponse } from "next/server";
import { enhanceResumeBullet } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, sectionType, jobTitle } = body;

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Please write at least a little bit first, Laken! 💕" },
        { status: 400 }
      );
    }

    const enhanced = await enhanceResumeBullet(content, jobTitle || "data entry");

    return NextResponse.json({ enhanced });
  } catch (error: any) {
    console.error("Resume enhance error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance resume" },
      { status: 500 }
    );
  }
}
