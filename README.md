# 💕 Laken's Job Journey

A friendly, supportive job search & resume builder built just for Laken.  
Helps find data entry and administrative roles, build polished resumes, and boost skills — all powered by AI.

## ✨ Features

- **🔍 Job Search** — Browse data entry & admin jobs via Adzuna API
- **📝 Resume Builder** — Create and polish your resume with AI-powered enhancement (DeepSeek)
- **🌱 Skill Booster** — Analyze job listings to see what skills to learn and how to grow
- **💕 Laken-Personalized** — Warm, encouraging tone throughout. You've got this!

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Mr-Dvck/Laken-JL.git
cd Laken-JL
npm install
```

### 2. Set Up Environment Variables

Copy the example and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

| Variable | Where to Get It |
|----------|-----------------|
| `ADZUNA_APP_ID` | [Adzuna Developer](https://developer.adzuna.com/) |
| `ADZUNA_APP_KEY` | [Adzuna Developer](https://developer.adzuna.com/) |
| `DEEPSEEK_API_KEY` | [DeepSeek Platform](https://platform.deepseek.com/) |

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it! 💕

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select `Mr-Dvck/Laken-JL`
3. Add the same environment variables in **Settings → Environment Variables**
4. Deploy! 🚀

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **APIs:** Adzuna (jobs) + DeepSeek (AI enhancement)
- **Deployment:** Vercel

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── jobs/search/route.ts      # Adzuna proxy
│   │   ├── resume/enhance/route.ts    # DeepSeek resume enhancer
│   │   └── skills/suggest/route.ts    # DeepSeek skill analyzer
│   ├── jobs/page.tsx                  # Job search page
│   ├── resume/page.tsx                # Resume builder page
│   ├── skills/page.tsx                # Skill booster page
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Home dashboard
│   └── globals.css                    # Global styles
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── LakenGreeting.tsx
│   ├── JobCard.tsx
│   └── LoadingSpinner.tsx
├── lib/
│   ├── adzuna.ts                      # Adzuna API client
│   ├── deepseek.ts                    # DeepSeek API client
│   └── utils.ts                       # Helpers
└── types/
    └── index.ts                       # TypeScript types
```

---

Made with 💕 for Laken · She's going to do amazing things!
