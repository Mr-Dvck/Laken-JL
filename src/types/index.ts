// ─── Adzuna Job ───────────────────────────────────────────
export interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string; area?: string[] };
  description: string;
  redirect_url: string;
  created: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: boolean;
  category: { label: string; tag: string };
  contract_type?: string;
  contract_time?: string;
}

// ─── Adzuna Search ────────────────────────────────────────
export interface AdzunaSearchResult {
  count: number;
  mean: number;
  results: AdzunaJob[];
}

// ─── Job (our normalized shape) ───────────────────────────
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted: string;
  salaryMin?: number;
  salaryMax?: number;
  category: string;
  contractType?: string;
}

// ─── Resume ───────────────────────────────────────────────
export interface ResumeSection {
  id: string;
  type: "summary" | "experience" | "education" | "skills" | "custom";
  title: string;
  content: string;
}

export interface Resume {
  name: string;
  email: string;
  phone: string;
  sections: ResumeSection[];
}

// ─── Skill Gap ────────────────────────────────────────────
export interface SkillGap {
  skill: string;
  youHave: boolean;
  suggestion: string;
}

// ─── DeepSeek Response ────────────────────────────────────
export interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DeepSeekResponse {
  id: string;
  choices: {
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
