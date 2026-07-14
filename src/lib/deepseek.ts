import { DeepSeekResponse, DeepSeekMessage } from "@/types";

const DEEPSEEK_BASE = "https://api.deepseek.com/v1";
const MODEL = "deepseek-chat";

function getApiKey(): string {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new Error("Missing DEEPSEEK_API_KEY environment variable");
  }
  return key;
}

async function chat(
  messages: DeepSeekMessage[],
  temperature = 0.7
): Promise<string> {
  const apiKey = getApiKey();

  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: 1500,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepSeek API error (${res.status}): ${text}`);
  }

  const data: DeepSeekResponse = await res.json();
  return data.choices[0]?.message?.content ?? "";
}

const SUPPORTIVE_PERSONA = `You are a warm, supportive, and encouraging career coach. 
You are helping a woman named Laken find a great data entry job. 
Be friendly, positive, and uplifting. Use her name occasionally. 
Keep responses clear, actionable, and jargon-free since she's not super tech-savvy. 
Always end on an encouraging note. ✨`;

// ─── Enhance Resume Bullet Points ─────────────────────────
export async function enhanceResumeBullet(
  bullet: string,
  jobTitle?: string
): Promise<string> {
  const messages: DeepSeekMessage[] = [
    { role: "system", content: SUPPORTIVE_PERSONA },
    {
      role: "user",
      content: `Please rewrite this resume bullet point to sound more professional and impactful${
        jobTitle ? ` for a ${jobTitle} position` : ""
      }:

"${bullet}"

Make it:
1. Use strong action verbs
2. Quantify results where possible (add realistic numbers)
3. Keep it to 1-2 sentences
4. Sound natural, not robotic

Return ONLY the improved bullet point, nothing else.`,
    },
  ];

  return chat(messages, 0.8);
}

// ─── Generate Resume Summary ──────────────────────────────
export async function generateSummary(
  experience: string,
  targetJob: string
): Promise<string> {
  const messages: DeepSeekMessage[] = [
    { role: "system", content: SUPPORTIVE_PERSONA },
    {
      role: "user",
      content: `Laken is applying for a "${targetJob}" position. Here's her experience:

${experience}

Please write a warm, professional 2-3 sentence resume summary that:
1. Highlights her relevant strengths
2. Sounds confident but approachable
3. Is tailored to data entry / administrative work
4. Addresses her in third person as "Laken"

Return ONLY the summary, nothing else.`,
    },
  ];

  return chat(messages, 0.8);
}

// ─── Suggest Skills for a Job ─────────────────────────────
export interface SkillSuggestions {
  skills: string[];
  encouragement: string;
}

export async function suggestSkills(
  jobTitle: string,
  jobDescription: string,
  currentSkills: string
): Promise<SkillSuggestions> {
  const messages: DeepSeekMessage[] = [
    { role: "system", content: SUPPORTIVE_PERSONA },
    {
      role: "user",
      content: `Laken is interested in this job:

**Title:** ${jobTitle}
**Description:** ${jobDescription.slice(0, 2000)}

Her current skills: ${currentSkills || "She's starting out — be encouraging!"}

Please:
1. List 5-7 key skills (both technical and soft) that would make her a strong candidate for this job
2. For each skill she already has, note it with a ✅ and add a quick tip to strengthen it
3. For each skill she doesn't have yet, note it with a 🌱 and add a friendly suggestion for how she can start learning it
4. End with a short encouraging message just for Laken

Format your response as JSON with this structure:
{
  "skills": ["Skill: description with emoji"],
  "encouragement": "Your encouraging message to Laken"
}

Return ONLY valid JSON, nothing else.`,
    },
  ];

  const raw = await chat(messages, 0.7);
  try {
    return JSON.parse(raw);
  } catch {
    // Fallback parsing
    return {
      skills: [raw],
      encouragement: "You've got this, Laken! Every expert was once a beginner. 💪✨",
    };
  }
}

// ─── Analyze Job Fit ──────────────────────────────────────
export async function analyzeJobFit(
  jobTitle: string,
  jobDescription: string,
  resumeText: string
): Promise<string> {
  const messages: DeepSeekMessage[] = [
    { role: "system", content: SUPPORTIVE_PERSONA },
    {
      role: "user",
      content: `Laken is looking at this job:

**Title:** ${jobTitle}
**Description:** ${jobDescription.slice(0, 2000)}

Her resume says: ${resumeText.slice(0, 1500)}

Please give Laken a friendly, honest assessment:
1. How well does she fit this role? (be encouraging!)
2. What are her top 2-3 strengths for this job?
3. What 1-2 things could she highlight differently in her application?
4. A quick confidence boost ✨

Keep it warm and conversational, like a supportive friend. Use her name.`,
    },
  ];

  return chat(messages, 0.8);
}
