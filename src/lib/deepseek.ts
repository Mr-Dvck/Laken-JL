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

// ─── Chat with Laken (General Assistant) ──────────────────
const CHAT_PERSONA = `You are Laken's personal AI career assistant — warm, encouraging, and a little sassy in a fun way. 
You live in the corner of her job search website. Your name is "Laken's AI Buddy."

CRITICAL RULES:
- Keep responses SHORT (2-4 sentences max) — she's on a website, not reading a novel
- Use her name occasionally but not every message
- Be hype and positive — you're her cheerleader
- Use emojis naturally ✨💕
- If she asks about resume stuff, offer to help with specific sections
- If she mentions a job title like "data entry", hype her up about how she's perfect for it
- Keep it conversational like texting a supportive best friend
- NEVER be robotic or corporate-sounding`;

export async function chatWithLaken(
  message: string,
  history: { role: string; content: string }[]
): Promise<string> {
  const messages: DeepSeekMessage[] = [
    { role: "system", content: CHAT_PERSONA },
    ...history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  return chat(messages, 0.9);
}

// ─── Generate Experience Bullets (Columbia, SC specific) ──
export async function generateExperienceBullets(
  input: string,
  location: string,
  targetRole: string
): Promise<string[]> {
  const messages: DeepSeekMessage[] = [
    { role: "system", content: SUPPORTIVE_PERSONA },
    {
      role: "user",
      content: `Laken is building her resume for ${targetRole} jobs in ${location}. 

She told me about her past work: "${input}"

Please generate 4-5 STRONG, realistic resume bullet points based on what she described. 

CRITICAL RULES:
- Make them sound REAL and specific to ${location} — reference realistic local employers (doctor's offices, government offices, USC, Prisma Health, BlueCross BlueShield, local businesses, etc.)
- Use strong action verbs (Managed, Coordinated, Processed, Implemented, Streamlined, etc.)
- Quantify EVERYTHING with realistic numbers (patient records, daily calls, files processed, etc.)
- Each bullet should be 1-2 sentences, professional but not robotic
- Infer reasonable responsibilities from what she described — fill in the gaps intelligently
- Make her sound like a STAR employee who any office would be lucky to have
- NO generic placeholder text — every bullet should feel like a real person's real experience

Return ONLY a JSON array of strings like:
["bullet one", "bullet two", "bullet three", "bullet four", "bullet five"]

No markdown, no explanations — ONLY the JSON array.`,
    },
  ];

  const raw = await chat(messages, 0.85);
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    // Fallback — split by newlines and clean up
    return raw
      .split("\n")
      .map((line) => line.replace(/^[\d•\-.\s]+/, "").trim())
      .filter((line) => line.length > 15);
  }
}

// ─── Generate Full Resume from Job Title ──────────────────
export interface GeneratedResume {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  encouragement: string;
}

export async function generateFullResume(
  jobTitle: string,
  currentSkills: string
): Promise<GeneratedResume> {
  const messages: DeepSeekMessage[] = [
    { role: "system", content: SUPPORTIVE_PERSONA },
    {
      role: "user",
      content: `Laken needs a COMPLETE, impressive resume for a "${jobTitle}" position.

${currentSkills ? `She mentioned these skills: ${currentSkills}` : "She's starting out — make her look amazing!"}

Generate a full professional resume for her. Make it DETAILED and IMPRESSIVE — use strong action verbs, quantify results with realistic numbers, and make her sound like a star candidate.

Return valid JSON with this exact structure:
{
  "summary": "A powerful 3-sentence professional summary about Laken, highlighting her as a detail-oriented professional. Use third person.",
  "experience": "• Managed data entry operations for 500+ daily records with 99.8% accuracy rate\\n• Implemented new digital filing system reducing document retrieval time by 45%\\n• Trained 3 new team members on database management and quality control procedures\\n• Processed and verified 1,000+ invoices monthly using SAP and QuickBooks\\n• Maintained strict confidentiality while handling sensitive client information for 200+ accounts",
  "education": "• Associate of Applied Science in Business Administration — [Local Community College]\\n• Certified Data Entry Specialist (CDES) — International Association of Administrative Professionals\\n• Microsoft Office Specialist (MOS): Excel Expert Certification",
  "skills": "• Typing Speed: 65+ WPM with 98% accuracy\\n• Software: Microsoft Excel (Advanced), Google Sheets, SAP, QuickBooks, Salesforce\\n• Data Management: 10-Key Data Entry, Database Administration, Records Management\\n• Soft Skills: Attention to Detail, Time Management, Organizational Skills, Written Communication\\n• Languages: English (Native)",
  "encouragement": "A short 1-2 sentence hype message just for Laken about how this resume will open doors!"
}

CRITICAL RULES:
- Make the experience bullets VERY specific to the job title "${jobTitle}"
- Use REALISTIC company names, numbers, and metrics — not generic placeholders
- Education should be realistic for someone entering the field (associates, certifications, relevant training)
- Skills must match what employers actually look for in ${jobTitle} roles
- The summary MUST mention Laken by name
- Experience should have 4-5 detailed bullet points
- Skills should have 5-7 items grouped by category
- Make it sound like a REAL resume that would get hired — not a template

Return ONLY valid JSON. No markdown, no explanations.`,
    },
  ];

  const raw = await chat(messages, 0.8);
  try {
    // Clean up any markdown code blocks if present
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback — return raw text split into sections
    return {
      summary: `Laken is a dedicated and detail-oriented ${jobTitle} professional with a proven track record of accuracy and efficiency. She brings strong organizational skills and a commitment to excellence in every task she undertakes. Ready to contribute her talents to a dynamic team.`,
      experience: `• Processed high-volume data entry tasks with consistent accuracy and speed\n• Maintained organized digital filing systems for efficient document retrieval\n• Collaborated with team members to meet daily processing targets\n• Ensured data integrity through careful verification and quality control checks`,
      education: `• High School Diploma\n• Relevant coursework in business administration and computer applications`,
      skills: `• Typing Speed: 55+ WPM\n• Microsoft Office Suite (Word, Excel, Outlook)\n• Google Workspace (Docs, Sheets, Drive)\n• Attention to Detail\n• Time Management\n• Organization\n• Written and Verbal Communication`,
      encouragement: `This resume is going to open doors for you, Laken! You've got everything employers are looking for — now go show them! ✨💕`,
    };
  }
}
