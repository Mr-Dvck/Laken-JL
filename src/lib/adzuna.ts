import { AdzunaSearchResult, Job } from "@/types";

const ADZUNA_BASE = "https://api.adzuna.com/v1/api/jobs";

function getCredentials(): { appId: string; appKey: string } {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    throw new Error("Missing ADZUNA_APP_ID or ADZUNA_APP_KEY environment variables");
  }
  return { appId, appKey };
}

export interface SearchParams {
  what?: string;
  where?: string;
  page?: number;
  resultsPerPage?: number;
  maxDaysOld?: number;
  salaryMin?: number;
  category?: string;
  contractType?: string;
}

function normalizeJob(raw: any): Job {
  return {
    id: raw.id,
    title: raw.title?.replace(/<\/?[^>]+(>|$)/g, "") ?? "Untitled",
    company: raw.company?.display_name ?? "Unknown",
    location: raw.location?.display_name ?? "Remote",
    description: raw.description?.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 1500) ?? "",
    url: raw.redirect_url ?? "",
    posted: raw.created ?? "",
    salaryMin: raw.salary_min,
    salaryMax: raw.salary_max,
    category: raw.category?.label ?? "",
    contractType: raw.contract_type,
  };
}

export async function searchJobs(params: SearchParams = {}): Promise<{
  jobs: Job[];
  total: number;
}> {
  const { appId, appKey } = getCredentials();

  const {
    what = "data entry",
    where = "",
    page = 1,
    resultsPerPage = 20,
    maxDaysOld = 30,
  } = params;

  const country = "us";
  const url = `${ADZUNA_BASE}/${country}/search/${page}`;

  const queryParams = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what,
    results_per_page: String(resultsPerPage),
    max_days_old: String(maxDaysOld),
    content_type: "application/json",
  });

  if (where) queryParams.set("where", where);

  const res = await fetch(`${url}?${queryParams.toString()}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Adzuna API error (${res.status}): ${text}`);
  }

  const data: AdzunaSearchResult = await res.json();

  return {
    jobs: (data.results ?? []).map(normalizeJob),
    total: data.count ?? 0,
  };
}
