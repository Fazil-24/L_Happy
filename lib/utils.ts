import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSentimentColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  if (score >= 30) return "text-orange-400";
  return "text-red-400";
}

export function getMoodColor(mood: string): string {
  const map: Record<string, string> = {
    excited: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    interested: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    neutral: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    skeptical: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    confused: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    blocked: "text-red-400 bg-red-400/10 border-red-400/20",
    resistant: "text-red-500 bg-red-500/10 border-red-500/20",
  };
  return map[mood] ?? "text-slate-400 bg-slate-400/10 border-slate-400/20";
}

export function getFitColor(fit: string): string {
  const map: Record<string, string> = {
    excellent: "text-emerald-400",
    good: "text-cyan-400",
    neutral: "text-slate-400",
    poor: "text-red-400",
  };
  return map[fit] ?? "text-slate-400";
}

export function getWeatherIcon(value: number): string {
  if (value >= 70) return "☀️";
  if (value >= 50) return "⛅";
  if (value >= 30) return "🌧️";
  return "⛈️";
}

// API routes are Next.js serverless functions at /api/*
