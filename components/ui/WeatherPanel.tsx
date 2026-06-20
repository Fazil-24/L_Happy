"use client";
import { motion } from "framer-motion";

interface WeatherPanelProps {
  adoptionSunshine: number;
  backlashStorm: number;
  confusionFog: number;
  trustTurbulence: number;
}

const metrics = [
  {
    key: "adoptionSunshine" as const,
    label: "Adoption Sunshine",
    emoji: "☀️",
    goodHigh: true,
    color: "emerald",
  },
  {
    key: "backlashStorm" as const,
    label: "Backlash Storm",
    emoji: "⛈️",
    goodHigh: false,
    color: "red",
  },
  {
    key: "confusionFog" as const,
    label: "Confusion Fog",
    emoji: "🌫️",
    goodHigh: false,
    color: "orange",
  },
  {
    key: "trustTurbulence" as const,
    label: "Trust Turbulence",
    emoji: "💨",
    goodHigh: false,
    color: "amber",
  },
];

const barColors: Record<string, string> = {
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
};

export default function WeatherPanel(props: WeatherPanelProps) {
  return (
    <div className="glass rounded-2xl p-5 border border-[var(--glass-border)]">
      <h3 className="font-semibold text-[var(--text-primary)] mb-1">Launch Weather</h3>
      <p className="text-xs text-[var(--text-tertiary)] mb-5">Market climate forecast</p>
      <div className="space-y-4">
        {metrics.map((m, i) => {
          const value = props[m.key];
          return (
            <div key={m.key}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <span>{m.emoji}</span>
                  {m.label}
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">{value}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 dark:bg-white/5">
                <motion.div
                  className={`h-full rounded-full ${barColors[m.color]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.7 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
