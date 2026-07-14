"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Briefcase, FileText, Sparkles, Heart } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Heart },
  { href: "/jobs", label: "Find Jobs", icon: Briefcase },
  { href: "/resume", label: "My Resume", icon: FileText },
  { href: "/skills", label: "Skill Boost", icon: Sparkles },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-pink-100 shadow-sm">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-display font-bold
                       text-laken-600 hover:text-laken-700 transition-colors"
          >
            <span className="text-2xl">💕</span>
            <span className="hidden sm:inline">Laken&apos;s Journey</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-laken-100 text-laken-700 shadow-sm"
                      : "text-gray-500 hover:text-laken-600 hover:bg-pink-50"
                  )}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
