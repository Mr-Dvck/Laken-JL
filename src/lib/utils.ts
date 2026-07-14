import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Just now";
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len).replace(/\s+\S*$/, "") + "…";
}

export function getGreeting(): { greeting: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: "Good morning", emoji: "☀️" };
  if (hour < 17) return { greeting: "Good afternoon", emoji: "🌸" };
  return { greeting: "Good evening", emoji: "✨" };
}

export const ENCOURAGEMENTS = [
  "You're doing amazing, Laken! 💕",
  "Every application brings you closer to the perfect job!",
  "Your skills are valuable — never doubt that! 🌟",
  "The right job is out there looking for YOU!",
  "One step at a time, Laken. You've got this! 💪",
  "Your attention to detail is a superpower! 🦸‍♀️",
  "Keep shining — employers are lucky to find you! ✨",
];

export function randomEncouragement(): string {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}
