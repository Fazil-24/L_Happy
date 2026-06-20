"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

const scenarios = {
  best: {
    label: "Best Case",
    color: "emerald",
    sentiment: 84,
    weather: { sunshine: 88, storm: 12, fog: 18, turbulence: 15 },
    highlights: [
      "Power users drive organic viral sharing within teams",
      "Privacy-conscious admins approve after first security review",
      "New users onboard within 5 minutes with zero support",
    ],
  },
  likely: {
    label: "Likely Case",
    color: "cyan",
    sentiment: 58,
    weather: { sunshine: 61, storm: 34, fog: 45, turbulence: 38 },
    highlights: [
      "Strong uptake from early adopters in first two weeks",
      "Admin approval slows rollout — needs security documentation",
      "New user confusion on step 3 — friction point to fix",
    ],
  },
  worst: {
    label: "Worst Case",
    color: "red",
    sentiment: 28,
    weather: { sunshine: 24, storm: 72, fog: 68, turbulence: 65 },
    highlights: [
      "Privacy backlash in team Slack after public announcement",
      "Competitor claims feature parity, dilutes excitement",
      "Onboarding drop-off above 60% in first session",
    ],
  },
};

type ScenarioKey = keyof typeof scenarios;

const tabColors: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  red: "bg-red-500/20 text-red-400 border-red-500/40",
};

const barColors: Record<string, string> = {
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
  red: "bg-red-500",
};

export default function ScenarioPreview() {
  const [active, setActive] = useState<ScenarioKey>("likely");
  const s = scenarios[active];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-tag mb-4 inline-flex">Launch scenarios</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4 mb-4">
            Three futures.{" "}
            <span className="text-gradient-purple">One smart plan.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            Explore best, likely, and worst-case outcomes side by side. The playbook
            accounts for all three so you&apos;re never caught off guard.
          </p>
        </motion.div>

        <div className="glass rounded-2xl border border-[var(--glass-border)] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] p-1 gap-1 bg-white/2">
            {(["best", "likely", "worst"] as ScenarioKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-sm font-semibold transition-all border",
                  active === key
                    ? tabColors[scenarios[key].color]
                    : "text-[var(--text-tertiary)] border-transparent hover:text-[var(--text-secondary)]"
                )}
              >
                {scenarios[key].label}
              </button>
            ))}
          </div>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sentiment + weather */}
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      Overall Sentiment
                    </span>
                    <span
                      className={cn(
                        "text-2xl font-bold",
                        s.color === "emerald"
                          ? "text-emerald-400"
                          : s.color === "cyan"
                          ? "text-cyan-400"
                          : "text-red-400"
                      )}
                    >
                      {s.sentiment}%
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 dark:bg-white/5 light:bg-black/5">
                    <motion.div
                      className={cn("h-full rounded-full", barColors[s.color])}
                      animate={{ width: `${s.sentiment}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "☀️ Adoption Sunshine", value: s.weather.sunshine },
                    { label: "⛈️ Backlash Storm", value: s.weather.storm },
                    { label: "🌫️ Confusion Fog", value: s.weather.fog },
                    { label: "💨 Trust Turbulence", value: s.weather.turbulence },
                  ].map((w) => (
                    <div key={w.label}>
                      <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                        <span>{w.label}</span>
                        <span>{w.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 dark:bg-white/5 light:bg-black/5">
                        <motion.div
                          className={cn("h-full rounded-full opacity-70", barColors[s.color])}
                          animate={{ width: `${w.value}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-4 uppercase tracking-wide">
                  Key signals
                </h4>
                <ul className="space-y-3">
                  {s.highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 text-sm text-[var(--text-secondary)]"
                    >
                      <span
                        className={cn(
                          "mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0",
                          barColors[s.color]
                        )}
                      />
                      {h}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
