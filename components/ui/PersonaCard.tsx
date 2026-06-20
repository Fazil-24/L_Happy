"use client";
import { motion } from "framer-motion";
import { PersonaReaction } from "@/lib/types";
import { getMoodColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PersonaCardProps {
  persona: PersonaReaction;
  index: number;
}

export default function PersonaCard({ persona, index }: PersonaCardProps) {
  const moodCls = getMoodColor(persona.mood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass rounded-2xl p-5 border border-[var(--glass-border)] hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{persona.moodEmoji}</div>
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full border", moodCls)}>
          {persona.mood}
        </span>
      </div>

      <div className="font-semibold text-[var(--text-primary)] mb-0.5">{persona.personaName}</div>
      <div className="text-xs text-[var(--text-tertiary)] mb-3 capitalize">
        {persona.personaType.replace("_", " ")}
      </div>

      <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed mb-4 border-l-2 border-violet-500/30 pl-3">
        &ldquo;{persona.quote}&rdquo;
      </p>

      {persona.drivers.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-emerald-400 mb-1.5">✓ Drivers</div>
          <ul className="space-y-1">
            {persona.drivers.slice(0, 2).map((d, i) => (
              <li key={i} className="text-xs text-[var(--text-secondary)] flex gap-2">
                <span className="text-emerald-500 flex-shrink-0">·</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {persona.concerns.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-red-400 mb-1.5">⚠ Concerns</div>
          <ul className="space-y-1">
            {persona.concerns.slice(0, 2).map((c, i) => (
              <li key={i} className="text-xs text-[var(--text-secondary)] flex gap-2">
                <span className="text-red-500 flex-shrink-0">·</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[var(--text-tertiary)]">Adoption likelihood</span>
          <span
            className={cn(
              "font-semibold",
              persona.adoptionLikelihood >= 70
                ? "text-emerald-400"
                : persona.adoptionLikelihood >= 40
                ? "text-amber-400"
                : "text-red-400"
            )}
          >
            {persona.adoptionLikelihood}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 dark:bg-white/5">
          <motion.div
            className={cn(
              "h-full rounded-full",
              persona.adoptionLikelihood >= 70
                ? "bg-emerald-500"
                : persona.adoptionLikelihood >= 40
                ? "bg-amber-500"
                : "bg-red-500"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${persona.adoptionLikelihood}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
