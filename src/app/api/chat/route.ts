import { NextRequest, NextResponse } from "next/server";
import { chatWithLaken } from "@/lib/deepseek";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || message.trim().length < 2) {
      return NextResponse.json(
        { error: "What's on your mind, Laken? Type something and I'm all ears! 💕" },
        { status: 400 }
      );
    }

    const reply = await chatWithLaken(message, history || []);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to chat" },
      { status: 500 }
    );
  }
}
