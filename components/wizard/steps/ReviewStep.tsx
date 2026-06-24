"use client";
import { motion } from "framer-motion";
import { ExtractedInsights } from "@/lib/types";
import { CheckCircle, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
  insights: ExtractedInsights;
  onConfirm: () => void;
  onBack: () => void;
}

const complexityColors: Record<string, string> = {
  low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  high: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function ReviewStep({ insights, onConfirm, onBack }: ReviewStepProps) {
  const handleConfirm = () => {
    window.pendo?.track("insights_confirmed", {
      featureName: insights.featureName,
      launchComplexity: insights.launchComplexity,
      targetSegmentCount: insights.targetSegments?.length ?? 0,
      differentiatorCount: insights.keyDifferentiators?.length ?? 0,
      concernCount: insights.potentialConcerns?.length ?? 0,
      coreBenefit: insights.coreBenefit?.substring(0, 100) ?? "",
    });
    onConfirm();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Insights extracted
        </h2>
        <p className="text-[var(--text-secondary)]">
          Confirm the extracted details before tuning the simulation
        </p>
      </motion.div>

      <div className="space-y-5">
        {/* Feature header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-[var(--glass-border)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{insights.featureName}</h3>
              <p className="text-[var(--text-secondary)] mt-1 leading-relaxed">{insights.coreBenefit}</p>
            </div>
            <span
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-full border flex-shrink-0",
                complexityColors[insights.launchComplexity]
              )}
            >
              {insights.launchComplexity} complexity
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed border-t border-[var(--border)] pt-3">
            {insights.summary}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Target segments */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-5 border border-[var(--glass-border)]"
          >
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              🎯 Target Segments
            </h4>
            <ul className="space-y-2">
              {insights.targetSegments.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-violet-400 flex-shrink-0">·</span>
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Differentiators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-5 border border-[var(--glass-border)]"
          >
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              ⚡ Key Differentiators
            </h4>
            <ul className="space-y-2">
              {insights.keyDifferentiators.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-emerald-400 flex-shrink-0">·</span>
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Potential concerns */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-5 border border-red-500/10"
          >
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Potential Concerns
            </h4>
            <ul className="space-y-2">
              {insights.potentialConcerns.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-red-400 flex-shrink-0">·</span>
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Market readiness */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-5 border border-cyan-500/10"
          >
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              📊 Market Readiness
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {insights.marketReadiness}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex gap-3"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-[var(--text-secondary)] glass border border-[var(--border)] hover:border-violet-500/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Re-enter brief
          </button>
          <button onClick={handleConfirm} className="btn-primary flex-1 justify-center py-3">
            Looks good — tune the market <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
