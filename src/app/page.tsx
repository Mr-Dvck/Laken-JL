"use client";

import LakenGreeting from "@/components/LakenGreeting";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Sparkles,
  ArrowRight,
  Search,
  PenTool,
  Lightbulb,
  Target,
} from "lucide-react";

const quickActions = [
  {
    href: "/jobs",
    icon: Briefcase,
    title: "Find Jobs",
    description: "Browse data entry & admin roles near you",
    color: "from-laken-500 to-laken-600",
    bg: "bg-laken-50",
  },
  {
    href: "/resume",
    icon: FileText,
    title: "Build Resume",
    description: "Create a polished resume that stands out",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
  },
  {
    href: "/skills",
    icon: Sparkles,
    title: "Boost Skills",
    description: "See what skills to learn & how to grow",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
  },
];

const tips = [
  {
    icon: Search,
    text: "Use specific keywords like \"data entry clerk\" or \"administrative assistant\" for better results.",
  },
  {
    icon: PenTool,
    text: "Tailor your resume for each job — highlight the skills they're asking for!",
  },
  {
    icon: Lightbulb,
    text: "Even if you don't have every skill listed, apply anyway — enthusiasm counts!",
  },
  {
    icon: Target,
    text: "Set a goal of 3-5 applications per day. Consistency is key, Laken!",
  },
];

export default function HomePage() {
  return (
    <div className="py-4">
      <LakenGreeting />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {quickActions.map(({ href, icon: Icon, title, description, color, bg }) => (
          <Link
            key={href}
            href={href}
            className={`card group hover:scale-[1.02] transition-all duration-300 ${bg}`}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}
            >
              <Icon size={22} className="text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              {title}
              <ArrowRight
                size={16}
                className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
              />
            </h3>
            <p className="text-sm text-gray-500">{description}</p>
          </Link>
        ))}
      </div>

      {/* Tips Section */}
      <div className="card border-amber-100 bg-gradient-to-br from-amber-50/50 to-white">
        <h2 className="text-xl font-display font-bold text-gray-800 mb-4 flex items-center gap-2">
          💡 Tips for Your Job Hunt
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={16} className="text-amber-600" />
              </div>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Footer */}
      <div className="mt-12 text-center">
        <p className="text-4xl mb-3">🌟</p>
        <p className="text-gray-500 text-sm">
          The perfect job doesn&apos;t find you — you find it.{" "}
          <span className="text-laken-500 font-medium">
            And you&apos;re already on your way, Laken.
          </span>
        </p>
      </div>
    </div>
  );
}
