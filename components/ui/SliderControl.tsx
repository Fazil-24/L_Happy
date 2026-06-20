"use client";
import { cn } from "@/lib/utils";

interface SliderControlProps {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  leftLabel: string;
  rightLabel: string;
  color?: string;
}

export default function SliderControl({
  label,
  description,
  value,
  onChange,
  leftLabel,
  rightLabel,
  color = "violet",
}: SliderControlProps) {
  const gradients: Record<string, string> = {
    violet: "from-violet-600 to-purple-500",
    cyan: "from-cyan-600 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    pink: "from-pink-600 to-rose-500",
    emerald: "from-emerald-600 to-teal-500",
    blue: "from-blue-600 to-indigo-500",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
          <div className="text-xs text-[var(--text-tertiary)]">{description}</div>
        </div>
        <div
          className={cn(
            "text-sm font-bold px-2 py-0.5 rounded-lg",
            value >= 66
              ? "text-emerald-400 bg-emerald-400/10"
              : value >= 33
              ? "text-amber-400 bg-amber-400/10"
              : "text-red-400 bg-red-400/10"
          )}
        >
          {value}
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, var(--slider-fill, #7c3aed) ${value}%, rgba(255,255,255,0.1) ${value}%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
