"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Wand2,
  Save,
  Zap,
  Rocket,
  Stars,
} from "lucide-react";

interface Section {
  id: string;
  type: "summary" | "experience" | "education" | "skills";
  title: string;
  content: string;
}

const defaultSections: Section[] = [
  { id: "1", type: "summary", title: "Professional Summary", content: "" },
  { id: "2", type: "experience", title: "Work Experience", content: "" },
  { id: "3", type: "education", title: "Education", content: "" },
  { id: "4", type: "skills", title: "Skills", content: "" },
];

export default function ResumePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [blowupJobTitle, setBlowupJobTitle] = useState("");
  const [blowupSkills, setBlowupSkills] = useState("");

  function updateSection(id: string, content: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
  }

  async function enhanceSection(section: Section) {
    setEnhancing(section.id);
    try {
      const res = await fetch("/api/resume/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: section.content,
          sectionType: section.type,
          jobTitle: blowupJobTitle || "data entry",
        }),
      });
      const data = await res.json();
      if (data.enhanced) {
        updateSection(section.id, data.enhanced);
      }
    } catch (err) {
      console.error("Failed to enhance:", err);
    } finally {
      setEnhancing(null);
    }
  }

  async function blowUpResume() {
    const title = blowupJobTitle.trim();
    if (!title) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: title,
          currentSkills: blowupSkills,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();

      // Fill all sections with the generated content
      setSections((prev) =>
        prev.map((s) => {
          if (s.type === "summary") return { ...s, content: data.summary || "" };
          if (s.type === "experience") return { ...s, content: data.experience || "" };
          if (s.type === "education") return { ...s, content: data.education || "" };
          if (s.type === "skills") return { ...s, content: data.skills || "" };
          return s;
        })
      );

      // Also fill in a placeholder name if empty
      if (!name) setName("Laken");
    } catch (err) {
      console.error("Failed to generate resume:", err);
    } finally {
      setGenerating(false);
    }
  }

  function addSection() {
    const newSection: Section = {
      id: Date.now().toString(),
      type: "experience",
      title: "Additional Experience",
      content: "",
    };
    setSections((prev) => [...prev, newSection]);
  }

  function removeSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function copyResume() {
    let text = `${name}\n${email} | ${phone}\n\n`;
    sections.forEach((s) => {
      text += `${s.title}\n${"─".repeat(s.title.length)}\n${s.content}\n\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const previewText = [
    name,
    email && phone ? `${email} · ${phone}` : email || phone,
    ...sections.filter((s) => s.content).map((s) => `\n${s.title}\n${s.content}`),
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="py-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          📝 Build Your Resume
        </h1>
        <p className="text-gray-500">
          Let&apos;s make your experience shine, Laken! I&apos;ll help you every step of the way.
        </p>
      </div>

      {/* 🚀 Blow It Up — Auto-Generate Full Resume */}
      <div className="card mb-8 border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 overflow-hidden relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-laken-400/10 to-amber-400/5 animate-shimmer pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-laken-500 flex items-center justify-center shadow-lg shadow-purple-200 animate-glow-pulse">
              <Rocket size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                🚀 BLOW IT UP — Auto-Generate Full Resume
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium animate-magic-sparkle">
                  AI MAGIC
                </span>
              </h3>
              <p className="text-sm text-gray-500">
                Type a job title below and I&apos;ll build you a COMPLETE, impressive resume in seconds!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={blowupJobTitle}
              onChange={(e) => setBlowupJobTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") blowUpResume();
              }}
              placeholder='e.g. "Data Entry Clerk" or "Administrative Assistant"'
              className="input-field flex-1 border-purple-200 focus:border-purple-400 focus:ring-purple-100"
            />
            <input
              type="text"
              value={blowupSkills}
              onChange={(e) => setBlowupSkills(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") blowUpResume();
              }}
              placeholder="Your skills (optional) — e.g. typing, Excel"
              className="input-field flex-1 border-purple-200 focus:border-purple-400 focus:ring-purple-100"
            />
            <button
              onClick={blowUpResume}
              disabled={!blowupJobTitle.trim() || generating}
              className="btn-primary whitespace-nowrap bg-gradient-to-r from-purple-500 via-laken-500 to-amber-500
                         hover:from-purple-600 hover:via-laken-600 hover:to-amber-600
                         shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Wand2 size={18} className="animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Stars size={18} className="animate-magic-sparkle" /> Blow It Up! 🔥
                </>
              )}
            </button>
          </div>

          {/* Quick-fill chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-gray-400 pt-1">Quick fill:</span>
            {["Data Entry Clerk", "Administrative Assistant", "Office Assistant", "Remote Data Entry", "Receptionist"].map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => { setBlowupJobTitle(title); }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all
                  ${blowupJobTitle === title
                    ? "bg-purple-100 text-purple-700 border-2 border-purple-300 shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50"
                  }`}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          {/* Contact Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-laken-500" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <div key={section.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">{section.title}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => enhanceSection(section)}
                    disabled={!section.content || enhancing === section.id}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl
                               bg-purple-50 text-purple-600 hover:bg-purple-100
                               disabled:opacity-50 transition-all font-medium"
                  >
                    {enhancing === section.id ? (
                      <>
                        <Wand2 size={14} className="animate-spin" /> Working...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Enhance
                      </>
                    )}
                  </button>
                  {section.type === "experience" && sections.length > 1 && (
                    <button
                      onClick={() => removeSection(section.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, e.target.value)}
                placeholder={`Write your ${section.title.toLowerCase()} here...\n\nTip: Use bullet points starting with • for each item.`}
                rows={5}
                className="input-field resize-y"
              />
            </div>
          ))}

          <button onClick={addSection} className="btn-secondary text-sm">
            <Plus size={16} /> Add Section
          </button>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <FileText size={18} className="text-laken-500" />
                Live Preview
              </h3>
              <button
                onClick={copyResume}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl
                           bg-laken-50 text-laken-600 hover:bg-laken-100 transition-all font-medium"
              >
                {copied ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 min-h-[300px]">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
                  <Wand2 size={32} className="text-purple-400 animate-spin mb-3" />
                  <p className="text-purple-600 font-medium text-sm">Working my magic, Laken...</p>
                  <p className="text-gray-400 text-xs mt-1">Building you an amazing resume! ✨</p>
                </div>
              ) : (
                <pre className="font-body text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {previewText || (
                    <span className="text-gray-400 italic">
                      Your resume will appear here as you fill it in, Laken! Start typing on the left or use <strong className="text-purple-500">🚀 Blow It Up</strong> above! 💕
                    </span>
                  )}
                </pre>
              )}
            </div>
          </div>

          {/* Tips Card */}
          <div className="card mt-4 bg-gradient-to-br from-purple-50/50 to-white border-purple-100">
            <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <Sparkles size={16} />
              Pro Tips for Laken
            </h4>
            <ul className="text-sm text-purple-600 space-y-1.5">
              <li>• Use <strong>🚀 Blow It Up</strong> to generate a full resume from just a job title!</li>
              <li>• Use the <strong>Enhance</strong> button to polish individual sections ✨</li>
              <li>• Quantify your work — add numbers where you can!</li>
              <li>• Tailor your summary to each job you apply for</li>
              <li>• Keep it to one page for entry-level roles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
