import { NextRequest, NextResponse } from "next/server";
import { generateExperienceBullets } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, location, targetRole } = body;

    if (!input || input.trim().length < 10) {
      return NextResponse.json(
        { error: "Tell me a little more about what you did, Laken! Just a sentence or two helps me work my magic. 💕" },
        { status: 400 }
      );
    }

    const bullets = await generateExperienceBullets(
      input,
      location || "Columbia, SC",
      targetRole || "data entry or administrative assistant"
    );

    return NextResponse.json({ bullets });
  } catch (error: any) {
    console.error("Experience generate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate experience" },
      { status: 500 }
    );
  }
}
