import { NextRequest, NextResponse } from "next/server";
import { searchJobs } from "@/lib/adzuna";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const what = searchParams.get("what") || "data entry";
    const where = searchParams.get("where") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const maxDaysOld = parseInt(searchParams.get("maxDaysOld") || "30", 10);

    const { jobs, total } = await searchJobs({
      what,
      where,
      page,
      maxDaysOld,
      resultsPerPage: 20,
    });

    return NextResponse.json({ jobs, total });
  } catch (error: any) {
    console.error("Job search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search jobs" },
      { status: 500 }
    );
  }
}
