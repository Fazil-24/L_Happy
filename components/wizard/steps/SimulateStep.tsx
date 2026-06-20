"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SimulationResult, ExtractedInsights } from "@/lib/types";
import PersonaCard from "@/components/ui/PersonaCard";
import WeatherPanel from "@/components/ui/WeatherPanel";
import ChatAssistant from "@/components/wizard/ChatAssistant";
import { cn, getSentimentColor } from "@/lib/utils";
import { ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";

interface SimulateStepProps {
  result: SimulationResult;
  insights: ExtractedInsights;
  onGeneratePlaybook: () => void;
}

type Scenario = "best" | "likely" | "worst";

const scenarioConfig: Record<Scenario, { label: string; sublabel: string; color: string; emoji: string; bg: string }> = {
  best: {
    label: "Best Case",
    sublabel: "Optimistic",
    color: "emerald",
    emoji: "🌟",
    bg: "bg-emerald-600/90",
  },
  likely: {
    label: "Likely Case",
    sublabel: "Most Probable",
    color: "cyan",
    emoji: "📊",
    bg: "bg-cyan-600/90",
  },
  worst: {
    label: "Worst Case",
    sublabel: "Pessimistic",
    color: "red",
    emoji: "⚠️",
    bg: "bg-red-600/90",
  },
};

export default function SimulateStep({ result, insights, onGeneratePlaybook }: SimulateStepProps) {
  // Default to "likely" — the most probable scenario
  const [activeScenario, setActiveScenario] = useState<Scenario>("likely");

  const personas = result.personas.filter((p) => p.scenario === activeScenario);

  const sentimentForScenario: Record<Scenario, number> = {
    best: Math.min(100, result.overallSentiment + 25),
    likely: result.overallSentiment,
    worst: Math.max(0, result.overallSentiment - 30),
  };

  const displaySentiment = sentimentForScenario[activeScenario];
  const cfg = scenarioConfig[activeScenario];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Simulation Results</h2>
        <p className="text-[var(--text-secondary)]">
          Starting with the <span className="text-cyan-400 font-semibold">most probable scenario</span> — switch tabs to explore alternatives
        </p>
      </motion.div>

      {/* Scenario tabs */}
      <div className="flex gap-2 glass rounded-xl p-1 mb-8">
        {(["likely", "best", "worst"] as Scenario[]).map((s) => {
          const c = scenarioConfig[s];
          const isActive = s === activeScenario;
          return (
            <button
              key={s}
              onClick={() => setActiveScenario(s)}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex flex-col items-center",
                isActive ? `${c.bg} text-white` : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              <span className="flex items-center gap-1.5">
                <span>{c.emoji}</span>
                {c.label}
              </span>
              {s === "likely" && (
                <span className={cn("text-xs mt-0.5", isActive ? "text-white/70" : "text-cyan-400")}>
                  ★ Most Probable
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Sentiment meter */}
        <motion.div
          key={activeScenario + "-sentiment"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-5 border border-[var(--glass-border)]"
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">Overall Sentiment</h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">
            {result.sentimentLabel} · {cfg.sublabel}
          </p>

          <div className="flex items-end gap-3 mb-4">
            <div className={cn("text-5xl font-bold", getSentimentColor(displaySentiment))}>
              {displaySentiment}
            </div>
            <div className="text-xl text-[var(--text-tertiary)] mb-1">/ 100</div>
          </div>

          <div className="h-3 rounded-full bg-white/5">
            <motion.div
              className={cn(
                "h-full rounded-full",
                displaySentiment >= 70
                  ? "bg-emerald-500"
                  : displaySentiment >= 50
                  ? "bg-cyan-500"
                  : displaySentiment >= 30
                  ? "bg-amber-500"
                  : "bg-red-500"
              )}
              animate={{ width: `${displaySentiment}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>

          <div className="mt-4 text-xs text-[var(--text-tertiary)]">
            {activeScenario === "likely"
              ? "Based on your current persona parameters"
              : activeScenario === "best"
              ? "If everything aligns in your favor"
              : "If key risks materialize simultaneously"}
          </div>
        </motion.div>

        {/* Weather panel */}
        <div className="lg:col-span-2">
          <WeatherPanel {...result.weatherReport} />
        </div>
      </div>

      {/* Risks & Opportunities */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="glass rounded-2xl p-5 border border-red-500/10">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Top Risks
          </h4>
          <ul className="space-y-2">
            {result.topRisks.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-red-400 flex-shrink-0 mt-0.5">·</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-5 border border-emerald-500/10">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Top Opportunities
          </h4>
          <ul className="space-y-2">
            {result.topOpportunities.map((o, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-emerald-400 flex-shrink-0 mt-0.5">·</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Persona cards */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-semibold text-[var(--text-primary)]">
            Persona Reactions
          </h3>
          <span className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full",
            cfg.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" :
            cfg.color === "cyan" ? "bg-cyan-500/10 text-cyan-400" :
            "bg-red-500/10 text-red-400"
          )}>
            {cfg.emoji} {cfg.label}
          </span>
        </div>
        <motion.div
          key={activeScenario}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {personas.map((p, i) => (
            <PersonaCard key={`${activeScenario}-${i}`} persona={p} index={i} />
          ))}
        </motion.div>
      </div>

      <button
        onClick={onGeneratePlaybook}
        className="btn-primary w-full justify-center py-4 text-base"
      >
        Generate Launch Playbook <ArrowRight className="w-5 h-5" />
      </button>

      {/* Floating chat assistant */}
      <ChatAssistant insights={insights} simulation={result} />
    </div>
  );
}
