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
          jobTitle: "data entry",
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
              <pre className="font-body text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {previewText || (
                  <span className="text-gray-400 italic">
                    Your resume will appear here as you fill it in, Laken! Start typing on the left. 💕
                  </span>
                )}
              </pre>
            </div>
          </div>

          {/* Tips Card */}
          <div className="card mt-4 bg-gradient-to-br from-purple-50/50 to-white border-purple-100">
            <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <Sparkles size={16} />
              Pro Tips for Laken
            </h4>
            <ul className="text-sm text-purple-600 space-y-1.5">
              <li>• Use the <strong>Enhance</strong> button to make your bullets shine ✨</li>
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
