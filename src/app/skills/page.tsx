"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SkillSuggestions } from "@/lib/deepseek";
import {
  Sparkles,
  Search,
  Lightbulb,
  Target,
  CheckCircle2,
  Sprout,
  ArrowRight,
  Heart,
} from "lucide-react";

export default function SkillsPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SkillSuggestions | null>(null);

  async function analyzeSkills(e: React.FormEvent) {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/skills/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, currentSkills }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data: SkillSuggestions = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze. Try again, Laken!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          🌱 Skill Booster
        </h1>
        <p className="text-gray-500">
          See what skills will help you land that dream job, Laken!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Target size={18} className="text-amber-500" />
            What job are you aiming for?
          </h3>

          <form onSubmit={analyzeSkills} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder='e.g. "Data Entry Clerk" or "Administrative Assistant"'
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Paste the job description{" "}
                <span className="text-gray-400 font-normal">(optional, but helps!)</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting here for a better analysis..."
                rows={5}
                className="input-field resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Your current skills{" "}
                <span className="text-gray-400 font-normal">(be honest!)</span>
              </label>
              <textarea
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="List what you're already good at — typing speed, Microsoft Office, Google Sheets, organization, etc. Don't be shy! 💕"
                rows={3}
                className="input-field resize-y"
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? (
                <>Analyzing...</>
              ) : (
                <>
                  <Sparkles size={18} /> Analyze My Skills
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading && (
            <div className="card">
              <LoadingSpinner text="Analyzing your skills and the job requirements..." />
            </div>
          )}

          {error && (
            <div className="card border-red-200 bg-red-50 text-center">
              <p className="text-red-600 mb-2">😕 {error}</p>
              <button onClick={analyzeSkills} className="btn-secondary text-sm">
                Try Again
              </button>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Skills List */}
              <div className="card">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-500" />
                  Skills to Focus On
                </h3>
                <div className="space-y-3">
                  {result.skills.map((skill, i) => {
                    const isHave = skill.includes("✅");
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                          isHave
                            ? "bg-green-50 border border-green-100"
                            : "bg-amber-50 border border-amber-100"
                        }`}
                      >
                        {isHave ? (
                          <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Sprout size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm text-gray-700">{skill}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Encouragement */}
              <div className="card bg-gradient-to-br from-laken-50 to-white border-laken-200">
                <div className="flex items-start gap-3">
                  <Heart size={24} className="text-laken-400 fill-laken-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-laken-700 mb-1">
                      A message for you, Laken:
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {result.encouragement}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !result && (
            <div className="card text-center py-12">
              <p className="text-5xl mb-4">🌱</p>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Ready to level up?
              </h3>
              <p className="text-gray-500 text-sm">
                Paste a job listing on the left and I&apos;ll show you exactly what skills to
                focus on. You&apos;ve got this, Laken! ✨
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Skills Reference */}
      <div className="card mt-8 border-amber-100 bg-gradient-to-br from-amber-50/50 to-white">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📋 Top Skills for Data Entry Roles
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { skill: "Typing 50+ WPM", icon: "⌨️" },
            { skill: "Microsoft Excel", icon: "📊" },
            { skill: "Google Sheets", icon: "📋" },
            { skill: "Attention to Detail", icon: "🔍" },
            { skill: "10-Key Data Entry", icon: "🔢" },
            { skill: "Time Management", icon: "⏰" },
            { skill: "Organization", icon: "📁" },
            { skill: "Written Communication", icon: "✍️" },
          ].map(({ skill, icon }) => (
            <div
              key={skill}
              className="flex items-center gap-2 p-3 rounded-xl bg-white border border-amber-100 text-sm text-gray-700"
            >
              <span className="text-lg">{icon}</span>
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
