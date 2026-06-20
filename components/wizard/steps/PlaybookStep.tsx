"use client";
import { motion } from "framer-motion";
import { LaunchPlaybook, ExtractedInsights } from "@/lib/types";
import { getFitColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CheckCircle, Shield, Target, Zap, BarChart3, RefreshCw } from "lucide-react";
import DownloadButton from "@/components/ui/DownloadButton";
import ChatAssistant from "@/components/wizard/ChatAssistant";

interface PlaybookStepProps {
  playbook: LaunchPlaybook;
  featureName: string;
  insights: ExtractedInsights;
  onRestart: () => void;
}

const fitColors: Record<string, string> = {
  excellent: "border-emerald-500/40 bg-emerald-500/5",
  good: "border-cyan-500/40 bg-cyan-500/5",
  neutral: "border-slate-500/40 bg-slate-500/5",
  poor: "border-red-500/40 bg-red-500/5",
};

export default function PlaybookStep({ playbook, featureName, insights, onRestart }: PlaybookStepProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          Launch Playbook Ready
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Your Launch Strategy for{" "}
          <span className="text-gradient-purple">{featureName}</span>
        </h2>

        {/* Download + Readiness score row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-4">
        <DownloadButton playbook={playbook} insights={insights} />
        <div className="inline-flex items-center gap-3 glass rounded-2xl px-6 py-3 border border-[var(--glass-border)]">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          <span className="text-sm text-[var(--text-secondary)]">Launch Readiness Score</span>
          <span
            className={cn(
              "text-2xl font-bold",
              playbook.launchReadinessScore >= 70
                ? "text-emerald-400"
                : playbook.launchReadinessScore >= 50
                ? "text-amber-400"
                : "text-red-400"
            )}
          >
            {playbook.launchReadinessScore}
          </span>
          <span className="text-[var(--text-tertiary)] text-sm">/ 100</span>
        </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Recommended style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-violet-500/20"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-1">
                Recommended Launch Style
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {playbook.recommendedStyle.name}
              </h3>
            </div>
            <span
              className={cn(
                "text-sm font-semibold px-3 py-1.5 rounded-full",
                getFitColor(playbook.recommendedStyle.fit),
                playbook.recommendedStyle.fit === "excellent"
                  ? "bg-emerald-500/10"
                  : playbook.recommendedStyle.fit === "good"
                  ? "bg-cyan-500/10"
                  : "bg-slate-500/10"
              )}
            >
              {playbook.recommendedStyle.fitScore}% fit
            </span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
            {playbook.recommendedStyle.description}
          </p>
          <div className="glass rounded-xl p-3 border border-violet-500/10 mb-4">
            <span className="text-xs text-violet-400 font-semibold">Core message: </span>
            <span className="text-sm text-[var(--text-primary)]">
              {playbook.recommendedStyle.messagingAngle}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-emerald-400 mb-2">Pros</div>
              <ul className="space-y-1">
                {playbook.recommendedStyle.pros.map((p, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[var(--text-secondary)]">
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-red-400 mb-2">Cons</div>
              <ul className="space-y-1">
                {playbook.recommendedStyle.cons.map((c, i) => (
                  <li key={i} className="flex gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="text-red-400 flex-shrink-0">·</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 border border-[var(--glass-border)]"
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            Launch Messaging
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Headline</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {playbook.messaging.headline}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1">Subheadline</div>
              <div className="text-[var(--text-secondary)]">{playbook.messaging.subheadline}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-1">CTA</div>
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 font-semibold text-sm">
                {playbook.messaging.cta}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-tertiary)] uppercase tracking-wide mb-2">Key Messages by Persona</div>
              <ul className="space-y-2">
                {playbook.messaging.keyMessages.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="text-violet-400 flex-shrink-0">·</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Phases */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-[var(--glass-border)]"
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">Rollout Phases</h3>
          <div className="space-y-4">
            {playbook.phases.map((phase, i) => (
              <div
                key={i}
                className="relative pl-6 border-l-2 border-violet-500/30 pb-4 last:pb-0"
              >
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-violet-500" />
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-[var(--text-primary)] text-sm">{phase.phase}</span>
                  <span className="text-xs text-[var(--text-tertiary)] glass px-2 py-0.5 rounded-full border border-[var(--border)]">
                    {phase.duration}
                  </span>
                </div>
                <ul className="space-y-1 mb-2">
                  {phase.actions.map((a, j) => (
                    <li key={j} className="flex gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-emerald-400 font-medium">
                  ✓ Success: {phase.successMetric}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Safeguards + Metrics */}
        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-5 border border-amber-500/10"
          >
            <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Safeguards
            </h4>
            <ul className="space-y-2">
              {playbook.safeguards.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-amber-400 flex-shrink-0">·</span>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-5 border border-emerald-500/10"
          >
            <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Success Metrics
            </h4>
            <ul className="space-y-2">
              {playbook.successMetrics.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-emerald-400 flex-shrink-0">·</span>
                  {m}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Alternative launch styles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-6 border border-[var(--glass-border)]"
        >
          <h3 className="font-semibold text-[var(--text-primary)] mb-4">
            Competitor-Style Launch Board
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {playbook.allStyles.map((style, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl p-4 border",
                  fitColors[style.fit] ?? "border-[var(--border)]"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {style.name}
                  </span>
                  <span className={cn("text-xs font-bold", getFitColor(style.fit))}>
                    {style.fitScore}%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] leading-relaxed mb-2">
                  {style.messagingAngle}
                </p>
                <span
                  className={cn(
                    "text-xs font-semibold capitalize",
                    getFitColor(style.fit)
                  )}
                >
                  {style.fit} fit
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onRestart}
          className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl text-sm font-semibold text-[var(--text-secondary)] glass border border-[var(--border)] hover:border-violet-500/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Simulate a different launch
        </motion.button>
      </div>

      {/* Launch consultant available on playbook page too */}
      <ChatAssistant insights={insights} />
    </div>
  );
}
